import { Layout, makeScene2D } from "@motion-canvas/2d";
import {
  createRef,
  Direction,
  easeOutCubic,
  sequence,
  waitFor,
} from "@motion-canvas/core";
import { CrapsTable } from "../../components/craps/CrapsTable";
import { CrapsProcessor } from "../../components/craps/CrapsProcessor";
import { CrapsScoreBug } from "../../components/craps/CrapsScoreBug";
import { FadeIn } from "../../utils/FadeIn";
import { c } from "../../components/craps/CrapsTableCoords";
import { CrapsWinConditionsHorizontal } from "../../components/craps/CrapWinConditionsHorizontal";
import simData from "../../../../dicedata/output/theone-100k-newreport/sessions/theone-100k-newreport-TheOne-best-1.json";

// TEST CONFIGURATION - Enable/disable components to isolate performance
const TEST_CONFIG = {
  enableTable: true,
  enableScoreBug: true,
  enableWinConditions: true,
  enableBetAnimations: true,
  enableDiceAnimations: true,
  enableWorkingIndicators: true,
  enableLabels: true,
  enablePopups: true,

  // Reduce data size for faster testing
  maxRounds: 5000, // Test with first 50 rounds only
};

export default makeScene2D(function* (view) {
  console.log("=== COMPONENT ISOLATION TEST ===");
  console.log("Configuration:", TEST_CONFIG);

  const container = createRef<Layout>();
  const table = createRef<CrapsTable>();
  const bug = createRef<CrapsScoreBug>();
  const winConds = createRef<CrapsWinConditionsHorizontal>();

  view.add(
    <Layout ref={container}>
      {TEST_CONFIG.enableTable && (
        <CrapsTable
          ref={table}
          opacity={0}
          scale={0.9}
          y={-80}
        ></CrapsTable>
      )}
      {TEST_CONFIG.enableScoreBug && (
        <CrapsScoreBug
          ref={bug}
          opacity={0}
          scale={0.6}
        />
      )}
      {TEST_CONFIG.enableWinConditions && (
        <CrapsWinConditionsHorizontal
          y={410}
          x={400}
          scale={0.3}
          tableProps={{ height: 400, width: 3300 }}
          valueRowHeight={200}
          labelProps={{ fontSize: 100, fill: "white" }}
          extensionLength={200}
          ref={winConds}
          easyValueTxtProps={{ fontSize: 100 }}
          hardValueTxtProps={{ fontSize: 100 }}
          easyAnimationDirection={Direction.Top}
          opacity={0}
        />
      )}
    </Layout>
  );

  if (TEST_CONFIG.enableScoreBug) {
    bug().position([-500, 470]);
  }

  // Setup animations
  const setupStart = performance.now();
  if (TEST_CONFIG.enableTable) {
    yield* FadeIn(table(), 1, easeOutCubic, [0, 500]);
  }

  if (TEST_CONFIG.enableScoreBug || TEST_CONFIG.enableWinConditions) {
    yield* sequence(
      0.5,
      ...(TEST_CONFIG.enableScoreBug
        ? [FadeIn(bug(), 0.6, easeOutCubic, [0, 100])]
        : []),
      ...(TEST_CONFIG.enableWinConditions
        ? [FadeIn(winConds(), 1, easeOutCubic, [100, 0])]
        : []),
      ...(TEST_CONFIG.enableScoreBug ? [bug().updateLabel("GOOD LUCK!")] : [])
    );
  }

  if (TEST_CONFIG.enableTable) {
    const chip = table().bets().newChip(15, c.PLAYER);
    chip.opacity(0);
  }
  const setupEnd = performance.now();
  console.log(`Setup time: ${(setupEnd - setupStart).toFixed(2)}ms`);

  yield* waitFor(1);

  // Create processor but pass null refs for disabled components
  const processor = new CrapsProcessor(
    TEST_CONFIG.enableTable ? table : ({ current: null } as any),
    TEST_CONFIG.enableScoreBug ? bug : ({ current: null } as any),
    TEST_CONFIG.enableWinConditions ? winConds : ({ current: null } as any)
  );
  processor.forceWorkingIndicator = false;

  const sessionData = simData.slice(0, TEST_CONFIG.maxRounds);
  console.log(`Testing with ${sessionData.length} rounds`);

  const processingStart = performance.now();
  let roundTimes: number[] = [];

  // Process each round with timing
  for (let i = 0; i < sessionData.length; i++) {
    const roll = sessionData[i];
    const roundStart = performance.now();

    // Call our modified processor
    yield* testProcessorRound(processor, roll, TEST_CONFIG);

    const roundEnd = performance.now();
    const roundTime = roundEnd - roundStart;
    roundTimes.push(roundTime);

    if (i % 10 === 0) {
      const recentAvg =
        roundTimes.slice(-10).reduce((a, b) => a + b, 0) /
        Math.min(10, roundTimes.length);
      console.log(
        `Round ${i}: ${roundTime.toFixed(2)}ms (avg: ${recentAvg.toFixed(2)}ms)`
      );
    }
  }

  const processingEnd = performance.now();
  const totalTime = processingEnd - processingStart;
  const avgTime = roundTimes.reduce((a, b) => a + b, 0) / roundTimes.length;
  const maxTime = Math.max(...roundTimes);

  console.log("\n=== RESULTS ===");
  console.log(`Total processing time: ${totalTime.toFixed(2)}ms`);
  console.log(`Average round time: ${avgTime.toFixed(2)}ms`);
  console.log(`Max round time: ${maxTime.toFixed(2)}ms`);
  console.log(
    `Rounds per second: ${(sessionData.length / (totalTime / 1000)).toFixed(2)}`
  );

  if (TEST_CONFIG.enableScoreBug) {
    yield* bug().updateLabel("TEST COMPLETE");
  }
  yield* waitFor(2);
});

