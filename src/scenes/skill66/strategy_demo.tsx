import { Camera, Layout, makeScene2D, Rect, Txt } from "@motion-canvas/2d";
import {
  all,
  createRef,
  createRefArray,
  createRefMap,
  easeInOutCubic,
  easeOutCubic,
  linear,
  sequence,
  waitFor,
  waitUntil,
} from "@motion-canvas/core";
import { CrapsTable } from "../../components/craps/CrapsTable";

import { CrapsProcessor } from "../../components/craps/CrapsProcessor";
import { CrapsScoreBug } from "../../components/craps/CrapsScoreBug";
import { FadeIn } from "../../utils/FadeIn";

import simData from "../../../../dicedata/output/skill66-demo/skill66-demo-sessions.json";
import { Bright, Darkest, Grays, PoppinsWhite, Theme } from "../../styles";

export default makeScene2D(function* (view) {
  view.fill(Theme.BG);
  const container = createRef<Layout>();
  const table = createRef<CrapsTable>();
  const bug = createRef<CrapsScoreBug>();
  const camera = createRef<Camera>();
  const stepContainer = createRef<Layout>();
  const steps = createRefArray<Rect>();

  view.add(
    <Camera ref={camera}>
      <Layout ref={container}>
        <CrapsTable
          ref={table}
          opacity={0}
          scale={0.7}
          x={-270}
          y={-100}
        ></CrapsTable>
        <CrapsScoreBug
          ref={bug}
          opacity={0}
          scale={0.8}
        />
      </Layout>
      <Layout
        layout
        ref={stepContainer}
        direction={"column"}
        x={650}
        maxWidth={450}
        gap={20}
        fontSize={30}
        opacity={0}
      >
        {/* <Layout alignSelf={"center"}>
        <Txt
          {...PoppinsWhite}
          fontSize={55}
          fill={Bright.YELLOW}
          fontWeight={600}
          text={"6 8 $15 LOW ROLLER"}
        ></Txt>
      </Layout> */}
        <Rect
          ref={steps}
          direction={"column"}
          stroke={Grays.GRAY4}
          lineWidth={4}
          radius={10}
          padding={15}
        >
          <Txt
            {...PoppinsWhite}
            text={"STEP 1"}
            fontWeight={800}
          ></Txt>
          <Txt
            {...PoppinsWhite}
            text={"Wait for a point to be established."}
            textWrap={"wrap"}
          ></Txt>
        </Rect>
        <Rect
          ref={steps}
          direction={"column"}
          stroke={Grays.GRAY4}
          lineWidth={4}
          radius={10}
          padding={15}
        >
          <Txt
            {...PoppinsWhite}
            text={"STEP 2"}
            fontWeight={800}
          ></Txt>
          <Txt
            {...PoppinsWhite}
            text={"Place $66 inside."}
            textWrap={"wrap"}
          ></Txt>
        </Rect>
        <Rect
          ref={steps}
          direction={"column"}
          stroke={Grays.GRAY4}
          lineWidth={4}
          radius={10}
          padding={15}
        >
          <Txt
            {...PoppinsWhite}
            text={"STEP 3"}
            fontWeight={800}
          ></Txt>
          <Txt
            {...PoppinsWhite}
            text={"Either hits, press to $88 inside."}
            textWrap={"wrap"}
          ></Txt>
        </Rect>
        <Rect
          ref={steps}
          direction={"column"}
          stroke={Grays.GRAY4}
          lineWidth={4}
          radius={10}
          padding={15}
        >
          <Txt
            {...PoppinsWhite}
            text={"STEP 4"}
            fontWeight={800}
          ></Txt>
          <Txt
            {...PoppinsWhite}
            text={"Next hit, regress to $44 inside."}
            textWrap={"wrap"}
          ></Txt>
        </Rect>
        {/* <Rect
          ref={steps}
          direction={"column"}
          stroke={Grays.GRAY4}
          lineWidth={4}
          radius={10}
          padding={15}
        >
          <Txt
            {...PoppinsWhite}
            text={"STEP 5"}
            fontWeight={800}
          ></Txt>
          <Txt
            {...PoppinsWhite}
            text={"Keep bets up for 5 more hits. Full press each win."}
            textWrap={"wrap"}
          ></Txt>
        </Rect>
        <Rect
          ref={steps}
          direction={"column"}
          stroke={Grays.GRAY4}
          lineWidth={4}
          radius={10}
          padding={15}
        >
          <Txt
            {...PoppinsWhite}
            text={"STEP 6"}
            fontWeight={800}
          ></Txt>
          <Txt
            {...PoppinsWhite}
            text={"After 5th hit, all bets down and restart the system."}
            textWrap={"wrap"}
          ></Txt> */}
        {/* </Rect> */}
      </Layout>
    </Camera>
  );

  // https://github.com/motion-canvas/motion-canvas/issues/1057
  camera().scene().position(view.size().div(2));

  const processor = new CrapsProcessor(table, bug);
  const session = simData[0].SESSION;
  const firstSession = simData.filter(({ SESSION }) => SESSION === session);

  const cameraZoomSecs = 2;

  bug().position([-270, 400]);

  // STEP CONTAINER
  stepContainer().x(0)
  stepContainer().y(700)
  stepContainer().scale(2)
  steps[1].opacity(0)
  steps[2].opacity(0)
  steps[3].opacity(0)
  // steps[4].opacity(0)
  // steps[5].opacity(0)
  yield* FadeIn(stepContainer, 1, easeOutCubic, [100, 0]);

  yield* waitUntil("show-step2")
  yield* all(
    steps[1].opacity(1, 1, linear),
    stepContainer().y(500, 1, easeInOutCubic)
  )
  yield* waitFor(1)

  yield* waitUntil("show-step3")
  yield* all(
    steps[2].opacity(1, 1, linear),
    stepContainer().y(200, 1, easeInOutCubic)
  )
  yield* waitFor(1)

  yield* waitUntil("show-step4")
  yield* all(
    steps[3].opacity(1, 1, linear),
    stepContainer().y(-100, 1, easeInOutCubic)
  )
  yield* waitFor(1)

  // yield* waitUntil("show-step5")
  // yield* all(
  //   steps[4].opacity(1, 1, linear),
  //   stepContainer().y(-400, 1, easeInOutCubic)
  // )
  // yield* waitFor(1)

  // yield* waitUntil("show-step6")
  // yield* all(
  //   steps[5].opacity(1, 1, linear),
  //   stepContainer().y(-700, 1, easeInOutCubic)
  // )
  // yield* waitFor(1)

  // SHOW TABLE
  yield* waitUntil("Show-table")

  yield* all(stepContainer().scale(1,1, easeInOutCubic),
stepContainer().position([650, 0], 1, easeInOutCubic))

  yield* FadeIn(table(), 1, easeOutCubic, [0, 500]);
  yield* sequence(
    0.5,
    FadeIn(bug(), 0.6, easeOutCubic, [0, 100]),
    bug().updateLabel("GOOD LUCK!")
  );


  // camera().save();
  // yield* all(
  //   camera().zoom(1.1, cameraZoomSecs, easeInOutCubic),
  //   camera().position([100, 0], cameraZoomSecs, easeInOutCubic)
  // );

  yield* waitUntil("step1");
  yield* all(
    steps[0].stroke(Bright.ORANGE, 1, linear),
    steps[0].lineWidth(10, 1, linear)
  );
  // yield camera().restore(cameraZoomSecs, easeInOutCubic);
  yield* processor.round(firstSession[0]);

  yield* waitUntil("step2");
  // yield all(
  //   camera().zoom(1.1, 1, easeInOutCubic),
  //   camera().position([100, -100], 1, easeInOutCubic)
  // );
  yield* all(
    steps[0].stroke(Grays.GRAY4, 1, linear),
    steps[1].stroke(Bright.ORANGE, 1, linear),
    steps[1].lineWidth(10, 1, linear)
  );
  // yield camera().restore(1, easeInOutCubic);
  yield* processor.round(firstSession[1]);
  yield* processor.round(firstSession[2]);

  yield* waitUntil("step3");
  yield* all(
    steps[1].stroke(Grays.GRAY4, 1, linear),
    steps[2].stroke(Bright.ORANGE, 1, linear),
    steps[2].lineWidth(10, 1, linear)
  );
  yield* processor.round(firstSession[3]);
  yield* processor.round(firstSession[4]);

  yield* waitFor(1);
  yield* waitUntil("step4");
  yield* all(
    steps[2].stroke(Grays.GRAY4, 1, linear),
    steps[3].stroke(Bright.ORANGE, 1, linear),
    steps[3].lineWidth(10, 1, linear)
  );
  yield* processor.round(firstSession[5]);

  yield* waitFor(1);
  // yield* waitUntil("step5");
  // yield* all(
  //   steps[3].stroke(Grays.GRAY4, 1, linear),
  //   // steps[4].stroke(Bright.ORANGE, 1, linear),
  //   // steps[4].lineWidth(10, 1, linear)
  // );
  yield* processor.round(firstSession[6]);
  yield* processor.round(firstSession[7]);
  yield* processor.round(firstSession[8]);
  yield* waitFor(1);
  yield* waitUntil("pointis4");
  yield* processor.round(firstSession[9]);
  yield* waitFor(1);
  // yield* waitUntil("easy6");
  // yield* processor.round(firstSession[10]);

  // yield* waitFor(1);
  // yield* waitUntil("step6");
  // yield* all(
  //   // steps[4].stroke(Grays.GRAY4, 1, linear),
  //   // steps[5].stroke(Bright.ORANGE, 1, linear),
  //   // steps[5].lineWidth(10, 1, linear)
  // );

  // yield* processor.round(firstSession[11]);
  // yield* processor.round(firstSession[12]);
  // yield* processor.round(firstSession[13]);

  // yield* waitFor(1);
  yield* waitUntil("end");
  // yield* all(
  //   steps[5].stroke(Grays.GRAY4, 1, linear),
  //   steps[0].stroke(Bright.ORANGE, 1, linear),
  //   steps[0].lineWidth(10, 1, linear)
  // );
  // yield* processor.round(firstSession[14]);

});
