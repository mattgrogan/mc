import {
  Gradient,
  Icon,
  Layout,
  makeScene2D,
  Node,
  Rect,
  Txt,
  TxtProps,
} from "@motion-canvas/2d";
import {
  createRef,
  createRefArray,
  Direction,
  easeInOutCubic,
  easeOutBounce,
  easeOutCubic,
  easeOutExpo,
  makeRefs,
  range,
  sequence,
  slideTransition,
  useLogger,
  waitFor,
  waitUntil,
} from "@motion-canvas/core";
import { Bright, Grays, PoppinsBlack, PoppinsWhite, Theme } from "../../styles";
import { FadeIn } from "../../utils/FadeIn";

import * as params from "./DD_00_Params";

import { Plot } from "../../components/plot/plot";
import { commaFormmatter } from "../../components/styled/findQuantiles";
import { PlotArea } from "../../components/styled/plotArea";
import { TitleBox } from "../../components/styled/titleBox";

const X_AXIS_MIN = 0;
const X_AXIS_MAX = 40;
const X_AXIS_STEP = 100;

const Y_AXIS_MIN = -5;
const Y_AXIS_MAX = 0;
const Y_AXIS_STEP = 0.5;

const HAND_QUANTILES_ID = "PLYR_NET_SHBR_UPDATED_OUT_OF_HAND";

// The amount those gray limit bars go to X

const BETWEEN_SECS = 1.0;

// Filter just the data we want on the histogram
// const data = params.histogramData.slice(0, 30);