// Modified processor round that respects our test configuration
function* testProcessorRound(
  processor: any,
  data: any,
  config: typeof TEST_CONFIG
) {
  // Shooter management
  if (data.SHOOTER_ROLL == 1 && config.enablePopups && config.enableScoreBug) {
    yield processor.scoreBug().newShooter();
  }

  // Score bug updates
  if (config.enableScoreBug) {
    yield* processor.scoreBug().updateRoll(data.SHOOTER_ROLL == 1);
    yield* processor.scoreBug().updateBankroll(data.NET_BR_START);
    yield* processor.scoreBug().updateExposure(data.NET_SHBR_START);

    if (config.enableLabels) {
      yield* processor.scoreBug().updateLabel("PLACE BETS");
    }
  }

  // Bet management
  if (config.enableBetAnimations && config.enableTable) {
    const downBets = [];
    for (const bet of data.BETSDOWN) {
      downBets.push(processor.table().bets().removeBet(bet.bet));
    }
    if (downBets.length > 0) {
      yield* sequence(0.2, ...downBets);
    }

    const newBets = [];
    for (const betType of data.NEWBETS) {
      const isBuy = betType.bet == "BUY4" || betType.bet == "BUY10";
      newBets.push(
        processor
          .table()
          .bets()
          .makeBet(betType.amount, betType.bet, false, isBuy)
      );
    }
    if (newBets.length > 0) {
      yield* sequence(0.3, ...newBets);
    }
  }

  // Working indicators
  if (config.enableWorkingIndicators && config.enableTable) {
    const WORKING_INDICATOR_BETS = [
      "BUY4",
      "PLACE4",
      "PLACE5",
      "PLACE6",
      "PLACE8",
      "PLACE9",
      "PLACE10",
      "BUY10",
      "COME4ODDS",
      "COME5ODDS",
      "COME6ODDS",
      "COME8ODDS",
      "COME9ODDS",
      "COME10ODDS",
    ];

    for (const bet of data.BETS) {
      if (WORKING_INDICATOR_BETS.includes(bet.bet)) {
        if (
          data.POINT_STATUS != bet.working ||
          processor.forceWorkingIndicator
        ) {
          yield* processor
            .table()
            .bets()
            .chip(bet.bet)
            .setWorking(bet.working == "On");
          yield processor.table().bets().chip(bet.bet).showWorking(0.6);
        } else {
          yield processor.table().bets().chip(bet.bet).hideWorking(0.6);
        }
      }
    }
  }

  // Score updates (without win conditions)
  if (config.enableScoreBug) {
    yield* processor.scoreBug().updateBankroll(data.NET_BR_UPDATED);
    yield* processor.scoreBug().updateBets(data.BETS_TOTAL);
    yield* processor.scoreBug().updateExposure(data.NET_SHBR_UPDATED);
  }

  yield* waitFor(0.6);

  // Dice throwing
  if (config.enableDiceAnimations && config.enableTable) {
    if (config.enableLabels && config.enableScoreBug) {
      yield* processor.scoreBug().updateLabel("DICE ARE OUT");
    }
    yield* processor.table().dice().throw(data.D1, data.D2);
  }

  yield* waitFor(0.6);

  // Game state popups
  if (config.enablePopups && config.enableScoreBug) {
    if (data.IS_SEVEN_OUT) {
      yield processor.scoreBug().sevenOut();
    }
    if (data.IS_POINT_SET) {
      yield processor.scoreBug().pointSet(data.POINTS_SET);
    }
    if (data.IS_POINT_HIT) {
      yield processor.scoreBug().pointHit();
    }
  }

  // Rest of the round processing...
  // (Continue with similar conditional logic for remaining operations)

  yield* waitFor(1);
}
