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
  Bright,
  Darker,
  Darkest,
  Grays,
  PoppinsBlack,
  PoppinsWhite,
  sessionDark,
} from "../../styles";
import { FadeIn } from "../../utils/FadeIn";
import * as params from "./DD_00_Params";
import { Plot } from "../../components/plot/plot";
import { PlotArea } from "../../components/styled/plotArea";
import {
  getQuantile,
  plusCommaFormmatter,
  commaFormmatter,
} from "../../components/styled/findQuantiles";
import {
  createLabelAndPointer,
  eraseLabelAndPointer,
} from "../../components/styled/labelAndPointer";
import { createValueLabel } from "../../components/plot/PlotValueLabel";
import { tw_colors } from "../../../src/tw_colors";
const data = params.data;

// PLOT OPTIONS
const DATA = data.SHOOTER_WINLOSS_HIST.PLYR_175;
const X_AXIS_MIN = DATA.HIST_MIN;
const X_AXIS_MAX = DATA.HIST_MAX;
const X_AXIS_STEP = DATA.BIN_WIDTH;
const Y_AXIS_MAX = Math.max(...DATA.HIST.PCT) * 1.2;
const X_TICKS_EVERY = 2;
const PCT_FONT_SIZE = 40;
const BAR_WIDTH = 80;

// ADJUSTMENTS: NEG TO LEFT, POS TO RIGHT
const MIN_OFFSET = -200;
const P05_OFFSET = -100;
const P25_OFFSET = 200;
const AVG_OFFSET = 100;
const MEDIAN_OFFSET = 400;
const P75_OFFSET = 450;
const P95_OFFSET = 0;

// THEME
const PLOT_AREA_FILL = Bright.WHITE;
const BAR_COLOR = tw_colors.blue[700];

// The amount those gray limit bars go to X
const MINMAX_HIGH = Y_AXIS_MAX * 0.02;
const MINMAX_LOW = Y_AXIS_MAX * -0.02;

// The size of the boxplot
const BOXPLOT_YMAX = Y_AXIS_MAX * 1.0;
const BOXPLOT_YMIN = Y_AXIS_MAX * 0.9;

// Default style and position of pointer boxes
const DEFAULTS_LABEL_AND_POINTER = {
  offsetX: 0,
  offsetY: 200,
  sourceElbowOffset: new Vector2([0, -20]),
  targetElbowOffset: new Vector2([0, 40]),
  sourceElbowOffset2: 0,
  direction: Direction.Top,
};

// Style of the arrow line from the pointer label
const POINTER_LINE_PROPS = {
  lineWidth: 8,
  lineDash: [0],
  stroke: tw_colors.slate[500],
  radius: 10,
  endArrow: true,
  endOffset: 10,
  end: 0,
  arrowSize: 15,
};

// Default style and position of pointer boxes
const DEFAULTS_BOXPLOT_LABEL_AND_POINTER = {
  offsetX: 0,
  offsetY: -120,
  sourceElbowOffset: new Vector2([0, 20]),
  targetElbowOffset: new Vector2([0, -40]),
  sourceElbowOffset2: 0,
  direction: Direction.Bottom,
  mainRectProps: { scale: 0.35 },
};

// Style of the arrow line from the pointer label
const BOXPLOT_LINE_PROPS = {
  lineWidth: 5,
  lineDash: [0],
  stroke: tw_colors.slate[500],
  radius: 5,
  endArrow: true,
  endOffset: 5,
  end: 0,
  arrowSize: 10,
};

// Style of the lines that are part of the boxplot
const BOXPLOT_BAR_PROPS = {
  lineWidth: 10,
  stroke: tw_colors.slate[700],
  opacity: 0,
};

// Style of the label rectangle
const LABEL_RECT_PROPS = {
  fill: tw_colors.blue[900],
};

const VALUE_RECT_PROPS = {
  fill: tw_colors.blue[50],
};