let titleGradient = new Gradient({
  from: [0, -100],
  to: [0, 100],
  stops: [
    { offset: 0, color: "#f9fafb" },
    { offset: 1, color: "#9ca3af" },
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

  yield* slideTransition(Direction.Right);

  const container = createRef<Layout>();
  view.add(
    <Layout
      ref={container}
      direction={"column"}
      justifyContent={"center"}
      alignItems={"center"}
      width={"80%"}
      height={"90%"}
      gap={50}
      padding={100}
      layout
    ></Layout>
  );

  yield* waitFor(1);

  const plotTitle = makeRefs<typeof TitleBox>();
  container().add(
    <TitleBox
      refs={plotTitle}
      fontSize={100}
      nodeOpacity={0}
      rectProps={{ fill: titleGradient, stroke: Grays.GRAY1 }}
      headerProps={{ ...PoppinsBlack }}
      subheadProps={{ ...PoppinsBlack }}
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
      width={"50%"}
    ></Layout>
  );

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
      {range(5).map(() => (
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

  // Find the correct data from the json file
  rowValues[0].text(commaFormmatter(params.casinostats[0].TOTAL_BET));
  rowValues[1].text(commaFormmatter(params.casinostats[0].TOTAL_WON));
  rowValues[2].text(commaFormmatter(params.casinostats[0].TOTAL_LOST * -1));
  rowValues[3].text(commaFormmatter(params.casinostats[0].HOUSE_TAKE * -1));
  rowValues[4].text(
    commaFormmatter(params.casinostats[0].HOUSE_EDGE * -100, 3) + "%"
  );
  // rowValues[2].text(sim.table_min);
  // rowValues[3].text(sim.table_max);

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
  //yield* FadeIn(parameterTable, 1, easeOutCubic, [0, 100]);

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
        fontSize: 40,
      }}
      xTitleProps={{
        ...PoppinsBlack,
        fill: Grays.BLACK,
        text: "HOUSE EDGE",
        lineToLabelPadding: 50,
        opacity: 1,
        fontSize: 60,
      }}
      yTitleProps={{
        ...PoppinsBlack,
        fill: Grays.BLACK,
        text: "HOUSE EDGE",
        lineToLabelPadding: -160,
        opacity: 0,
        rotation: -90,
        fontSize: 60,
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
    color: Bright.YELLOW,
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

  // ************************
  // DRAW THE EDGE ARROW
  // ************************
  const HOUSE_EDGE_PERCENT = params.casinostats[0].HOUSE_EDGE * 100;
  useLogger().debug(HOUSE_EDGE_PERCENT.toFixed(3));

  // yield* waitUntil("skill66");
  const thisStrategyLine = plot().hLine([10, HOUSE_EDGE_PERCENT], {
    lineWidth: 60,
    stroke: Bright.BLUE,
    startOffset: 30,
    endOffset: 20,
    // lineDash: [20, 5],
    start: 1,
    startArrow: true,
    arrowSize: 80,
    opacity: 0.8,
  });
  thisStrategyLine.zIndex(100);
  yield* thisStrategyLine.start(0, 1, easeOutExpo);

  // ************************
  // DRAW THE EDGE COMPARISONS
  // ************************

  yield* addPointer(plot(), 0, "TAKE/LAY ODDS (0.00%)");
  yield* waitFor(BETWEEN_SECS);
  yield* addPointer(plot(), -1.41, "PASS/COME (1.41%)");
  yield* waitFor(BETWEEN_SECS);
  yield* addPointer(plot(), -2.78, "FIELD (3:1) (2.78%)");
  yield* waitFor(BETWEEN_SECS);
  yield* addPointer(plot(), -1.52, "PLACE 6/8 (1.52%)");
  yield* waitFor(BETWEEN_SECS);
  yield* addPointer(plot(), -1.67, "BUY 4/10 (1.67%)");
  yield* waitFor(BETWEEN_SECS);
  yield* addPointer(plot(), -4.0, "PLACE 5/9 (4.00%)");
  yield* waitFor(BETWEEN_SECS);

  yield* plot().rescale(
    X_AXIS_MIN,
    X_AXIS_MAX,
    X_AXIS_STEP,
    -18,
    Y_AXIS_MAX,
    2,
    2,
    easeInOutCubic
  );

  yield* addPointer(plot(), -5.56, "FIELD (2:1) (5.56%)");
  yield* waitFor(BETWEEN_SECS);
  yield* addPointer(plot(), -6.67, "PLACE 4/10 (6.67%)");
  yield* waitFor(BETWEEN_SECS);
  yield* addPointer(plot(), -9.09, "HARD 6/8 (9.09%)");
  yield* waitFor(BETWEEN_SECS);
  yield* addPointer(plot(), -11.11, "HARD 4/10 & ANY CRAPS (11.11%)");
  yield* waitFor(BETWEEN_SECS);
  yield* addPointer(plot(), -16.67, "ANY SEVEN (16.67%)");
  yield* waitFor(BETWEEN_SECS);

  // yield thisStrategyLabel.opacity(1, 1.2);

  yield* waitFor(10);
  yield* waitUntil("end");
});

function* addPointer(plot: Plot, edge: number, label: string) {
  const OPACITY_ON_SECS = 0.7;
  const OPACITY_DELAY_SECS = 0.7;
  const OPACITY_OFF_SECS = 0.7;

  const lineProps = {
    lineWidth: 20,
    stroke: Grays.BLACK,
    // fill: Grays.GRAY2,
    startOffset: 30,
    endOffset: 20,
    //lineDash: [20, 5],
    start: 1,
    startArrow: true,
    arrowSize: 30,
    opacity: 0.6,
  };

  const edgeLabelProps: TxtProps = {
    //...MonoWhite,
    ...PoppinsWhite,
    fill: Grays.BLACK,
    fontWeight: 600,
    fontSize: 60,
    opacity: 0,
    offset: [-1, 0],
  };

  const line = plot.hLine([10, edge], lineProps);
  const text = plot.text([10, edge], {
    ...edgeLabelProps,
    text: label,
  });
  yield line.start(0, 0.6, easeInOutCubic);
  yield text
    .opacity(1, OPACITY_ON_SECS)
    .wait(OPACITY_DELAY_SECS)
    .to(0, OPACITY_OFF_SECS);
}
