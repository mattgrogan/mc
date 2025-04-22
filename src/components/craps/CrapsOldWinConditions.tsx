import { Layout, Rect, RectProps, Node, Txt } from "@motion-canvas/2d";
import {
  createRefArray,
  Direction,
  range,
  sequence,
  useLogger,
} from "@motion-canvas/core";
import { Bright, grayGradient, Grays, PoppinsWhite } from "../../styles";
import { RollText } from "../../utils/RollText";
import { CircumscribeRect } from "../../utils/Circumscribe";

const default_data = [
  { throw: "2", winloss: 0 },
  { throw: "3", winloss: 0 },
  { throw: "4E", winloss: 0 },
  { throw: "4H", winloss: 0 },
  { throw: "5", winloss: 0 },
  { throw: "6E", winloss: 0 },
  { throw: "6H", winloss: 0 },
  { throw: "7", winloss: 0 },
  { throw: "8E", winloss: 0 },
  { throw: "8H", winloss: 0 },
  { throw: "9", winloss: 0 },
  { throw: "10E", winloss: 0 },
  { throw: "10H", winloss: 0 },
  { throw: "11", winloss: 0 },
  { throw: "12", winloss: 0 },
];

function prepareWinConditions(data: { throw: string; winloss: number }[]) {
  const newData = [];
  for (const row of data) {
    let fill = Grays.GRAY2;
    if (row.winloss > 0) {
      fill = Bright.GREEN;
    }
    if (row.winloss < 0) {
      fill = Bright.RED;
    }

    let label = "-";
    if (row.winloss > 0) {
      label = "+" + row.winloss.toFixed(0);
    }
    if (row.winloss < 0) {
      label = row.winloss.toFixed(0);
    }

    const newRow = {
      throw: row.throw,
      winloss: row.winloss,
      label: label,
      fill: fill,
    };
    newData.push(newRow);
  }
  return newData;
}

export interface CrapsWinConditionsProps extends RectProps {}

export class CrapsWinConditions extends Rect {
  private declare data;
  private readonly values = createRefArray<RollText>();
  private readonly rows = createRefArray<Layout>();
  private readonly labelRects = createRefArray<Rect>();

  public constructor(props?: CrapsWinConditionsProps) {
    super({
      layout: true,
      direction: "column",
      justifyContent: "space-evenly",
      ...props,
    });

    this.data = prepareWinConditions(default_data);

    this.add(
      <Node>
        {range(this.data.length).map((index) => (
          <Layout
            ref={this.rows}
            direction="row"
            height={"100%"}
          >
            <Rect
              ref={this.labelRects}
              fill={grayGradient}
              width={"30%"}
              height={"100%"}
              lineWidth={2}
              stroke={Grays.GRAY4}
              justifyContent={"center"}
              alignItems={"center"}
            >
              <Txt
                text={this.data[index].throw}
                alignSelf={"center"}
                textAlign={"center"}
                {...PoppinsWhite}
                fontSize={25}
              ></Txt>
            </Rect>
            <Rect
              fill={grayGradient}
              width={"70%"}
              height={"100%"}
              lineWidth={2}
              stroke={Grays.GRAY4}
              justifyContent={"end"}
              alignItems={"center"}
              padding={10}
            >
              <RollText
                ref={this.values}
                width={120}
                height={50}
                initialText={"-"}
                fill={grayGradient}
                txtProps={{
                  ...PoppinsWhite,
                  textAlign: "right",
                  fontSize: 25,
                  fill: this.data[index].fill,
                }}
              ></RollText>
            </Rect>
          </Layout>
        ))}
      </Node>
    );
  }

  public *update(data: { throw: string; winloss: number }[]) {
    const newData = prepareWinConditions(data);
    const generators = [];
    for (let i = 0; i < newData.length; i++) {
      generators.push(
        this.values[i].next(newData[i].label, Direction.Right, {
          fill: newData[i].fill,
        })
      );
    }
    yield* sequence(0.05, ...generators);
  }

  public *highlight(d1: number, d2: number) {
    let category = "";

    if ([2, 3, 5, 7, 9, 11, 12].includes(d1 + d2)) {
      category = (d1 + d2).toString();
    }

    if (d1 + d2 == 4) {
      category = d1 == d2 ? "4H" : "4E";
    }
    if (d1 + d2 == 6) {
      category = d1 == d2 ? "6H" : "6E";
    }
    if (d1 + d2 == 8) {
      category = d1 == d2 ? "8H" : "8E";
    }
    if (d1 + d2 == 10) {
      category = d1 == d2 ? "10H" : "10E";
    }

    useLogger().debug(category);

    const index = this.data.findIndex((t) => t.throw === category);

    yield* CircumscribeRect(this.values[index], Bright.YELLOW, 0.95, 10, 1);
    // yield* this.values[index].scale(2, 0.5, easeOutCubic).to(1, 0.5, easeOutCubic)
    // yield* this.labelRects[index].fill(yellowGradient, 0.5)
  }
}
