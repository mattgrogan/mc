import {
  Img,
  Layout,
  makeScene2D,
  Rect,
  Txt,
  TxtProps,
} from "@motion-canvas/2d";
import {
  all,
  createRef,
  easeInElastic,
  easeInOutCubic,
  easeOutBounce,
  easeOutCubic,
  easeOutExpo,
  fadeTransition,
  sequence,
  waitFor,
  waitUntil,
} from "@motion-canvas/core";

import {
  Bright,
  Darker,
  Darkest,
  Grays,
  MonoWhite,
  PoppinsWhite,
  Theme,
} from "../../styles";

import bg from "../../../assets/dark_craps_layout_bg.png";
import { Plot } from "../../components/plot/plot";
import { FadeIn } from "../../utils/FadeIn";

import casinostats from "../../../../dicedata/output/skill66halfpress-100k/skill66halfpress-100k-casinostats.json";

//() =>
// (
//   ((this.totalLost + this.totalWon) / this.totalBet) *
//   100 *
//   this.pctComplete() *
//   -1
// ).toFixed(3) + " %"
const HOUSE_EDGE =
  (casinostats[0].TOTAL_LOST + casinostats[0].TOTAL_WON) /
  casinostats[0].TOTAL_BET;
const HOUSE_EDGE_PERCENT = HOUSE_EDGE * 100;
const HOUSE_EDGE_LABEL =
  "SKILL66 HALF-PRESS (" + (HOUSE_EDGE_PERCENT * -1).toFixed(3) + "%)";

