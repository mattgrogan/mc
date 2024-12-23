import { Gradient, Layout, Line, makeScene2D, Txt } from "@motion-canvas/2d";
import {
  createRef,
  createSignal,
  Direction,
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
  LightBlueGradient,
  PoppinsBlack,
  PoppinsWhite,
  purpleGradient,
  silverGradient,
  Theme,
} from "../../styles";
import { FadeIn } from "../../utils/FadeIn";

import { Plot } from "../../components/plot/plot";
import { TitleBox } from "../../components/styled/titleBox";

//-sessions-shooters-rolls.json
import simstats from "../../../../dicedata/output/skill66halfpress-100k/skill66halfpress-100k-sessions-shooters-rolls.json";

//-rolls_by_shooter.json
import rollsByShooter from "../../../../dicedata/output/pushit-new/pushit-new-rolls_by_shooter.json";

//-quantiles.json
import quantiles from "../../../../dicedata/output/pushit-new/pushit-new-quantiles.json";
import { DataTable } from "../../components/styled/dataTable";
import {
  getQuantile,
  getQuantileData,
} from "../../components/styled/findQuantiles";
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
  const totalThrows = simstats[0].ROLLS;

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
  const bars: Line[] = [];
  const labels: Txt[] = [];

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
    const point = new Vector2(diceData[index].throw, diceData[index].pct * 100);
    const line = plot().vLine(point, {
      stroke: Bright.BLUE,
      lineWidth: 140,
      opacity: 1,
      end: 0,
    });
    bars.push(line);

    const pct = (diceData[index].pct * 100).toFixed(2);
    const label = plot().text(point, {
      ...PoppinsWhite,
      text: pct,
      offsetY: 1.5,
      fill: Grays.BLACK,
      fontWeight: 500,
      fontSize: 60,
      opacity: 0,
    });
    label.add(
      <Txt
        text="%"
        fontSize={50}
      />
    );
    labels.push(label);
  }

  // ************************
  // END FACTOR
  // ************************

  yield* sequence(0.1, ...bars.map((line) => line.end(1, 1, easeOutCubic)));
  yield* sequence(0.1, ...labels.map((pct) => pct.opacity(1, 0.6)));

  yield* waitFor(10);
  yield* waitUntil("end");
});
