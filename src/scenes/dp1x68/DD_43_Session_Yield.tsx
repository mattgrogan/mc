// EXTRACT_FRAMES: [000685]
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
  createRef,
  createSignal,
  easeInCubic,
  easeInOutCubic,
  easeOutCubic,
  SimpleSignal,
  waitFor,
  waitUntil,
} from "@motion-canvas/core";
import { Grays, PoppinsWhite } from "../../styles";
import { tw_colors } from "../../tw_colors";
import { FadeIn } from "../../utils/FadeIn";
import { PLAYER_NAME } from "./DD_00_Params";
// session_yield.v1.json
import dataImport from "../../../../dicedata/output/dp1x68-100k/json/session_yield.v1.json";
const DATA = dataImport[PLAYER_NAME];

const TITLE = "Session Yield Achievements";

// Extract the specific yield targets we want to show
const targetYields = [1.0, 2.0, 3.0, 5.0, 10.0];
const yieldData = targetYields.map((target) => {
  const entry = DATA.find((d) => d.SESSION_YIELD === target);
  return {
    multiplier: target,
    percentage: entry ? entry.CUMPCT * 100 : 0,
    label: `${target}X+`,
  };
});

const title = createSignal(TITLE);

const TITLE_TXT_PROPS: TxtProps = {
  ...PoppinsWhite,
  fontSize: 120,
  fontWeight: 800,
  fill: tw_colors.zinc[100],
};

const CardProps: RectProps = {
  width: 600,
  height: 500,
  fill: tw_colors.zinc[900],
  stroke: tw_colors.zinc[600],
  lineWidth: 2,
  radius: 0,
  justifyContent: "center",
  alignItems: "center",
  direction: "column",
  gap: 20,
  padding: 30,
};

const BigNumberProps: TxtProps = {
  ...PoppinsWhite,
  fontSize: 140,
  fontWeight: 800,
  fill: tw_colors.green[400],
};

const SmallPercentProps: TxtProps = {
  ...PoppinsWhite,
  fontSize: 80,
  fontWeight: 600,
  fill: tw_colors.green[400],
};

const LabelProps: TxtProps = {
  ...PoppinsWhite,
  fontSize: 100,
  fontWeight: 600,
  fill: tw_colors.zinc[300],
};

const SubLabelProps: TxtProps = {
  ...PoppinsWhite,
  fontSize: 30,
  fontWeight: 500,
  fill: tw_colors.zinc[400],
};

export default makeScene2D(function* (view) {
  yield* waitFor(1);

  // Create signals for animated percentages and opacity
  const signals: SimpleSignal<number, void>[] = [];
  const opacitySignals: SimpleSignal<number, void>[] = [];
  yieldData.forEach((_, index) => {
    signals[index] = createSignal(0.0);
    opacitySignals[index] = createSignal(0.0);
  });

  // --------------- container ----------------
  const camera = createRef<Camera>();
  const container = createRef<Layout>();
  const cardsContainer = createRef<Layout>();

  view.add(
    <Camera ref={camera}>
      <Layout
        ref={container}
        direction={"column"}
        justifyContent={"center"}
        alignItems={"center"}
        width={"100%"}
        height={"100%"}
        gap={100}
        padding={50}
        layout
      >
        <Layout
          ref={cardsContainer}
          direction={"row"}
          justifyContent={"center"}
          alignItems={"center"}
          gap={60}
          width={"100%"}
          opacity={0}
          layout
        >
          {yieldData.map((data, index) => (
            <Rect {...CardProps}>
              <Layout
                direction={"column"}
                justifyContent={"center"}
                alignItems={"center"}
                gap={0}
              >
                {/* Percentage Display */}
                <Layout
                  direction={"row"}
                  alignItems={"baseline"}
                  gap={5}
                  marginTop={0}
                  opacity={() => opacitySignals[index]()}
                >
                  <Txt
                    {...BigNumberProps}
                    text={() => {
                      const pct = signals[index]();
                      return pct < 0.1 ? "< 0.1" : pct.toFixed(1);
                    }}
                  />
                  <Txt
                    {...SmallPercentProps}
                    text={"%"}
                  />
                </Layout>

                {/* Progress Bar */}
                <Layout
                  width={400}
                  height={12}
                  justifyContent={"start"}
                  alignItems={"center"}
                  layout={false}
                >
                  <Line
                    points={[
                      [-150, 0],
                      [150, 0],
                    ]}
                    lineWidth={20}
                    stroke={tw_colors.zinc[700]}
                    radius={6}
                  />
                  <Line
                    points={[
                      [-150, 0],
                      [150, 0],
                    ]}
                    lineWidth={20}
                    end={() => Math.min(signals[index]() / 100, 1)}
                    stroke={tw_colors.green[500]}
                    radius={6}
                  />
                </Layout>

                {/* Label */}
                <Txt
                  {...LabelProps}
                  text={data.label}
                  marginTop={50}
                  marginBottom={0}
                />

                {/* Sub Label */}
                <Txt
                  {...SubLabelProps}
                  text={"their outlay"}
                />
              </Layout>
            </Rect>
          ))}
        </Layout>
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
      <Layout
        layout
        direction={"column"}
        alignItems={"center"}
        ref={titleRef}
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
    </Node>
  );

  // https://github.com/motion-canvas/motion-canvas/issues/1057
  camera().scene().position(view.size().div(2));

  // camera().save();
  // camera().position(titleRef().middle());
  // camera().zoom(1.5);

  // START DRAWING THE COMPONENTS HERE
  // =================================
  // yield* FadeIn(titleNode, 1, easeOutCubic, [100, 0]);
  // yield* waitFor(0.5);
  // yield camera().restore(2, easeInOutCubic);
  yield* FadeIn(cardsContainer, 2, easeOutCubic, [0, 100]);

  yield* waitFor(1);

  yield* waitUntil("show-data");

  // Animate each percentage
  for (let i = 0; i < yieldData.length; i++) {
    yield opacitySignals[i](1, 0.3, easeInCubic);
    yield* signals[i](yieldData[i].percentage, 1.5, easeInOutCubic);
    yield* waitFor(0.2);
  }

  yield* waitFor(5);
});
