import {
  Circle,
  Icon,
  Layout,
  Line,
  makeScene2D,
  Rect,
  Txt,
} from "@motion-canvas/2d";
import {
  all,
  createEffect,
  createRef,
  createSignal,
  delay,
  easeInOutCubic,
  easeOutCubic,
  linear,
  makeRefs,
  range,
  sequence,
  SimpleSignal,
  spawn,
  Vector2,
  waitFor,
} from "@motion-canvas/core";
import { PlotArea } from "../../components/styled/plotArea";
import { Plot, PlotSpace } from "../../components/plot/plot";
import { Grays, PoppinsBlack, PoppinsWhite } from "../../styles";
import { RollText } from "../../utils/RollText";

import bbData from "../../../../dicedata/output/three_point_molly_working-100k/bot_battle/AlwaysWorking/battle_export.json";

import {
  commaFormmatter,
  plusCommaFormmatter,
} from "../../components/styled/findQuantiles";
import { tw_colors } from "../../tw_colors";

const X_AXIS_MIN = 0;
const X_AXIS_MAX = 130;
const X_AXIS_STEP = 10;
const X_TICKS_EVERY = 5;

const Y_AXIS_MIN = -4000;
const Y_AXIS_MAX = 4000;
const Y_AXIS_STEP = 1000;
const Y_TICKS_EVERY = 1;

const SECS_PER_THROW = 1;

