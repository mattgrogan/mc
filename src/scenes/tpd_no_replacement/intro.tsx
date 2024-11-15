import { Circle, makeScene2D, Txt } from "@motion-canvas/2d";
import { createRef, waitUntil } from "@motion-canvas/core";

import { PoppinsWhite, Theme } from "../../styles";

export default makeScene2D(function* (view) {
  view.fill(Theme.BG);
  view.add(<Txt {...PoppinsWhite}>INTRO</Txt>);

  yield* waitUntil("end");
});
