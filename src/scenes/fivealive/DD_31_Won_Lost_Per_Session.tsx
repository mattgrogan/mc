// EXTRACT_FRAMES: [001015]
import {
  Camera,
  Layout,
  Line,
  makeScene2D,
  Txt,
  Node,
  TxtProps,
} from "@motion-canvas/2d";
import {
  all,
  createRef,
  createSignal,
  delay,
  Direction,
  easeInOutCubic,
  easeOutCubic,
  linear,
  makeRefs,
  PossibleVector2,
  Reference,
  sequence,
  Vector2,
  waitFor,
  waitUntil,
} from "@motion-canvas/core";
import {
  Bright,
  grayGradient,
  Grays,
  PoppinsBlack,
  PoppinsWhite,
  Theme,
} from "../../styles";
import { FadeIn } from "../../utils/FadeIn";
import { Plot } from "../../components/plot/plot";
import { PlotArea } from "../../components/styled/plotArea";
import {
  plusCommaFormmatter,
  commaFormmatter,
} from "../../components/styled/findQuantiles";
import { createValueLabel } from "../../components/plot/PlotValueLabel";
import { tw_colors } from "../../tw_colors";
import { DataTable } from "../../components/styled/dataTable";
import { createLayoutToCoordLine } from "../../components/plot/LayoutToCoordLine";
import { PLAYER_NAME } from "./DD_00_Params";
// hist_session_cwonlost.v1.json
import dataImport from "../../../../dicedata/output/y2025/m07/fivealive-100k/json/hist_session_cwonlost.v1.json";
// quantiles_session_cwonlost.v1.json
import quantilesImport from "../../../../dicedata/output/y2025/m07/fivealive-100k/json/quantiles_session_cwonlost.v1.json";

const DATA = dataImport[PLAYER_NAME];
const QUANTILES = quantilesImport[PLAYER_NAME];

const title = createSignal("Profit and Loss per Session");
const subtitle = createSignal(
  `Histogram of outcomes from ${commaFormmatter(
    QUANTILES.N
  )} sessions played by the bots.`
);

// PLOT OPTIONS
const X_AXIS_MIN = DATA.HIST_MIN[0];
const X_AXIS_MAX = DATA.HIST_MAX[0];
const X_AXIS_STEP = DATA.BIN_WIDTH[0];
const Y_AXIS_MAX = Math.max(...DATA.PCT) * 1.3;
const X_TICKS_EVERY = 2;
const PCT_FONT_SIZE = 30;
const BAR_WIDTH = 60;
const SECOND_AXIS_OFFSET_Y = 20;

// THEME
const BAR_COLOR = tw_colors.blue[500];

// The amount those gray limit bars go to X
const MINMAX_HIGH = Y_AXIS_MAX * 0.01;
const MINMAX_LOW = Y_AXIS_MAX * -0.01;

// Style of the label rectangle
const LABEL_RECT_PROPS = {
  // fill: tw_colors.blue[900],
  fill: tw_colors.zinc[800],
  stroke: Grays.GRAY1,
};

const VALUE_RECT_PROPS = {
  // fill: tw_colors.blue[50],
  fill: grayGradient,
  stroke: Grays.GRAY1,
};

const TITLE_TXT_PROPS: TxtProps = {
  ...PoppinsWhite,
  fontSize: 100,
  fontWeight: 800,
  fill: tw_colors.zinc[100],
};

const SUBTITLE_TXT_PROPS: TxtProps = {
  ...PoppinsWhite,
  fontSize: 60,
  fontWeight: 400,
  fill: tw_colors.zinc[400],
};

const arrowLevels = {
  MIN: 5,
  P05: 4.5,
  P25: 4,
  MEDIAN: 3.5,
  MEAN: 3,
  P75: 2.5,
  P95: 1.5,
  MAX: 5,
};

// --------------- makeScene2d ----------------

