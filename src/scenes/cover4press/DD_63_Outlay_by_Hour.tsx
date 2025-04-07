import {
  Camera,
  Layout,
  makeScene2D,
  Rect,
  RectProps,
  Txt,
  TxtProps,
  Node,
} from "@motion-canvas/2d";
import {
  createRef,
  createSignal,
  delay,
  easeInOutCubic,
  easeOutCubic,
  Vector2,
  waitFor,
  waitUntil,
} from "@motion-canvas/core";
import { Grays, PoppinsWhite } from "../../styles";
import { tw_colors } from "../../tw_colors";
import { data } from "././DD_00_Params";
import { FadeIn } from "../../utils/FadeIn";

const DATA = data.OUTLAY_OVER_TIME.Cover4Press;

const title = createSignal(
  "What is the average\nout-of-pocket outlay\nper hour?"
);
const TITLE_POSITION = new Vector2(-1450, -750);

const TITLE_TXT_PROPS: TxtProps = {
  ...PoppinsWhite,
  fontSize: 100,
  fontWeight: 800,
  fill: tw_colors.zinc[100],
};

const RowProps: RectProps = {
  width: "80%",
  height: "10%",
  stroke: Grays.GRAY3,
  lineWidth: 5,
};

const HeaderProps: RectProps = {
  width: "33.333%",
  fill: tw_colors.rose[950],
  stroke: Grays.GRAY2,
  lineWidth: 5,
  justifyContent: "center",
  alignItems: "center",
};

const ValueProps: RectProps = {
  width: "33.333%",
  fill: tw_colors.zinc[950],
  stroke: Grays.GRAY2,
  lineWidth: 5,
  justifyContent: "center",
  alignItems: "center",
};

const HeaderTxtProps: TxtProps = {
  ...PoppinsWhite,
  fontSize: 80,
  fontWeight: 700,
};

const ValueTxtProps: TxtProps = {
  ...PoppinsWhite,
  fontSize: 80,
  fontWeight: 500,
};

export default makeScene2D(function* (view) {
  yield* waitFor(1);

  const emptyOcc = createSignal("");
  const halfOcc = createSignal("");
  const fullOcc = createSignal("");

  const emptySpeed = createSignal("");
  const halfSpeed = createSignal("");
  const fullSpeed = createSignal("");

  const emptyAvg = createSignal("");
  const halfAvg = createSignal("");
  const fullAvg = createSignal("");

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
        width={"100%"}
        height={"100%"}
        gap={0}
        padding={50}
        layout
      >
        <Node
          ref={containerNode}
          opacity={0}
        >
          {/* header row */}
          <Rect
            {...RowProps}
            direction={"row"}
          >
            <Rect {...HeaderProps}>
              <Txt
                {...HeaderTxtProps}
                text="Table Occupancy"
              ></Txt>
            </Rect>
            <Rect {...HeaderProps}>
              <Txt
                {...HeaderTxtProps}
                text="Table Speed"
              ></Txt>
            </Rect>
            <Rect {...HeaderProps}>
              <Txt
                {...HeaderTxtProps}
                text="Average Outlay"
              ></Txt>
            </Rect>
          </Rect>

          {/* empty row */}
          <Rect
            {...RowProps}
            direction={"row"}
          >
            <Rect {...ValueProps}>
              <Txt
                {...ValueTxtProps}
                text={() => emptyOcc()}
              ></Txt>
            </Rect>
            <Rect {...ValueProps}>
              <Txt
                {...ValueTxtProps}
                text={() => emptySpeed()}
              ></Txt>
            </Rect>
            <Rect {...ValueProps}>
              <Txt
                {...ValueTxtProps}
                text={() => emptyAvg()}
              ></Txt>
            </Rect>
          </Rect>

          {/* half row */}
          <Rect
            {...RowProps}
            direction={"row"}
          >
            <Rect {...ValueProps}>
              <Txt
                {...ValueTxtProps}
                text={() => halfOcc()}
              ></Txt>
            </Rect>
            <Rect {...ValueProps}>
              <Txt
                {...ValueTxtProps}
                text={() => halfSpeed()}
              ></Txt>
            </Rect>
            <Rect {...ValueProps}>
              <Txt
                {...ValueTxtProps}
                text={() => halfAvg()}
              ></Txt>
            </Rect>
          </Rect>
          {/* full row */}
          <Rect
            {...RowProps}
            direction={"row"}
          >
            <Rect {...ValueProps}>
              <Txt
                {...ValueTxtProps}
                text={() => fullOcc()}
              ></Txt>
            </Rect>
            <Rect {...ValueProps}>
              <Txt
                {...ValueTxtProps}
                text={() => fullSpeed()}
              ></Txt>
            </Rect>
            <Rect {...ValueProps}>
              <Txt
                {...ValueTxtProps}
                text={() => fullAvg()}
              ></Txt>
            </Rect>
          </Rect>
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

  yield* waitUntil("show-empty");
  yield* emptyOcc("Empty", 1);
  yield* emptySpeed("100 Rolls per Hour", 1);
  yield* emptyAvg("$" + DATA.MEAN_OUTLAY_1_HR[0].toFixed(0) + " per Hour", 2);

  yield* waitFor(1);

  yield* waitUntil("show-half");
  yield* halfOcc("Half-Full", 1);
  yield* halfSpeed("80 Rolls per Hour", 1);
  yield* halfAvg("$" + DATA.MEAN_OUTLAY_1_HR[1].toFixed(0) + " per Hour", 2);

  yield* waitFor(1);

  yield* waitUntil("show-full");
  yield* fullOcc("Full", 1);
  yield* fullSpeed("60 Rolls per Hour", 1);
  yield* fullAvg("$" + DATA.MEAN_OUTLAY_1_HR[2].toFixed(0) + " per Hour", 2);

  yield* waitFor(5);
});
