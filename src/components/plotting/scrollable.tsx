import { LinePlot, Plot } from '@hhenrichsen/canvas-commons';
import { makeScene2D } from '@motion-canvas/2d/lib/scenes';
import { createRef, range, useRandom } from '@motion-canvas/core';
import { waitFor } from '@motion-canvas/core/lib/flow';

export default makeScene2D(function* (view) {
view.fill("#333")

const random = useRandom();

const plot = createRef<Plot>();
view.add(
  <Plot
    size={500}
    ref={plot}
    labelX="Time"
    labelY="Beans"
    labelSize={10}
    opacity={0}
  >
    <LinePlot
      lineWidth={4}
      stroke={'red'}
      data={[[0, 100], [1, 80], [2, 60], [3,90]]}
    />
    ,
  </Plot>,
);

yield* plot().opacity(1, 2);
yield* waitFor(2);

yield* plot().ticks(5, 3);
yield* plot().tickLabelSize(20, 2);
yield* plot().size(800, 2);
yield* plot().labelSize(30, 2);
yield* plot().min(-10, 2);
yield* plot().opacity(0, 2);
plot().remove();

  yield* waitFor(5);
});