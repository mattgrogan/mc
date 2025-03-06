import {
  Camera,
  Gradient,
  Layout,
  Line,
  makeScene2D,
  Txt,
  Node,
  Rect,
  RectProps,
  TxtProps,
} from "@motion-canvas/2d";
import {
  createRef,
  createSignal,
  easeInOutCubic,
  easeOutCubic,
  linear,
  makeRef,
  makeRefs,
  sequence,
  Vector2,
  waitFor,
  waitUntil,
} from "@motion-canvas/core";
import {
  Bright,
  Darker,
  Grays,
  PoppinsBlack,
  PoppinsWhite,
  sessionDark,
  sessionGradient,
  sessionLight,
  silverGradient,
  Theme,
} from "../../styles";
import { FadeIn } from "../../utils/FadeIn";
import * as params from "./DD_00_Params";
import { Plot, PlotSpace } from "../../components/plot/plot";
import { TitleBox } from "../../components/styled/titleBox";
import { DataTable } from "../../components/styled/dataTable";
import { PlotArea } from "../../components/styled/plotArea";
import {
  getQuantile,
  getQuantileData,
  plusCommaFormmatter,
} from "../../components/styled/findQuantiles";
// import { audioPlayer } from "./DD_00_Params";

const QUANTILES_ID = "PLYR_CWONLOST_BY_SESSION";
// Filter just the data we want on the histogram
const data = params.sessionHist.slice(0, 35);

// TITLE
const TITLE = "HOW MUCH MONEY DID THE PLAYERS WIN OR LOSE?";
const SUBTITLE = "BY SESSION";

// QUANTILES TABLE
const TABLE_HEADER_RECT_PROPS = { fill: sessionGradient, stroke: Grays.GRAY1 };
const TABLE_HEADER_TXT_PROPS = { ...PoppinsWhite, fontSize: 70 };
const TABLE_VALUE_RECT_PROPS = { fill: silverGradient, stroke: Grays.GRAY1 };
const TABLE_VALUE_TXT_PROPS = { ...PoppinsBlack, fontSize: 80 };

// PLOT OPTIONS
const X_AXIS_MIN = -1400;
const X_AXIS_MAX = 2000;
const X_AXIS_STEP = 200;
const Y_AXIS_MAX = 70;
const X_TICKS_EVERY = 1;

// BAR OPTIONS
const BAR_WIDTH = 60;

// The amount those gray limit bars go to X
const MINMAX_HIGH = 2;
const MINMAX_LOW = -2;

