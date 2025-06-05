// bot_battle_refactored.tsx
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

// Constants
const ANIMATION_CONFIG = {
  SECS_PER_THROW: 1,
  X_TICKS_EVERY: 5,
  Y_TICKS_EVERY: 1,
  LEADERBOARD_FADE_DELAY: 0.2,
  AXIS_ANIMATION_DURATION: 0.6,
  COUNTER_FADE_DURATION: 0.5,
} as const;

const LAYOUT_CONFIG = {
  CONTAINER_GAP: 50,
  CONTAINER_PADDING: 100,
  LEADERBOARD_ITEM_HEIGHT: 100,
  LEADERBOARD_ITEM_SPACING: 120,
  PLOT_WIDTH_PERCENT: "60%",
  PLOT_HEIGHT_PERCENT: "70%",
  LEADERBOARD_WIDTH_PERCENT: "33%",
  COUNTER_WIDTH_PERCENT: "20%",
  COUNTER_HEIGHT_PERCENT: "10%",
} as const;

// Types
interface BotWithSignals {
  ordinalRankSignal: SimpleSignal<number>;
  rankSignal: SimpleSignal<number>;
  amountSignal: SimpleSignal<number>;
  isFinishedSignal: SimpleSignal<boolean>;
  plotLine: Line;
}

interface AxisLimits {
  yMin: number;
  yMax: number;
  yStep: number;
}

// Utility Functions
function getYAxisLimitsAndStep(minData: number, maxData: number): AxisLimits {
  const niceSteps = [50, 100, 200, 500, 1000, 2000, 5000, 10000];
  const range = maxData - minData;
  const padding = range * 0.1;

  const rawMin = minData - padding;
  const rawMax = maxData + padding;
  const rawRange = rawMax - rawMin;

  let yStep = niceSteps[0];
  for (const s of niceSteps) {
    if (rawRange / s <= 10) {
      yStep = s;
      break;
    }
  }

  const yMin = Math.floor(rawMin / yStep) * yStep;
  const yMax = Math.ceil(rawMax / yStep) * yStep;

  return { yMin, yMax, yStep };
}

function filterShooterRoll<T extends { SHOOTER_ROLL: number }>(data: T[]): T[] {
  return data.filter(
    (item, index, array) =>
      item.SHOOTER_ROLL % 5 === 0 || index === array.length - 1
  );
}

// Component Creation Functions
function createCounter(
  handSignal: SimpleSignal<number>,
  throwSignal: SimpleSignal<number>
) {
  const counter = createRef<Rect>();
  const throwRollText = createRef<RollText>();

  const counterElement = (
    <Rect
      ref={counter}
      width={LAYOUT_CONFIG.COUNTER_WIDTH_PERCENT}
      height={LAYOUT_CONFIG.COUNTER_HEIGHT_PERCENT}
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
        </Rect>
      </Rect>
    </Rect>
  );

  createEffect(() => {
    spawn(throwRollText().next(throwSignal().toFixed(0)));
  });

  return { counter, counterElement };
}

function createLeaderboardItem(
  bot: any,
  botSignal: BotWithSignals,
  leaderboardArea: Layout
) {
  return (
    <Rect
      layout={true}
      direction={"row"}
      justifyContent={"start"}
      alignItems={"center"}
      gap={20}
      padding={20}
      width={leaderboardArea.width()}
      height={LAYOUT_CONFIG.LEADERBOARD_ITEM_HEIGHT}
      fill={() => (!botSignal.isFinishedSignal() ? "white" : "gray")}
      opacity={0}
      y={() =>
        leaderboardArea.top().y +
        LAYOUT_CONFIG.LEADERBOARD_ITEM_SPACING * botSignal.ordinalRankSignal()
      }
    >
      <Txt
        text={() => commaFormmatter(Math.round(botSignal.rankSignal()), 0, "-")}
        width={"5%"}
        {...PoppinsBlack}
      />
      <Layout width={"5%"}>
        <Circle
          size={60}
          fill={bot.COLOR}
        />
      </Layout>
      <Txt
        text={bot.BOT_NAME}
        width={"50%"}
        {...PoppinsBlack}
        fontWeight={700}
      />
      <Txt
        text={() => plusCommaFormmatter(botSignal.amountSignal(), 0)}
        width={"25%"}
        alignSelf={"end"}
        textAlign={"right"}
      />
      <Layout width={"5%"}>
        <Icon
          icon={"material-symbols:arrow-upward"}
          size={() => (botSignal.amountSignal() > 0 ? 60 : 0)}
          color={"green"}
        />
        <Icon
          icon={"material-symbols:arrow-downward"}
          size={() => (botSignal.amountSignal() < 0 ? 60 : 0)}
          color={"red"}
        />
      </Layout>
      <Layout width={"5%"}>
        <Icon
          icon={"gis:flag-finish"}
          size={() => (botSignal.isFinishedSignal() ? 60 : 0)}
          color={"black"}
        />
      </Layout>
    </Rect>
  );
}

