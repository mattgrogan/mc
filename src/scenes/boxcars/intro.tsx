import { Circle, Img, Layout, makeScene2D, Txt } from "@motion-canvas/2d";
import {
  all,
  createRef,
  easeInBack,
  easeInBounce,
  easeInCubic,
  easeOutBounce,
  easeOutCubic,
  waitFor,
  waitUntil,
} from "@motion-canvas/core";

import { PoppinsWhite, Theme } from "../../styles";

import chip200Png from "../../../assets/Chips/Chip_0200.png";
import chip1500Png from "../../../assets/Chips/Chip_1500.png";
import { FadeIn } from "../../utils/FadeIn";
import { FadeOut } from "../../utils/FadeOut";

export default makeScene2D(function* (view) {
  view.fill(Theme.BG);

  const chip200 = createRef<Img>();
  const chip1500 = createRef<Img>();
  view.add(
    <Layout>
      <Img
        ref={chip200}
        src={chip200Png}
        scale={3}
        opacity={0}
      ></Img>
      <Img
        ref={chip1500}
        src={chip1500Png}
        scale={0}
        opacity={1}
      ></Img>
    </Layout>
  );

  yield* waitFor(2);

  yield* waitUntil("bouncein");
  yield* FadeIn(chip200, 0.6, easeOutBounce, [0, 200]);
  yield* waitFor(1);

  yield* waitUntil("swap");
  yield* all(
    chip200().scale(0, 0.6, easeInCubic),
    chip1500().scale(3, 0.6, easeOutCubic)
  );

  yield* waitFor(1);
  yield* waitUntil("roll");
  yield* all(
    chip1500().rotation(360, 1, easeInCubic),
    chip1500().x(2000, 1, easeInCubic)
  );

  yield* waitFor(20);

  yield* waitUntil("end");
});
