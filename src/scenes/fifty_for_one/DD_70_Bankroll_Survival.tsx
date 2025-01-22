import {
  Gradient,
  Layout,
  Line,
  makeScene2D,
  Node,
  Rect,
  Txt,
} from "@motion-canvas/2d";
import {
  createRef,
  createRefArray,
  Direction,
  easeOutCubic,
  linear,
  makeRefs,
  range,
  sequence,
  slideTransition,
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
  Theme,
} from "../../styles";
import { FadeIn } from "../../utils/FadeIn";
import * as params from "./DD_00_Params";
import { Plot } from "../../components/plot/plot";
import {
  commaFormmatter,
  getQuantile,
  getQuantileData,
} from "../../components/styled/findQuantiles";
import { PlotArea } from "../../components/styled/plotArea";
import { TitleBox } from "../../components/styled/titleBox";

const WINNERS = params.winlose.find((stat) => stat.STAT == "N_UP").BY_SHOOTER;
const PUSHERS = params.winlose.find((stat) => stat.STAT == "N_EVEN").BY_SHOOTER;
const LOSERS = params.winlose.find((stat) => stat.STAT == "N_DOWN").BY_SHOOTER;
const TOTAL = params.winlose.find((stat) => stat.STAT == "N").BY_SHOOTER;

const QUANTILES_ID = "MIN_BR_END";
const X_AXIS_MIN = 0;
const X_AXIS_MAX = 40;
const X_AXIS_STEP = 100;

const Y_AXIS_MIN = -2000;
const Y_AXIS_MAX = 200;
const Y_AXIS_STEP = 200;

const HAND_QUANTILES_ID = "PLYR_NET_SHBR_UPDATED_OUT_OF_HAND";

// The amount those gray limit bars go to X
const X_LIMIT = 2;

// Filter just the data we want on the histogram
const data = params.worstBankroll.slice(0, 21);