// Add this variable at the top level to track bankroll lines
let currentBankrollLines: Line[] = [];

// Updated createBotAnimations function to track the lines
function* createBotAnimations(
  currentHand: any,
  botSignals: BotWithSignals[],
  plot: Plot,
  throwSignal: SimpleSignal<number>
) {
  const bankrollLineGenerators = [];
  const bankrollLines: Line[] = [];

  // Create lines and animations for each bot
  for (let i = 0; i < bbData.N_BOTS; i++) {
    const bot = currentHand.BOTS[i];
    const yOffset = i * 5;
    const xOffset = i / 10;

    const coords = bot.THROWS.filter((item: any) => !item.IS_FINISHED).map(
      (item: any) =>
        new Vector2(
          Math.min(item.SHOOTER_ROLL + xOffset, currentHand.N_SHOOTER_ROLLS),
          item.NET_BR_END + yOffset
        )
    );

    const line = plot.steppedLine([0, bot.START_BR], coords, {
      lineWidth: 10,
      opacity: 0.8,
      stroke: bbData.BOTS[i].COLOR,
      end: 0,
    });
    bankrollLines.push(line);

    const botPlaySecs = bot.MAX_SHOOTER_ROLL * ANIMATION_CONFIG.SECS_PER_THROW;

    // Add line animation
    bankrollLineGenerators.push(line.end(1, botPlaySecs, linear));

    // Add completion flag
    bankrollLineGenerators.push(
      delay(botPlaySecs, () => botSignals[i].isFinishedSignal(true))
    );

    // Fade line after completion
    bankrollLineGenerators.push(
      delay(botPlaySecs, line.opacity(0.2, ANIMATION_CONFIG.SECS_PER_THROW * 2))
    );

    // Add signal updates for each throw
    const throws = bot.THROWS;
    for (const t of throws) {
      const delayTime = t.SHOOTER_ROLL * ANIMATION_CONFIG.SECS_PER_THROW;
      const duration = ANIMATION_CONFIG.SECS_PER_THROW * 1;

      bankrollLineGenerators.push(
        delay(
          delayTime,
          botSignals[i].ordinalRankSignal(t.ORDINAL_RANK, duration)
        )
      );
      bankrollLineGenerators.push(
        delay(delayTime, botSignals[i].rankSignal(t.RANK, duration))
      );
      bankrollLineGenerators.push(
        delay(delayTime, botSignals[i].amountSignal(t.NET_BR_END, duration))
      );
    }
  }

  // Add throw counter updates
  range(currentHand.N_SHOOTER_ROLLS).map((index) =>
    bankrollLineGenerators.push(
      delay(
        index * ANIMATION_CONFIG.SECS_PER_THROW,
        throwSignal(index + 1, 0.01)
      )
    )
  );

  // Store the lines for later cleanup
  currentBankrollLines = bankrollLines;

  return { bankrollLineGenerators, bankrollLines };
}

// Fixed clearBankrollLines function
function* clearBankrollLines(plot: Plot) {
  // Remove only the tracked bankroll lines
  for (const line of currentBankrollLines) {
    line.remove();
  }
  // Clear the tracking array
  currentBankrollLines = [];
}

function resetBotSignals(botSignals: BotWithSignals[], currentHand: any) {
  for (let i = 0; i < botSignals.length; i++) {
    const bot = currentHand.BOTS[i];
    botSignals[i].ordinalRankSignal(bot.START_ORD_RANK);
    botSignals[i].rankSignal(bot.START_RANK);
    botSignals[i].amountSignal(bot.START_BR);
    botSignals[i].isFinishedSignal(false);
  }
}

function* updatePlotForHand(plot: Plot, currentHand: any) {
  const x_axis_min = 0;
  const x_axis_max = Math.ceil(currentHand.N_SHOOTER_ROLLS / 5) * 5;
  const { yMin, yMax, yStep } = getYAxisLimitsAndStep(
    currentHand.MIN_BR,
    currentHand.MAX_BR
  );

  // Update plot bounds
  plot.xMin(x_axis_min);
  plot.xMax(x_axis_max);
  plot.yMin(yMin);
  plot.yMax(yMax);

  // Update ticks
  plot.xAxis.updateTicks(
    x_axis_min,
    x_axis_max,
    1,
    ANIMATION_CONFIG.X_TICKS_EVERY
  );
  plot.yAxis.updateTicks(yMin, yMax, yStep, ANIMATION_CONFIG.Y_TICKS_EVERY);
}

function* animateHandTransition(
  handSignal: SimpleSignal<number>,
  newHandIndex: number
) {
  yield* handSignal(newHandIndex, 0.5, easeInOutCubic);
  yield* waitFor(0.5);
}

