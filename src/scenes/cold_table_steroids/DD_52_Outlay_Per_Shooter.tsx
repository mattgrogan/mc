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
import { data } from "././DD_00_Params";
import { Plot } from "../../components/plot/plot";
import { PlotArea } from "../../components/styled/plotArea";
import { commaFormmatter } from "../../components/styled/findQuantiles";
import { createValueLabel } from "../../components/plot/PlotValueLabel";
import { tw_colors } from "../../../src/tw_colors";
import { DataTable } from "../../components/styled/dataTable";
import { createLayoutToCoordLine } from "../../components/plot/LayoutToCoordLine";

const title = createSignal(
  "How much did the bots\noutlay out their pocket\nduring a shooter?"
);
const TITLE_POSITION = new Vector2(-1400, -800);

// PLOT OPTIONS
const DATA = data.SHOOTER_OUTLAY.ColdTable;
const X_AXIS_MIN = Math.max(DATA.HIST_MIN, 0);
const X_AXIS_MAX = DATA.HIST_MAX;
const X_AXIS_STEP = DATA.BIN_WIDTH;
const Y_AXIS_MAX = Math.max(...DATA.HIST.PCT) * 1.3;
const X_TICKS_EVERY = 1;
const PCT_FONT_SIZE = 40;
const BAR_WIDTH = 100;
const SECOND_AXIS_OFFSET_Y = -20;

