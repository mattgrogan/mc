import {
  Gradient,
  Layout,
  Line,
  makeScene2D,
  Txt,
  Video,
} from "@motion-canvas/2d";
import {
  createRef,
  delay,
  Direction,
  easeInOutExpo,
  easeOutCubic,
  linear,
  makeRefs,
  sequence,
  slideTransition,
  Vector2,
  waitFor,
  waitUntil,
} from "@motion-canvas/core";
import {
  Bright,
  Grays,
  MonoWhite,
  PoppinsBlack,
  PoppinsWhite,
  sessionDark,
  sessionGradient,
  silverGradient,
  Theme,
} from "../../styles";
import { FadeIn } from "../../utils/FadeIn";
import * as params from "./DD_00_Params";
import { Plot } from "../../components/plot/plot";
import { TitleBox } from "../../components/styled/titleBox";
import { DataTable } from "../../components/styled/dataTable";
import { PlotArea } from "../../components/styled/plotArea";
import {
  getQuantile,
  getQuantileData,
  plusCommaFormmatter,
} from "../../components/styled/findQuantiles";
import { audioPlayer } from "./DD_00_Params";
import video from "../../../../Videos/dd_135_across/dd_135_across_demo_v1_speed_ramp.mp4";
import { FadeOut } from "../../utils/FadeOut";

const QUANTILES_ID = "PLYR_CWONLOST_BY_SESSION";
const X_AXIS_MIN = -1400;
const X_AXIS_MAX = 2000;
const X_AXIS_STEP = 200;

const Y_AXIS_MAX = 70;
const BAR_WIDTH = 60;

// The amount those gray limit bars go to X
const MINMAX_LIMIT = 6;

// Tick marks every
const X_TICKS_EVERY = 1;

