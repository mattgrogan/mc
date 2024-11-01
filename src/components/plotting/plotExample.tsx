import { Circle, Line, makeScene2D } from "@motion-canvas/2d";
import {
  createRef,
  createSignal,
  useLogger,
  Vector2,
} from "@motion-canvas/core";
import { Axis } from "./Axis";

export default makeScene2D(function* (view) {
  // Create your animations here

  view.fill("black");
  const line = createRef<Line>();

  view.add(
    <Line
      ref={line}
      points={[
        [-600, 0],
        [600, 0],
      ]}
      lineWidth={5}
      stroke={"white"}
    />
  );

  const axis = new Axis({
    minCoord: 0,
    maxCoord: 100,
    minPoint: () => line().left().x,
    maxPoint: () => line().right().x,
  });
  const logger = useLogger();
  const p = axis.c2p(50);
  logger.debug(p().toString());

  logger.debug("Creating pointVal");
  const pointVal = createSignal(50);
  logger.debug("pointVal=" + pointVal().toString());

  const point = (
    <Circle
      size={50}
      fill={"red"}
    />
  );
  view.add(point);

  point.x(axis.c2p(50));

  logger.debug("maxCoord=" + axis.maxCoord().toString());
  axis.maxCoord(50);
  logger.debug("maxCoord=" + axis.maxCoord().toString());

  yield* axis.maxCoord(200, 1);

  yield* point.x(axis.c2p(30), 1);

  yield* line().scale(0.5, 1);
  yield* point.x(axis.c2p(75), 1);
});
