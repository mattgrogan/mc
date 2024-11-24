import {
  Icon,
  Layout,
  Line,
  makeScene2D,
  Rect,
  Txt
} from "@motion-canvas/2d";
import {
  all,
  createRef,
  easeInElastic,
  easeInOutCubic,
  easeOutCubic,
  linear,
  sequence,
  waitFor,
  waitUntil
} from "@motion-canvas/core";

import {
  Bright,
  Grays,
  ITCBenguiatNormal,
  MonoWhite,
  PoppinsWhite,
  Theme
} from "../../styles";

import { FadeIn } from "../../utils/FadeIn";

export default makeScene2D(function* (view) {
  view.fill(Theme.BG);

  const container = createRef<Layout>();
  const header = createRef<Txt>();
  const title = createRef<Txt>();

  view.add(
    <Layout
      layout
      ref={container}
      direction={"column"}
      gap={50}
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
        {...ITCBenguiatNormal}
        fill={Bright.BLUE}
        text={"6 8 $15 LOW ROLLER"}
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
  const line1 = (
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
  line1.absolutePosition(() => header().absolutePosition().addY(-50));
  const line2 = line1.clone();
  line2.absolutePosition(() => title().absolutePosition().addY(70));
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
  yield* container().y(-280, 1, easeInOutCubic);

  const rect = createRef<Rect>();

  view.add(
    <Layout
      layout
      y={150}
    >
      <Rect
        ref={rect}
        direction={"column"}
        width={"100%"}
        height={"100%"}
        alignItems={"center"}
        padding={30}
        paddingLeft={100}
        paddingRight={100}
        radius={20}
        gap={10}
        stroke={Grays.GRAY2}
        lineWidth={5}
        end={0}
        clip
      >
        <Txt
          {...ITCBenguiatNormal}
          fontSize={50}
          text={"MAX $40"}
          opacity={0}
        />
        <Txt
          {...ITCBenguiatNormal}
          fontSize={50}
          text={"PER SHOOTER"}
          opacity={0}
        />
        <Icon
          icon={"fluent-emoji-flat:dollar-banknote"}
          //scale={20}
          size={[300, 300]}
          opacity={0}
        ></Icon>
      </Rect>
    </Layout>
  );

  yield* rect().end(1, 1, easeInOutCubic);
  yield* rect().fill("#101010", 1, linear);
  yield* sequence(
    0.2,
    ...rect()
      .children()
      .map((node) => node.opacity(1, 1, linear))
  );

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

    yield* waitUntil("agenda");
  yield* rect().height(0, 1, easeInElastic);
  rect().remove();

  yield* waitFor(1);

  // show the agenda
  const agenda = createRef<Layout>();
  const step1 = createRef<Rect>();
  const step2 = createRef<Rect>();
  const step3 = createRef<Rect>();

  view.add(
    <Layout
      ref={agenda}
      layout
      y={150}
      gap={100}
      justifyContent={"space-evenly"}
    >
      <Rect
        ref={step1}
        opacity={0}
        direction={"column"}
        width={"100%"}
        height={"100%"}
        alignItems={"center"}
        padding={30}
        paddingLeft={100}
        paddingRight={100}
        radius={20}
        gap={10}
        stroke={Grays.GRAY2}
        lineWidth={5}
        end={1}
        fill={"#101010"}
        clip
      >
        <Txt
          {...ITCBenguiatNormal}
          fill={Bright.GREEN}
          text={"1"}
        />
        <Txt
          {...PoppinsWhite}
          text={"REVIEW"}
        />
        <Txt
          {...PoppinsWhite}
          text={"STRATEGY"}
        />
      </Rect>
      <Rect
        ref={step2}
        opacity={0}
        direction={"column"}
        width={"100%"}
        height={"100%"}
        alignItems={"center"}
        padding={30}
        paddingLeft={100}
        paddingRight={100}
        radius={20}
        gap={10}
        stroke={Grays.GRAY2}
        lineWidth={5}
        end={1}
        fill={"#101010"}
        clip
      >
        <Txt
          {...ITCBenguiatNormal}
          fill={Bright.GREEN}
          text={"2"}
        />
        <Txt
          {...MonoWhite}
          text={"SIMULATE"}
        />
        <Txt
          {...PoppinsWhite}
          text={"100K SESSIONS"}
        />
      </Rect>
      <Rect
        ref={step3}
        opacity={0}
        direction={"column"}
        width={"100%"}
        height={"100%"}
        alignItems={"center"}
        padding={30}
        paddingLeft={100}
        paddingRight={100}
        radius={20}
        gap={10}
        stroke={Grays.GRAY2}
        lineWidth={5}
        end={1}
        fill={"#101010"}
        clip
      >
        <Txt
          {...ITCBenguiatNormal}
          fill={Bright.GREEN}
          text={"3"}
        />
        <Txt
          {...MonoWhite}
          text={"ANALYZE"}
        />
        <Txt
          {...PoppinsWhite}
          text={"DATA"}
        />
      </Rect>
    </Layout>
  );
  // suppress the layout for a while and remember the positions
  step1()
    .children()
    .forEach((ref) => ref.save());
  step1().width(step1().width());
  step1().height(step1().height());
  //step1().layout(false);
  step1()
    .children()
    .forEach((ref) => ref.restore());

  // suppress the layout for a while and remember the positions
  step2()
    .children()
    .forEach((ref) => ref.save());
  step2().width(step2().width());
  step2().height(step2().height());
  //step2().layout(false);
  step2()
    .children()
    .forEach((ref) => ref.restore());

  // suppress the layout for a while and remember the positions
  step3()
    .children()
    .forEach((ref) => ref.save());
  step3().width(step3().width());
  step3().height(step3().height());
  //step2().layout(false);
  step3()
    .children()
    .forEach((ref) => ref.restore());

  // suppress the layout for a while and remember the positions
  agenda()
    .children()
    .forEach((ref) => ref.save());

  agenda().layout(false);
  agenda()
    .children()
    .forEach((ref) => ref.restore());

  yield* waitFor(1);
  yield* waitUntil("step1");
  yield* FadeIn(step1, 1, easeOutCubic, [0, 100]),
    yield* step1().stroke(Bright.YELLOW, 1, linear);

  yield* waitFor(1);
  yield* waitUntil("step2");
  yield* FadeIn(step2, 1, easeOutCubic, [0, 100]),
    yield* all(
      step1().opacity(0.3, 1, linear),
      step1().stroke(Grays.GRAY2, 1, linear)
    );
  yield* step2().stroke(Bright.YELLOW, 1, linear);

  yield* waitFor(1);
  yield* waitUntil("step3");
  yield* FadeIn(step3, 1, easeOutCubic, [0, 100]);
  yield* all(
    step2().opacity(0.3, 1, linear),
    step2().stroke(Grays.GRAY2, 1, linear)
  );
  yield* step3().stroke(Bright.YELLOW, 1, linear);

  yield* waitFor(1);
  yield* waitUntil("step3-end ");
  yield* all(
    step3().opacity(0.3, 1, linear),
    step3().stroke(Grays.GRAY2, 1, linear)
  );

  yield* waitFor(3);

  yield* waitUntil("end");
});