export default makeScene2D(function* (view) {
  view.fill("#222");
  yield* waitFor(1);

  // --------------- signals ----------------
  const handSignal = createSignal(9);
  const throwSignal = createSignal(0);
  const currentHand = bbData.HANDS[handSignal()];
  const throwRollText = createRef<RollText>();

  // Determine the size of the axis
  const x_axis_min = 0;
  const x_axis_max = Math.ceil(currentHand.N_SHOOTER_ROLLS / 5) * 5;
  const { yMin, yMax, yStep } = getYAxisLimitsAndStep(
    currentHand.MIN_BR,
    currentHand.MAX_BR
  );

  // --------------- container ----------------
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

  // --------------- counter ----------------
  const counter = createRef<Rect>();
  view.add(
    <Rect
      ref={counter}
      width={"20%"}
      height={"10%"}
      fill={tw_colors.zinc[950]}
      stroke={tw_colors.zinc[500]}
      lineWidth={2}
      offset={[-1, -1]}
      position={[-1800, -1000]}
      layout
      direction={"row"}
      opacity={0}
    >
      <Rect
        height={"100%"}
        width={"50%"}
        direction={"column"}
      >
        <Rect
          height={"40%"}
          alignItems={"center"}
          justifyContent={"center"}
        >
          <Txt
            {...PoppinsWhite}
            fontSize={60}
            text={"HAND"}
          ></Txt>
        </Rect>
        <Rect
          height={"60%"}
          alignItems={"center"}
          justifyContent={"center"}
        >
          <Txt
            {...PoppinsWhite}
            fontSize={100}
            text={() => (handSignal() + 1).toFixed(0)}
          ></Txt>
        </Rect>
      </Rect>
      <Rect
        height={"100%"}
        width={"50%"}
        direction={"column"}
      >
        <Rect
          height={"40%"}
          alignItems={"center"}
          justifyContent={"center"}
        >
          <Txt
            {...PoppinsWhite}
            fontSize={60}
            text={"THROW"}
          ></Txt>
        </Rect>
        <Rect
          height={"60%"}
          alignItems={"center"}
          justifyContent={"center"}
          clip
        >
          <RollText
            ref={throwRollText}
            initialText={"-"}
            offsetY={1}
            width={200}
            height={200}
            position={[0, 100]}
            txtProps={{ ...PoppinsWhite, fontSize: 100 }}
          />
          {/* <Txt
            {...PoppinsWhite}
            fontSize={100}
            text={() => throwSignal().toFixed(0)}
          ></Txt> */}
        </Rect>
      </Rect>
    </Rect>
  );

  createEffect(() => {
    console.log("Signal changed: ", throwSignal());
    spawn(throwRollText().next(throwSignal().toFixed(0)));
  });

  // --------------- plotArea ----------------
  const plotArea = makeRefs<typeof PlotArea>();
  container().add(
    <PlotArea
      refs={plotArea}
      // height={plotArea.rect.height() * 0.9}
      props={{
        width: "60%",
        height: "70%",
        margin: 200,
        // fill: Theme.BG,
        // stroke: Grays.GRAY1,
      }}
    ></PlotArea>
  );

  // --------------- leaderboard area ----------------
  const leaderboardArea = createRef<Layout>();
  // The Items layout disables layout, so each Rect can be positioned
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
      ></Layout>
    </Layout>
  );

  // --------------- plot ----------------
  const plot = createRef<Plot>();
  plotArea.layout.add(
    <Plot
      ref={plot}
      clip={false}
      xMin={x_axis_min}
      xMax={x_axis_max}
      yMin={yMin}
      yMax={yMax}
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
        fontSize: 80,
        lineToLabelPadding: 20,
      }}
      yLabelProps={{
        fill: Grays.WHITE,
        decimalNumbers: 0,
        fontSize: 50,
        lineToLabelPadding: -60,
      }}
      yTitleProps={{
        fill: Grays.WHITE,
        text: "Win Amount",
        lineToLabelPadding: -250,
        rotation: -90,
        opacity: 0,
        fontSize: 60,
      }}
      xTitleProps={{
        fill: Grays.WHITE,
        text: "Throw",
        lineToLabelPadding: 200,
        opacity: 0,
        fontSize: 60,
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
    // plotCircle: Circle;
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
    };

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
        fill={() => (!botSignal.isFinishedSignal() ? "white" : "gray")}
        opacity={0}
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

  // --------------- create lines ----------------
  const bankrollLines: Line[] = [];
  const bankrollLineGenerators = [];

  // --------------- both axes ----------------
  yield* plot().xAxis.end(1, 0.6, easeOutCubic);
  yield* plot().yAxis.end(1, 0.6, easeOutCubic);
  // yield* plot().rescale(
  //   0,
  //   Math.ceil(currentHand.N_SHOOTER_ROLLS / 5) * 5,
  //   5,
  //   currentHand.MIN_BR,
  //   currentHand.MAX_BR,
  //   500,
  //   1
  // );
  plot().xAxis.updateTicks(x_axis_min, x_axis_max, 1, X_TICKS_EVERY);
  plot().yAxis.updateTicks(yMin, yMax, yStep, Y_TICKS_EVERY);
  // plot().yAxis.updateTicks(Y_AXIS_MIN, Y_AXIS_MAX, Y_AXIS_STEP, Y_TICKS_EVERY);
  yield* counter().opacity(1, 0.5);
  yield* plot().xTitle.opacity(1, 0.5);
  yield* plot().yTitle.opacity(1, 0.5);

  yield* waitFor(2);

  // Create one line for each bot
  for (let i = 0; i < bbData.N_BOTS; i++) {
    const yOffset = i * 5;
    const xOffset = i / 10;
    const coords = currentHand.BOTS[i].THROWS.filter(
      (item) => !item.IS_FINISHED
    ).map(
      (item) =>
        new Vector2(
          Math.min(item.SHOOTER_ROLL + xOffset, currentHand.N_SHOOTER_ROLLS),
          item.NET_BR_END + yOffset
        )
    );
    const line = plot().steppedLine([0, currentHand.BOTS[i].START_BR], coords, {
      lineWidth: 10,
      opacity: 0.8,
      stroke: bbData.BOTS[i].COLOR,
      end: 0,
    });
    bankrollLines.push(line);

    // Set the starting positions
    botSignals[i].ordinalRankSignal(currentHand.BOTS[i].START_ORD_RANK);
    botSignals[i].rankSignal(currentHand.BOTS[i].START_RANK);
    botSignals[i].amountSignal(currentHand.BOTS[i].START_BR);

    // Calculate the time for the line animation
    const botPlaySecs = currentHand.BOTS[i].MAX_SHOOTER_ROLL * SECS_PER_THROW;

    // Generate the line animation for only the amount of time relating to the length
    bankrollLineGenerators.push(line.end(1, botPlaySecs, linear));

    // Show the complete flag
    bankrollLineGenerators.push(
      delay(botPlaySecs, () => botSignals[i].isFinishedSignal(true))
    );

    // Decrease opacity
    bankrollLineGenerators.push(
      delay(botPlaySecs, line.opacity(0.2, SECS_PER_THROW * 2))
    );

    // Update the rank every 5th roll or at the last roll
    function filterShooterRoll<T extends { SHOOTER_ROLL: number }>(
      data: T[]
    ): T[] {
      return data.filter(
        (item, index, array) =>
          item.SHOOTER_ROLL % 5 === 0 || index === array.length - 1
      );
    }

    // const throws = filterShooterRoll(currentHand.BOTS[i].THROWS);
    const throws = currentHand.BOTS[i].THROWS;
    for (const t of throws) {
      bankrollLineGenerators.push(
        delay(
          t.SHOOTER_ROLL * SECS_PER_THROW,
          botSignals[i].ordinalRankSignal(t.ORDINAL_RANK, SECS_PER_THROW * 1)
        )
      );
      bankrollLineGenerators.push(
        delay(
          t.SHOOTER_ROLL * SECS_PER_THROW,

          botSignals[i].rankSignal(t.RANK, SECS_PER_THROW * 1)
        )
      );
      bankrollLineGenerators.push(
        delay(
          t.SHOOTER_ROLL * SECS_PER_THROW,
          botSignals[i].amountSignal(t.NET_BR_END, SECS_PER_THROW * 1)
        )
      );
    }
  }

  yield* sequence(0.2, ...leaderboards.map((board) => board.opacity(1, 1)));
  // Add updates for the throw
  range(currentHand.N_SHOOTER_ROLLS).map((index) =>
    bankrollLineGenerators.push(
      delay(index * SECS_PER_THROW, throwSignal(index + 1, 0.01))
    )
  );

  // Animate the lines
  // yield* all(...bankrollLines.map((l) => l.end(1, 10, linear)));
  yield* all(...bankrollLineGenerators);

  // Show the ending numbers
  for (let i = 0; i < bbData.N_BOTS; i++) {
    yield botSignals[i].ordinalRankSignal(currentHand.BOTS[i].END_ORD_RANK, 1);
    yield botSignals[i].rankSignal(currentHand.BOTS[i].END_RANK, 1);
    yield botSignals[i].amountSignal(currentHand.BOTS[i].END_BR, 1);
  }

  yield* waitFor(20);
});

function getYAxisLimitsAndStep(minData: number, maxData: number) {
  const niceSteps = [50, 100, 200, 500, 1000, 2000, 5000, 10000];
  const range = maxData - minData;
  const padding = range * 0.1;

  const rawMin = minData - padding;
  const rawMax = maxData + padding;

  const rawRange = rawMax - rawMin;

  // Pick a nice step size
  let yStep = niceSteps[0];
  for (const s of niceSteps) {
    if (rawRange / s <= 10) {
      // Aim for ~10 ticks max
      yStep = s;
      break;
    }
  }

  // Snap min and max to nearest step multiples
  const yMin = Math.floor(rawMin / yStep) * yStep;
  const yMax = Math.ceil(rawMax / yStep) * yStep;

  return { yMin, yMax, yStep };
}