export default makeScene2D(function* (view) {
  view.fill("#000");
  view.add(
    <Img
      src={bg}
      opacity={0.3}
    />
  );

  const container = createRef<Layout>();
  const plot = createRef<Plot>();
  const title = createRef<Txt>();
  const frame = createRef<Rect>();

  view.add(
    <Layout ref={container}>
      <Rect
        ref={frame}
        width={"90%"}
        height={"90%"}
        fill={Grays.BLACK}
        radius={10}
        stroke={Grays.GRAY3}
        lineWidth={2}
        scale={0}
        clip
      >
        <Plot
          ref={plot}
          yMin={-2}
          yMax={0}
          x={360}
          y={50}
          size={[800, 800]}
          xAxisProps={{ opacity: 0 }}
          yAxisProps={{
            opacity: 0,
            stroke: Grays.GRAY2,
            lineWidth: 6,
            start: 0.5,
            end: 0.5,
          }}
          yTickProps={{ lineWidth: 2, stroke: Grays.GRAY2 }}
          yLabelProps={{
            fill: Grays.GRAY1,
            suffix: "%",
            decimalNumbers: 1,
            fontSize: 25,
          }}
          // yTitleProps={{
          //   ...PoppinsWhite,
          //   fontSize: 50,
          //   text: "House Edge",
          //   rotation: -90,
          //   opacity: 0,
          // }}
        ></Plot>
        <Txt
          ref={title}
          {...PoppinsWhite}
          fill={Theme.TITLE}
          text={"House Edge"}
          y={-430}
          x={-40}
          opacity={0}
        />
      </Rect>
    </Layout>
  );

  yield* fadeTransition();

  yield* waitFor(1);
  yield* frame().scale(1, 1.2, easeOutExpo);
  yield* all(
    plot().yAxis.opacity(1, 0.2),
    plot().yAxis.start(0, 0.6, easeOutExpo),
    plot().yAxis.end(1, 0.6, easeOutExpo)
  );

  // Add ticks
  plot().yAxis.updateTicks(-20, 0, 0.5);
  yield* waitFor(0.2);
  yield* FadeIn(title, 0.6, easeOutCubic, [50, 0]);
  //yield* plot().yTitle.opacity(1, 0.6);

  yield* waitFor(0.2);

  const lineProps = {
    lineWidth: 1,
    stroke: Grays.GRAY1,
    // fill: Grays.GRAY2,
    startOffset: 15,
    endOffset: 20,
    //lineDash: [20, 5],
    start: 1,
    startArrow: true,
    arrowSize: 5,
  };

  const edgeLabelProps: TxtProps = {
    //...MonoWhite,
    ...PoppinsWhite,
    fill: Bright.RED,
    fontWeight: 400,
    fontSize: 30,
    opacity: 0,
    offset: [-1, 0],
  };

  yield* waitUntil("place68");
  const place68Line = plot().hLine([60, -1.52], lineProps);
  const place68Label = plot().text([60, -1.52], {
    ...edgeLabelProps,
    text: "PLACE 6/8 (1.52%)",
  });
  yield place68Line.start(0, 0.6, easeInOutCubic);
  yield* place68Label.opacity(1, 1);

  yield* waitFor(0.5);

  yield* waitUntil("place59");
  yield* plot().rescale(0, 100, 1, -5, 0, 1, 1, easeInOutCubic);
  const place59Line = plot().hLine([10, -4], lineProps);
  const place59Label = plot().text([10, -4], {
    ...edgeLabelProps,
    text: "PLACE 5/9 (4.00%)",
  });

  yield place59Line.start(0, 0.6, easeInOutCubic);
  yield* place59Label.opacity(1, 0.6);

  yield* waitUntil("skill66");
  const skill66Line = plot().hLine([-20, HOUSE_EDGE_PERCENT], {
    lineWidth: 6,
    stroke: Bright.ORANGE,
    startOffset: 0,
    endOffset: 20,
    lineDash: [20, 5],
    start: 1,
    startArrow: true,
    arrowSize: 15,
  });
  const skill66Label = plot().text([-20, HOUSE_EDGE_PERCENT], {
    //...MonoWhite,
    ...PoppinsWhite,
    fontWeight: 500,
    fontSize: 40,
    opacity: 0,
    fill: Bright.ORANGE,
    offset: [1, 0],
    text: HOUSE_EDGE_LABEL,
  });

  yield skill66Label.opacity(1, 1.2);
  yield* skill66Line.start(0, 1, easeOutExpo);

  yield* waitUntil("others");
  ///////////////////////////

  const oddsLine = plot().hLine([10, 0], lineProps);
  const oddsLabel = plot().text([10, 0], {
    ...edgeLabelProps,
    text: "TAKE/LAY ODDS (0.00%)",
  });

  yield* sequence(
    0.4,
    oddsLine.start(0, 0.6, easeInOutCubic),
    oddsLabel.opacity(1, 0.6)
  );

  const passLine = plot().hLine([10, -1.41], lineProps);
  const passLabel = plot().text([10, -1.41], {
    ...edgeLabelProps,
    offsetY: 1,
    text: "PASS/COME (1.41%)",
  });

  yield passLine.start(0, 0.6, easeInOutCubic);
  yield* passLabel.opacity(1, 0.6);

  //yield passLabel.offset([-1, 1], 1, easeInOutCubic);

  const field3Line = plot().hLine([10, -2.78], lineProps);
  const field3Label = plot().text([10, -2.78], {
    ...edgeLabelProps,
    text: "FIELD (3:1) (2.78%)",
  });

  yield field3Line.start(0, 0.6, easeInOutCubic);
  yield* field3Label.opacity(1, 0.6);

  yield* waitFor(1);
  yield* plot().rescale(0, 100, 1, -10, 0, 2, 2, easeInOutCubic);

  const field2Line = plot().hLine([10, -5.56], lineProps);
  const field2Label = plot().text([10, -5.56], {
    ...edgeLabelProps,
    text: "FIELD (2:1) (5.56%)",
  });

  yield field2Line.start(0, 0.6, easeInOutCubic);
  yield* field2Label.opacity(1, 0.6);

  const place410Line = plot().hLine([10, -6.67], lineProps);
  const place410Label = plot().text([10, -6.67], {
    ...edgeLabelProps,
    text: "PLACE 4/10 (6.67%)",
  });

  yield place410Line.start(0, 0.6, easeInOutCubic);
  yield* place410Label.opacity(1, 0.6);

  const hard68Line = plot().hLine([10, -9.09], lineProps);
  const hard68Label = plot().text([10, -9.09], {
    ...edgeLabelProps,
    text: "HARD 6/8 (9.09%)",
  });

  yield hard68Line.start(0, 0.6, easeInOutCubic);
  yield* hard68Label.opacity(1, 0.6);

  yield* waitFor(1);
  yield* plot().rescale(0, 100, 1, -18, 0, 2, 1, easeInOutCubic);

  const hard410Line = plot().hLine([10, -11.11], lineProps);
  const hard410Label = plot().text([10, -11.11], {
    ...edgeLabelProps,
    text: "HARD 4/10 & ANY CRAPS (11.11%)",
  });

  yield hard410Line.start(0, 0.6, easeInOutCubic);
  yield* hard410Label.opacity(1, 0.6);

  //yield* plot().rescale(0, 100, 1, -18, 0, 2, 1, easeInOutCubic);

  const sevenLine = plot().hLine([10, -16.67], lineProps);
  const sevenLabel = plot().text([10, -16.67], {
    ...edgeLabelProps,
    text: "ANY SEVEN (16.67%)",
  });

  yield sevenLine.start(0, 0.6, easeInOutCubic);
  yield* sevenLabel.opacity(1, 0.6);

  yield* waitFor(5);

  yield* frame().height(0, 1, easeInElastic);
  frame().remove();

  yield* waitFor(2);

  yield* waitUntil("end");
});
