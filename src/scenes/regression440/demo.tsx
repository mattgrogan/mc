import { Layout, makeScene2D } from "@motion-canvas/2d";
import {
  all,
  createRef,
  easeInOutCubic,
  easeOutCubic,
  sequence,
  Vector2,
  waitFor,
} from "@motion-canvas/core";
import { CrapsTable } from "../../components/craps/CrapsTable";

import { FadeIn } from "../../utils/FadeIn";
import { c } from "../../components/craps/CrapsTableCoords";
import { CrapsScoreBug } from "../../components/craps/CrapsScoreBug";

export default makeScene2D(function* (view) {
  view.fill("222");
  const container = createRef<Layout>();
  const table = createRef<CrapsTable>();
  const bug = createRef<CrapsScoreBug>();
  view.add(
    <Layout ref={container}>
      <CrapsTable
        ref={table}
        opacity={0}
      ></CrapsTable>
      <CrapsScoreBug
        ref={bug}
        opacity={0}
        scale={0.6}
      />
    </Layout>
  );

  bug().position([0, 450]);

  yield* FadeIn(table(), 1, easeOutCubic, [0, 500]);
  yield* sequence(
    0.5,
    FadeIn(bug(), 0.6, easeOutCubic, [0, 100]),
    bug().updateLabel("REGRESSION 440")
  );

  yield* waitFor(1);

  yield* bug().updateLabel("DICE ARE OUT");

  yield* table().dice().throw(3, 3);
  yield* table().movePuckTo(c.PUCK6);
  yield* table().dice().removeDice();

  yield* bug().updateLabel("PLACE BETS");
  yield* sequence(
    0.2,
    table().bets().makeBet(100, c.PLACE5),
    table().bets().makeBet(120, c.PLACE6),
    table().bets().makeBet(120, c.PLACE8),
    table().bets().makeBet(100, c.PLACE9)
  );
  yield* bug().updateBankroll(-440);
  yield* bug().updateBets(440);
  yield* bug().updateExposure(-440);

  yield* bug().updateLabel("DICE ARE OUT");

  yield* bug().updateRoll(false);
  yield* table().dice().throw(3, 6);
  yield* bug().updateLabel("THROW IS NINE");

  yield* bug().hidePlayerStats();

  yield* bug().updateLabel("PLAYER WINS 140");
  yield* table().bets().winBet(140, c.PLACE9, false);
  yield* table().dice().removeDice();
  yield* bug().updateLabel("PLACE BETS");
  yield* sequence(
    0.2,
    table().bets().removeBet(c.PLACE5),
    table().bets().removeBet(c.PLACE6),
    table().bets().removeBet(c.PLACE8),
    table().bets().removeBet(c.PLACE9)
  );
  yield* sequence(
    0.2,
    table().bets().makeBet(50, c.PLACE5),
    table().bets().makeBet(60, c.PLACE6),
    table().bets().makeBet(60, c.PLACE8),
    table().bets().makeBet(50, c.PLACE9)
  );
  yield* bug().updateBankroll(-80);
  yield* bug().updateBets(220);
  yield* bug().updateExposure(-80);

  yield* table().dice().removeDice();

  yield* waitFor(5);
});
