// EXTRACT_FRAMES: [000325]
import {
  Camera,
  Layout,
  makeScene2D,
  Rect,
  RectProps,
  Txt,
  TxtProps,
  Node,
  Line,
} from "@motion-canvas/2d";
import {
  chain,
  createRef,
  createRefArray,
  createSignal,
  delay,
  easeInOutCubic,
  easeOutCubic,
  range,
  SimpleSignal,
  Vector2,
  waitFor,
  waitUntil,
} from "@motion-canvas/core";
import { Grays, PoppinsWhite } from "../../styles";
import { tw_colors } from "../../tw_colors";
import { FadeIn } from "../../utils/FadeIn";
import { commaFormmatter } from "../../components/styled/findQuantiles";

// resolved_bets.v1.json
import dataImport from "../../../../dicedata/output/lay78-100k/json/resolved_bets.v1.json";
const DATA = dataImport["VigOnWin"];

const TITLE = "How much did each bet\ncontribute to the overall loss?";
const SCALE = 0.7;

// Sorting for the bets
const preferredOrder: string[] = [
  "DONTPASS",
  "BUY4",
  "PLACE4",
  "PLACE5",
  "PLACE6",
  "PLACE8",
  "PLACE9",
  "PLACE10",
  "BUY10",
  "LAY4",
  "LAY5",
  "LAY6",
  "LAY8",
  "LAY9",
  "LAY10",
  "ALLSMALL",
  "ALLTALL",
  "ALLTALLSMALL",
  "DONTCOME",
  "DONTCOME4",
  "DONTCOME5",
  "DONTCOME6",
  "DONTCOME8",
  "DONTCOME9",
  "DONTCOME10",
];

DATA.sort(
  (a, b) => preferredOrder.indexOf(a.BET) - preferredOrder.indexOf(b.BET)
);

const title = createSignal(TITLE);
const TITLE_POSITION = new Vector2(-1200, -1250);

// Time to draw each percentage
const DRAW_SECS = 0.1;
// Time between incrementing each percentage
const BETWEEN_SECS = 0.001;

const TITLE_TXT_PROPS: TxtProps = {
  ...PoppinsWhite,
  fontSize: 100,
  fontWeight: 800,
  fill: tw_colors.zinc[100],
};

const RowProps: RectProps = {
  width: "80%",
  height: "8%",
  stroke: tw_colors.zinc[100],
  lineWidth: 0,
};

const ValueProps: RectProps = {
  width: "33.333%",
  fill: tw_colors.zinc[950],
  stroke: Grays.GRAY2,
  lineWidth: 1,
  justifyContent: "center",
  alignItems: "center",
};

const ValueTxtProps: TxtProps = {
  ...PoppinsWhite,
  fontSize: 60,
  fontWeight: 500,
};

export default makeScene2D(function* (view) {
  yield* waitFor(1);

  const signals: SimpleSignal<number, void>[] = [];
  range(DATA.length).map((index) => {
    signals[index] = createSignal(0);
  });

  // --------------- container ----------------
  const camera = createRef<Camera>();
  const container = createRef<Layout>();
  const containerNode = createRef<Node>();
  const tableRect = createRefArray<Rect>();
  view.add(
    <Camera ref={camera}>
      <Layout
        ref={container}
        direction={"column"}
        justifyContent={"center"}
        alignItems={"center"}
        width={"80%"}
        height={"100%"}
        gap={0}
        padding={50}
        layout
        // scale={SCALE}
      >
        <Node
          ref={containerNode}
          opacity={0}
        >
          {range(DATA.length).map((index) => (
            <Rect
              {...RowProps}
              direction={"row"}
              ref={tableRect}
            >
              <Rect
                {...ValueProps}
                justifyContent={"start"}
                padding={50}
                width={"20%"}
              >
                <Txt
                  {...ValueTxtProps}
                  text={DATA[index].BET}
                ></Txt>
              </Rect>
              <Rect
                {...ValueProps}
                justifyContent={"end"}
                padding={80}
                width={"20%"}
              >
                <Txt
                  {...ValueTxtProps}
                  text={() =>
                    commaFormmatter(signals[index]() * 100, 2, "-  ") + "%"
                  }
                ></Txt>
              </Rect>
              <Rect
                {...ValueProps}
                width={"60%"}
              >
                <Layout layout={false}>
                  <Line
                    points={[
                      [-650, 0],
                      [650, 0],
                    ]}
                    lineWidth={100}
                    stroke={tw_colors.zinc[700]}
                  ></Line>
                  <Line
                    points={[
                      [-650, 0],
                      [650, 0],
                    ]}
                    lineWidth={100}
                    end={() => signals[index]()}
                    stroke={tw_colors.rose[500]}
                  ></Line>
                </Layout>
              </Rect>
            </Rect>
          ))}
        </Node>
      </Layout>
    </Camera>
  );

  // --------------- title ----------------
  const titleNode = createRef<Node>();
  const titleRef = createRef<Layout>();

  container().add(
    <Node
      ref={titleNode}
      opacity={0}
    >
      <Layout layout={false}>
        <Layout
          layout
          direction={"column"}
          alignItems={"start"}
          ref={titleRef}
          position={() => tableRect[0].topLeft().addY(-50)}
          offset={[-1, 1]}
          // x={() => rightColX()}
          // y={0}
        >
          {() =>
            title()
              .split("\n")
              .map((line) => (
                <Txt
                  {...TITLE_TXT_PROPS}
                  text={line}
                />
              ))
          }
        </Layout>
      </Layout>
    </Node>
  );

  // https://github.com/motion-canvas/motion-canvas/issues/1057
  camera().scene().position(view.size().div(2));

  camera().zoom(SCALE);
  camera().save();
  camera().position(titleRef().middle());
  camera().zoom(1.5);

  // START DRAWING THE COMPONENTS HERE
  // =================================
  yield* FadeIn(titleNode, 1, easeOutCubic, [100, 0]);
  yield* waitFor(0.5);
  yield camera().restore(2, easeInOutCubic);
  yield* delay(1, FadeIn(containerNode, 2, easeOutCubic, [100, 0]));

  yield* waitFor(1);

  yield* waitUntil("show-data");
  const generators = [];
  let waitSecs = 0;
  for (const i in range(DATA.length)) {
    generators.push(signals[i](DATA[i].PCT_OF_LOSS, DRAW_SECS, easeOutCubic));
    generators.push(waitFor(BETWEEN_SECS));
    waitSecs += DRAW_SECS + BETWEEN_SECS;
  }
  yield* chain(...generators);

  yield* waitFor(5);
});
