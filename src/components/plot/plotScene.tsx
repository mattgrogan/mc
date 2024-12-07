import { Circle, makeScene2D } from "@motion-canvas/2d";
import {
  createRef,
  createSignal,
  easeInOutCubic,
  useLogger,
  waitFor,
} from "@motion-canvas/core";
import { Plot } from "./plot";

export default makeScene2D(function* (view) {
  view.fill("#333");
  const plot = createRef<Plot>();

  view.add(
    <Plot
      ref={plot}
      size={[500, 500]}
      xAxisProps={{ opacity: 1, stroke: "blue", lineWidth: 12 }}
      xLabelProps={{ fill: "red" }}
      xTitleProps={{ fill: "white", text: "THIS IS THE X LABEL" }}
      yTitleProps={{
        fill: "white",
        text: "THIS IS THE Y LABEL",
        rotation: -90,
      }}
    ></Plot>
  );

  const circle = (
    <Circle
      size={20}
      fill={"red"}
    />
  );
  circle.absolutePosition(() => plot().c2p([75, 25]));
  view.add(circle);
  // Add ticks
  plot().xAxis.updateTicks(-50, 50, 10);

  yield* waitFor(1);
  const logger = useLogger();
  const n = plot().c2p([0, 0]);
  logger.debug({ message: `x=${n.x} y=${n.y}` });
  yield* plot().position(plot().position().addX(-100), 1);
  const n2 = plot().c2p([0, 0]);
  logger.debug({ message: `x=${n2.x} y=${n2.y}` });
  yield* waitFor(1);

  // Create a circle
  const c2 = plot().circle([100, 300], { size: 10, fill: "green" });

  // Create text
  const pct = createSignal(0);
  const t = plot().text([100, 300], {
    offset: [-1, 1],
    text: () => pct().toFixed(0),
    fill: "#fff",
  });

  // Create a line
  const l = plot().hLine([100, 300], { lineWidth: 10, stroke: "yellow" });

  // Create a box
  const b = plot().box([20, 5], [60, 10], { lineWidth: 3, stroke: "#fff" });
  yield* waitFor(1);

  // RESCALE
  yield* plot().rescale(-100, 200, 20, -100, 500, 50, 1);
  yield* waitFor(1);

  // RESIZE
  yield* plot().width(1200, 1);
  yield* waitFor(1);

  // Move the box
  yield* b.upperLeft([0, 300], 1);
  yield* b.shiftPositionTo([60, 100], [100, -50], 2, easeInOutCubic);
  yield* waitFor(1);

  yield* pct(100, 1);

  yield* waitFor(10);
});