export default makeScene2D(function* (view) {
  yield* waitFor(1);

  // --------------- container ----------------
  const container = createRef<Layout>();
  view.add(
    <Layout
      ref={container}
      direction={"column"}
      justifyContent={"center"}
      alignItems={"center"}
      width={"100%"}
      height={"100%"}
      gap={50}
      padding={0}
      layout
    ></Layout>
  );

  // --------------- title and subtitle ----------------
  const titleContainer = createRef<Layout>();

  view.add(
    <Layout
      ref={titleContainer}
      direction={"column"}
      alignItems={"start"}
      position={[0, 0]}
      gap={10}
      opacity={0}
      layout
      offsetX={-1}
      offsetY={-1}
    >
      <Txt
        {...TITLE_TXT_PROPS}
        text={title}
      />
      <Txt
        {...SUBTITLE_TXT_PROPS}
        text={subtitle}
        textAlign={"left"}
        width={1600}
      />
    </Layout>
  );

  // --------------- plotArea ----------------
  const plotArea = makeRefs<typeof PlotArea>();
  container().add(
    <PlotArea
      refs={plotArea}
      props={
        {
          // fill: Theme.BG,
          // stroke: Grays.GRAY1,
        }
      }
    ></PlotArea>
  );

  // --------------- plot ----------------
  const plot = createRef<Plot>();
  plotArea.layout.add(
    <Plot
      ref={plot}
      position={() => plotArea.layout.position().addY(-250)}
      xMin={X_AXIS_MIN}
      xMax={X_AXIS_MAX}
      yMax={Y_AXIS_MAX}
      width={plotArea.rect.width() * 0.9}
      height={plotArea.rect.height() * 0.6}
      xAxisProps={{
        opacity: 1,
        stroke: Grays.GRAY2,
        axisLineWidth: 5,
        end: 0,
        tickLength: 30,
      }}
      xLabelProps={{
        fill: Grays.WHITE,
        decimalNumbers: 0,
        fontSize: 40,
        lineToLabelPadding: 20,
      }}
      xTitleProps={{
        fill: Grays.BLACK,
        text: "",
        lineToLabelPadding: 10,
        opacity: 0,
        fontSize: 100,
      }}
      xTickProps={{ stroke: Grays.GRAY2 }}
      yAxisProps={{ opacity: 0 }}
    ></Plot>
  );

  // --------------- table ----------------
  const dataTable = makeRefs<typeof DataTable>();
  const tableData = [
    { label: "MOST LOST", value: plusCommaFormmatter(QUANTILES.MIN) },
    { label: "5TH", value: plusCommaFormmatter(QUANTILES.P05) },
    {
      label: "25TH",
      value: plusCommaFormmatter(QUANTILES.P25),
    },
    {
      label: "MEDIAN",
      value: plusCommaFormmatter(QUANTILES.MEDIAN),
    },
    {
      label: "AVERAGE",
      value: plusCommaFormmatter(QUANTILES.MEAN, 2),
    },
    {
      label: "75TH",
      value: plusCommaFormmatter(QUANTILES.P75),
    },
    {
      label: "95TH",
      value: plusCommaFormmatter(QUANTILES.P95),
    },
    { label: "MOST WON", value: plusCommaFormmatter(QUANTILES.MAX) },
  ];

  plot().add(
    <DataTable
      refs={dataTable}
      data={tableData}
      headerRectProps={{ ...LABEL_RECT_PROPS }}
      valueRectProps={{ ...VALUE_RECT_PROPS }}
      headerTxtProps={{ ...PoppinsWhite }}
      valueTxtProps={{ ...PoppinsWhite }}
      fontSize={48}
    ></DataTable>
  );
  dataTable.layout.width("75%");
  dataTable.layout.height("10%");
  dataTable.layout.y(1100);

  // --------------- plot2 - dup for second axis ----------------
  const plot2 = createRef<Plot>();
  plotArea.layout.add(
    <Plot
      ref={plot2}
      position={() =>
        plotArea.layout.position().addY(-250).addY(SECOND_AXIS_OFFSET_Y)
      }
      xMin={X_AXIS_MIN}
      xMax={X_AXIS_MAX}
      yMax={Y_AXIS_MAX}
      width={plotArea.rect.width() * 0.9}
      height={plotArea.rect.height() * 0.7}
      xAxisProps={{
        opacity: 1,
        stroke: Grays.GRAY2,
        axisLineWidth: 5,
        end: 0,
        tickLength: 30,
      }}
      xLabelProps={{
        fill: Grays.WHITE,
        decimalNumbers: 0,
        fontSize: 40,
        lineToLabelPadding: 20,
        opacity: 0,
      }}
      xTitleProps={{
        fill: Grays.BLACK,
        text: "",
        lineToLabelPadding: 10,
        opacity: 0,
        fontSize: 100,
      }}
      xTickProps={{ stroke: Grays.GRAY2 }}
      yAxisProps={{ opacity: 0 }}
    ></Plot>
  );

  // --------------- upper and lower range ----------------
  const lowerRangeBox = plot2().box(
    [X_AXIS_MIN, MINMAX_HIGH],
    [QUANTILES.MIN - 1, MINMAX_LOW],
    {
      fill: Grays.WHITE,
      opacity: 0,
      zIndex: 200,
    }
  );
  const upperRangeBox = plot2().box(
    [QUANTILES.MAX + 1, MINMAX_HIGH],
    [Math.max(X_AXIS_MAX, QUANTILES.MAX), MINMAX_LOW],
    {
      fill: Grays.WHITE,
      opacity: 0,
      zIndex: -200,
    }
  );
  // --------------- iqr range ----------------
  const iqrRangeBox = plot2().box(
    [QUANTILES.P25, MINMAX_HIGH],
    [QUANTILES.P75, MINMAX_LOW],
    {
      fill: tw_colors.violet[500],
      opacity: 0,
      zIndex: 200,
    }
  );
  // --------------- 90pct LOW range ----------------
  const p90Low = plot2().box(
    [QUANTILES.P05, MINMAX_HIGH],
    [QUANTILES.P25, MINMAX_LOW],
    {
      fill: tw_colors.cyan[500],
      opacity: 0,
      zIndex: 200,
    }
  );
  const p90High = plot2().box(
    [QUANTILES.P75, MINMAX_HIGH],
    [QUANTILES.P95, MINMAX_LOW],
    {
      fill: tw_colors.cyan[500],
      opacity: 0,
      zIndex: 200,
    }
  );

  // --------------- create data bars and labels ----------------
  const bars: Line[] = [];
  const labels: Txt[] = [];

  for (let index = 0; index < DATA.PCT.length; index++) {
    const offset = 50;
    const point = new Vector2(DATA.MIDPOINT[index], DATA.PCT[index]);
    const line = plot().vLine(point, {
      stroke: BAR_COLOR,
      lineWidth: BAR_WIDTH,
      opacity: 1,
      end: 0,
    });
    if (DATA.PCT[index] > 0) {
      bars.push(line);
    }

    if (DATA.PCT[index] >= 0.1) {
      const pct = DATA.PCT[index].toFixed(1);
      const label = plot().text(point, {
        ...PoppinsWhite,
        text: pct,
        offsetY: 1.5,
        fill: Grays.WHITE,
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
    } else if (DATA.PCT[index] < 0.1 && DATA.PCT[index] > 0) {
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

  // --------------- create arrows ----------------
  function transformPoint(dataTable: any, i: number): Vector2 {
    return dataTable.headerRects[i]
      .absolutePosition()
      .transformAsPoint(dataTable.layout.worldToParent());
  }

  const minArrow = createArrow(
    plot2,
    transformPoint(dataTable, 0),
    [QUANTILES.MIN, 0],
    50,
    arrowLevels.MIN
  );

  const p05Arrow = createArrow(
    plot2,
    transformPoint(dataTable, 1),
    [QUANTILES.P05, 0],
    50,
    arrowLevels.P05
  );

  const p25Arrow = createArrow(
    plot2,
    transformPoint(dataTable, 2),
    [QUANTILES.P25, 0],
    50,
    arrowLevels.P25
  );

  const medianArrow = createArrow(
    plot2,
    transformPoint(dataTable, 3),
    [QUANTILES.MEDIAN, 0],
    50,
    arrowLevels.MEDIAN
  );

  const meanArrow = createArrow(
    plot2,
    transformPoint(dataTable, 4),
    [QUANTILES.MEAN, 0],
    50,
    arrowLevels.MEAN
  );
  const p75Arrow = createArrow(
    plot2,
    transformPoint(dataTable, 5),
    [QUANTILES.P75, 0],
    50,
    arrowLevels.P75
  );

  const p95Arrow = createArrow(
    plot2,
    transformPoint(dataTable, 6),
    [QUANTILES.P95, 0],
    50,
    arrowLevels.P95
  );

  const maxArrow = createArrow(
    plot2,
    transformPoint(dataTable, 7),
    [QUANTILES.MAX, 0],
    50,
    arrowLevels.MAX
  );

  // --------------- zeroLine ----------------
  const zeroLine = plot().vLine([0, Y_AXIS_MAX], {
    lineWidth: 5,
    stroke: Grays.GRAY2,
    lineDash: [20, 5],
    opacity: 0.5,
    end: 0,
  });

  // --------------- count ----------------
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
      text: commaFormmatter(QUANTILES.N),
      ...PoppinsBlack,
      padding: 20,
    },
  });
  // --------------- box ----------------
  const box = plot().box([-100, Y_AXIS_MAX * 0.95], [100, Y_AXIS_MAX * -0.01], {
    fill: Grays.GRAY3,
    opacity: 0,
    lineWidth: 10,
    lineDash: [20, 10],
    stroke: Grays.WHITE,
  });

  // Calculate title positions
  const titleFinalX = -view.width() / 2 + 100; // 100px from left edge
  const titleFinalY = -view.height() / 2 + 100; // 100px from top edge

  // Set initial scale
  titleContainer().scale(1.5);

  // Calculate initial position - 15% from left edge of view, vertically centered
  const leftEdge = -view.width() / 2;
  const titleInitialX = leftEdge + view.width() * 0.15;

  // Since offsetY={-1}, we need to account for the title's height to center it
  const titleBounds = titleContainer().cacheBBox();
  const titleInitialY = -titleBounds.height / 2;

  titleContainer().position(new Vector2(titleInitialX, titleInitialY));

  // START DRAWING THE COMPONENTS HERE
  // =================================

  // --------------- plotArea ----------------
  plotArea.container.opacity(1);

  // 1. Fade in title at initial position (scaled up)
  yield* FadeIn(titleContainer, 1, easeOutCubic, [0, 50]);
  yield* waitFor(1.5);

  // 2. Move title to upper left corner and scale down simultaneously
  yield* all(
    titleContainer().position(
      new Vector2(titleFinalX, titleFinalY),
      1.5,
      easeInOutCubic
    ),
    titleContainer().scale(1, 1.5, easeInOutCubic)
  );
  yield* waitFor(0.5);

  // --------------- both axes ----------------
  yield plot().xAxis.end(1, 0.6, easeOutCubic);
  yield plot2().xAxis.end(1, 0.6, easeOutCubic);
  plot().xAxis.updateTicks(X_AXIS_MIN, X_AXIS_MAX, X_AXIS_STEP, X_TICKS_EVERY);
  plot2().xAxis.updateTicks(
    X_AXIS_MIN,
    X_AXIS_MAX,
    X_AXIS_STEP,
    X_TICKS_EVERY,
    0.5,
    false
  );

  yield* waitFor(2);

  // --------------- data table ----------------
  // yield* sequence(
  //   0.1,
  //   ...dataTable.columns.map((c) => c.opacity(1, 1, linear))
  // );

  // --------------- draw arrows ----------------
  const arrowDrawSecs = 0.8;
  const waitBetweenSecs = 1;

  // --------------- MIN arrow ----------------
  // --------------- draw new ----------------
  yield dataTable.columns[0].opacity(1, arrowDrawSecs);
  minArrow.stroke(tw_colors.red[600]);
  yield dataTable.headerRects[0].fill(tw_colors.red[950], arrowDrawSecs);
  yield* minArrow.end(1, arrowDrawSecs);
  // --------------- min shaders ----------------
  if (QUANTILES.MIN > X_AXIS_MIN) {
    yield lowerRangeBox.opacity(0.5, 1, linear);
  }

  yield* waitFor(waitBetweenSecs);
  // --------------- MAX arrow ----------------
  // --------------- previous ----------------
  yield dataTable.headerRects[0].fill(tw_colors.zinc[800], arrowDrawSecs);
  yield* minArrow.stroke(tw_colors.zinc[600], arrowDrawSecs);
  yield minArrow.opacity(0, 1, linear);
  // --------------- draw new ----------------
  yield dataTable.columns[7].opacity(1, arrowDrawSecs);
  maxArrow.stroke(tw_colors.green[600]);
  yield dataTable.headerRects[7].fill(tw_colors.green[950], arrowDrawSecs);
  yield* maxArrow.end(1, arrowDrawSecs);
  // --------------- max shader ----------------
  if (QUANTILES.MAX < X_AXIS_MAX) {
    yield* upperRangeBox.opacity(0.5, 0.6, linear);
  }
  yield* waitFor(waitBetweenSecs);

  // ###################################################
  // ------------- DRAW BARS ------------------------
  // --------------- previous ----------------
  yield dataTable.headerRects[7].fill(tw_colors.zinc[800], arrowDrawSecs);
  yield maxArrow.stroke(tw_colors.zinc[600], arrowDrawSecs);
  yield maxArrow.opacity(0, 1 + arrowDrawSecs, linear);
  // --------------- zeroline ----------------
  yield* zeroLine.end(1, 0.6, easeOutCubic);
  // --------------- data ----------------
  yield sequence(0.1, ...bars.map((line) => line.end(1, 1, easeOutCubic)));
  yield* sequence(0.1, ...labels.map((pct) => pct.opacity(1, 1)));
  // --------------- count box ----------------
  yield FadeIn(countRefs.layout, 0.6, easeOutCubic, [0, 50]);

  // ###################################################
  // --------------- MEDIAN arrow ----------------
  // --------------- draw new ----------------
  medianArrow.stroke(tw_colors.blue[600]);
  yield dataTable.columns[3].opacity(1, arrowDrawSecs);
  yield dataTable.headerRects[3].fill(tw_colors.blue[950], arrowDrawSecs);
  yield* medianArrow.end(1, arrowDrawSecs);

  yield* waitFor(waitBetweenSecs);
  // --------------- MEAN arrow ----------------
  // --------------- previous ----------------
  yield dataTable.headerRects[3].fill(tw_colors.zinc[800], arrowDrawSecs);
  yield* medianArrow.stroke(tw_colors.zinc[600], arrowDrawSecs);
  yield medianArrow.opacity(0, 1, linear);
  // --------------- draw new ----------------
  meanArrow.stroke(tw_colors.blue[600]);
  yield dataTable.columns[4].opacity(1, arrowDrawSecs);
  yield dataTable.headerRects[4].fill(tw_colors.blue[950], arrowDrawSecs);
  yield* meanArrow.end(1, arrowDrawSecs);

  yield* waitFor(waitBetweenSecs);
  // --------------- IQR arrows ----------------
  // --------------- previous ----------------
  yield dataTable.headerRects[4].fill(tw_colors.zinc[800], arrowDrawSecs);
  yield* meanArrow.stroke(tw_colors.zinc[600], arrowDrawSecs);
  yield meanArrow.opacity(0, 1, linear);
  // --------------- draw new ----------------
  p25Arrow.stroke(tw_colors.violet[600]);
  p75Arrow.stroke(tw_colors.violet[600]);
  yield dataTable.columns[2].opacity(1, arrowDrawSecs);
  yield dataTable.columns[5].opacity(1, arrowDrawSecs);
  yield dataTable.headerRects[2].fill(tw_colors.violet[950], arrowDrawSecs);
  yield dataTable.headerRects[5].fill(tw_colors.violet[950], arrowDrawSecs);
  yield p25Arrow.end(1, arrowDrawSecs);
  yield delay(arrowDrawSecs / 2, iqrRangeBox.opacity(0.8, 0.6, linear));
  yield* p75Arrow.end(1, arrowDrawSecs);

  yield* waitFor(waitBetweenSecs);
  // --------------- 90 arrows ----------------
  // --------------- previous ----------------
  yield dataTable.headerRects[2].fill(tw_colors.zinc[800], arrowDrawSecs);
  yield dataTable.headerRects[5].fill(tw_colors.zinc[800], arrowDrawSecs);
  yield p25Arrow.stroke(tw_colors.zinc[600], arrowDrawSecs);
  yield* p75Arrow.stroke(tw_colors.zinc[600], arrowDrawSecs);
  yield p25Arrow.opacity(0, 1, linear);
  yield p75Arrow.opacity(0, 1, linear);
  // --------------- draw new ----------------
  p05Arrow.stroke(tw_colors.cyan[600]);
  p95Arrow.stroke(tw_colors.cyan[600]);
  yield dataTable.columns[1].opacity(1, arrowDrawSecs);
  yield dataTable.columns[6].opacity(1, arrowDrawSecs);
  yield dataTable.headerRects[1].fill(tw_colors.cyan[950], arrowDrawSecs);
  yield dataTable.headerRects[6].fill(tw_colors.cyan[950], arrowDrawSecs);
  yield p05Arrow.end(1, arrowDrawSecs);
  yield delay(arrowDrawSecs / 2, p90Low.opacity(0.8, 0.6, linear));
  yield delay(arrowDrawSecs / 2, p90High.opacity(0.8, 0.6, linear));
  yield* p95Arrow.end(1, arrowDrawSecs);
  yield* waitFor(1);
  // --------------- previous ----------------
  yield dataTable.headerRects[1].fill(tw_colors.zinc[800], arrowDrawSecs);
  yield dataTable.headerRects[6].fill(tw_colors.zinc[800], arrowDrawSecs);
  yield p05Arrow.stroke(tw_colors.zinc[600], arrowDrawSecs);
  yield* p95Arrow.stroke(tw_colors.zinc[600], arrowDrawSecs);
  yield p05Arrow.opacity(0, 1, linear);
  yield p95Arrow.opacity(0, 1, linear);
  // --------------- end ----------------
  yield* waitFor(10);
  yield* waitUntil("end");
});

function createArrow(
  plot: Reference<Plot>,
  source: PossibleVector2,
  target: PossibleVector2,
  startOffset: number,
  level: number
) {
  const targetOffsetY = 40 * level;
  const arrow = createLayoutToCoordLine({
    plot: plot,
    source: source,
    target: target,
    lineProps: {
      stroke: Grays.GRAY1,
      endArrow: true,
      arrowSize: 15,
      // lineDash: [10, 1],
      lineWidth: 8,
      radius: 10,
      endOffset: 30,
      end: 0,
    },
    sourceElbowOffset: new Vector2([0, 0]),
    targetElbowOffset: new Vector2([0, targetOffsetY]),
    sourceElbowOffset2: 0,
  });
  arrow.startOffset(startOffset);
  return arrow;
}
