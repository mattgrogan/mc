import { Layout, makeScene2D } from "@motion-canvas/2d";
import {
  all,
  createRef,
  easeOutCubic,
  Vector2,
  waitFor,
} from "@motion-canvas/core";
import { CrapsTable } from "../../components/craps/CrapsTable";

import { FadeIn } from "../../utils/FadeIn";
import { c } from "../../components/CrapsTableCoords";

export default makeScene2D(function* (view) {
  const container = createRef<Layout>();
  const table = createRef<CrapsTable>();
  view.add(
    <Layout ref={container}>
      <CrapsTable
        ref={table}
        opacity={0}
      ></CrapsTable>
    </Layout>
  );

  yield* FadeIn(table(), 1, easeOutCubic, [0, 500]);
  yield* waitFor(1);
  yield* table().movePuckTo(c.PUCK4);
  yield* waitFor(1);
  yield* table().dice().throw(3, 3);
  yield* table().bets().makeBet(5, c.PUCK5);
  yield* table().bets().moveBet(c.PUCK5, c.PUCK6);
  yield* table().bets().loseBet(c.PUCK6);
  yield* table().bets().makeBet(100, c.PUCK8);
  yield* table().bets().removeBet(c.PUCK8);
  yield* table().bets().makeBet(100, c.PUCK8);
  yield* table().bets().winBet(500, c.PUCK8);
  yield* waitFor(5);
});