const AVERAGE_WONLOST = params.amountWonLostQuantiles.find(
  (stat) => stat.STAT == "MEAN_WONLOST"
).BY_SESSION;

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

  // CREATE THE CONTAINER
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

  // CREATE THE TITLE BOX
  const plotTitle = makeRefs<typeof TitleBox>();
  container().add(
    <TitleBox
      refs={plotTitle}
      fontSize={100}
      nodeOpacity={0}
      rectProps={{ fill: sessionGradient, stroke: Grays.GRAY1 }}
      headerProps={{ ...PoppinsWhite }}
      subheadProps={{ ...PoppinsWhite }}
    >
      {TITLE}
    </TitleBox>
  );
  plotTitle.subhead.text(SUBTITLE);

  // CREATE THE PLOT AREA
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

  ////////////////////////////////////////
  // TODO: MOVE INTO FUNCTION
  // Find the correct data from the json file
  const tableData = getQuantileData(
    QUANTILES_ID,
    params.quantiles,
    plusCommaFormmatter
  );
  tableData[0].label = "MOST LOST";
  tableData[6].label = "MOST WON";

  tableData.splice(4, 0, {
    label: "AVERAGE",
    value: AVERAGE_WONLOST.toFixed(2),
  });

  const medianFormattedText = tableData[3].value;
  // END TODO
  ///////////////////////////////////////

  // CREATE THE DATA TABLE
  const dataTable = makeRefs<typeof DataTable>();
  container().add(
    <DataTable
      refs={dataTable}
      data={tableData}
      headerRectProps={TABLE_HEADER_RECT_PROPS}
      headerTxtProps={TABLE_HEADER_TXT_PROPS}
      valueRectProps={TABLE_VALUE_RECT_PROPS}
      valueTxtProps={TABLE_VALUE_TXT_PROPS}
    ></DataTable>
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
  yield* FadeIn(plotTitle.headerContainer, 0, easeOutCubic, [100, 0]);
  yield* FadeIn(plotTitle.subheadContainer, 0, easeOutCubic, [100, 0]);
  yield* FadeIn(plotTitle.container, 0.6, easeOutCubic, [100, 0]);

  // yield* waitFor(1);

  // Draw the Plot
  yield* FadeIn(plotArea.container, 1, easeOutCubic, [100, 0]);

  // yield* waitFor(2);
  yield plot().xAxis.end(1, 0.6, easeOutCubic);
  plot().xAxis.updateTicks(X_AXIS_MIN, X_AXIS_MAX, X_AXIS_STEP, X_TICKS_EVERY);

  // Add the Min line
  const minValue = getQuantile(QUANTILES_ID, params.quantiles, 0);
  const maxValue = getQuantile(QUANTILES_ID, params.quantiles, 1);
  // const minLine = plot().vLine([minValue, MINMAX_HIGH], {
  //   stroke: Grays.GRAY3,
  //   lineWidth: 6,
  //   end: 0,
  //   zIndex: -10, // THIS IS BEING OVERRIDEN
  // });
  // minLine.zIndex(0);

  // Add the Max line
  // const maxLine = plot().vLine([maxValue, MINMAX_HIGH], {
  //   stroke: Grays.GRAY3,
  //   lineWidth: 6,
  //   end: 0,
  // });

  // Try a box
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
      stroke: sessionDark,
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
        fontSize: 40,
        opacity: 0,
      });
      label.add(
        <Txt
          text="%"
          fontSize={24}
        />
      );

      labels.push(label);
    } else if (data[index].PCT < 0.1 && data[index].PCT > 0) {
      const pct = "<0.1";
      const label = plot().text(point, {
        ...PoppinsWhite,
        text: pct,
        offsetY: 1.5,
        fill: Grays.GRAY2,
        fontWeight: 500,
        fontSize: 30,
        opacity: 0,
      });
      label.add(
        <Txt
          text="%"
          fontSize={24}
        />
      );
      labels.push(label);
    }
  }
  // ************************
  // END FACTOR
  // ************************

  const zeroLine = plot().vLine([0, Y_AXIS_MAX], {
    lineWidth: 5,
    stroke: Grays.GRAY2,
    lineDash: [20, 5],
    opacity: 0.5,
  });

  yield* sequence(0.1, ...bars.map((line) => line.end(1, 1, easeOutCubic)));
  yield* sequence(0.1, ...labels.map((pct) => pct.opacity(1, 0.6)));

  // Show data ranges in plot
  if (minValue > X_AXIS_MIN) {
    // yield minLine.end(1, 1, easeOutCubic);
    yield lowerRangeBox.opacity(0.2, 1, linear);
  }
  if (maxValue < X_AXIS_MAX) {
    // yield* maxLine.end(1, 0.6, easeOutCubic);
    yield* upperRangeBox.opacity(0.2, 0.6, linear);
  }
  yield* zeroLine.end(1, 0.6, easeOutCubic);

  // Median
  yield* waitUntil("median");
  yield* dataTable.columns[3].opacity(1, 0.6);
  yield* waitFor(1);

  // Average
  yield* waitUntil("avg");
  yield* dataTable.columns[4].opacity(1, 0.6);
  yield* waitFor(1);

  // IQR
  yield* waitUntil("iqr");
  yield dataTable.columns[2].opacity(1, 0.6);
  yield* dataTable.columns[5].opacity(1, 0.6);
  yield* waitFor(1);

  // Middle 90%
  yield* waitUntil("ninety");
  yield dataTable.columns[1].opacity(1, 0.6);
  yield* dataTable.columns[6].opacity(1, 0.6);
  yield* waitFor(1);

  // Min/Max
  yield* waitUntil("minmax");
  yield dataTable.columns[0].opacity(1, 0.6);
  yield* dataTable.columns[7].opacity(1, 0.6);
  yield* waitFor(1);

  // Draw a box
  const box = plot().box([-1162, Y_AXIS_MAX * 0.9], [396, -2], {
    stroke: Grays.GRAY3,
    lineWidth: 5,
    fill: Darker.GREEN,
    opacity: 0.5,
  });
  box.zIndex(-1000);
  // yield* box.lowerRight([400, Y_AXIS_MAX - 10], 1);

  // const pointerPosition = Vector2.createSignal([-500, 0]);
  // const pointer1 = plot().line(pointerPosition(), pointerPosition().addY(-15), {
  //   stroke: Bright.YELLOW,
  //   startArrow: true,
  //   startOffset: 70,
  //   lineWidth: 10,
  // });

  yield* plot().rescale(-1400, -600, 50, 0, Y_AXIS_MAX, 1, 2);
  yield* waitFor(2);
  yield* plot().rescale(0, X_AXIS_MAX, X_AXIS_STEP, 0, Y_AXIS_MAX, 1, 2);
  yield* waitFor(2);
  yield* plot().rescale(
    X_AXIS_MIN,
    X_AXIS_MAX,
    X_AXIS_STEP,
    0,
    Y_AXIS_MAX,
    1,
    2
  );
  yield* waitFor(2);
  camera().save();
  yield camera().position([-1500, 1000], 2, easeInOutCubic);
  yield* camera().zoom(1.5, 2, easeInOutCubic);
  yield* waitFor(2);
  yield* camera().restore(2, easeInOutCubic);

  yield* waitFor(2);

  // AVERAGE
  const averageLabel = makeRefs<typeof HeaderValueBox>();
  plot().add(
    <HeaderValueBox
      refs={averageLabel}
      headerRectProps={{
        fill: sessionGradient,
        stroke: Grays.GRAY1,
        padding: 30,
      }}
      headerTxtProps={{ text: "AVERAGE", ...PoppinsWhite, fontSize: 70 }}
      valueRectProps={TABLE_VALUE_RECT_PROPS}
      valueTxtProps={{
        ...PoppinsBlack,
        fontSize: 80,
        text: "-463.15",
        padding: 30,
      }}
    ></HeaderValueBox>
  );
  averageLabel.layout.position(
    plot().c2p([-500, 0], PlotSpace.LOCAL).addY(180)
  );
  averageLabel.layout.scale(0.5);

  plot().cToPLine([-463.15, 0], averageLabel.layout.top(), 50, -20, 0, {
    lineWidth: 8,
    lineDash: [10, 1],
    stroke: sessionDark,
    radius: 10,
    startArrow: true,
    startOffset: 20,
    arrowSize: 15,
  });

  // MEDIAN
  const medianLabel = makeRefs<typeof HeaderValueBox>();
  plot().add(
    <HeaderValueBox
      refs={medianLabel}
      headerRectProps={{
        fill: sessionGradient,
        stroke: Grays.GRAY1,
        padding: 30,
      }}
      headerTxtProps={{ text: "MEDIAN", ...PoppinsWhite, fontSize: 70 }}
      valueRectProps={TABLE_VALUE_RECT_PROPS}
      valueTxtProps={{
        ...PoppinsBlack,
        fontSize: 80,
        text: "-1,125",
        padding: 30,
      }}
    ></HeaderValueBox>
  );
  medianLabel.layout.position(
    plot().c2p([-1125, 0], PlotSpace.LOCAL).addY(180)
  );
  medianLabel.layout.scale(0.5);

  plot().cToPLine([-1125, 0], medianLabel.layout.top(), 50, -20, 0, {
    lineWidth: 8,
    lineDash: [10, 1],
    stroke: sessionDark,
    radius: 10,
    startArrow: true,
    startOffset: 20,
    arrowSize: 15,
  });

  yield* waitFor(10);

  yield* waitFor(2);
  yield* waitUntil("end");
});

function HeaderValueBox({
  refs,
  headerRectProps = {},
  headerTxtProps = {},
  valueRectProps = {},
  valueTxtProps = {},
}: {
  refs: { container: Node; layout: Layout };
  headerRectProps?: RectProps;
  headerTxtProps?: TxtProps;
  valueRectProps?: RectProps;
  valueTxtProps?: TxtProps;
}) {
  return (
    <Node ref={makeRef(refs, "container")}>
      <Rect
        ref={makeRef(refs, "layout")}
        layout
        direction={"column"}
        radius={20}
        clip
        shadowOffset={[2, 2]}
        shadowColor={"black"}
        shadowBlur={10}
      >
        <Rect
          height={"50%"}
          justifyContent={"center"}
          alignItems={"center"}
          {...headerRectProps}
        >
          <Txt
            fontWeight={600}
            {...headerTxtProps}
          ></Txt>
        </Rect>
        <Rect
          height={"50%"}
          justifyContent={"center"}
          alignItems={"center"}
          {...valueRectProps}
        >
          <Txt
            fontWeight={600}
            {...valueTxtProps}
          ></Txt>
        </Rect>
      </Rect>
    </Node>
  );
}
