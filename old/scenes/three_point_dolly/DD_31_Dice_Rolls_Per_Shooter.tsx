import {
  Camera,
  Gradient,
  Layout,
  Line,
  makeScene2D,
  Txt,
} from "@motion-canvas/2d";
import {
  createRef,
  Direction,
  easeInOutCubic,
  easeOutCubic,
  linear,
  makeRefs,
  sequence,
  useLogger,
  Vector2,
  waitFor,
  waitUntil,
} from "@motion-canvas/core";
import {
  Darker,
  Darkest,
  gameFlowDark,
  gameFlowGradient,
  Grays,
  PoppinsBlack,
  PoppinsWhite,
  sessionDark,
  Theme,
} from "../../styles";
import { FadeIn } from "../../utils/FadeIn";
import * as params from "./DD_00_Params";
import { Plot } from "../../components/plot/plot";
import { TitleBox } from "../../components/styled/titleBox";
import { PlotArea } from "../../components/styled/plotArea";
import { getQuantile } from "../../components/styled/findQuantiles";
import {
  createLabelAndPointer,
  eraseLabelAndPointer,
} from "../../components/styled/labelAndPointer";
import { createValueLabel } from "../../components/plot/PlotValueLabel";
// import { audioPlayer } from "./DD_00_Params";

const QUANTILES_ID = "SHOOTER_ROLL_BY_SHOOTER";
// Filter just the data we want on the histogram
// const data = params.sessionHist.slice(0, 35);
const data = params.rollsByShooter;

// TITLE
const TITLE = "NUMBER OF DICE ROLLS";
const SUBTITLE = "BY SHOOTER";

// PLOT OPTIONS
const X_AXIS_MIN = 0;
const X_AXIS_MAX = 100;
const X_AXIS_STEP = 5;
const Y_AXIS_MAX = 45;
const X_TICKS_EVERY = 1;
const PCT_FONT_SIZE = 40;

// BAR OPTIONS
const BAR_WIDTH = 80;

// The amount those gray limit bars go to X
const MINMAX_HIGH = Y_AXIS_MAX * 0.025;
const MINMAX_LOW = Y_AXIS_MAX * -0.025;

// THE COUNT
const COUNT = "1,000,000";

// Seconds between drawing each bar and label
const BAR_DRAW_DELAY = 0.1;

// COLORS
const MAIN_GRADIENT = gameFlowGradient;
const BAR_COLOR = gameFlowDark;

const AVERAGE_WONLOST = params.simstats[0].ROLLS / params.simstats[0].SHOOTERS;
const plotAreaFill = new Gradient({
  type: "linear",

  from: [0, -200],
  to: [0, 500],
  stops: [
    { offset: 0, color: "#d2d2d2" },
    { offset: 1, color: "#818181" },
  ],
});

const DEFAULTS_LABEL_AND_POINTER = {
  offsetX: 0,
  offsetY: 200,
  sourceElbowOffset: new Vector2([0, -20]),
  targetElbowOffset: new Vector2([0, 50]),
  sourceElbowOffset2: 0,
  direction: Direction.Top,
};

