import { Circle, makeScene2D } from "@motion-canvas/2d";
import { createRef, Direction, useLogger, waitFor } from "@motion-canvas/core";
import { RollText } from "../utils/RollText";

export default makeScene2D(function* (view) {
  // Create your animations here

  const r = createRef<RollText>();

  view.add(
    <RollText
      ref={r}
      width={300}
      height={100}
      stroke={"#666"}
      lineWidth={1}
      initialText={"Hello"}
      txtProps={{ fill: "black", fontSize: 80 }}
    />
  );

  yield* r().next("Left", Direction.Left);
  yield* r().next("Right", Direction.Right);
  yield* r().next("Top", Direction.Top);
  yield* r().next("Bottom", Direction.Bottom);
  yield* r().next("Bye", false);

  yield* waitFor(5);
});
