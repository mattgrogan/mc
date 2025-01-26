import { Layout, Line, makeScene2D, Txt } from "@motion-canvas/2d";
import {
  createRef,
  easeOutCubic,
  sequence,
  waitFor,
  waitUntil,
} from "@motion-canvas/core";

import { Bright, Grays, PoppinsWhite, Theme } from "../../styles";

import { FadeIn } from "../../utils/FadeIn";
import { audioPlayer } from "./DD_00_Params";
// import bg from "../../../assets/dark_craps_layout_bg.png";

export default makeScene2D(function* (view) {
  view.fill(Theme.BG);
  // view.add(
  //   <Img
  //     src={bg}
  //     opacity={0.3}
  //   />
  // );

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
        fontSize={140}
        text={"TODAY'S SIMULATION"}
      />
      <Txt
        ref={title}
        opacity={0}
        {...PoppinsWhite}
        fill={Bright.WHITE}
        fontWeight={600}
        fontSize={180}
        text={"6 7 8 All Day"}
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
  audioPlayer.chime();
  const line1: Line = (
    <Line
      stroke={Bright.BLUE}
      lineWidth={5}
      points={[
        [-3840 / 2, 0],
        [3840 / 2, 0],
      ]}
      end={0}
    />
  );
  line1.absolutePosition(() => header().absolutePosition().addY(-300));
  const line2 = line1.clone();
  line2.absolutePosition(() => title().absolutePosition().addY(300));
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

  yield* waitFor(3);

  yield* waitUntil("end");
});
