import {
  Camera,
  Gradient,
  Icon,
  Layout,
  makeScene2D,
  Node,
  Rect,
  Txt,
} from "@motion-canvas/2d";
import {
  createRef,
  createRefArray,
  Direction,
  easeInOutCubic,
  easeOutBounce,
  easeOutCubic,
  makeRefs,
  range,
  sequence,
  waitFor,
  waitUntil,
} from "@motion-canvas/core";
import {
  grayGradient,
  Grays,
  PoppinsBlack,
  PoppinsWhite,
  Theme,
} from "../../styles";
import { FadeIn } from "../../utils/FadeIn";

import * as params from "./DD_00_Params";

import { Plot } from "../../components/plot/plot";
import { commaFormmatter } from "../../components/styled/findQuantiles";
import { PlotArea } from "../../components/styled/plotArea";
import { TitleBox } from "../../components/styled/titleBox";
import { createLabelAndPointer } from "../../components/styled/labelAndPointer";

const X_AXIS_MIN = 0;
const X_AXIS_MAX = 40;
const X_AXIS_STEP = 100;

const Y_AXIS_MIN = 0;
const Y_AXIS_MAX = 5;
const Y_AXIS_STEP = 0.5;

const BETWEEN_SECS = 0.7;

let titleGradient = new Gradient({
  from: [0, -100],
  to: [0, 100],
  stops: [
    { offset: 0, color: "#831414" },
    { offset: 1, color: "#6a1010" },
  ],
});

const plotAreaFill = new Gradient({
  type: "linear",

  from: [0, -200],
  to: [0, 500],
  stops: [
    { offset: 0, color: "#d2d2d2" },
    { offset: 1, color: "#818181" },
  ],
});