// THEME
const PLOT_AREA_FILL = Bright.WHITE;
const BAR_COLOR = tw_colors.fuchsia[500];

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
        padding={0}
        layout
      ></Layout>
    </Camera>
  );

  // --------------- title ----------------
  const titleNode = createRef<Node>();
  const titleRef = createRef<Layout>();

  container().add(
    <Node
      ref={titleNode}
      opacity={0}
    >
      <Layout layout={false}>
        <Layout
          layout
          direction={"column"}
          alignItems={"start"}
          ref={titleRef}
          position={TITLE_POSITION}
          offset={[-1, 0]}
          // x={() => rightColX()}
          // y={0}
        >
          {() =>
            title()
              .split("\n")
              .map((line) => (
                <Txt
                  {...TITLE_TXT_PROPS}
                  text={line}
                />
              ))
          }
        </Layout>
      </Layout>
    </Node>
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

  // https://github.com/motion-canvas/motion-canvas/issues/1057
  camera().scene().position(view.size().div(2));

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
    { label: "MIN", value: commaFormmatter(DATA.QUANTILES.MIN) },
    { label: "5TH", value: commaFormmatter(DATA.QUANTILES.P05) },
    {
      label: "25TH",
      value: commaFormmatter(DATA.QUANTILES.P25),
    },
    {
      label: "MEDIAN",
      value: commaFormmatter(DATA.QUANTILES.MEDIAN),
    },
    {
      label: "AVERAGE",
      value: commaFormmatter(DATA.QUANTILES.MEAN, 2),
    },
    {
      label: "75TH",
      value: commaFormmatter(DATA.QUANTILES.P75),
    },
    {
      label: "95TH",
      value: commaFormmatter(DATA.QUANTILES.P95),
    },
    { label: "MAX", value: commaFormmatter(DATA.QUANTILES.MAX) },
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
    [DATA.QUANTILES.MIN - 1, MINMAX_LOW],
    {
      fill: Grays.WHITE,
      opacity: 0,
      zIndex: 200,
    }
  );
  const upperRangeBox = plot2().box(
    [DATA.QUANTILES.MAX + 1, MINMAX_HIGH],
    [Math.max(X_AXIS_MAX, DATA.QUANTILES.MAX), MINMAX_LOW],
    {
      fill: Grays.WHITE,
      opacity: 0,
      zIndex: -200,
    }
  );
  // --------------- iqr range ----------------
  const iqrRangeBox = plot2().box(
    [DATA.QUANTILES.P25, MINMAX_HIGH],
    [DATA.QUANTILES.P75, MINMAX_LOW],
    {
      fill: tw_colors.violet[500],
      opacity: 0,
      zIndex: 200,
    }
  );
  // --------------- 90pct LOW range ----------------
  const p90Low = plot2().box(
    [DATA.QUANTILES.P05, MINMAX_HIGH],
    [DATA.QUANTILES.P25, MINMAX_LOW],
    {
      fill: tw_colors.cyan[500],
      opacity: 0,
      zIndex: 200,
    }
  );
  const p90High = plot2().box(
    [DATA.QUANTILES.P75, MINMAX_HIGH],
    [DATA.QUANTILES.P95, MINMAX_LOW],
    {
      fill: tw_colors.cyan[500],
      opacity: 0,
      zIndex: 200,
    }
  );

  // --------------- create data bars and labels ----------------
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

  // --------------- create arrows ----------------
  function transformPoint(dataTable: any, i: number): Vector2 {
    return dataTable.headerRects[i]
      .absolutePosition()
      .transformAsPoint(dataTable.layout.worldToParent());
  }

  const minArrow = createArrow(
    plot2,
    transformPoint(dataTable, 0),
    [DATA.QUANTILES.MIN, 0],
    50,
    arrowLevels.MIN
  );

  const p05Arrow = createArrow(
    plot2,
    transformPoint(dataTable, 1),
    [DATA.QUANTILES.P05, 0],
    50,
    arrowLevels.P05
  );

  const p25Arrow = createArrow(
    plot2,
    transformPoint(dataTable, 2),
    [DATA.QUANTILES.P25, 0],
    50,
    arrowLevels.P25
  );

  const medianArrow = createArrow(
    plot2,
    transformPoint(dataTable, 3),
    [DATA.QUANTILES.MEDIAN, 0],
    50,
    arrowLevels.MEDIAN
  );

  const meanArrow = createArrow(
    plot2,
    transformPoint(dataTable, 4),
    [DATA.QUANTILES.MEAN, 0],
    50,
    arrowLevels.MEAN
  );
  const p75Arrow = createArrow(
    plot2,
    transformPoint(dataTable, 5),
    [DATA.QUANTILES.P75, 0],
    50,
    arrowLevels.P75
  );

  const p95Arrow = createArrow(
    plot2,
    transformPoint(dataTable, 6),
    [DATA.QUANTILES.P95, 0],
    50,
    arrowLevels.P95
  );

  const maxArrow = createArrow(
    plot2,
    transformPoint(dataTable, 7),
    [DATA.QUANTILES.MAX, 0],
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
      text: commaFormmatter(DATA.QUANTILES.N),
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

  // --------- position camera on title ---------------
  camera().save();
  camera().position(titleRef().middle());
  camera().zoom(1.5);

  // START DRAWING THE COMPONENTS HERE
  // =================================

  // --------------- plotArea ----------------
  // yield* FadeIn(plotArea.container, 1, easeOutCubic, [100, 0]);
  plotArea.container.opacity(1);
  yield* FadeIn(titleNode, 1, easeOutCubic, [100, 0]);
  yield* waitFor(0.5);
  yield camera().restore(2, easeInOutCubic);
  yield* waitFor(1.8);

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
  const longCameraMove = 2;

  // --------------- MIN arrow ----------------
  // --------------- camera ----------------
  yield camera().zoom(1.2, longCameraMove, easeInOutCubic);
  yield* camera().position([-1100, 400], longCameraMove, easeInOutCubic);
  // --------------- draw new ----------------
  yield dataTable.columns[0].opacity(1, arrowDrawSecs);
  minArrow.stroke(tw_colors.red[600]);
  yield dataTable.headerRects[0].fill(tw_colors.red[950], arrowDrawSecs);
  yield* minArrow.end(1, arrowDrawSecs);
  // --------------- min shaders ----------------
  if (DATA.QUANTILES.MIN > X_AXIS_MIN) {
    yield lowerRangeBox.opacity(0.5, 1, linear);
  }

  yield* waitFor(waitBetweenSecs);
  // --------------- MAX arrow ----------------
  // --------------- previous ----------------
  yield dataTable.headerRects[0].fill(tw_colors.zinc[800], arrowDrawSecs);
  yield* minArrow.stroke(tw_colors.zinc[600], arrowDrawSecs);
  yield minArrow.opacity(0, 1, linear);
  // --------------- camera ----------------
  yield* camera().position([1100, 400], longCameraMove, easeInOutCubic);
  // --------------- draw new ----------------
  yield dataTable.columns[7].opacity(1, arrowDrawSecs);
  maxArrow.stroke(tw_colors.green[600]);
  yield dataTable.headerRects[7].fill(tw_colors.green[950], arrowDrawSecs);
  yield* maxArrow.end(1, arrowDrawSecs);
  // --------------- max shader ----------------
  if (DATA.QUANTILES.MAX < X_AXIS_MAX) {
    yield* upperRangeBox.opacity(0.5, 0.6, linear);
  }
  yield* waitFor(waitBetweenSecs);
  // --------------- camera ----------------
  yield camera().zoom(0.9, longCameraMove, easeInOutCubic);
  yield camera().position([0, 0], longCameraMove, easeInOutCubic);

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
  // --------------- camera ----------------
  yield camera().zoom(1, longCameraMove, easeInOutCubic);

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
  // --------------- camera ----------------
  yield camera().zoom(1, waitBetweenSecs * 2, easeInOutCubic);
  yield* camera().y(0, waitBetweenSecs * 2, easeInOutCubic);
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
