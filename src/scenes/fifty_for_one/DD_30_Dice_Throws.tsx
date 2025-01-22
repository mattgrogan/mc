import { Gradient, Layout, Line, makeScene2D, Txt } from "@motion-canvas/2d";
import {
  all,
  createRef,
  createSignal,
  Direction,
  easeOutCubic,
  makeRefs,
  sequence,
  slideTransition,
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

import { Plot } from "../../components/plot/plot";
import { TitleBox } from "../../components/styled/titleBox";

import * as params from "./DD_00_Params";

import { diceThrows } from "./DD_00_Params";

//-sessions-shooters-rolls.json
// const simStatsJsonFile =
//   "../../../../dicedata/output/skill66halfpress-100k/skill66halfpress-100k-sessions-shooters-rolls.json";

// import simstats from "../../../../dicedata/output/skill66halfpress-100k/skill66halfpress-100k-sessions-shooters-rolls.json";

//-quantiles.json
import { PlotArea } from "../../components/styled/plotArea";

let titleGradient = new Gradient({
  from: [0, -300],
  to: [0, 100],
  stops: [
    { offset: 0, color: "#2191fb" },
    { offset: 1, color: "#1d4e89" },
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

const X_MIN = 1;
const X_MAX = 13;
const Y_MAX = 20;

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

  const totalThrowsSignal = createSignal(0);
  const totalThrows = params.simstats[0].ROLLS;

  const plotTitle = makeRefs<typeof TitleBox>();
  container().add(
    <TitleBox
      refs={plotTitle}
      fontSize={100}
      nodeOpacity={0}
      rectProps={{ fill: titleGradient, stroke: Grays.GRAY1 }}
      headerProps={{ ...PoppinsWhite }}
      subheadProps={{ ...PoppinsWhite }}
    ></TitleBox>
  );
  plotTitle.header.text(() =>
    totalThrowsSignal().toLocaleString("en-US", { maximumFractionDigits: 0 })
  );
  plotTitle.subhead.text("DICE THROWS");

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

  // Plot is only added after all the layout has been completed.
  plotArea.layout.add(
    <Plot
      ref={plot}
      position={() => plotArea.layout.position()}
      xMin={X_MIN}
      xMax={X_MAX}
      yMax={Y_MAX}
      width={plotArea.rect.width() * 0.9}
      height={plotArea.rect.height() * 0.7}
      xAxisProps={{
        opacity: 1,
        stroke: Grays.BLACK,
        lineWidth: 8,
        end: 0,
      }}
      xLabelProps={{
        ...PoppinsBlack,
        fill: Grays.BLACK,
        decimalNumbers: 0,
        fontSize: 80,
        fontWeight: 600,
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
  yield totalThrowsSignal(totalThrows, 1, easeOutCubic);
  yield* FadeIn(plotTitle.headerContainer, 0, easeOutCubic, [100, 0]);
  yield* FadeIn(plotTitle.subheadContainer, 0, easeOutCubic, [100, 0]);
  yield* FadeIn(plotTitle.container, 0.6, easeOutCubic, [100, 0]);

  // yield* waitFor(1);

  // Draw the Plot
  yield* FadeIn(plotArea.container, 1, easeOutCubic, [100, 0]);

  // yield* waitFor(2);
  yield plot().xAxis.end(1, 0.6, easeOutCubic);
  plot().xAxis.updateTicks(2, 12, 1);

  yield* waitFor(2);

  // ************************
  // FACTOR THIS STUFF OUT
  // ************************
  const theoreticalBars: Line[] = [];
  const actualBars: Line[] = [];
  const theoreticalLabels: Txt[] = [];
  const theoreticalNLabels: Txt[] = [];
  const actualLabels: Txt[] = [];
  const actualNLabels: Txt[] = [];

  const diceData = [
    {
      throw: 2,
      pct: 1 / 36,
    },
    { throw: 3, pct: 2 / 36 },
    { throw: 4, pct: 3 / 36 },
    { throw: 5, pct: 4 / 36 },
    { throw: 6, pct: 5 / 36 },
    { throw: 7, pct: 6 / 36 },
    { throw: 8, pct: 5 / 36 },
    { throw: 9, pct: 4 / 36 },
    { throw: 10, pct: 3 / 36 },
    { throw: 11, pct: 2 / 36 },
    { throw: 12, pct: 1 / 36 },
  ];

  for (let index = 0; index < diceData.length; index++) {
    const offset = 50;

    // Theoretical bar
    const point = new Vector2(diceData[index].throw, diceData[index].pct * 100);
    const line = plot().vLine(point, {
      stroke: Grays.GRAY4,
      lineWidth: 180,
      opacity: 1,
      end: 0,
    });
    theoreticalBars.push(line);

    // Actual bar
    const dataPoint = new Vector2(
      diceThrows[index].THROW,
      diceThrows[index].PCT
    );
    const dataLine = plot().vLine(dataPoint, {
      stroke: Darker.BLUE,
      lineWidth: 180,
      opacity: 1,
      end: 0,
    });
    actualBars.push(dataLine);

    // Theoretical Percent
    const pct = (diceData[index].pct * 100).toFixed(2);
    const label = plot().text(point, {
      ...PoppinsWhite,
      text: pct,
      offsetY: 1.5,
      fill: Grays.GRAY4,
      fontWeight: 500,
      fontSize: 40,
      opacity: 0,
    });
    label.add(
      <Txt
        text="%"
        fontSize={20}
      />
    );
    theoreticalLabels.push(label);

    // Theoretical N
    let theoreticalN = "";
    let theoreticalSuffix = " M";
    const theoreticalNCount = diceData[index].pct * totalThrows;
    if (theoreticalNCount >= 1000000) {
      theoreticalN = (theoreticalNCount / 1000000).toFixed(2);
    } else {
      theoreticalN = (theoreticalNCount / 1000).toFixed(0);
      theoreticalSuffix = " K";
    }
    const theoreticalNLabel = plot().text(point, {
      ...PoppinsWhite,
      text: theoreticalN,
      offsetY: 1.5,
      fill: Grays.GRAY4,
      fontWeight: 500,
      fontSize: 40,
      opacity: 0,
    });
    theoreticalNLabel.add(
      <Txt
        text={theoreticalSuffix}
        fontSize={40}
      />
    );
    theoreticalNLabels.push(theoreticalNLabel);

    // Actual Percent
    const actualPct = diceThrows[index].PCT.toFixed(2);
    const actualLabel = plot().text(dataPoint, {
      ...PoppinsWhite,
      text: actualPct,
      offsetY: -1.5,
      fill: Grays.WHITE,
      fontWeight: 500,
      fontSize: 40,
      opacity: 0,
    });
    actualLabel.add(
      <Txt
        text="%"
        fontSize={20}
      />
    );
    actualLabels.push(actualLabel);

    // Actual N
    let actualN = "";
    let suffix = " M";

    const count = diceThrows[index].COUNT;
    if (count >= 1000000) {
      actualN = (count / 1000000).toFixed(2);
    } else {
      actualN = (count / 1000).toFixed(0);
      suffix = " K";
    }
    const actualNLabel = plot().text(dataPoint, {
      ...PoppinsWhite,
      text: actualN,
      offsetY: -1.5,
      fill: Grays.WHITE,
      fontWeight: 500,
      fontSize: 40,
      opacity: 0,
    });
    actualNLabel.add(
      <Txt
        text={suffix}
        fontSize={40}
      />
    );
    actualNLabels.push(actualNLabel);
  }

  // ************************
  // END FACTOR
  // ************************

  // Show theoretical with its percent
  yield* sequence(
    0.1,
    ...theoreticalBars.map((line) => line.end(1, 1, easeOutCubic))
  );
  yield* sequence(0.1, ...theoreticalLabels.map((pct) => pct.opacity(1, 0.6)));
  yield* waitFor(1);

  // Show actual with its percent
  yield* waitUntil("show-actual");
  yield* sequence(
    0.1,
    ...actualBars.map((line) => line.end(1, 1, easeOutCubic))
  );
  yield* sequence(0.1, ...actualLabels.map((pct) => pct.opacity(1, 0.6)));

  yield* waitFor(8);
  yield* waitUntil("show-n");

  // Hide the percents and show the N
  yield all(...actualLabels.map((pct) => pct.opacity(0, 0.6)));
  yield* all(...theoreticalLabels.map((pct) => pct.opacity(0, 0.6)));
  yield* sequence(0.1, ...theoreticalNLabels.map((pct) => pct.opacity(1, 0.6)));
  yield* sequence(0.1, ...actualNLabels.map((pct) => pct.opacity(1, 0.6)));

  yield* waitFor(8);
  yield* waitUntil("end");
});