// Main Scene Function
export default makeScene2D(function* (view) {
  view.fill("#222");
  yield* waitFor(1);

  // Signals
  const handSignal = createSignal(0); // Start at hand 1 (index 0)
  const throwSignal = createSignal(0);

  // Create main container
  const container = createRef<Layout>();
  view.add(
    <Layout
      ref={container}
      direction={"row"}
      justifyContent={"center"}
      alignItems={"center"}
      width={"100%"}
      height={"100%"}
      gap={LAYOUT_CONFIG.CONTAINER_GAP}
      padding={LAYOUT_CONFIG.CONTAINER_PADDING}
      layout
    />
  );

  // Create counter
  const { counter, counterElement } = createCounter(handSignal, throwSignal);
  view.add(counterElement);

  // Create plot area
  const plotArea = makeRefs<typeof PlotArea>();
  container().add(
    <PlotArea
      refs={plotArea}
      props={{
        width: LAYOUT_CONFIG.PLOT_WIDTH_PERCENT,
        height: LAYOUT_CONFIG.PLOT_HEIGHT_PERCENT,
        margin: 200,
      }}
    />
  );

  // Create leaderboard area
  const leaderboardArea = createRef<Layout>();
  const leaderboardAreaItems = createRef<Layout>();
  container().add(
    <Layout
      ref={leaderboardArea}
      width={LAYOUT_CONFIG.LEADERBOARD_WIDTH_PERCENT}
      height={"90%"}
    >
      <Layout
        layout={false}
        ref={leaderboardAreaItems}
      />
    </Layout>
  );

  // Create plot with initial hand data
  const initialHand = bbData.HANDS[0];
  const initial_x_max = Math.ceil(initialHand.N_SHOOTER_ROLLS / 5) * 5;
  const {
    yMin: initial_yMin,
    yMax: initial_yMax,
    yStep: initial_yStep,
  } = getYAxisLimitsAndStep(initialHand.MIN_BR, initialHand.MAX_BR);

  const plot = createRef<Plot>();
  plotArea.layout.add(
    <Plot
      ref={plot}
      clip={false}
      xMin={0}
      xMax={initial_x_max}
      yMin={initial_yMin}
      yMax={initial_yMax}
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
    />
  );

  // Initialize components
  plotArea.container.opacity(1);

  // Create bot signals and leaderboard items (these persist across hands)
  const botSignals: BotWithSignals[] = [];
  const leaderboards: Rect[] = [];

  for (const bot of bbData.BOTS) {
    const botSignal: BotWithSignals = {
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

    const board = createLeaderboardItem(bot, botSignal, leaderboardArea());
    leaderboards.push(board);
    leaderboardAreaItems().add(board);
  }

  // Initial setup animations
  yield* plot().xAxis.end(
    1,
    ANIMATION_CONFIG.AXIS_ANIMATION_DURATION,
    easeOutCubic
  );
  yield* plot().yAxis.end(
    1,
    ANIMATION_CONFIG.AXIS_ANIMATION_DURATION,
    easeOutCubic
  );
  yield* counter().opacity(1, ANIMATION_CONFIG.COUNTER_FADE_DURATION);
  yield* plot().xTitle.opacity(1, ANIMATION_CONFIG.COUNTER_FADE_DURATION);
  yield* plot().yTitle.opacity(1, ANIMATION_CONFIG.COUNTER_FADE_DURATION);

  yield* waitFor(1);

  // MAIN LOOP: Iterate through hands 1-10 (indices 0-9)
  for (let handIndex = 0; handIndex < 10; handIndex++) {
    const currentHand = bbData.HANDS[handIndex];

    // Update hand signal
    if (handIndex > 0) {
      yield* animateHandTransition(handSignal, handIndex);
    }

    // Clear previous lines and update plot
    yield* clearBankrollLines(plot());
    yield* updatePlotForHand(plot(), currentHand);

    // Reset bot signals for new hand
    resetBotSignals(botSignals, currentHand);

    // Reset throw counter
    throwSignal(0);

    // Show leaderboards
    yield* sequence(
      ANIMATION_CONFIG.LEADERBOARD_FADE_DELAY,
      ...leaderboards.map((board) => board.opacity(1, 1))
    );

    // Create and run bot animations for this hand
    const { bankrollLineGenerators } = yield* createBotAnimations(
      currentHand,
      botSignals,
      plot(),
      throwSignal
    );

    // Run all animations for this hand
    yield* all(...bankrollLineGenerators);

    // Show final results for this hand
    for (let i = 0; i < bbData.N_BOTS; i++) {
      const bot = currentHand.BOTS[i];
      yield botSignals[i].ordinalRankSignal(bot.END_ORD_RANK, 1);
      yield botSignals[i].rankSignal(bot.END_RANK, 1);
      yield botSignals[i].amountSignal(bot.END_BR, 1);
    }

    // Pause between hands (except after the last hand)
    if (handIndex < 10) {
      yield* waitFor(2);
    }
  }

  yield* waitFor(5);
});
