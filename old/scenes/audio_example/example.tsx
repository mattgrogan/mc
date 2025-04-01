import { Rect, makeScene2D } from "@motion-canvas/2d";
import {
  all,
  createRef,
  easeInExpo,
  easeInOutExpo,
  sound,
  waitFor,
} from "@motion-canvas/core";
import scrollAudio from "../../../assets/sfx/chime_012.mp3";
import cha from "./cha-ching.wav";

const sfx = sound(scrollAudio); //.trim(1.1, 3);
const sfx2 = sound(scrollAudio); //.trim(1.1, 3);

const chasound = sound(cha).gain(-20);

export default makeScene2D(function* (view) {
  const rect = createRef<Rect>();
  // const r = new Rect({ ref: rect, size: 320, fill: "blue" });

  view.add(
    <Rect
      ref={rect}
      size={320}
      radius={80}
      smoothCorners
      fill={"#f3303f"}
    />
    // r
  );
  chasound.play();
  yield* waitFor(0.3);
  sfx.play();
  yield* all(
    rect().rotation(90, 1, easeInOutExpo),
    rect().scale(2, 1, easeInOutExpo)
  );
  yield* rect().scale(1, 0.6, easeInExpo);
  sfx2.play();
  rect().fill("#ffa56d");
  yield* all(rect().ripple(1), rect().fill("#f3303f", 1));
  yield* waitFor(20);
});
