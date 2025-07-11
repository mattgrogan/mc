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

// SCENE-NAME-worst_sessions.json
import simData from "../../../../dicedata/output/ken_440_regress-100k/ken_440_regress-100k-best-440Regress-1.json";

export default makeScene2D(function* (view) {
  // view.fill(Theme.BG);
  const container = createRef<Layout>();
  const table = createRef<CrapsTable>();
  const bug = createRef<CrapsScoreBug>();
  const winConds = createRef<CrapsWinConditionsHorizontal>();
  view.add(
    <Layout ref={container}>
      <CrapsTable
        ref={table}
        opacity={0}
        scale={0.9}
        y={-80}
      ></CrapsTable>
      <CrapsScoreBug
        ref={bug}
        opacity={0}
        scale={0.6}
      />
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
      \
    </Layout>
  );

  bug().position([-500, 470]);

  yield* FadeIn(table(), 1, easeOutCubic, [0, 500]);
  yield* sequence(
    0.5,
    FadeIn(bug(), 0.6, easeOutCubic, [0, 100]),
    FadeIn(winConds(), 1, easeOutCubic, [100, 0]),
    bug().updateLabel("GOOD LUCK!")
  );

  const chip = table().bets().newChip(15, c.PLAYER);
  chip.opacity(0);

  yield* waitFor(1);

  const processor = new CrapsProcessor(table, bug, winConds);
  processor.forceWorkingIndicator = false;

  const sessionData = simData;
  for (const roll of sessionData) {
    yield* processor.round(roll);
  }

  yield* bug().updateLabel("GAME OVER");
  yield* waitFor(10);
});
