import { Circle, Line, makeScene2D } from "@motion-canvas/2d";
import {
  createRef,
  createSignal,
  useLogger,
  Vector2,
} from "@motion-canvas/core";
import { NumberLine } from "./NumberLine";

export default makeScene2D(function* (view) {
  // Create your animations here

  view.fill("#333");
  const nl = createRef<NumberLine>();

  view.add(
    <NumberLine
      ref={nl}
      minNumber={0}
      maxNumber={100}
      length={400}
      numberLineProps={{ lineWidth: 5, stroke: "red" }}
    />
  );

  const logger = useLogger();

  yield* nl().x(-600, 1);

  // const point = (
  //   <Circle
  //     size={50}
  //     fill={"red"}
  //   />
  // );
  // view.add(point);
});
