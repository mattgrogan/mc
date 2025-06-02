import {
  Circle,
  Gradient,
  Icon,
  Layout,
  Line,
  makeScene2D,
  Rect,
  Txt,
} from "@motion-canvas/2d";
import {
  all,
  createRef,
  createSignal,
  debug,
  easeOutCubic,
  linear,
  makeRefs,
  PossibleVector2,
  SignalValue,
  SimpleSignal,
  useLogger,
  Vector2,
  waitFor,
} from "@motion-canvas/core";
import { PlotArea } from "../../components/styled/plotArea";
import { Plot, PlotSpace } from "../../components/plot/plot";
import { Grays, PoppinsBlack } from "../../styles";

import bbData from "../../../../dicedata/bot_battle_test2.json";

import { tw_colors } from "../../tw_colors";
import {
  commaFormmatter,
  plusCommaFormmatter,
} from "../../components/styled/findQuantiles";

const X_AXIS_MIN = 0;
const X_AXIS_MAX = 130;
const X_AXIS_STEP = 10;
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
      direction={"row"}
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
      // height={plotArea.rect.height() * 0.9}
      props={{
        width: "66%",
        height: "90%",
        margin: 100,
        // fill: Theme.BG,
        // stroke: Grays.GRAY1,
      }}
    ></PlotArea>
  );

  // --------------- plotArea ----------------
  const leaderboardArea = createRef<Layout>();
  const leaderboardAreaItems = createRef<Layout>();
  container().add(
    <Layout
      ref={leaderboardArea}
      width={"33%"}
      height={"90%"}
    >
      <Layout
        layout={false}
        ref={leaderboardAreaItems}
        // direction={"column"}
        // stroke: Grays.GRAY1,
      ></Layout>
    </Layout>
  );

  // --------------- plot ----------------
  const plot = createRef<Plot>();
  plotArea.layout.add(
    <Plot
      ref={plot}
      clip={false}
      //   position={() => plotArea.layout.position().addY(-250)}
      xMin={X_AXIS_MIN - 1}
      xMax={X_AXIS_MAX}
      yMin={Y_AXIS_MIN}
      yMax={Y_AXIS_MAX}
      width={plotArea.rect.width() * 1}
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

  // --------------- leaderboard ----------------
  const leaderboards: Rect[] = [];

  interface botWithSignals {
    ordinalRankSignal: SimpleSignal<number>;
    rankSignal: SimpleSignal<number>;
    amountSignal: SimpleSignal<number>;
    isFinishedSignal: SimpleSignal<boolean>;
    plotLine: Line;
    plotCircle: Circle;
  }
  const botSignals: botWithSignals[] = [];

  for (const bot of bbData.BOTS) {
    // Initialize the signals for each bot
    const botSignal: botWithSignals = {
      ordinalRankSignal: createSignal(bot.SESSION),
      rankSignal: createSignal(0),
      amountSignal: createSignal(0),
      isFinishedSignal: createSignal(false),
      plotLine: plot().steppedLine([0, 0], [[0, 0]], {
        lineWidth: 5,
        opacity: 1,
        stroke: bot.COLOR,
        end: 1,
      }),
      plotCircle: plot().circle([0, 0], {
        width: 30,
        height: 30,
        fill: bot.COLOR,
        opacity: 1,
      }),
    };

    // Create a line for each bot

    botSignals.push(botSignal);

    // @ts-expect-error
    const board: Rect = (
      <Rect
        layout={true}
        direction={"row"}
        justifyContent={"start"}
        // alignContent={"center"}
        alignItems={"center"}
        // textAlign={"left"}
        gap={20}
        padding={20}
        width={leaderboardArea().width()}
        height={100}
        fill={"white"}
        opacity={0.8}
        // stroke={"red"}
        // lineWidth={2}
        y={() =>
          leaderboardArea().top().y + 120 * botSignal.ordinalRankSignal()
        }
        //   y={() => leaderboardArea().top().y + 120 * ordinalRanks[bot.SESSION]()}
      >
        {/* <Layout direction="row"> */}
        <Txt
          text={() =>
            commaFormmatter(Math.round(botSignal.rankSignal()), 0, "-")
          }
          width={"5%"}
          {...PoppinsBlack}
        ></Txt>
        <Layout width={"5%"}>
          <Circle
            size={60}
            fill={bot.COLOR}
          ></Circle>
        </Layout>

        <Txt
          text={bot.BOT_NAME}
          width={"50%"}
          {...PoppinsBlack}
          fontWeight={700}
        ></Txt>
        <Txt
          text={() => plusCommaFormmatter(botSignal.amountSignal(), 0)}
          width={"25%"}
          alignSelf={"end"}
          textAlign={"right"}
        ></Txt>

        <Layout width={"5%"}>
          <Icon
            icon={"material-symbols:arrow-upward"}
            size={() => (botSignal.amountSignal() > 0 ? 60 : 0)}
            color={"green"}
          ></Icon>
          <Icon
            icon={"material-symbols:arrow-downward"}
            size={() => (botSignal.amountSignal() < 0 ? 60 : 0)}
            color={"red"}
          ></Icon>
        </Layout>
        <Layout width={"5%"}>
          <Icon
            icon={"gis:flag-finish"}
            size={() => (botSignal.isFinishedSignal() ? 60 : 0)}
            color={"black"}
          ></Icon>
        </Layout>
        {/* </Layout> */}
      </Rect>
    );
    leaderboards.push(board);
    leaderboardAreaItems().add(board);
  }

  const rollNo = createSignal(0);
  //   const ordinalRanks: Record<number, SimpleSignal<number>> = {};
  //   const amounts: Record<number, SimpleSignal<number>> = {};
  //   const ranks: Record<number, SimpleSignal<number>> = {};
  //   const maxRoll: Record<number, number> = {};
  //   //   const pctComplete: Record<number, SimpleSignal<number>> = {};
  //   const firstRoll = bbData.filter(({ SESSION_ROLL }) => SESSION_ROLL === 1);
  //   for (const bot of firstRoll) {
  //     ordinalRanks[bot.SESSION] = createSignal(bot.ORDINAL_RANK);
  //     amounts[bot.SESSION] = createSignal(0);
  //     ranks[bot.SESSION] = createSignal(0);
  //     // pctComplete[bot.SESSION] = createSignal(0);

  //     leaderboards[bot.SESSION] = (
  //       <Rect
  //         layout={true}
  //         direction={"row"}
  //         justifyContent={"start"}
  //         // alignContent={"center"}
  //         alignItems={"center"}
  //         // textAlign={"left"}
  //         gap={20}
  //         padding={20}
  //         width={leaderboardArea().width()}
  //         height={100}
  //         fill={"white"}
  //         opacity={0.8}
  //         // stroke={"red"}
  //         // lineWidth={2}
  //         y={() => leaderboardArea().top().y + 120 * ordinalRanks[bot.SESSION]()}
  //       >
  //         {/* <Layout direction="row"> */}
  //         <Txt
  //           text={() => Math.round(ranks[bot.SESSION]()).toString()}
  //           width={"5%"}
  //           {...PoppinsBlack}
  //         ></Txt>
  //         <Layout width={"5%"}>
  //           <Circle
  //             size={60}
  //             fill={bot.COLOR}
  //           ></Circle>
  //         </Layout>

  //         <Txt
  //           text={bot.BOT_NAME}
  //           width={"50%"}
  //           {...PoppinsBlack}
  //           fontWeight={700}
  //         ></Txt>
  //         <Txt
  //           text={() => plusCommaFormmatter(amounts[bot.SESSION](), 0)}
  //           width={"25%"}
  //           alignSelf={"end"}
  //           textAlign={"right"}
  //         ></Txt>

  //         <Layout width={"5%"}>
  //           <Icon
  //             icon={"material-symbols:arrow-upward"}
  //             size={() => (amounts[bot.SESSION]() > 0 ? 60 : 0)}
  //             color={"green"}
  //           ></Icon>
  //           <Icon
  //             icon={"material-symbols:arrow-downward"}
  //             size={() => (amounts[bot.SESSION]() < 0 ? 60 : 0)}
  //             color={"red"}
  //           ></Icon>
  //         </Layout>
  //         <Layout width={"5%"}>
  //           <Icon
  //             icon={"gis:flag-finish"}
  //             size={() => (rollNo() < maxRoll[bot.SESSION] ? 0 : 60)}
  //             color={"black"}
  //           ></Icon>
  //         </Layout>
  //         {/* </Layout> */}
  //       </Rect>
  //     );
  //     leaderboardAreaItems().add(leaderboards[bot.SESSION]);
  //   }

  //   // --------------- both axes ----------------
  yield* plot().xAxis.end(1, 0.6, easeOutCubic);
  yield* plot().yAxis.end(1, 0.6, easeOutCubic);
  plot().xAxis.updateTicks(X_AXIS_MIN, X_AXIS_MAX, X_AXIS_STEP, X_TICKS_EVERY);
  plot().yAxis.updateTicks(Y_AXIS_MIN, Y_AXIS_MAX, Y_AXIS_STEP, Y_TICKS_EVERY);

  //   // --------------- create lines ----------------

  //   // Extract line coordinates in plot space

  //   const bankrollCoords: Record<number, Vector2[]> = {};
  //   const colors: Record<number, string> = {};

  //   for (const row of bbData) {
  //     if (!bankrollCoords[row.SESSION]) {
  //       // Ensure the session exists
  //       bankrollCoords[row.SESSION] = [];
  //     }

  //     if (!maxRoll[row.SESSION]) {
  //       // Ensure the session exists
  //       maxRoll[row.SESSION] = 0;
  //     }

  //     const vector = new Vector2(
  //       row.SESSION_ROLL + row.SESSION / 20,
  //       row.NET_BR_END + row.SESSION * 10
  //     );
  //     bankrollCoords[row.SESSION].push(vector);
  //     maxRoll[row.SESSION] = Math.max(maxRoll[row.SESSION], row.SESSION_ROLL);
  //     colors[row.SESSION] = row.COLOR;
  //   }

  //   // Create each line
  //   const lines: Record<number, Line> = {};
  //   for (const session in bankrollCoords) {
  //     lines[session] = plot().steppedLine([0, 0], [], {
  //       lineWidth: 5,
  //       opacity: 0.8,
  //       stroke: () => (rollNo() < maxRoll[session] ? colors[session] : "gray"),
  //       // end: () => rollNo() / maxRoll[session],
  //       //   end: () => pctComplete[session](),
  //       end: 1,
  //     });
  //   }

  //   // Create a dot at the end
  //   const dots: Record<number, Circle> = {};
  //   for (const session in bankrollCoords) {
  //     const lastCoord = bankrollCoords[session].at(-1);
  //     dots[session] = plot().circle(lastCoord, {
  //       width: 30,
  //       height: 30,
  //       fill: colors[session],
  //       opacity: () => (rollNo() < maxRoll[session] ? 0 : 1),
  //     });
  //   }

  // Create a vertical line
  const point1 = () => plot().c2p(new Vector2(rollNo(), 4000), PlotSpace.LOCAL);
  const point2 = () =>
    plot().c2p(new Vector2(rollNo(), -4000), PlotSpace.LOCAL);
  const line = (
    <Line
      points={[point1, point2]}
      lineWidth={10}
      stroke="gray"
      lineDash={[20, 5]}
      zIndex={-100}
    ></Line>
  );
  plot().add(line);

  //   yield* waitFor(3); // This holds off the axis drawing

  //   // yield* rollNo(200, 60, linear);

  const DELAY = 1;

  //   for (let i = 0; i < 250; i++) {
  //     yield rollNo(rollNo() + 1, DELAY, linear);

  //     const rollData = bbData.filter(
  //       ({ SESSION_ROLL }) => SESSION_ROLL === Math.floor(rollNo())
  //     );

  //     for (const bot of rollData) {
  //       // Only update ranks every 5th roll
  //       if (i % 1 == 0 || i > 50) {
  //         yield ordinalRanks[bot.SESSION](bot.ORDINAL_RANK, DELAY, linear);
  //         yield ranks[bot.SESSION](bot.RANK, DELAY, linear);
  //       }
  //       yield amounts[bot.SESSION](bot.NET_BR_END, DELAY, linear);

  //       // Find the point along the horizontal axis

  //       // Find the old length to get the percentage so it can be animated
  //       const oldLength = lines[bot.SESSION].baseArcLength();
  //       lines[bot.SESSION].points([...lines[bot.SESSION].points(), ...newPoints]);
  //       lines[bot.SESSION].end(
  //         lines[bot.SESSION].distanceToPercentage(oldLength)
  //       );
  //       useLogger().debug(
  //         lines[bot.SESSION].distanceToPercentage(oldLength).toString()
  //       );
  //       const newLength = lines[bot.SESSION].baseArcLength();
  //       //   useLogger().debug({
  //       //     message: "line length",
  //       //     object: { old: oldLength, new: newLength },
  //       //   });
  //       yield lines[bot.SESSION].end(1, DELAY, linear);
  //     }

  //     // Rescale at 16 to 50
  //     // yield plot().rescale(
  //     //   0,
  //     //   i + 10,
  //     //   10,
  //     //   Y_AXIS_MIN,
  //     //   Y_AXIS_MAX,
  //     //   Y_AXIS_STEP,
  //     //   DELAY
  //     // );

  //     yield* waitFor(DELAY);
  //   }

  for (const bbThrow of bbData.THROWS) {
    // Increase the roll number
    yield rollNo(bbThrow.SESSION_ROLL, DELAY, linear);

    // Loop through each bot and update the signals
    for (const [botIndex, bot] of bbThrow.BOT_THROWS.entries()) {
      yield botSignals[botIndex].amountSignal(bot.NET_BR_END, DELAY, linear);
      yield botSignals[botIndex].rankSignal(bot.RANK, DELAY, linear);
      yield botSignals[botIndex].ordinalRankSignal(
        bot.ORDINAL_RANK,
        DELAY / 4,
        linear
      );
      yield botSignals[botIndex].isFinishedSignal(
        bot.IS_FINISHED,
        DELAY,
        linear
      );

      if (!bot.IS_FINISHED) {
        // Save the existing length of the line
        const prevLength = botSignals[botIndex].plotLine.baseArcLength();

        // Calculate the new points
        const newPoints = plot().steppedLinePoints(
          [bbThrow.SESSION_ROLL - 1, bot.PREV_NET_BR_END],
          [[bbThrow.SESSION_ROLL, bot.NET_BR_END]]
        );

        // Add the new points ot the line
        botSignals[botIndex].plotLine.points([
          ...botSignals[botIndex].plotLine.points(),
          ...newPoints,
        ]);

        // Set the end percentage to match the previous length
        const pctComplete =
          botSignals[botIndex].plotLine.distanceToPercentage(prevLength);
        botSignals[botIndex].plotLine.end(pctComplete);

        // Now animate the drawing
        yield botSignals[botIndex].plotLine.end(1, DELAY, linear);

        // // Update the circle
        // const circlePoint = plot().c2p(
        //   [bbThrow.SESSION_ROLL, bot.NET_BR_END],
        //   PlotSpace.LOCAL
        // );
        // yield botSignals[botIndex].plotCircle.position(
        //   circlePoint,
        //   DELAY,
        //   linear
        // );
      }
    }
    yield* waitFor(DELAY);
  }

  //   // TODO: Make sure it updates again at the end. Maybe after a certain percentage it updates more frequently.

  //   // yield* rollNo(16, 8, linear);
  //   // yield plot().rescale(15, 50, 5, Y_AXIS_MIN, Y_AXIS_MAX, Y_AXIS_STEP, 5);
  //   // yield* rollNo(50, 25, linear);

  //   // TODO: Scaling for x axis
  //   // TODO: Add label for roll #

  yield* waitFor(20);
});