export default makeScene2D(function* (view) {
  // view.fill(Theme.BG);
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

  // TITLE BOX
  const plotTitle = makeRefs<typeof TitleBox>();
  container().add(
    <TitleBox
      refs={plotTitle}
      fontSize={100}
      nodeOpacity={0}
      rectProps={{ fill: MAIN_GRADIENT, stroke: Grays.GRAY1 }}
      headerProps={{ ...PoppinsWhite }}
      subheadProps={{ ...PoppinsWhite }}
    >
      {TITLE}
    </TitleBox>
  );
  plotTitle.subhead.text(SUBTITLE);

  // PLOT AREA
  const plotArea = makeRefs<typeof PlotArea>();
  container().add(
    <PlotArea
      refs={plotArea}
      props={{
        fill: plotAreaFill,
        stroke: Grays.GRAY1,
      }}
    ></PlotArea>
  );

  // https://github.com/motion-canvas/motion-canvas/issues/1057
  camera().scene().position(view.size().div(2));

  // ADD THE PLOT
  const plot = createRef<Plot>();
  plotArea.layout.add(
    <Plot
      ref={plot}
      position={() => plotArea.layout.position().addY(-100)}
      xMin={X_AXIS_MIN}
      xMax={X_AXIS_MAX}
      yMax={Y_AXIS_MAX}
      width={plotArea.rect.width() * 0.9}
      height={plotArea.rect.height() * 0.7}
      xAxisProps={{
        opacity: 1,
        stroke: Grays.BLACK,
        lineWidth: 8,
        end: 0,
        tickLength: 30,
      }}
      xLabelProps={{
        fill: Grays.BLACK,
        decimalNumbers: 0,
        fontSize: 40,
        lineToLabelPadding: 50,
      }}
      xTitleProps={{
        fill: Grays.BLACK,
        text: "",
        lineToLabelPadding: 200,
        opacity: 0,
        fontSize: 100,
      }}
      xTickProps={{ stroke: Grays.BLACK }}
      yAxisProps={{ opacity: 0 }}
    ></Plot>
  );

  // START DRAWING THE COMPONENTS HERE

  // Draw the title
  // yield* FadeIn(plotTitle.headerContainer, 0, easeOutCubic, [100, 0]);
  // yield* FadeIn(plotTitle.subheadContainer, 0, easeOutCubic, [100, 0]);
  // yield* FadeIn(plotTitle.container, 0.6, easeOutCubic, [100, 0]);

  // yield* waitFor(1);

  // Draw the Plot
  yield* FadeIn(plotArea.container, 1, easeOutCubic, [100, 0]);

  // yield* waitFor(2);
  yield plot().xAxis.end(1, 0.6, easeOutCubic);
  plot().xAxis.updateTicks(X_AXIS_MIN, X_AXIS_MAX, X_AXIS_STEP, X_TICKS_EVERY);

  // Add the Min line
  const minValue = getQuantile(QUANTILES_ID, params.quantiles, 0);
  const maxValue = getQuantile(QUANTILES_ID, params.quantiles, 1);

  // Draw shadow over the x axis outside of the data range
  const lowerRangeBox = plot().box(
    [0, MINMAX_HIGH],
    [minValue - 1, MINMAX_LOW],
    {
      fill: Grays.GRAY3,
      opacity: 0,
      zIndex: 200,
    }
  );
  const upperRangeBox = plot().box(
    [maxValue, MINMAX_HIGH],
    [Math.max(X_AXIS_MAX, maxValue), MINMAX_LOW],
    {
      fill: Grays.GRAY3,
      opacity: 0,
      zIndex: -200,
    }
  );

  yield* waitFor(2);

  // ************************
  // FACTOR THIS STUFF OUT
  // ************************
  const bars: Line[] = [];
  const labels: Txt[] = [];

  for (let index = 0; index < data.length; index++) {
    const offset = 50;
    const point = new Vector2(data[index].MIDPOINT, data[index].PCT);
    const line = plot().vLine(point, {
      stroke: BAR_COLOR,
      lineWidth: BAR_WIDTH,
      opacity: 1,
      end: 0,
    });
    if (data[index].COUNT > 0) {
      bars.push(line);
    }

    if (data[index].PCT >= 0.1) {
      const pct = data[index].PCT.toFixed(1);
      const label = plot().text(point, {
        ...PoppinsWhite,
        text: pct,
        offsetY: 1.5,
        fill: Grays.BLACK,
        fontWeight: 500,
        fontSize: PCT_FONT_SIZE,
        opacity: 0,
      });
      label.add(
        <Txt
          text="%"
          fontSize={PCT_FONT_SIZE * 0.6}
        />
      );

      labels.push(label);
    } else if (data[index].PCT < 0.1 && data[index].PCT > 0) {
      const pct = "<0.1";
      const label = plot().text(point, {
        ...PoppinsWhite,
        text: pct,
        offsetY: 2,
        fill: Grays.GRAY2,
        fontWeight: 500,
        fontSize: PCT_FONT_SIZE,
        opacity: 0,
      });
      label.add(
        <Txt
          text="%"
          fontSize={PCT_FONT_SIZE * 0.6}
        />
      );
      labels.push(label);
    }
  }
  // ************************
  // END FACTOR
  // ************************

  // ************************
  // CREATE OBJECTS
  // ************************

  const zeroLine = plot().vLine([0, Y_AXIS_MAX], {
    lineWidth: 5,
    stroke: Grays.GRAY2,
    lineDash: [20, 5],
    opacity: 0.5,
    end: 0,
  });

  // COUNT
  const countRefs = makeRefs<typeof createValueLabel>();
  const count = createValueLabel({
    refs: countRefs,
    plot: plot,
    target: [X_AXIS_MAX, Y_AXIS_MAX],
    mainRectProps: {
      radius: 0,
      shadowOffset: [0, 0],
      shadowBlur: 0,
      lineWidth: 2,
      stroke: Grays.BLACK,
      opacity: 0,
    },
    labelRectProps: { fill: Grays.GRAY4 },
    labelTxtProps: { text: "COUNT", ...PoppinsWhite, padding: 20 },
    valueRectProps: { fill: Grays.WHITE },
    valueTxtProps: {
      text: COUNT,
      ...PoppinsBlack,
      padding: 20,
    },
  });

  // MEDIAN
  const medianValue = getQuantile(QUANTILES_ID, params.quantiles, 0.5);
  const median = createLabelAndPointer({
    ...DEFAULTS_LABEL_AND_POINTER,
    labelRectProps: { fill: MAIN_GRADIENT },
    lineProps: { stroke: BAR_COLOR },
    plot: plot,
    target: [medianValue, 0],
    label: "MEDIAN",
    value: medianValue.toFixed(0),
    offsetX: -100,
  });

  // AVERAGE
  const avg = createLabelAndPointer({
    ...DEFAULTS_LABEL_AND_POINTER,
    labelRectProps: { fill: MAIN_GRADIENT },
    lineProps: { stroke: BAR_COLOR },
    plot: plot,
    target: [AVERAGE_WONLOST, 0],
    label: "AVERAGE",
    value: AVERAGE_WONLOST.toFixed(2),
    offsetX: 150,
  });

  // MIN
  const mostLostValue = getQuantile(QUANTILES_ID, params.quantiles, 0);
  const mostLost = createLabelAndPointer({
    ...DEFAULTS_LABEL_AND_POINTER,
    labelRectProps: { fill: MAIN_GRADIENT },
    lineProps: { stroke: BAR_COLOR },
    plot: plot,
    target: [mostLostValue, 0],
    label: "MIN",
    value: mostLostValue.toFixed(0),
    offsetX: -150,
  });

  // MAX
  const mostWonValue = getQuantile(QUANTILES_ID, params.quantiles, 1);
  const mostWon = createLabelAndPointer({
    ...DEFAULTS_LABEL_AND_POINTER,
    labelRectProps: { fill: MAIN_GRADIENT },
    lineProps: { stroke: BAR_COLOR },
    plot: plot,
    target: [mostWonValue, 0],
    label: "MAX",
    value: mostWonValue.toFixed(0),
    offsetX: 150,
  });

  // 25th PERCENTILE
  const p25Value = getQuantile(QUANTILES_ID, params.quantiles, 0.25);
  const p25 = createLabelAndPointer({
    ...DEFAULTS_LABEL_AND_POINTER,
    labelRectProps: { fill: MAIN_GRADIENT },
    lineProps: { stroke: BAR_COLOR },
    plot: plot,
    target: [p25Value, Y_AXIS_MAX * 0.925],
    label: "25TH PERCENTILE",
    value: p25Value.toFixed(0),
    offsetX: -80,
    offsetY: -120,
    sourceElbowOffset: 0,
    targetElbowOffset: 0,
    mainRectProps: { scale: 0.4 },
    direction: Direction.Bottom,
  });

  // 75th PERCENTILE
  const p75Value = getQuantile(QUANTILES_ID, params.quantiles, 0.75);
  const p75 = createLabelAndPointer({
    ...DEFAULTS_LABEL_AND_POINTER,
    labelRectProps: { fill: MAIN_GRADIENT },
    lineProps: { stroke: BAR_COLOR },
    plot: plot,
    target: [p75Value, Y_AXIS_MAX * 0.925],
    label: "75TH PERCENTILE",
    value: p75Value.toFixed(0),
    offsetX: 80,
    offsetY: -120,
    sourceElbowOffset: [0, 0],
    sourceElbowOffset2: [0, 0],
    targetElbowOffset: [0, 0],
    mainRectProps: { scale: 0.4 },
    direction: Direction.Bottom,
  });

  // 5th PERCENTILE
  const p05Value = getQuantile(QUANTILES_ID, params.quantiles, 0.05);
  const p05 = createLabelAndPointer({
    ...DEFAULTS_LABEL_AND_POINTER,
    labelRectProps: { fill: MAIN_GRADIENT },
    lineProps: { stroke: BAR_COLOR },
    plot: plot,
    target: [p05Value, Y_AXIS_MAX * 0.855],
    label: "5TH PERCENTILE",
    value: p05Value.toFixed(0),
    offsetX: -175,
    offsetY: 80,
    sourceElbowOffset: 0,
    targetElbowOffset: 0,
    mainRectProps: { scale: 0.4 },
    direction: Direction.Top,
  });

  // 95th PERCENTILE
  const p95Value = getQuantile(QUANTILES_ID, params.quantiles, 0.95);
  const p95 = createLabelAndPointer({
    lineProps: { stroke: BAR_COLOR },
    ...DEFAULTS_LABEL_AND_POINTER,
    labelRectProps: { fill: MAIN_GRADIENT },
    plot: plot,
    target: [p95Value, Y_AXIS_MAX * 0.855],
    label: "95TH PERCENTILE",
    value: p95Value.toFixed(0),
    offsetX: 80,
    offsetY: 120,
    sourceElbowOffset: 0,
    targetElbowOffset: 0,
    mainRectProps: { scale: 0.4 },
    direction: Direction.Top,
  });

  // IQR Box
  const iqrBoxFill = plot().box(
    [p25Value, Y_AXIS_MAX * 0.95],
    [p75Value, Y_AXIS_MAX * 0.9],
    {
      radius: 0,
      fill: MAIN_GRADIENT,
      opacity: 0,
    }
  );
  iqrBoxFill.zIndex(-1001);

  // Middle 90%
  const p90BoxFill = plot().box(
    [p05Value, Y_AXIS_MAX * 0.88],
    [p95Value, Y_AXIS_MAX * 0.83],
    {
      radius: 0,
      fill: MAIN_GRADIENT,
      opacity: 0,
    }
  );
  iqrBoxFill.zIndex(-1001);

  // ************************
  // ANIMATION
  // ************************
  // COUNT
  yield FadeIn(countRefs.layout, 0.6, easeOutCubic, [0, 50]);

  yield* zeroLine.end(1, 0.6, easeOutCubic);

  yield sequence(
    BAR_DRAW_DELAY,
    ...bars.map((line) => line.end(1, 0.6, easeOutCubic))
  );
  yield* sequence(BAR_DRAW_DELAY, ...labels.map((pct) => pct.opacity(1, 0.6)));

  // Show data ranges in plot
  if (minValue > X_AXIS_MIN) {
    yield lowerRangeBox.opacity(0.2, 1, linear);
  }
  if (maxValue < X_AXIS_MAX) {
    yield upperRangeBox.opacity(0.2, 0.6, linear);
  }

  // // Zoom in on central tendency
  camera().save();
  yield camera().position([-550, 200], 2, easeInOutCubic);
  yield camera().zoom(1.3, 2, easeInOutCubic);

  yield waitFor(1)
  
  // AVERAGE
  yield* FadeIn(avg.valueLabel, 0.6, easeOutCubic, [0, 50]);
  yield* avg.arrow.end(1, 1, easeInOutCubic);
  
  yield waitFor(1)
  
  // MEDIAN
  yield* FadeIn(median.valueLabel, 0.6, easeOutCubic, [0, 50]);
  yield* median.arrow.end(1, 1, easeInOutCubic);
  
  yield waitFor(1)
  
  // MINIMUM
  yield* FadeIn(mostLost.valueLabel, 0.6, easeOutCubic, [0, 50]);
  yield* mostLost.arrow.end(1, 1, easeInOutCubic);
  
  yield* waitFor(5)
  
  yield* camera().restore(2)
  
  // MOST WON
  yield* FadeIn(mostWon.valueLabel, 0.6, easeOutCubic, [0, 50]);
  yield* mostWon.arrow.end(1, 1, easeInOutCubic);
  
  yield* waitFor(3)
  
  // // Zoom in on central tendency
  camera().save();
  yield camera().position([-400,170], 2, easeInOutCubic);
  yield* camera().zoom(1.3, 2, easeInOutCubic);
  
  yield* iqrBoxFill.opacity(0.3, 1);
  
  // 25th PERCENTILE
  yield FadeIn(p25.valueLabel, 0.6, easeOutCubic, [0, 50]);
  yield* p25.arrow.end(1, 1, easeInOutCubic);
  
  // 75th PERCENTILE
  yield FadeIn(p75.valueLabel, 0.6, easeOutCubic, [0, 50]);
  yield* p75.arrow.end(1, 1, easeInOutCubic);
  
  yield* waitFor(10)
  // Middle 90%
  yield* p90BoxFill.opacity(0.3, 1);
  
  // 5th PERCENTILE
  yield FadeIn(p05.valueLabel, 0.6, easeOutCubic, [0, 50]);
  yield* p05.arrow.end(1, 1, easeInOutCubic);
  
  // 95th PERCENTILE
  yield FadeIn(p95.valueLabel, 0.6, easeOutCubic, [0, 50]);
  yield* p95.arrow.end(1, 1, easeInOutCubic);
  
  // // ZOOM OUT
  yield* waitFor(2);
  yield* camera().restore(2, easeInOutCubic);
  
  // // RESCALE
  // yield* plot().rescale(-50000, 10000, 5000, 0, Y_AXIS_MAX, 10, 2);
  // plot().xAxis.updateTicks(-50000, 10000, 5000, 1);
  // yield lowerRangeBox.opacity(0.2, 1, linear);
  
  yield* waitFor(10)


  // middle 90%
  // Show the middle 90%
  yield eraseLabelAndPointer(p25);
  yield eraseLabelAndPointer(p75);
  yield eraseLabelAndPointer(p05);
  yield eraseLabelAndPointer(p95);
  yield iqrBoxFill.opacity(0, 1)
  yield p90BoxFill.opacity(0, 1)

  yield* waitFor(3);

  yield* waitUntil("end");
});
