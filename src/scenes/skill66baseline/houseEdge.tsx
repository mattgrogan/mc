import { Img, Layout, makeScene2D } from "@motion-canvas/2d";
import {
  all,
  createRef,
  easeInOutCubic,
  easeOutExpo,
  sequence,
  waitFor,
  waitUntil,
} from "@motion-canvas/core";

import { Bright, Grays, MonoWhite, PoppinsWhite, Theme } from "../../styles";

import bg from "../../../assets/dark_craps_layout_bg.png";
import { Plot } from "../../components/plot/plot";

export default makeScene2D(function* (view) {
  view.fill(Theme.BG);
  // view.add(
  //   <Img
  //     src={bg}
  //     opacity={0.3}
  //   />
  // );

  const container = createRef<Layout>();
  const plot = createRef<Plot>();

  view.add(
    <Layout ref={container}>
      <Plot
        ref={plot}
        yMin={-2}
        yMax={0}
        size={[1200, 800]}
        xAxisProps={{ opacity: 0 }}
        yAxisProps={{
          opacity: 0,
          stroke: "white",
          lineWidth: 4,
          start: 0.5,
          end: 0.5,
        }}
        yLabelProps={{
          fill: "white",
          suffix: "%",
          decimalNumbers: 2,
          fontSize: 40,
        }}
        yTitleProps={{
          ...PoppinsWhite,
          fontSize: 50,
          text: "House Edge",
          rotation: -90,
          opacity: 0,
        }}
      ></Plot>
    </Layout>
  );

  yield* waitFor(1);
  yield* all(
    plot().yAxis.opacity(1, 0.2),
    plot().yAxis.start(0, 0.6, easeOutExpo),
    plot().yAxis.end(1, 0.6, easeOutExpo)
  );

  // Add ticks
  plot().yAxis.updateTicks(-20, 0, 0.5);
  yield* waitFor(0.2);
  yield* plot().yTitle.opacity(1, 0.6);

  yield* waitFor(0.2);

  const oddsLine = plot().hLine([100, 0], {
    lineWidth: 3,
    stroke: Grays.GRAY2,
    startOffset: 50,
    lineDash: [20, 5],
    end: 0,
    startArrow: true,
    arrowSize: 10,
  });
  const oddsLabel = plot().text([100, 0], {
    ...MonoWhite,
    fontWeight: 200,
    fontSize: 40,
    opacity: 0,
    offset: [1, 1],
    text: "TAKE / LAY ODDS (0.00%)",
  });

  yield* oddsLine.end(1, 1, easeInOutCubic);
  yield* oddsLabel.opacity(1, 1);

  yield* waitFor(1);

  const passLine = plot().hLine([50, -1.41], {
    lineWidth: 3,
    stroke: Grays.GRAY2,
    startOffset: 50,
    lineDash: [20, 5],
    end: 0,
    startArrow: true,
    arrowSize: 10,
  });
  const passLabel = plot().text([50, -1.41], {
    ...MonoWhite,
    fontWeight: 200,
    fontSize: 40,
    opacity: 0,
    offset: [1, 1],
    text: "PASSLINE (1.41%)",
  });

  yield* passLine.end(1, 1, easeInOutCubic);
  yield* passLabel.opacity(1, 1);

  yield* waitFor(1);

  const place68Line = plot().hLine([100, -1.52], {
    lineWidth: 3,
    stroke: Grays.GRAY2,
    startOffset: 50,
    lineDash: [20, 5],
    end: 0,
    startArrow: true,
    arrowSize: 10,
  });
  const place68Label = plot().text([100, -1.52], {
    ...MonoWhite,
    fontWeight: 200,
    fontSize: 40,
    opacity: 0,

    offset: [1, 1],
    text: "PLACE 6 & 8 (1.52%)",
  });
  yield* place68Line.end(1, 1, easeInOutCubic);
  yield* place68Label.opacity(1, 1);

  yield* waitFor(1);

  yield* plot().rescale(0, 100, 1, -5, 0, 1, 2, easeInOutCubic);
  yield* waitFor(1);

  const place59Line = plot().hLine([60, -4], {
    lineWidth: 3,
    stroke: Grays.GRAY2,
    startOffset: 50,
    lineDash: [20, 5],
    end: 0,
    startArrow: true,
    arrowSize: 10,
  });
  const place59Label = plot().text([60, -4], {
    ...MonoWhite,
    fontWeight: 200,
    fontSize: 40,
    opacity: 0,
    offset: [1, 1],
    text: "PLACE 5 & 9 (4.00%)",
  });

  yield* place59Line.end(1, 1, easeInOutCubic);
  yield* place59Label.opacity(1, 1);

  yield* waitFor(1);
  const skill66Line = plot().hLine([50, -2.591], {
    lineWidth: 6,
    stroke: Bright.YELLOW,
    startOffset: 50,
    lineDash: [20, 5],
    start: 1,
    startArrow: true,
    arrowSize: 15,
  });
  const skill66Label = plot().text([50, -2.591], {
    ...MonoWhite,
    fontWeight: 500,
    fontSize: 40,
    opacity: 0,
    fill: Bright.YELLOW,
    offset: [1, 1],
    text: "SKILL 66 (2.591%)",
  });

  yield* sequence(
    0.2,
    skill66Line.start(0, 1, easeInOutCubic),
    skill66Label.opacity(1, 1)
  );

  yield* waitFor(1);
  yield* plot().rescale(0, 100, 1, -20, 0, 5, 2, easeInOutCubic);

  yield* waitFor(2);

  yield* waitUntil("end");
});
