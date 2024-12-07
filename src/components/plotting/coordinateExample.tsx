import { Circle, makeScene2D } from "@motion-canvas/2d";
import { createRef, waitFor } from "@motion-canvas/core";
import { CoordinateSystem } from "./CoordinateSystem";
export default makeScene2D(function* (view) {
  // Create your animations here
  view.fill("#2c2c2c");
  const cs = createRef<CoordinateSystem>();
  view.add(
    <CoordinateSystem
      ref={cs}
      width={100}
      height={100}
    ></CoordinateSystem>
  );
  view.add(
    <Circle
      width={100}
      height={100}
      fill={"red"}
    />
  );
  yield* cs().draw();
  cs().xAxis.updateTicks(0, 10, 1);
  yield* waitFor(10);
});
