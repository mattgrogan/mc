import { Layout, makeScene2D, Rect, Txt } from "@motion-canvas/2d";
import {
  createRef,
  createRefArray,
  easeInCubic,
  easeOutCubic,
  fadeTransition,
  waitFor,
  waitUntil,
} from "@motion-canvas/core";

import { PoppinsWhite, Theme } from "../../styles";
import { FadeIn } from "../../utils/FadeIn";
import { FadeOut } from "../../utils/FadeOut";

export default makeScene2D(function* (view) {
  view.fill(Theme.BG);
  const container = createRef<Layout>();
  const title = createRef<Txt>();

  view.add(
    <Layout ref={container}>
      <Txt
        ref={title}
        {...PoppinsWhite}
        opacity={0}
        fontWeight={600}
        fontSize={120}
      >
        THE SIMULATION
      </Txt>
    </Layout>
  );

  yield* fadeTransition();

  yield* waitFor(1);
  yield title().letterSpacing(10, 10, easeOutCubic);

  yield* FadeIn(title, 1.5, easeOutCubic, [0, -100]);
  yield* waitFor(1);
  yield* waitUntil("fadeout");
  yield* FadeOut(title, 0.2, easeInCubic);
  yield* waitFor(1);
  yield* waitUntil("end");
});
