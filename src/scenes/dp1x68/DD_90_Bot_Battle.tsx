// EXTRACT_FRAMES: [001791]
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
import { Plot } from "../../components/plot/plot";
import { Grays, PoppinsBlack, PoppinsWhite, Theme } from "../../styles";
import bbData from "../../../../dicedata/output/dp1x68-100k/bot_battle/PLYR/battle_export.json";
import {
  commaFormmatter,
  plusCommaFormmatter,
} from "../../components/styled/findQuantiles";
import { tw_colors } from "../../tw_colors";
import { name } from "./DD_00_Params";

const EVENT_NAME = name;

// Theme colors for UI elements (not bot lines - those come from data)
const UI_THEME = {
  COUNTER_BG: tw_colors.gray[800],
  COUNTER_BORDER: tw_colors.gray[600],
  COUNTER_DIVIDER: tw_colors.gray[600],
  LEADERBOARD_ACTIVE: "white",
  LEADERBOARD_FINISHED: "gray",
  LINES_FADED: "#666666",
  AXIS_STROKE: tw_colors.gray[400],
  AXIS_LABELS: tw_colors.gray[400],
  AXIS_TICKS: tw_colors.gray[400],
} as const;

// Constants
const ANIMATION_CONFIG = {
  SECS_PER_ROLL: 0.2, // Faster animation since we're using session rolls
  RANK_UPDATE_INTERVAL: 2, // Update ranks every 2 seconds
  RANK_ANIMATION_DURATION: 0.6, // How long each rank change takes to animate
  X_TICKS_EVERY: 1,
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
  COUNTER_WIDTH: 200,
  COUNTER_HEIGHT: 80,
  TITLE_HEIGHT: 150,
} as const;

// Types
interface BotWithSignals {
  session: number;
  ordinalRankSignal: SimpleSignal<number>;
  rankSignal: SimpleSignal<number>;
  amountSignal: SimpleSignal<number>;
  isFinishedSignal: SimpleSignal<boolean>;
  color: string;
  name: string;
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

// Component Creation Functions
function createTitle() {
  return (
    <Layout
      direction={"column"}
      justifyContent={"start"}
      alignItems={"start"}
      height={LAYOUT_CONFIG.TITLE_HEIGHT}
      width={600}
      gap={20}
      position={[-3840 / 2 + 100, -2160 / 2 + 100]} // Upper left positioning for 3840x2160
      layout={false} // Don't participate in layout flow
    >
      <Txt
        {...PoppinsWhite}
        fontSize={120}
        fontWeight={900}
        text={EVENT_NAME}
        offsetX={-1}
      />
      <Txt
        {...PoppinsWhite}
        fontSize={80}
        fontWeight={600}
        text={"Bot Battle"}
        opacity={0.8}
        offsetX={-1}
        y={150}
      />
    </Layout>
  );
}

function createCounter(rollSignal: SimpleSignal<number>) {
  const counter = createRef<Rect>();

  const counterElement = (
    <Layout
      layout={false}
      position={[0, -2160 / 2 + 200]} // Position above where leaderboard will be
      scale={3}
    >
      <Rect
        ref={counter}
        width={LAYOUT_CONFIG.COUNTER_WIDTH}
        height={LAYOUT_CONFIG.COUNTER_HEIGHT}
        fill={UI_THEME.COUNTER_BG}
        stroke={UI_THEME.COUNTER_BORDER}
        lineWidth={1}
        radius={0}
        layout
        direction={"row"}
        justifyContent={"center"}
        alignItems={"center"}
        gap={15}
        opacity={0}
        shadowColor={"rgba(0,0,0,0.3)"}
        shadowOffset={[0, 4]}
        shadowBlur={12}
      >
        <Txt
          {...PoppinsWhite}
          fontSize={32}
          fontWeight={700}
          text={"ROLL"}
          opacity={0.9}
        />
        <Rect
          width={2}
          height={40}
          fill={UI_THEME.COUNTER_DIVIDER}
          radius={1}
        />
        <Txt
          {...PoppinsWhite}
          fontSize={36}
          fontWeight={900}
          text={() => rollSignal().toFixed(0)}
          width={60}
          textAlign={"center"}
        />
      </Rect>
    </Layout>
  );

  return { counter, counterElement };
}

function createLeaderboardItem(bot: BotWithSignals, leaderboardArea: Layout) {
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
      fill={() =>
        !bot.isFinishedSignal()
          ? UI_THEME.LEADERBOARD_ACTIVE
          : UI_THEME.LEADERBOARD_FINISHED
      }
      opacity={0}
      y={() =>
        leaderboardArea.top().y +
        LAYOUT_CONFIG.LEADERBOARD_ITEM_SPACING * bot.ordinalRankSignal()
      }
    >
      <Txt
        text={() => commaFormmatter(Math.round(bot.rankSignal()), 0, "-")}
        width={"5%"}
        {...PoppinsBlack}
      />
      <Layout width={"5%"}>
        <Circle
          size={60}
          fill={bot.color}
        />
      </Layout>
      <Txt
        text={bot.name}
        width={"50%"}
        {...PoppinsBlack}
        fontWeight={700}
      />
      <Txt
        text={() => plusCommaFormmatter(bot.amountSignal(), 0)}
        width={"25%"}
        alignSelf={"end"}
        textAlign={"right"}
      />
      <Layout width={"5%"}>
        <Icon
          icon={"material-symbols:arrow-upward"}
          size={() => (bot.amountSignal() > 0 ? 60 : 0)}
          color={"green"}
        />
        <Icon
          icon={"material-symbols:arrow-downward"}
          size={() => (bot.amountSignal() < 0 ? 60 : 0)}
          color={"red"}
        />
      </Layout>
      <Layout width={"5%"}>
        <Icon
          icon={"gis:flag-finish"}
          size={() => (bot.isFinishedSignal() ? 60 : 0)}
          color={"black"}
        />
      </Layout>
    </Rect>
  );
}