// Filter just the data we want on the histogram
const data = params.sessionHist.slice(0, 35);

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

  audioPlayer.woosh();
  // yield* slideTransition(Direction.Right);
  yield* waitFor(1)
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
      rectProps={{ fill: sessionGradient, stroke: Grays.GRAY1 }}
      headerProps={{ ...PoppinsWhite }}
      subheadProps={{ ...PoppinsWhite }}
    >
      HOW MUCH MONEY DID THE PLAYERS WIN OR LOSE?
    </TitleBox>
  );
  plotTitle.subhead.text("BY SESSION");

  // ADD THE PLOT AREA
  const plotArea = makeRefs<typeof PlotArea>();
  const plot = createRef<Plot>();

  container().add(
    <PlotArea
      refs={plotArea}
      props={{
        fill: plotAreaFill,
        stroke: Grays.GRAY1,
      }}
    ></PlotArea>
  );

  // ADD THE TABLE
  const dataTable = makeRefs<typeof DataTable>();

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

  // Create the data table and pass in the references
  container().add(
    <DataTable
      refs={dataTable}
      data={tableData}
      headerRectProps={{ fill: sessionGradient, stroke: Grays.GRAY1 }}
      valueRectProps={{ fill: silverGradient, stroke: Grays.GRAY1 }}
      headerTxtProps={{ ...PoppinsWhite, fontSize: 55 }}
      valueTxtProps={{ ...PoppinsBlack }}
      fontSize={70}
    ></DataTable>
  );

  // Highlight the average separately
  // dataTable.headerRects[4].fill(purpleGradient);

  // Plot is only added after all the layout has been completed.
  plotArea.layout.add(
    <Plot
      ref={plot}
      position={() => plotArea.layout.position()}
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
      }}
      xLabelProps={{ fill: Grays.BLACK, decimalNumbers: 0, fontSize: 40 }}
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
  const minLine = plot().vLine([minValue, MINMAX_LIMIT], {
    stroke: Grays.GRAY3,
    lineWidth: 6,
    end: 0,
    zIndex: -10, // THIS IS BEING OVERRIDEN
  });
  minLine.zIndex(0);

  // Add the Max line
  const maxLine = plot().vLine([maxValue, MINMAX_LIMIT], {
    stroke: Grays.GRAY3,
    lineWidth: 6,
    end: 0,
  });

  // Try a box
  const lowerRangeBox = plot().box(
    [X_AXIS_MIN, MINMAX_LIMIT],
    [minValue - 1, 0],
    {
      fill: Grays.GRAY3,
      opacity: 0,
      zIndex: 200,
    }
  );
  const upperRangeBox = plot().box(
    [maxValue + 1, MINMAX_LIMIT],
    [Math.max(X_AXIS_MAX, maxValue), 0],
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
  yield minLine.end(1, 1, easeOutCubic);
  yield lowerRangeBox.opacity(0.2, 1, linear);
  yield* maxLine.end(1, 0.6, easeOutCubic);
  yield* upperRangeBox.opacity(0.2, 0.6, linear);
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

  yield* waitFor(10);

  ///////////////////////////

  // yield* waitUntil("ad")
  // yield plotTitle.container.opacity(0, 1, linear)
  // yield plotArea.container.opacity(0, 1, linear)
  // yield dataTable.columns[1].opacity(0, 1, linear)
  // yield dataTable.columns[2].opacity(0, 1, linear)
  // yield dataTable.columns[3].opacity(0, 1, linear)
  // yield dataTable.columns[4].opacity(0, 1, linear)
  // yield dataTable.columns[5].opacity(0, 1, linear)
  // yield* dataTable.columns[6].opacity(0, 1, linear)

  // const arrowColor = Bright.WHITE
  // const minArrow = createRef<Line>()
  // const maxArrow = createRef<Line>()
  // view.add(<Line ref={minArrow} start={1} lineWidth={60} arrowSize={100} startArrow points={[[-860, 0], [-1260, 0], [-1260, 450]]} stroke={arrowColor}></Line>)
  // view.add(<Line ref={maxArrow} start={1} lineWidth={60} arrowSize={100} startArrow points={[[860, 0], [1260, 0], [1260, 450]]} stroke={arrowColor}></Line>)

  // yield minArrow().start(0, 1, easeInOutExpo)
  // yield maxArrow().start(0, 1, easeInOutExpo)

  // const videoRef=createRef<Video>()
  // view.add(<Video ref={videoRef} src={video} lineWidth={0} stroke={Grays.GRAY3} scale={1.2} opacity={0}></Video>)
  // videoRef().play()
  // yield * videoRef().opacity(1, 1, linear)

  // const line1 = createRef<Txt>()
  // const line2 = createRef<Txt>()
  // // const line3 = createRef<Txt>()
  // view.add(<Txt ref={line1} {...PoppinsWhite} fontSize={160} y={-740} text={"WATCH FULL SESSION REPLAYS"} opacity={0}></Txt>)
  // view.add(<Txt ref={line2} {...MonoWhite} fill={Bright.BLUE} fontSize={120} y={800} text={"dicedata.info/#extras"} opacity={0}></Txt>)
  // yield* FadeIn(line1, 0.6, easeOutCubic, [0, 100])
  // yield* waitFor(0.5)
  // yield* FadeOut(line1, 0.6, easeOutCubic, [0, -100])

  // line1().text("OF THE BEST AND WORST SESSIONS")
  // yield* FadeIn(line1, 0.6, easeOutCubic, [0, 100])
  // yield* waitFor(0.5)
  // yield* FadeOut(line1, 0.6, easeOutCubic, [0, -100])

  // line1().text("EVERY DICE THROW")
  // yield* FadeIn(line1, 0.6, easeOutCubic, [0, 100])
  // yield dataTable.container.opacity(0, 1)
  // yield minArrow().opacity(0, 1)
  // yield maxArrow().opacity(0, 1)
  // yield videoRef().scale(1.6, 10, linear)
  // yield delay(1, line2().opacity(1, 0.6, linear))
  // yield* waitFor(0.5)
  // yield* FadeOut(line1, 0.6, easeOutCubic, [0, -100])

  // line1().text("SEE ALL BETS MADE")
  // yield* FadeIn(line1, 0.6, easeOutCubic, [0, 100])
  // yield* waitFor(0.5)
  // yield* FadeOut(line1, 0.6, easeOutCubic, [0, -100])

  // line1().text("SEE ALL WINS PAID")
  // yield* FadeIn(line1, 0.6, easeOutCubic, [0, 100])
  // yield* waitFor(0.5)
  // yield* FadeOut(line1, 0.6, easeOutCubic, [0, -100])

  // line1().text("ON YOUTUBE OR PATREON")
  // yield* FadeIn(line1, 0.6, easeOutCubic, [0, 100])
  // yield* waitFor(0.5)
  // yield* FadeOut(line1, 0.6, easeOutCubic, [0, -100])

  // line1().text("JOIN TODAY")
  // // line1().fontSize(120)
  // yield* FadeIn(line1, 0.6, easeOutCubic, [0, 100])
  // yield* waitFor(0.5)
  // yield* FadeOut(line1, 0.6, easeOutCubic, [0, -100])

  // line1().text("HTTPS://DICEDATA.INFO/#EXTRAS")
  // yield* FadeIn(line1, 0.6, easeOutCubic, [0, 100])
  // yield* waitFor(1.5)
  // yield* FadeOut(line1, 0.6, easeOutCubic, [0, -100])

  // view.add(<Txt ref={line2} {...PoppinsWhite} fontSize={120} y={-700}></Txt>)
  // view.add(<Txt ref={line3} {...PoppinsWhite} fontSize={120} y={-560}></Txt>)
  // yield* line1().text("WATCH FULL SESSION REPLAYS", 2, linear)
  // yield* line2().text("can access FULL sessions replays of", 2, linear)
  // yield* line3().text("the BEST and WORST simulated sessions!", 2, linear)

  yield* waitFor(2);
  yield* waitUntil("end");
});