export default makeScene2D(function* (view) {
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

  // PLOT AREA
  const plotArea = makeRefs<typeof PlotArea>();
  container().add(
    <PlotArea
      refs={plotArea}
      props={{
        fill: PLOT_AREA_FILL,
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
        lineWidth: 60,
        end: 0,
        tickLength: 30,
      }}
      xLabelProps={{
        fill: Grays.BLACK,
        decimalNumbers: 0,
        fontSize: 40,
        lineToLabelPadding: 60,
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

  // Add the Min line
  const minValue = DATA.QUANTILES.MIN;
  const maxValue = DATA.QUANTILES.MAX;

  // Shade outside of the data range
  const lowerRangeBox = plot().box(
    [X_AXIS_MIN, MINMAX_HIGH],
    [minValue - 1, MINMAX_LOW],
    {
      fill: Grays.GRAY3,
      opacity: 0,
      zIndex: 200,
    }
  );
  const upperRangeBox = plot().box(
    [maxValue + 1, MINMAX_HIGH],
    [Math.max(X_AXIS_MAX, maxValue), MINMAX_LOW],
    {
      fill: Grays.GRAY3,
      opacity: 0,
      zIndex: -200,
    }
  );

  // ************************
  // Create the bars and labels
  // ************************
  const bars: Line[] = [];
  const labels: Txt[] = [];

  for (let index = 0; index < DATA.HIST.PCT.length; index++) {
    const offset = 50;
    const point = new Vector2(DATA.HIST.MIDPOINT[index], DATA.HIST.PCT[index]);
    const line = plot().vLine(point, {
      stroke: BAR_COLOR,
      lineWidth: BAR_WIDTH,
      opacity: 1,
      end: 0,
    });
    if (DATA.HIST.PCT[index] > 0) {
      bars.push(line);
    }

    if (DATA.HIST.PCT[index] >= 0.1) {
      const pct = DATA.HIST.PCT[index].toFixed(1);
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
    } else if (DATA.HIST.PCT[index] < 0.1 && DATA.HIST.PCT[index] > 0) {
      const pct = "<0.1";
      const label = plot().text(point, {
        ...PoppinsWhite,
        text: pct,
        offsetY: 1.5,
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
      text: commaFormmatter(DATA.QUANTILES.N),
      ...PoppinsBlack,
      padding: 20,
    },
  });

  // MEDIAN
  const median = createLabelAndPointer({
    ...DEFAULTS_BOXPLOT_LABEL_AND_POINTER,
    plot: plot,
    target: [DATA.QUANTILES.MEDIAN, BOXPLOT_YMAX],
    label: "MEDIAN",
    value: plusCommaFormmatter(DATA.QUANTILES.MEDIAN),
    offsetX: MEDIAN_OFFSET,
    lineProps: BOXPLOT_LINE_PROPS,
    labelRectProps: LABEL_RECT_PROPS,
    valueRectProps: VALUE_RECT_PROPS,
  });

  // AVERAGE
  const avg = createLabelAndPointer({
    ...DEFAULTS_LABEL_AND_POINTER,
    plot: plot,
    target: [DATA.QUANTILES.MEAN, 0],
    label: "AVERAGE",
    value: plusCommaFormmatter(DATA.QUANTILES.MEAN, 2),
    offsetX: AVG_OFFSET,
    lineProps: POINTER_LINE_PROPS,
    labelRectProps: LABEL_RECT_PROPS,
    valueRectProps: VALUE_RECT_PROPS,
  });

  // MINIMUM
  const mostLost = createLabelAndPointer({
    ...DEFAULTS_LABEL_AND_POINTER,
    plot: plot,
    target: [DATA.QUANTILES.MIN, 0],
    label: "MOST LOST",
    value: plusCommaFormmatter(DATA.QUANTILES.MIN),
    offsetX: MIN_OFFSET,
    lineProps: POINTER_LINE_PROPS,
    labelRectProps: LABEL_RECT_PROPS,
    valueRectProps: VALUE_RECT_PROPS,
  });

  // MOST WON
  const mostWon = createLabelAndPointer({
    ...DEFAULTS_LABEL_AND_POINTER,
    plot: plot,
    target: [DATA.QUANTILES.MAX, 0],
    label: "MOST WON",
    value: plusCommaFormmatter(DATA.QUANTILES.MAX),
    offsetX: 0,
    lineProps: POINTER_LINE_PROPS,
    labelRectProps: LABEL_RECT_PROPS,
    valueRectProps: VALUE_RECT_PROPS,
  });

  // 25th PERCENTILE
  const p25 = createLabelAndPointer({
    ...DEFAULTS_BOXPLOT_LABEL_AND_POINTER,
    plot: plot,
    target: [DATA.QUANTILES.P25, BOXPLOT_YMAX],
    label: "25TH PERCENTILE",
    value: plusCommaFormmatter(DATA.QUANTILES.P25),
    offsetX: P25_OFFSET,
    lineProps: BOXPLOT_LINE_PROPS,
    labelRectProps: LABEL_RECT_PROPS,
    valueRectProps: VALUE_RECT_PROPS,
  });

  // 75th PERCENTILE
  const p75 = createLabelAndPointer({
    ...DEFAULTS_BOXPLOT_LABEL_AND_POINTER,
    plot: plot,
    target: [DATA.QUANTILES.P75, BOXPLOT_YMAX],
    label: "75TH PERCENTILE",
    value: plusCommaFormmatter(DATA.QUANTILES.P75),
    offsetY: DEFAULTS_BOXPLOT_LABEL_AND_POINTER.offsetY + 50,
    offsetX: P75_OFFSET,
    sourceElbowOffset: new Vector2([0, 20]),
    targetElbowOffset: new Vector2([0, 0]),
    lineProps: { ...BOXPLOT_LINE_PROPS },
    labelRectProps: LABEL_RECT_PROPS,
    valueRectProps: VALUE_RECT_PROPS,
  });

  // 5th PERCENTILE
  const p05 = createLabelAndPointer({
    ...DEFAULTS_BOXPLOT_LABEL_AND_POINTER,
    plot: plot,
    target: [DATA.QUANTILES.P05, BOXPLOT_YMAX],
    label: "5TH PERCENTILE",
    value: plusCommaFormmatter(DATA.QUANTILES.P05),
    offsetX: P05_OFFSET,
    lineProps: BOXPLOT_LINE_PROPS,
    labelRectProps: LABEL_RECT_PROPS,
    valueRectProps: VALUE_RECT_PROPS,
  });
  // const p05Value = getQuantile(QUANTILES_ID, params.quantiles, 0.05);
  // const p05 = createLabelAndPointer({
  //   ...DEFAULTS_LABEL_AND_POINTER,
  //   plot: plot,
  //   target: [p05Value, Y_AXIS_MAX * 0.855],
  //   label: "5TH PERCENTILE",
  //   value: plusCommaFormmatter(p05Value),
  //   offsetX: -150,
  //   offsetY: 80,
  //   sourceElbowOffset: 0,
  //   targetElbowOffset: 0,
  //   mainRectProps: { scale: 0.4 },
  //   direction: Direction.Top,
  // });

  // 95th PERCENTILE
  const p95 = createLabelAndPointer({
    ...DEFAULTS_BOXPLOT_LABEL_AND_POINTER,
    plot: plot,
    target: [DATA.QUANTILES.P95, BOXPLOT_YMAX],
    label: "95TH PERCENTILE",
    value: plusCommaFormmatter(DATA.QUANTILES.P95),
    offsetX: P95_OFFSET,
    lineProps: BOXPLOT_LINE_PROPS,
    labelRectProps: LABEL_RECT_PROPS,
    valueRectProps: VALUE_RECT_PROPS,
  });

  // IQR Box
  // const iqrBoxFill = plot().box(
  //   [DATA.QUANTILES.P25, Y_AXIS_MAX * 0.95],
  //   [DATA.QUANTILES.P75, Y_AXIS_MAX * -0.02],
  //   {
  //     radius: 0,
  //     // fill: Darker.GREEN,
  //     stroke: Bright.ORANGE,
  //     lineWidth: 10,
  //     opacity: 1,
  //   }
  // );

  const iqrBox = plot().box(
    [DATA.QUANTILES.P25, BOXPLOT_YMAX],
    [DATA.QUANTILES.P75, BOXPLOT_YMIN],
    {
      fill: tw_colors.violet[700],
      opacity: 0,
      zIndex: 200,
      stroke: BOXPLOT_BAR_PROPS.stroke,
      lineWidth: 5,
      // shadowOffset: new Vector2([2, 2]),
      // shadowColor: "black",
      // shadowBlur: 10,
      strokeFirst: true,
      lineCap: "butt",
      radius: 0,
      clip: true,
    }
  );

  const medianLine = plot().line(
    [DATA.QUANTILES.MEDIAN, BOXPLOT_YMAX],
    [DATA.QUANTILES.MEDIAN, BOXPLOT_YMIN],
    BOXPLOT_BAR_PROPS
  );

  const boxMidpoint = BOXPLOT_YMIN + (BOXPLOT_YMAX - BOXPLOT_YMIN) / 2;
  const p90RangeLine = plot().line(
    [DATA.QUANTILES.P05, boxMidpoint],
    [DATA.QUANTILES.P95, boxMidpoint],
    BOXPLOT_BAR_PROPS
  );

  const p05Line = plot().line(
    [DATA.QUANTILES.P05, BOXPLOT_YMAX],
    [DATA.QUANTILES.P05, BOXPLOT_YMIN],
    BOXPLOT_BAR_PROPS
  );
  const p95Line = plot().line(
    [DATA.QUANTILES.P95, BOXPLOT_YMAX],
    [DATA.QUANTILES.P95, BOXPLOT_YMIN],
    BOXPLOT_BAR_PROPS
  );

  // const p90BoxFill = plot().box(
  //   [DATA.QUANTILES.P05, MINMAX_LOW * 1.5],
  //   [DATA.QUANTILES.P95, MINMAX_LOW * 2],
  //   {
  //     fill: tw_colors.blue[800],
  //     opacity: 0.6,
  //     zIndex: 100,
  //   }
  // );
  // iqrBoxFill.zIndex(-1001);

  // // Middle 90%
  // const p90BoxFill = plot().box(
  //   [p05Value, Y_AXIS_MAX * 0.88],
  //   [p95Value, Y_AXIS_MAX * 0.83],
  //   {
  //     radius: 0,
  //     fill: Darkest.GREEN,
  //     opacity: 0,
  //   }
  // );
  // iqrBoxFill.zIndex(-1001);

  // // ************************
  // // ANIMATION
  // // ************************
  // // COUNT
  // START DRAWING THE COMPONENTS HERE
  // =================================

  // Draw the Plot
  yield* FadeIn(plotArea.container, 1, easeOutCubic, [100, 0]);

  yield plot().xAxis.end(1, 0.6, easeOutCubic);
  plot().xAxis.updateTicks(X_AXIS_MIN, X_AXIS_MAX, X_AXIS_STEP, X_TICKS_EVERY);

  yield* waitFor(2);
  yield FadeIn(countRefs.layout, 0.6, easeOutCubic, [0, 50]);

  yield* zeroLine.end(1, 0.6, easeOutCubic);

  yield sequence(0.1, ...bars.map((line) => line.end(1, 1, easeOutCubic)));
  yield* sequence(0.1, ...labels.map((pct) => pct.opacity(1, 0.6)));

  // // Show data ranges in plot
  if (minValue > X_AXIS_MIN) {
    yield lowerRangeBox.opacity(0.2, 1, linear);
  }
  if (maxValue < X_AXIS_MAX) {
    yield* upperRangeBox.opacity(0.2, 0.6, linear);
  }

  // MOST LOST
  yield* FadeIn(mostLost.valueLabel, 0.6, easeOutCubic, [0, 50]);
  yield* mostLost.arrow.end(1, 1, easeInOutCubic);

  // MOST WON
  yield* FadeIn(mostWon.valueLabel, 0.6, easeOutCubic, [0, 50]);
  yield* mostWon.arrow.end(1, 1, easeInOutCubic);

  // AVERAGE
  yield* FadeIn(avg.valueLabel, 0.6, easeOutCubic, [0, 50]);
  yield* avg.arrow.end(1, 1, easeInOutCubic);

  // yield* waitFor(1)
  // camera().save();
  // yield camera().position([550, -130], 2, easeInOutCubic);
  // yield camera().zoom(1.3, 2, easeInOutCubic);

  // yield* waitFor(1)

  yield iqrBox.opacity(1, 1);
  yield medianLine.opacity(1, 1);
  yield p90RangeLine.opacity(1, 1);
  yield p05Line.opacity(1, 1);
  yield* p95Line.opacity(1, 1);

  // 5th PERCENTILE
  yield FadeIn(p05.valueLabel, 0.6, easeOutCubic, [0, 50]);
  yield* p05.arrow.end(1, 1, easeInOutCubic);

  // 25th PERCENTILE
  yield FadeIn(p25.valueLabel, 0.6, easeOutCubic, [0, 50]);
  yield* p25.arrow.end(1, 1, easeInOutCubic);

  // MEDIAN
  yield FadeIn(median.valueLabel, 0.6, easeOutCubic, [0, 50]);
  yield* median.arrow.end(1, 1, easeInOutCubic);

  yield* waitFor(5);

  // 75th PERCENTILE
  yield FadeIn(p75.valueLabel, 0.6, easeOutCubic, [0, 50]);
  yield* p75.arrow.end(1, 1, easeInOutCubic);

  // 95th PERCENTILE
  yield FadeIn(p95.valueLabel, 0.6, easeOutCubic, [0, 50]);
  yield* p95.arrow.end(1, 1, easeInOutCubic);

  // yield* waitFor(3)
  // yield camera().position([550, 130], 3, easeInOutCubic);
  // yield* waitFor(2)

  // yield* camera().position([-1000, 130], 2, easeInOutCubic);

  // yield camera().restore(5, easeInOutCubic)
  // yield* waitFor(8)

  // yield* iqrBoxFill.shiftPositionTo(
  //   [DATA.QUANTILES.P05, Y_AXIS_MAX * 1],
  //   [DATA.QUANTILES.P95, Y_AXIS_MAX * 0.9],
  //   3,
  //   easeInOutCubic
  // );

  // middle 90%
  // Show the middle 90%
  // yield eraseLabelAndPointer(p25);
  // yield eraseLabelAndPointer(p75);
  // yield eraseLabelAndPointer(p05);
  // yield eraseLabelAndPointer(p95);
  // yield iqrBoxFill.opacity(0, 1)
  // yield p90BoxFill.opacity(0, 1)

  yield* waitFor(10);

  yield* waitUntil("end");
});