// Main Scene Function
export default makeScene2D(function* (view) {
  // view.fill(Theme.BG);
  yield* waitFor(1);

  // Signals
  const rollSignal = createSignal(0);

  // Process data from the new simplified structure
  const botList = bbData.bots;
  const frames = bbData.frames;

  // Calculate axis limits from all frames
  const allBankrolls: number[] = [];
  const allRolls: number[] = [];

  for (const frame of frames) {
    allRolls.push(frame.roll);
    for (const botData of frame.bots) {
      allBankrolls.push(botData.bankroll);
    }
  }

  const minBR = Math.min(...allBankrolls);
  const maxBR = Math.max(...allBankrolls);
  const maxRoll = Math.max(...allRolls);

  const { yMin, yMax, yStep } = getYAxisLimitsAndStep(minBR, maxBR);
  const xMax = Math.ceil(maxRoll / 20) * 20;

  // Create main container
  const mainContainer = createRef<Layout>();
  view.add(
    <Layout
      ref={mainContainer}
      direction={"row"}
      justifyContent={"center"}
      alignItems={"center"}
      width={"100%"}
      height={"100%"}
      padding={LAYOUT_CONFIG.CONTAINER_PADDING}
      layout
    />
  );

  // Add title positioned in upper left
  const title = createTitle();
  view.add(title);

  // Create content container for plot and leaderboard
  const container = createRef<Layout>();
  mainContainer().add(
    <Layout
      ref={container}
      direction={"row"}
      justifyContent={"center"}
      alignItems={"center"}
      width={"100%"}
      height={"100%"}
      gap={LAYOUT_CONFIG.CONTAINER_GAP}
      layout
    />
  );

  // Create counter
  const { counter, counterElement } = createCounter(rollSignal);
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

  // Create plot
  const plot = createRef<Plot>();
  plotArea.layout.add(
    <Plot
      ref={plot}
      clip={false}
      xMin={0}
      xMax={xMax}
      yMin={yMin}
      yMax={yMax}
      width={plotArea.rect.width() * 1}
      height={plotArea.rect.height() * 1}
      xAxisProps={{
        opacity: 1,
        stroke: UI_THEME.AXIS_STROKE,
        axisLineWidth: 5,
        end: 0,
        tickLength: 30,
      }}
      yAxisProps={{
        opacity: 1,
        stroke: UI_THEME.AXIS_STROKE,
        axisLineWidth: 5,
        end: 0,
        tickLength: 30,
      }}
      xLabelProps={{
        fill: UI_THEME.AXIS_LABELS,
        decimalNumbers: 0,
        fontSize: 50,
        lineToLabelPadding: 20,
      }}
      yLabelProps={{
        fill: UI_THEME.AXIS_LABELS,
        decimalNumbers: 0,
        fontSize: 50,
        lineToLabelPadding: -60,
      }}
      yTitleProps={{
        fill: UI_THEME.AXIS_LABELS,
        text: "Win Amount",
        lineToLabelPadding: -250,
        rotation: -90,
        opacity: 0,
        fontSize: 60,
      }}
      xTitleProps={{
        fill: UI_THEME.AXIS_LABELS,
        text: "Session Roll",
        lineToLabelPadding: 200,
        opacity: 0,
        fontSize: 60,
      }}
      xTickProps={{ stroke: UI_THEME.AXIS_TICKS }}
      yTickProps={{ stroke: UI_THEME.AXIS_TICKS }}
    />
  );

  // Initialize components
  plotArea.container.opacity(1);

  // Create bot signals and leaderboard items
  const botSignals: BotWithSignals[] = [];
  const leaderboards: Rect[] = [];
  const lines: Line[] = [];

  for (let i = 0; i < botList.length; i++) {
    const bot = botList[i];

    const botSignal: BotWithSignals = {
      session: bot.session,
      ordinalRankSignal: createSignal(i),
      rankSignal: createSignal(i + 1),
      amountSignal: createSignal(0),
      isFinishedSignal: createSignal(false),
      color: bot.color,
      name: bot.name,
    };

    botSignals.push(botSignal);

    // Create leaderboard item
    const board = createLeaderboardItem(botSignal, leaderboardArea());
    // @ts-expect-error
    leaderboards.push(board);
    leaderboardAreaItems().add(board);

    // Create line coordinates by collecting data for this bot across all frames
    const coords: Vector2[] = [];
    for (const frame of frames) {
      const botData = frame.bots.find((b) => b.session === bot.session);
      if (botData) {
        coords.push(
          new Vector2(
            frame.roll + bot.session / 20, // Small offset to prevent overlap
            botData.bankroll + bot.session * 10 // Small Y offset to prevent overlap
          )
        );
      }
    }

    // Create line
    const line = plot().steppedLine([0, 0], coords, {
      lineWidth: 8,
      opacity: 0.8,
      stroke: bot.color,
      end: 0,
    });
    lines.push(line);
  }

  // Setup plot ticks after setting the bounds - use proper step sizes
  const xStep = 20; // Step every 20 rolls
  plot().xAxis.updateTicks(0, xMax, xStep, ANIMATION_CONFIG.X_TICKS_EVERY);
  plot().yAxis.updateTicks(yMin, yMax, yStep, ANIMATION_CONFIG.Y_TICKS_EVERY);

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

  // Show leaderboards
  yield* sequence(
    ANIMATION_CONFIG.LEADERBOARD_FADE_DELAY,
    ...leaderboards.map((board) => board.opacity(1, 1))
  );

  yield* waitFor(1);

  // Create animation generators
  const animationGenerators = [];

  // Use maxRoll for the full animation duration
  const animationDuration = maxRoll * ANIMATION_CONFIG.SECS_PER_ROLL;

  // Animate all lines for the full duration
  for (let i = 0; i < lines.length; i++) {
    animationGenerators.push(lines[i].end(1, animationDuration, linear));
  }

  // Group frames by update intervals to avoid multiple updates within the same interval
  const framesByInterval: Record<number, (typeof frames)[0]> = {};

  for (const frame of frames) {
    const intervalKey = Math.floor(
      (frame.roll * ANIMATION_CONFIG.SECS_PER_ROLL) /
        ANIMATION_CONFIG.RANK_UPDATE_INTERVAL
    );
    // Keep the latest frame in each interval (this will be the final state for that interval)
    framesByInterval[intervalKey] = frame;
  }

  // Update leaderboard - but only once per interval using the final frame data
  for (const frame of frames) {
    const delayTime = frame.roll * ANIMATION_CONFIG.SECS_PER_ROLL;
    const intervalKey = Math.floor(
      delayTime / ANIMATION_CONFIG.RANK_UPDATE_INTERVAL
    );

    // Only update ranks if this is the final frame for this interval
    const isLastFrameInInterval = framesByInterval[intervalKey] === frame;

    // Update each bot's signals based on this frame's data
    for (let i = 0; i < botList.length; i++) {
      const bot = botList[i];
      const botData = frame.bots.find((b) => b.session === bot.session);

      if (botData) {
        // Always update the bankroll amount for smooth line drawing
        animationGenerators.push(
          delay(
            delayTime,
            botSignals[i].amountSignal(
              botData.bankroll,
              ANIMATION_CONFIG.SECS_PER_ROLL
            )
          )
        );

        // Only update ranks once per interval using the final state
        if (isLastFrameInInterval) {
          animationGenerators.push(
            delay(
              delayTime,
              botSignals[i].ordinalRankSignal(
                botData.ordinal_rank,
                ANIMATION_CONFIG.RANK_ANIMATION_DURATION,
                linear
              )
            )
          );
          animationGenerators.push(
            delay(
              delayTime,
              botSignals[i].rankSignal(
                botData.rank,
                ANIMATION_CONFIG.RANK_ANIMATION_DURATION,
                linear
              )
            )
          );
        }

        // Mark as finished if this is the last frame for this bot
        if (frame === frames[frames.length - 1]) {
          animationGenerators.push(
            delay(delayTime, () => botSignals[i].isFinishedSignal(true))
          );
          // Fade the line when bot finishes
          animationGenerators.push(delay(delayTime, lines[i].opacity(0.3, 2)));
        }
      }
    }
  }

  // Update roll counter
  animationGenerators.push(rollSignal(maxRoll, animationDuration, linear));

  // Run all animations
  yield* all(...animationGenerators);

  // Wait for all animations to complete
  yield* waitFor(1);

  // Post-animation: Highlight winners sequence

  // First, fade all lines to gray
  for (let i = 0; i < lines.length; i++) {
    yield lines[i].stroke(UI_THEME.LINES_FADED, 1);
    yield lines[i].opacity(0.3, 1);
  }

  // Fade all leaderboard items
  for (const board of leaderboards) {
    yield board.opacity(0.3, 1);
  }

  // Get final rankings by finding the last frame data
  const finalFrame = frames[frames.length - 1];
  const finalRankings = finalFrame.bots
    .slice()
    .sort((a, b) => a.ordinal_rank - b.ordinal_rank)
    .slice(0, 3); // Top 3

  // Highlight each winner in sequence (1st, 2nd, 3rd place)
  for (let rank = 0; rank < 3; rank++) {
    const winnerBotData = finalRankings[rank];

    // Find the bot index in our arrays
    const botIndex = botList.findIndex(
      (bot) => bot.session === winnerBotData.session
    );

    if (botIndex !== -1) {
      // Highlight the winner's line and leaderboard
      yield* all(
        lines[botIndex].stroke(botList[botIndex].color, 1),
        lines[botIndex].opacity(1, 1),
        leaderboards[botIndex].opacity(1, 1),
        // Override fill color to white (original color)
        leaderboards[botIndex].fill(UI_THEME.LEADERBOARD_ACTIVE, 1)
      );

      // Hold for 3 seconds
      yield* waitFor(3);

      // Fade back down (except for the last one)
      if (rank < 2) {
        yield* all(
          lines[botIndex].stroke(UI_THEME.LINES_FADED, 1),
          lines[botIndex].opacity(0.3, 1),
          leaderboards[botIndex].opacity(0.3, 1),
          // Set back to gray color
          leaderboards[botIndex].fill(UI_THEME.LEADERBOARD_FINISHED, 1)
        );
      }
    }
  }

  // Final reveal: bring all back to full opacity with original colors
  yield* all(
    ...lines.map((line, i) =>
      all(
        line.stroke(botList[i].color, 1), // Restore original bot color
        line.opacity(1, 2)
      )
    ),
    ...leaderboards.map((board) =>
      all(
        board.opacity(1, 2),
        board.fill(UI_THEME.LEADERBOARD_ACTIVE, 2) // Restore original white background
      )
    )
  );

  yield* waitFor(5);
});
