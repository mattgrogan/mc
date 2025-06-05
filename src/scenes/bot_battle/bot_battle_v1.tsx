import { Gradient, Layout, Line, makeScene2D } from "@motion-canvas/2d";
import {
  createRef,
  createSignal,
  debug,
  easeOutCubic,
  linear,
  makeRefs,
  PossibleVector2,
  SignalValue,
  SimpleSignal,
  Vector2,
  waitFor,
} from "@motion-canvas/core";
import { PlotArea } from "../../components/styled/plotArea";
import { Plot } from "../../components/plot/plot";
import { Grays } from "../../styles";

// import simData1 from "../../../../dicedata/output/three_point_molly_working-100k/three_point_molly_working-100k-best-AlwaysWorking-1.json";
// import simData2 from "../../../../dicedata/output/three_point_molly_working-100k/three_point_molly_working-100k-best-AlwaysWorking-2.json";
// import simData3 from "../../../../dicedata/output/three_point_molly_working-100k/three_point_molly_working-100k-best-AlwaysWorking-3.json";
// import simData1 from "../../../../dicedata/output/ats_hedge-100k-600/sessions/ats_hedge-100k-600-best-ATS_Lay-1.json";
// import simData2 from "../../../../dicedata/output/ats_hedge-100k-600/sessions/ats_hedge-100k-600-best-ATS_Lay-2.json";
// import simData3 from "../../../../dicedata/output/ats_hedge-100k-600/sessions/ats_hedge-100k-600-best-ATS_Lay-3.json";
import bbData from "../../../../dicedata/output/three_point_molly_working-100k/bot_battle/AlwaysWorking/battle_export.json";

import { tw_colors } from "../../tw_colors";

const gradient = new Gradient({
  type: "radial",
  from: -100,
  to: -100,
  toRadius: 320,
  stops: [
    { offset: 0, color: "#f3303f" },
    { offset: 0.6, color: "#FFC66D" },
    { offset: 1, color: "#4aaaf1" },
  ],
});

const X_AXIS_MIN = 0;
const X_AXIS_MAX = 120;
const X_AXIS_STEP = 20;
const X_TICKS_EVERY = 1;

const Y_AXIS_MIN = -4000;
const Y_AXIS_MAX = 4000;
const Y_AXIS_STEP = 1000;
const Y_TICKS_EVERY = 1;

export default makeScene2D(function* (view) {
  view.fill("#222");
  yield* waitFor(1);

  //
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
      padding={100}
      layout
    ></Layout>
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
      //   position={() => plotArea.layout.position().addY(-250)}
      xMin={X_AXIS_MIN - 1}
      xMax={X_AXIS_MAX}
      yMin={Y_AXIS_MIN}
      yMax={Y_AXIS_MAX}
      width={plotArea.rect.width() * 0.9}
      height={plotArea.rect.height() * 1}
      xAxisProps={{
        opacity: 1,
        stroke: Grays.GRAY2,
        axisLineWidth: 5,
        end: 0,
        tickLength: 30,
      }}
      yAxisProps={{
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
    ></Plot>
  );

  // START DRAWING THE COMPONENTS HERE
  // =================================
  plotArea.container.opacity(1);

  // --------------- both axes ----------------
  yield* plot().xAxis.end(1, 0.6, easeOutCubic);
  yield* plot().yAxis.end(1, 0.6, easeOutCubic);
  plot().xAxis.updateTicks(X_AXIS_MIN, X_AXIS_MAX, X_AXIS_STEP, X_TICKS_EVERY);
  plot().yAxis.updateTicks(Y_AXIS_MIN, Y_AXIS_MAX, Y_AXIS_STEP, Y_TICKS_EVERY);

  // --------------- create lines ----------------

  const rollNo = createSignal(0);

  // Extract line coordinates in plot space
  const bankrollCoords: Record<number, Vector2[]> = {};
  const bankrollPoints: Record<number, SignalValue<PossibleVector2>[]> = {};

  for (const row of bbData) {
    if (!bankrollCoords[row.SESSION]) {
      // Ensure the session exists
      bankrollCoords[row.SESSION] = [];
    }
    const vector = new Vector2(
      row.SESSION_ROLL + row.SESSION / 20,
      row.NET_BR_END + row.SESSION * 10
    );
    bankrollCoords[row.SESSION].push(vector);
  }

  // Create each line
  const lines: Record<number, Line> = {};
  for (const session in bankrollCoords) {
    const line = plot().steppedLine([0, 0], bankrollCoords[session], {
      opacity: 0,
    });
    bankrollPoints[session] = line.points();

    lines[session] = plot().steppedLine(
      [0, 0],
      [0, 0],

      {
        lineWidth: 5,
        opacity: 0.5,
        stroke:
          "#" +
          (0x1000000 + Math.random() * 0xffffff).toString(16).substr(1, 6),
        end: 1,
      }
    );
    lines[session].points(() => bankrollPoints[session].slice(0, rollNo()));
  }
  // const extractData = (bbData: any, session: number): PossibleVector2[] =>
  //   bbData
  //     .filter(({ session }) => session === session)
  //     .map(({ session_roll, NET_BR_END }) => [session_roll, NET_BR_END]);

  //   for (let i = 0; i < 11; i++) {
  //     const line = plot().steppedLinePoints([0, 0], extractData(bbData, i));
  //   }

  //   const extracted1 = simData1.map(
  //     ({ ROLL, NET_BR_END }) => new Vector2(ROLL, NET_BR_END)
  //   );
  //   const line1 = plot().steppedLine([0, 0], extracted1, {
  //     lineWidth: 5,
  //     stroke: tw_colors.blue[500],
  //     end: 0,
  //   });
  //   // --------------- draw a line ----------------
  //   const extracted2 = simData2.map(
  //     ({ ROLL, NET_BR_END }) => new Vector2(ROLL, NET_BR_END)
  //   );
  //   const line2 = plot().steppedLine([0, 0], extracted2, {
  //     lineWidth: 5,
  //     stroke: tw_colors.emerald[500],
  //     end: 0,
  //   });
  //   // --------------- draw a line ----------------
  //   const extracted3 = simData3.map(
  //     ({ ROLL, NET_BR_END }) => new Vector2(ROLL, NET_BR_END)
  //   );
  //   const line3 = plot().steppedLine([0, 0], extracted3, {
  //     lineWidth: 5,
  //     stroke: tw_colors.indigo[500],
  //     end: 0,
  //   });

  yield* waitFor(5);

  //   const points1 = line1.points();
  //   line1.points(() => points1.slice(0, rollNo()));
  //   line1.end(1);

  //   const points2 = line2.points();
  //   line2.points(() => points2.slice(0, rollNo()));
  //   line2.end(1);

  //   const points3 = line3.points();
  //   line3.points(() => points3.slice(0, rollNo()));
  //   line3.end(1);

  yield* rollNo(400, 60, linear);

  // TODO: Need to create an array of just the points, so that I can tick through the rolls
  // TODO: Colors
  // TODO: Add points where they end
  // TODO: Scaling for x axis
  // TODO: Add label for roll #

  //   yield* line1.end(1, 1, easeOutCubic);
  //   yield* line1.stroke("gray", 0.2);
  //   yield* line2.end(1, 1, easeOutCubic);
  //   yield* line2.stroke("gray", 0.2);
  //   yield* line3.end(1, 1, easeOutCubic);
  //   yield* line3.stroke("gray", 0.2);

  yield* waitFor(20);
});
