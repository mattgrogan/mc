import { Gradient, Layout, Line, makeScene2D, Txt } from "@motion-canvas/2d";
import {
  createRef,
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

const X_MAX = 120;
const Y_MAX = 40;
const QUANTILES_ID = "SHOOTER_ROLL_BY_SHOOTER";

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
      headerProps={{ ...PoppinsWhite }}
      subheadProps={{ ...PoppinsWhite }}
    >
      NUMBER OF DICE ROLLS
    </TitleBox>
  );
  plotTitle.subhead.text("BY SHOOTER");

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
  const tableData = getQuantileData(QUANTILES_ID, quantiles);

  tableData.push({
    label: "AVG",
    value: (simstats[0].ROLLS / simstats[0].SHOOTERS).toFixed(2),
  });

  // Create the data table and pass in the references
  container().add(
    <DataTable
      refs={dataTable}
      data={tableData}
      headerRectProps={{ fill: LightBlueGradient, stroke: Grays.GRAY1 }}
      valueRectProps={{ fill: silverGradient, stroke: Grays.GRAY1 }}
      headerTxtProps={{ ...PoppinsWhite }}
      valueTxtProps={{ ...PoppinsBlack }}
      fontSize={80}
    ></DataTable>
  );

  // Highlight the average separately
  dataTable.headerRects[7].fill(purpleGradient);

  // Plot is only added after all the layout has been completed.
  plotArea.layout.add(
    <Plot
      ref={plot}
      position={() => plotArea.layout.position()}
      xMin={0}
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
  plot().xAxis.updateTicks(0, X_MAX, 5);

  // Add the Min line
  const minValue = getQuantile(QUANTILES_ID, quantiles, 0);
  const maxValue = getQuantile(QUANTILES_ID, quantiles, 1);
  const minLine = plot().vLine([minValue, 4], {
    stroke: Grays.GRAY3,
    lineWidth: 6,
    end: 0,
    zIndex: -10, // THIS IS BEING OVERRIDEN
  });
  minLine.zIndex(0);

  // Add the Max line
  const maxLine = plot().vLine([maxValue, 4], {
    stroke: Grays.GRAY3,
    lineWidth: 6,
    end: 0,
  });

  // Try a box
  const lowerRangeBox = plot().box([0, 4], [minValue, 0], {
    fill: Grays.GRAY3,
    opacity: 0,
    zIndex: 200,
  });
  const upperRangeBox = plot().box([maxValue, 4], [X_MAX, 0], {
    fill: Grays.GRAY3,
    opacity: 0,
    zIndex: -200,
  });

  yield* waitFor(2);

  // ************************
  // FACTOR THIS STUFF OUT
  // ************************
  const bars: Line[] = [];
  const labels: Txt[] = [];

  for (let index = 0; index < rollsByShooter.length; index++) {
    const offset = 50;
    const point = new Vector2(
      rollsByShooter[index].MIDPOINT,
      rollsByShooter[index].PCT
    );
    const line = plot().vLine(point, {
      stroke: Bright.BLUE,
      lineWidth: 80,
      opacity: 1,
      end: 0,
    });
    if (rollsByShooter[index].COUNT > 0) {
      bars.push(line);
    }

    if (rollsByShooter[index].PCT >= 0.1) {
      const pct = rollsByShooter[index].PCT.toFixed(1);
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
  yield* maxLine.end(1, 0.6, easeOutCubic);
  yield* upperRangeBox.opacity(0.2, 0.6, linear);

  // Show the data table
  yield* sequence(0.1, ...dataTable.columns.map((pct) => pct.opacity(1, 0.6)));

  yield* waitFor(10);
  yield* waitUntil("end");
});