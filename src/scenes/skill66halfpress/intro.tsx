import {
  Icon,
  Img,
  Layout,
  Line,
  makeScene2D,
  Rect,
  Txt,
} from "@motion-canvas/2d";
import {
  all,
  createRef,
  easeInElastic,
  easeInOutCubic,
  easeOutCubic,
  easeOutElastic,
  linear,
  sequence,
  waitFor,
  waitUntil,
} from "@motion-canvas/core";

import { Grays, PoppinsWhite, Theme } from "../../styles";

import bg from "../../../assets/dark_craps_layout_bg.png";
import { CrapsScoreBug } from "../../components/craps/CrapsScoreBug";
import { CrapsTable } from "../../components/craps/CrapsTable";
import { c } from "../../components/craps/CrapsTableCoords";
import { FadeIn } from "../../utils/FadeIn";

import surveySrc from "../../../assets/Other/skill66_survey.png"

export default makeScene2D(function* (view) {
  view.fill("#000");
  view.add(
    <Img
      src={bg}
      opacity={0.3}
    />
  );

  const container = createRef<Layout>();
  const header = createRef<Txt>();
  const title = createRef<Txt>();

  view.add(
    <Layout
      layout
      ref={container}
      direction={"column"}
      gap={0}
    >
      <Txt
        ref={header}
        opacity={0}
        {...PoppinsWhite}
        fill={Grays.GRAY2}
        text={"TODAY'S SIMULATION"}
      />
      <Txt
        ref={title}
        opacity={0}
        {...PoppinsWhite}
        fontWeight={600}
        fontSize={120}
        text={"SKILL 66 + HALF PRESS"}
        alignSelf={"center"}
      />
    </Layout>
  );
  yield* waitFor(1);

  // suppress the layout for a while and remember the positions
  container()
    .children()
    .forEach((ref) => ref.save());
  container().layout(false);
  container()
    .children()
    .forEach((ref) => ref.restore());

  // Fade In
  yield* sequence(
    0.2,
    FadeIn(title, 1, easeOutCubic, [0, 100], 2),
    FadeIn(header, 0.6, easeOutCubic, [-100, 0])
  );

  // Draw lines
  const line1: Line = (
    <Line
      stroke={Grays.GRAY1}
      lineWidth={5}
      points={[
        [-1920 / 2, 0],
        [1920 / 2, 0],
      ]}
      end={0}
    />
  );
  line1.absolutePosition(() => header().absolutePosition().addY(-100));
  const line2 = line1.clone();
  line2.absolutePosition(() => title().absolutePosition().addY(100));
  line2.end(1);
  line2.start(1);

  view.add(line1);
  view.add(line2);

  yield* waitFor(0.6);
  yield* sequence(
    0.1,
    line1.end(1, 0.5),
    line1.start(1, 0.5),
    line2.end(0, 0.5),
    line2.start(0, 0.5)
  );

  yield* waitFor(0.6);

  // Move Up
  yield* container().y(-350, 1, easeInOutCubic);
  yield* container().x(-250, 1, easeInOutCubic);

  const rect = createRef<Rect>();
  const table = createRef<CrapsTable>();
  const bug = createRef<CrapsScoreBug>();
  const survey = createRef<Img>();

  view.add(
    <Layout
      layout
      y={150}
      width={1200}
      height={500}
    >
      <Rect
        ref={rect}
        direction={"column"}
        width={"100%"}
        height={"100%"}
        alignItems={"center"}
        // padding={10}
        // paddingLeft={100}
        // paddingRight={100}
        radius={10}
        // gap={10}
        stroke={Grays.GRAY2}
        lineWidth={5}
        end={0}
        clip
      >
        {/* <Txt
          {...PoppinsWhite}
          fontSize={50}
          text={"TWO HITS: THEN LOCK IN PROFITS"}
          opacity={0}
        /> */}
        {/* <Txt
          {...PoppinsWhite}
          fontSize={50}
          text={"BASELINE AND MOVE INTO ANY STRATEGY"}
          opacity={0}
        /> */}
        <Img ref={survey} src={surveySrc} scale={0.72} opacity={0} offsetY={-1.35}></Img>
      </Rect>
    </Layout>
  );

  yield* waitUntil("show-rect");
  yield* rect().end(1, 1, easeInOutCubic);
  yield rect().fill(Theme.BG, 1, linear);
  yield* survey().opacity(1, 1, easeOutElastic);
  // yield* sequence(
  //   0.2,
  //   ...rect()
  //     .children()
  //     .map((node) => node.opacity(1, 1, linear))
  // );

  yield* waitFor(2);

  // suppress the layout for a while and remember the positions
  rect()
    .children()
    .forEach((ref) => ref.save());
  rect().width(rect().width());
  rect().height(rect().height());
  rect().layout(false);
  rect()
    .children()
    .forEach((ref) => ref.restore());

  yield* waitUntil("table");
  yield* rect().height(0, 1, easeInElastic);
  rect().remove();

  yield* waitFor(3);

  yield* waitUntil("end");
});