export default makeScene2D(function* (view) {
  view.fill(Theme.BG);

  yield* waitFor(1);

  // CONTAINER
  const camera = createRef<Camera>();
  const container = createRef<Layout>();
  view.add(
    <Camera ref={camera}>
      <Layout
        ref={container}
        direction={"column"}
        justifyContent={"center"}
        alignItems={"center"}
        width={"100%"}
        height={"100%"}
        gap={50}
        padding={100}
        layout
      ></Layout>
    </Camera>
  );

  yield* waitFor(1);

  const plotTitle = makeRefs<typeof TitleBox>();
  container().add(
    <TitleBox
      refs={plotTitle}
      fontSize={100}
      nodeOpacity={0}
      rectProps={{ fill: titleGradient, stroke: Grays.GRAY1 }}
      headerProps={{ ...PoppinsWhite }}
      subheadProps={{ ...PoppinsWhite }}
    >
      HOUSE TAKE AND EDGE
    </TitleBox>
  );
  plotTitle.subhead.text(params.name);

  // Add a two column area
  const subContainer = createRef<Layout>();
  container().add(
    <Layout
      ref={subContainer}
      width={"100%"}
      height={"100%"}
      direction={"row"}
      gap={50}
    ></Layout>
  );

  // Add the data rows
  const col2 = createRef<Layout>();
  subContainer().add(
    <Layout
      ref={col2}
      height={"100%"}
      width={"40%"}
    ></Layout>
  );

  // https://github.com/motion-canvas/motion-canvas/issues/1057
  camera().scene().position(view.size().div(2));

  const parameterTable = createRef<Layout>();
  const rowNodes = createRefArray<Node>();
  const rowRects = createRefArray<Rect>();
  const rowTitles = createRefArray<Txt>();
  const rowValues = createRefArray<Txt>();

  let z = -100;
  col2().add(
    <Layout
      ref={parameterTable}
      direction={"column"}
      width={"100%"}
      height={"100%"}
      y={view.height() * 0.1}
      x={view.width() / -4}
      gap={20}
      layout
      opacity={1}
    >
      <Node
        ref={rowNodes}
        opacity={0}
      ></Node>
      {range(5).map((index) => (
        <Node
          ref={rowNodes}
          opacity={0}
          zIndex={z--}
        >
          <Rect
            ref={rowRects}
            basis={0}
            grow={1}
            opacity={1}
            width={"100%"}
            height={"18%"}
            stroke={Grays.GRAY3}
            lineWidth={5}
          >
            <Rect
              width={"50%"}
              height={"100%"}
              fill={Grays.WHITE}
              justifyContent={"start"}
              alignItems={"center"}
              padding={50}
            >
              <Txt
                ref={rowTitles}
                {...PoppinsWhite}
                fill={Grays.BLACK}
                textWrap
                textAlign={"left"}
                // text={"SESSIONS"}
                fontSize={90}
                fontWeight={400}
              ></Txt>
            </Rect>
            <Rect
              width={"50%"}
              height={"100%"}
              fill={Grays.GRAY1}
              justifyContent={"end"}
              alignItems={"center"}
              padding={50}
            >
              <Txt
                ref={rowValues}
                {...PoppinsWhite}
                fill={Grays.BLACK}
                // text={"100,000"}
                fontSize={90}
                fontWeight={600}
              ></Txt>
            </Rect>
          </Rect>
        </Node>
      ))}
    </Layout>
  );

  rowTitles[0].text("TOTAL BET");
  rowTitles[1].text("TOTAL WON");
  rowTitles[2].text("TOTAL LOST");
  rowTitles[3].text("HOUSE TAKE");
  rowTitles[4].text("HOUSE EDGE");

  rowValues[0].text(commaFormmatter(params.casinostats[0].TOTAL_BET));
  rowValues[1].text(commaFormmatter(params.casinostats[0].TOTAL_WON));
  rowValues[2].text(commaFormmatter(params.casinostats[0].TOTAL_LOST * -1));
  rowValues[3].text(commaFormmatter(params.casinostats[0].HOUSE_TAKE * -1));
  rowValues[4].text(
    commaFormmatter(params.casinostats[0].HOUSE_EDGE * -100, 3) + "%"
  );
  // ADD THE PLOT AREA
  const plotArea = makeRefs<typeof PlotArea>();
  const plot = createRef<Plot>();

  subContainer().add(
    <PlotArea
      refs={plotArea}
      props={{
        height: "100%",
        width: "50%",
        fill: plotAreaFill,
        stroke: Grays.GRAY1,
      }}
    ></PlotArea>
  );

  yield* waitFor(1);

  // Plot is only added after all the layout has been completed.
  plotArea.layout.add(
    <Plot
      ref={plot}
      position={() => plotArea.layout.position()}
      xMin={X_AXIS_MIN}
      xMax={X_AXIS_MAX}
      yMax={Y_AXIS_MAX}
      yMin={Y_AXIS_MIN}
      width={plotArea.rect.width() * 0.7}
      height={plotArea.rect.height() * 0.7}
      xAxisProps={{
        opacity: 0,
        stroke: Grays.BLACK,
        lineWidth: 8,
        end: 0,
      }}
      yAxisProps={{
        opacity: 1,
        stroke: Grays.BLACK,
        lineWidth: 8,
        end: 0,
      }}
      xLabelProps={{
        fill: Grays.BLACK,
        decimalNumbers: 0,
        fontSize: 40,
        opacity: 0,
      }}
      yLabelProps={{
        fill: Grays.BLACK,
        suffix: "%",
        decimalNumbers: 1,
        fontSize: 50,
      }}
      xTitleProps={{
        ...PoppinsBlack,
        fill: Grays.BLACK,
        text: "HOUSE EDGE",
        lineToLabelPadding: 50,
        opacity: 0,
        fontSize: 60,
      }}
      yTitleProps={{
        ...PoppinsBlack,
        fill: Grays.BLACK,
        text: "HOUSE EDGE",
        lineToLabelPadding: -230,
        opacity: 1,
        rotation: -90,
        fontSize: 80,
        fontWeight: 600,
      }}
      xTickProps={{ stroke: Grays.BLACK, opacity: 0 }}
      yTickProps={{ stroke: Grays.BLACK }}
    ></Plot>
  );

  // START DRAWING THE COMPONENTS HERE

  // Draw the title
  yield* FadeIn(plotTitle.headerContainer, 0, easeOutCubic, [100, 0]);
  yield* FadeIn(plotTitle.subheadContainer, 0, easeOutCubic, [100, 0]);
  yield* FadeIn(plotTitle.container, 0.6, easeOutCubic, [100, 0]);

  yield* waitFor(1);
  // Show the table
  yield* sequence(
    0.4,
    ...rowNodes.map((r) => FadeIn(r, 1, easeOutCubic, [0, 50]))
  );

  yield* waitFor(1);
  yield* waitUntil("show-arrow");

  const arrow = new Icon({
    icon: "mdi:arrow-left-bold",
    scale: 20,
    color: "#e53935",
    offsetX: -1,
    layout: false,
    opacity: 0,
  });

  arrow.position(rowRects[0].right);
  col2().add(arrow);
  // Total Bet
  yield* FadeIn(arrow, 1, easeOutBounce, [100, 0]);
  yield* waitFor(2);
  // Total Won
  yield* arrow.position(rowRects[1].right, 1, easeInOutCubic);
  yield* waitFor(2);
  // Total Lost
  yield* arrow.position(rowRects[2].right, 1, easeInOutCubic);
  yield* waitFor(3);
  // House Take
  yield* arrow.position(rowRects[3].right, 1, easeInOutCubic);
  yield* waitFor(2);
  // House Edge
  yield* arrow.position(rowRects[4].right, 1, easeInOutCubic);

  yield* waitFor(2);
  yield* arrow.opacity(0, 0.6);
  arrow.remove();
  ////////////////////////////////////////////////////////////
  yield* waitUntil("show-plot");

  // Draw the Plot
  yield* FadeIn(plotArea.container, 1, easeOutCubic, [100, 0]);

  // yield* waitFor(2);
  // yield plot().xAxis.end(1, 0.6, easeOutCubic);
  yield plot().yAxis.end(1, 0.6, easeOutCubic);
  // plot().xAxis.updateTicks(X_AXIS_MIN, X_AXIS_MAX, X_AXIS_STEP);
  plot().yAxis.updateTicks(Y_AXIS_MIN, Y_AXIS_MAX, Y_AXIS_STEP);

  yield* waitFor(2);

  // Zoom camera
  camera().save();
  yield parameterTable().opacity(0, 0.6);
  yield camera().centerOn([700, 200], 4, easeInOutCubic);
  yield camera().zoom(1.35, 4, easeInOutCubic);
  yield* waitFor(1);

  // ************************
  // THIS STRATEGY
  // ************************
  const HOUSE_EDGE_PERCENT = params.casinostats[0].HOUSE_EDGE * -100;
  const strat = createLabelAndPointer({
    plot: plot,
    target: [0, HOUSE_EDGE_PERCENT],
    label: params.name,
    value: HOUSE_EDGE_PERCENT.toFixed(3) + "%",
    offsetX: 1400,
    offsetY: 0,
    sourceElbowOffset: 0,
    targetElbowOffset: 0,
    mainRectProps: { scale: 0.7 },
    labelRectProps: { fill: titleGradient },
    lineProps: {
      lineWidth: 20,
      stroke: "#6a1010",
      arrowSize: 40,
      lineDash: [0],
      opacity: 0.8,
      endOffset: 30,
    },

    direction: Direction.Left,
  });
  yield FadeIn(strat.valueLabel, 0.6, easeOutCubic, [0, 50]);
  yield* strat.arrow.end(1, 0.6, easeInOutCubic);
  yield* waitFor(BETWEEN_SECS);
  // ************************
  // ODDS
  // ************************
  const odds = createLabelAndPointer({
    plot: plot,
    target: [0, 0],
    label: "TAKE/LAY ODDS",
    value: "0%",
    offsetX: 700,
    offsetY: 100,
    sourceElbowOffset: [-500, 0],
    sourceElbowOffset2: [0, -50],
    targetElbowOffset: [30, 0],
    mainRectProps: { scale: 0.4 },
    labelRectProps: { fill: grayGradient },
    lineProps: {
      lineWidth: 10,
      stroke: Grays.BLACK,
      arrowSize: 20,
      lineDash: [0],
      opacity: 0.6,
      endOffset: 10,
    },

    direction: Direction.Left,
  });
  yield FadeIn(odds.valueLabel, 0.6, easeOutCubic, [50, 0]);
  yield* odds.arrow.end(1, 0.6, easeInOutCubic);
  yield* waitFor(BETWEEN_SECS);
  // ************************
  // Pass/Come
  // ************************
  const pass = createLabelAndPointer({
    plot: plot,
    target: [0, 1.41],
    label: "PASS/COME",
    value: "1.41%",
    offsetX: 260,
    offsetY: 100,
    sourceElbowOffset: [-30, 0],
    sourceElbowOffset2: [0, -20],
    targetElbowOffset: [30, 30],
    mainRectProps: { scale: 0.4 },
    labelRectProps: { fill: grayGradient },
    lineProps: {
      lineWidth: 10,
      stroke: Grays.BLACK,
      arrowSize: 20,
      lineDash: [0],
      opacity: 0.6,
      endOffset: 10,
    },

    direction: Direction.Left,
  });
  yield FadeIn(pass.valueLabel, 0.6, easeOutCubic, [50, 0]);
  yield* pass.arrow.end(1, 0.6, easeInOutCubic);
  yield* waitFor(BETWEEN_SECS);
  // ************************
  // Field 3x
  // ************************
  const field = createLabelAndPointer({
    plot: plot,
    target: [0, 2.78],
    label: "Field (3:1)",
    value: "2.78%",
    offsetX: 900,
    offsetY: 120,
    sourceElbowOffset: [-100, 0],
    sourceElbowOffset2: [0, -10],
    targetElbowOffset: [50, 50],
    mainRectProps: { scale: 0.4 },
    labelRectProps: { fill: grayGradient },
    lineProps: {
      lineWidth: 10,
      stroke: Grays.BLACK,
      arrowSize: 20,
      lineDash: [0],
      opacity: 0.6,
      endOffset: 10,
    },

    direction: Direction.Left,
  });
  yield FadeIn(field.valueLabel, 0.6, easeOutCubic, [50, 0]);
  yield* field.arrow.end(1, 0.6, easeInOutCubic);
  yield* waitFor(BETWEEN_SECS);
  // ************************
  // Place 6/8
  // ************************
  const place68 = createLabelAndPointer({
    plot: plot,
    target: [0, 1.52],
    label: "Place 6/8",
    value: "1.52%",
    offsetX: 480,
    offsetY: 50,
    sourceElbowOffset: [-20, 0],
    sourceElbowOffset2: [0, -10],
    targetElbowOffset: [10, -10],
    mainRectProps: { scale: 0.4 },
    labelRectProps: { fill: grayGradient },
    lineProps: {
      lineWidth: 10,
      stroke: Grays.BLACK,
      arrowSize: 20,
      lineDash: [0],
      opacity: 0.6,
      endOffset: 10,
    },

    direction: Direction.Left,
  });
  yield FadeIn(place68.valueLabel, 0.6, easeOutCubic, [50, 0]);
  yield* place68.arrow.end(1, 0.6, easeInOutCubic);
  yield* waitFor(BETWEEN_SECS);
  // ************************
  // Place 5/9
  // ************************
  const place59 = createLabelAndPointer({
    plot: plot,
    target: [0, 4.0],
    label: "Place 5/9",
    value: "4.00%",
    offsetX: 700,
    offsetY: 0,
    sourceElbowOffset: [0, 0],
    sourceElbowOffset2: [0, 0],
    targetElbowOffset: [0, 0],
    mainRectProps: { scale: 0.4 },
    labelRectProps: { fill: grayGradient },
    lineProps: {
      lineWidth: 10,
      stroke: Grays.BLACK,
      arrowSize: 20,
      lineDash: [0],
      opacity: 0.6,
      endOffset: 10,
    },

    direction: Direction.Left,
  });
  yield FadeIn(place59.valueLabel, 0.6, easeOutCubic, [50, 0]);
  yield* place59.arrow.end(1, 0.6, easeInOutCubic);
  yield* waitFor(BETWEEN_SECS);

  // ************************
  // RESCALE
  // ************************
  yield* plot().rescale(
    X_AXIS_MIN,
    X_AXIS_MAX,
    X_AXIS_STEP,
    0,
    18,
    2,
    2,
    easeInOutCubic
  );
  yield* waitFor(BETWEEN_SECS);

  // ************************
  // Field 2x
  // ************************
  const field2 = createLabelAndPointer({
    plot: plot,
    target: [0, 5.56],
    label: "Field (2:1)",
    value: "5.56%",
    offsetX: 900,
    offsetY: 0,
    sourceElbowOffset: [0, 0],
    sourceElbowOffset2: [0, 0],
    targetElbowOffset: [0, 0],
    mainRectProps: { scale: 0.4 },
    labelRectProps: { fill: grayGradient },
    lineProps: {
      lineWidth: 10,
      stroke: Grays.BLACK,
      arrowSize: 20,
      lineDash: [0],
      opacity: 0.6,
      endOffset: 10,
    },

    direction: Direction.Left,
  });
  yield FadeIn(field2.valueLabel, 0.6, easeOutCubic, [50, 0]);
  yield* field2.arrow.end(1, 0.6, easeInOutCubic);
  yield* waitFor(BETWEEN_SECS);
  // ************************
  // Place 4/10
  // ************************
  const place410 = createLabelAndPointer({
    plot: plot,
    target: [0, 6.67],
    label: "Place 4/10",
    value: "6.67%",
    offsetX: 400,
    offsetY: -50,
    sourceElbowOffset: [-50, 0],
    sourceElbowOffset2: [0, 30],
    targetElbowOffset: [10, 0],
    mainRectProps: { scale: 0.4 },
    labelRectProps: { fill: grayGradient },
    lineProps: {
      lineWidth: 10,
      stroke: Grays.BLACK,
      arrowSize: 20,
      lineDash: [0],
      opacity: 0.6,
      endOffset: 10,
    },

    direction: Direction.Left,
  });
  yield FadeIn(place410.valueLabel, 0.6, easeOutCubic, [50, 0]);
  yield* place410.arrow.end(1, 0.6, easeInOutCubic);
  yield* waitFor(BETWEEN_SECS);
  // ************************
  // Hard 4/10
  // ************************
  const hard410 = createLabelAndPointer({
    plot: plot,
    target: [0, 11.11],
    label: "Hard 4/10",
    value: "11.11%",
    offsetX: 800,
    offsetY: 0,
    sourceElbowOffset: [0, 0],
    sourceElbowOffset2: [0, 0],
    targetElbowOffset: [0, 0],
    mainRectProps: { scale: 0.4 },
    labelRectProps: { fill: grayGradient },
    lineProps: {
      lineWidth: 10,
      stroke: Grays.BLACK,
      arrowSize: 20,
      lineDash: [0],
      opacity: 0.6,
      endOffset: 10,
    },

    direction: Direction.Left,
  });
  yield FadeIn(hard410.valueLabel, 0.6, easeOutCubic, [50, 0]);
  yield* hard410.arrow.end(1, 0.6, easeInOutCubic);
  yield* waitFor(BETWEEN_SECS);
  // ************************
  // Any Craps
  // ************************
  const anycraps = createLabelAndPointer({
    plot: plot,
    target: [0, 11.11],
    label: "Any Craps",
    value: "11.11%",
    offsetX: 400,
    offsetY: 0,
    sourceElbowOffset: [0, 0],
    sourceElbowOffset2: [0, 0],
    targetElbowOffset: [0, 0],
    mainRectProps: { scale: 0.4 },
    labelRectProps: { fill: grayGradient },
    lineProps: {
      lineWidth: 10,
      stroke: Grays.BLACK,
      arrowSize: 20,
      lineDash: [0],
      opacity: 0.6,
      endOffset: 10,
    },

    direction: Direction.Left,
  });
  yield FadeIn(anycraps.valueLabel, 0.6, easeOutCubic, [50, 0]);
  yield* anycraps.arrow.end(1, 0.6, easeInOutCubic);
  yield* waitFor(BETWEEN_SECS);

  // ************************
  // Any Seven
  // ************************
  const anyseven = createLabelAndPointer({
    plot: plot,
    target: [0, 16.67],
    label: "Any Seven",
    value: "16.67%",
    offsetX: 400,
    offsetY: 0,
    sourceElbowOffset: [0, 0],
    sourceElbowOffset2: [0, 0],
    targetElbowOffset: [0, 0],
    mainRectProps: { scale: 0.4 },
    labelRectProps: { fill: grayGradient },
    lineProps: {
      lineWidth: 10,
      stroke: Grays.BLACK,
      arrowSize: 20,
      lineDash: [0],
      opacity: 0.6,
      endOffset: 10,
    },

    direction: Direction.Left,
  });
  yield FadeIn(anyseven.valueLabel, 0.6, easeOutCubic, [50, 0]);
  yield* anyseven.arrow.end(1, 0.6, easeInOutCubic);

  yield* waitFor(1);
  yield parameterTable().opacity(1, 1.5);
  yield* camera().restore(2, easeInOutCubic);

  yield* waitFor(10);
  yield* waitUntil("end");
});
