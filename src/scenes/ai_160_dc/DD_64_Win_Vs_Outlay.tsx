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
  createSignal,
  debug,
  delay,
  easeInOutCubic,
  easeOutCubic,
  range,
  SignalValue,
  SimpleSignal,
  Vector2,
  waitFor,
  waitUntil,
} from "@motion-canvas/core";
import { Grays, PoppinsWhite } from "../../styles";
import { tw_colors } from "../../tw_colors";
import { data } from "./DD_00_Params";
import { FadeIn } from "../../utils/FadeIn";
import { commaFormmatter } from "../../components/styled/findQuantiles";

const DATA = data.WIN_VS_OUTLAY.AI160DC;
const TITLE = "Bet Yield";

// Sorting for the bets
// const preferredOrder: string[] = [
//   "DONTPASS",
//   "BUY4",
//   "PLACE5",
//   "PLACE6",
//   "PLACE8",
//   "PLACE9",
//   "BUY10",
// ];

DATA.sort((a, b) => b.WIN_VS_OUTLAY_GRP - a.WIN_VS_OUTLAY_GRP);

const title = createSignal(TITLE);
const TITLE_POSITION = new Vector2(-1150, -750);

// Time to draw each percentage
const DRAW_SECS = 1;
// Time between incrementing each percentage
const BETWEEN_SECS = 0.5;

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

const HeaderProps: RectProps = {
  width: "33.333%",
  fill: tw_colors.green[950],
  stroke: Grays.GRAY2,
  lineWidth: 1,
  justifyContent: "center",
  alignItems: "center",
};

const ValueProps: RectProps = {
  width: "33.333%",
  fill: tw_colors.zinc[950],
  stroke: Grays.GRAY2,
  lineWidth: 1,
  justifyContent: "center",
  alignItems: "center",
};

const HeaderTxtProps: TxtProps = {
  ...PoppinsWhite,
  fontSize: 80,
  fontWeight: 600,
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
    signals[index] = createSignal(0.0);
  });

  // Add a better label
  const labels: SignalValue<string>[] = [];
  range(DATA.length).map((index) => {
    if (DATA[index].WIN_VS_OUTLAY_GRP == 0.01) {
      labels[index] =
        commaFormmatter(DATA[index].WIN_VS_OUTLAY_GRP, 2) + "x (1%)";
    } else if (DATA[index].WIN_VS_OUTLAY_GRP == 0.1) {
      labels[index] =
        commaFormmatter(DATA[index].WIN_VS_OUTLAY_GRP, 1) + "x (10%)";
    } else if (DATA[index].WIN_VS_OUTLAY_GRP == 0.5) {
      labels[index] =
        commaFormmatter(DATA[index].WIN_VS_OUTLAY_GRP, 1) + "x (50%)";
    } else {
      labels[index] =
        DATA[index].WIN_VS_OUTLAY_GRP.toFixed(0) +
        "x (" +
        commaFormmatter(DATA[index].WIN_VS_OUTLAY_GRP * 100, 0) +
        "%)";
    }
  });

  // --------------- container ----------------
  const camera = createRef<Camera>();
  const container = createRef<Layout>();
  const containerNode = createRef<Node>();
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
      >
        <Node
          ref={containerNode}
          opacity={0}
        >
          <Rect
            {...RowProps}
            direction={"row"}
          >
            <Rect
              {...HeaderProps}
              justifyContent={"start"}
              padding={50}
              width={"20%"}
            >
              <Txt
                {...HeaderTxtProps}
                text={"Bet Yield"}
              ></Txt>
            </Rect>
            <Rect
              {...HeaderProps}
              justifyContent={"center"}
              padding={80}
              width={"80%"}
            >
              <Txt
                {...HeaderTxtProps}
                text={"% of Bots Meeting or Exceeding This Yield"}
              ></Txt>
            </Rect>
          </Rect>

          {range(DATA.length).map((index) => (
            <Rect
              {...RowProps}
              direction={"row"}
            >
              <Rect
                {...ValueProps}
                justifyContent={"center"}
                padding={50}
                width={"20%"}
              >
                <Txt
                  {...ValueTxtProps}
                  text={labels[index]}
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
                    stroke={tw_colors.green[500]}
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
          position={TITLE_POSITION}
          offset={[-1, 0]}
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
    generators.push(signals[i](DATA[i].CUMPCT, DRAW_SECS, easeInOutCubic));
    generators.push(waitFor(BETWEEN_SECS));
    waitSecs += DRAW_SECS + BETWEEN_SECS;
  }
  yield* chain(...generators);

  yield* waitFor(1);
  yield* camera().zoom(1.2, 2, easeInOutCubic);

  yield* waitFor(5);
});