const AVERAGE_WONLOST = params.amountWonLostQuantiles.find(
  (stat) => stat.STAT == "MEAN_WONLOST"
).BY_SESSION;

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
      BANKROLL MANAGEMENT
    </TitleBox>
  );
  plotTitle.subhead.text("WORST CASES");

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
      >
        <Rect
          width={"100%"}
          // height={"18%"}
          basis={0}
          fill={Darker.BLUE}
          justifyContent={"center"}
          alignItems={"center"}
          stroke={Grays.GRAY2}
          grow={1}
          lineWidth={3}
        >
          <Txt
            {...PoppinsWhite}
            // fill={Darker.BLUE}
            text={"GETTING OUT OF THE HAND"}
            fontSize={80}
            fontWeight={600}
          />
        </Rect>
      </Node>
      {range(4).map((index) => (
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
                fontSize={70}
                fontWeight={600}
              ></Txt>
            </Rect>
            <Rect
              width={"50%"}
              height={"100%"}
              fill={Grays.GRAY1}
              justifyContent={"center"}
              alignItems={"center"}
              padding={50}
            >
              <Txt
                ref={rowValues}
                {...PoppinsWhite}
                fill={Grays.BLACK}
                // text={"100,000"}
                fontSize={120}
                fontWeight={600}
              ></Txt>
            </Rect>
          </Rect>
        </Node>
      ))}
    </Layout>
  );

  rowTitles[0].text("PERCENT NOT OUT OF HAND");
  rowTitles[1].text("MOST LOST");
  rowTitles[2].text("MEDIAN LOST");
  rowTitles[3].text("LEAST LOST");

  // Find the correct data from the json file
  const tableData = getQuantileData(
    HAND_QUANTILES_ID,
    params.out_of_hand,
    commaFormmatter
  );
  const pctWinners = ((LOSERS / TOTAL) * 100).toFixed(1) + "%";
  rowValues[0].text(pctWinners);
  rowValues[1].text(tableData[0].value);
  rowValues[2].text(tableData[3].value);
  rowValues[3].text(tableData[6].value);
  // rowValues[2].text(sim.table_min);
  // rowValues[3].text(sim.table_max);

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
        opacity: 1,
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
      xLabelProps={{ fill: Grays.BLACK, decimalNumbers: 0, fontSize: 40 }}
      yLabelProps={{ fill: Grays.BLACK, decimalNumbers: 0, fontSize: 40 }}
      xTitleProps={{
        ...PoppinsBlack,
        fill: Grays.BLACK,
        text: "LOWEST BANKROLL IN THE SESSION",
        lineToLabelPadding: 50,
        opacity: 1,
        fontSize: 60,
      }}
      yTitleProps={{
        ...PoppinsBlack,
        fill: Grays.BLACK,
        text: "WORST BANKROLL",
        lineToLabelPadding: -160,
        opacity: 0,
        rotation: -90,
        fontSize: 60,
      }}
      xTickProps={{ stroke: Grays.BLACK }}
      yTickProps={{ stroke: Grays.BLACK }}
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
  // yield plot().xAxis.end(1, 0.6, easeOutCubic);
  yield plot().yAxis.end(1, 0.6, easeOutCubic);
  // plot().xAxis.updateTicks(X_AXIS_MIN, X_AXIS_MAX, X_AXIS_STEP);
  plot().yAxis.updateTicks(Y_AXIS_MIN, Y_AXIS_MAX, Y_AXIS_STEP);

  // Add the Min line
  const minValue = getQuantile(QUANTILES_ID, params.quantiles, 0);
  const maxValue = getQuantile(QUANTILES_ID, params.quantiles, 1);

  const minLine = plot().hLine([X_LIMIT, minValue], {
    stroke: Grays.GRAY3,
    lineWidth: 6,
    end: 0,
    zIndex: -10, // THIS IS BEING OVERRIDEN
  });
  minLine.zIndex(0);

  // Add the Max line
  const maxLine = plot().hLine([X_LIMIT, maxValue], {
    stroke: Grays.GRAY3,
    lineWidth: 6,
    end: 0,
  });
  maxLine.zIndex(0);

  // Try a box
  const lowerRangeBox = plot().box(
    [X_LIMIT, minValue - 1],
    [0, Math.min(Y_AXIS_MIN, minValue)],

    {
      fill: Grays.GRAY3,
      opacity: 0,
      zIndex: 200,
    }
  );

  const upperRangeBox = plot().box(
    [X_LIMIT, maxValue + 1],
    [0, Math.max(Y_AXIS_MAX, maxValue)],
    {
      fill: Grays.GRAY3,
      opacity: 0,
      zIndex: -200,
    }
  );

  yield* waitFor(2);

  // Add the 99th Percentile
  const pct99 = getQuantile(QUANTILES_ID, params.quantiles, 0.01);
  useLogger().debug("99th percentile is " + pct99);

  const pct99Line = plot().hLine([X_AXIS_MAX, pct99], {
    stroke: Darker.RED,
    lineWidth: 6,
    end: 0,
    lineDash: [20, 5],
    zIndex: -10, // THIS IS BEING OVERRIDEN
  });
  pct99Line.zIndex(0);

  const pct99Label = plot().text([X_AXIS_MAX, pct99], {
    text: "99th Percentile",
    offset: [1, 1],
    fill: Darker.RED,
    opacity: 0,
  });
  const pct99Value = plot().text([X_AXIS_MAX, pct99], {
    text: commaFormmatter(pct99),
    offset: [1, -1],
    fill: Darker.RED,
    opacity: 0,
  });

  // ************************
  // FACTOR THIS STUFF OUT
  // ************************
  const bars: Line[] = [];
  const labels: Txt[] = [];

  for (let index = 0; index < data.length; index++) {
    const offset = 50;
    const point = new Vector2(data[index].PCT, data[index].MIDPOINT);
    const line = plot().hLine(point, {
      stroke: Bright.BLUE,
      lineWidth: 60,
      opacity: 1,
      end: 0,
    });
    if (data[index].COUNT > 0) {
      bars.push(line);
    }

    // if (data[index].PCT >= 0.1) {
    let pct = data[index].PCT.toFixed(1);

    // Shift the point over a bit, if it's low
    const POINT_LIMIT = 2;
    let adjPoint = point;
    if (data[index].PCT < POINT_LIMIT) {
      adjPoint = point.addX(POINT_LIMIT);
    }

    if (data[index].PCT < 0.1 && data[index].PCT > 0) {
      pct = "<0.1";
    }
    const n = commaFormmatter(data[index].COUNT);
    const label = plot().text(adjPoint, {
      ...PoppinsWhite,
      text: n + " (" + pct + "%)",
      offsetX: -1.1,
      fill: Grays.BLACK,
      fontWeight: 500,
      fontSize: 45,
      opacity: 0,
    });
    // label.add(
    //   <Txt
    //     text="%"
    //     fontSize={24}
    //   />
    // );

    if (data[index].PCT > 0) {
      labels.push(label);
    }
  }
  // ************************
  // END FACTOR
  // ************************

  yield* sequence(0.1, ...bars.map((line) => line.end(1, 1, easeOutCubic)));
  yield* sequence(0.1, ...labels.map((pct) => pct.opacity(1, 0.6)));

  // Show data ranges in plot
  yield minLine.end(1, 1, easeOutCubic);
  yield lowerRangeBox.opacity(0.2, 1, linear);
  // yield* maxLine.end(1, 0.6, easeOutCubic);
  // yield* upperRangeBox.opacity(0.2, 0.6, linear);

  // Show the 99th Percentile
  yield* waitUntil("show-99th");
  yield* pct99Line.end(1, 1, easeOutCubic);
  yield* pct99Label.opacity(1, 0.6);
  yield* pct99Value.opacity(1, 0.6);
  yield* waitFor(1);
  yield* sequence(
    0.4,
    ...rowNodes.map((r) => FadeIn(r, 1, easeOutCubic, [0, 50]))
  );
  yield* waitFor(1);

  yield* waitFor(10);
  yield* waitUntil("end");
});
