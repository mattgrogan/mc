import { Circle, Layout, makeScene2D, Txt } from "@motion-canvas/2d";
import {
  all,
  createRef,
  createSignal,
  useLogger,
  waitFor,
} from "@motion-canvas/core";

const RESOLUTION_X = 1920;
const RESOLUTION_Y = 1080;

export default makeScene2D(function* (view) {
  // Create your animations here
  view.fill("#333");

  const text = createRef<Txt>();

  const x = createSignal(0);
  const y = createSignal(0);

  view.add(
    <Layout
      x={x}
      y={y}
    >
      <Circle
        size={50}
        fill={"lightseagreen"}
      />
      <Txt
        ref={text}
        fill={"white"}
        fontSize={40}
        text={() => `[${x().toFixed(0)}, ${y().toFixed(0)}]`}
        y={0}
        offsetY={-2}
      />
    </Layout>
  );

  const circle = (
    <Circle
      size={50}
      fill={"lightseagreen"}
    />
  );

  view.add(circle.clone().position([-RESOLUTION_X / 2, 0]));

  yield* waitFor(1);
  yield* all(x(-RESOLUTION_X / 2, 1), text().offset([-1, 0], 1));
  yield* waitFor(1);
  yield* all(y(-RESOLUTION_Y / 2, 1), text().offset([-1, -1], 1));
  yield* waitFor(1);
  yield* all(x(0, 1), text().offset([0, -1], 1));
  yield* waitFor(1);
  yield* all(x(RESOLUTION_X / 2, 1), text().offset([1, -1], 1));
  yield* waitFor(1);
  yield* all(y(0, 1), text().offset([1, 0], 1), text().y(0, 1));
  yield* waitFor(1);
  yield* all(
    y(RESOLUTION_Y / 2, 1),
    text().offset([1, 1], 1),
    text().y(-50, 1)
  );
  yield* waitFor(1);
  yield* all(x(0, 1), text().offset([0, 1], 1));

  yield* waitFor(1);
});
