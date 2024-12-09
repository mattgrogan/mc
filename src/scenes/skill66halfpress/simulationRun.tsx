import { Camera, Layout, makeScene2D } from "@motion-canvas/2d";
import {
  all,
  createRef,
  Direction,
  easeInOutCubic,
  easeOutBounce,
  linear,
  slideTransition,
  waitFor,
  waitUntil,
} from "@motion-canvas/core";

import { SimulationScreen } from "../../components/craps/CrapsSimulationScreen";
import { Bright, Theme } from "../../styles";
import { CircumscribeRect } from "../../utils/Circumscribe";
import { FadeIn } from "../../utils/FadeIn";

import simstats from "../../../../dicedata/output/skill66halfpress-100k/skill66halfpress-100k-sessions-shooters-rolls.json";
import casinostats from "../../../../dicedata/output/skill66halfpress-100k/skill66halfpress-100k-casinostats.json";

export default makeScene2D(function* (view) {
  view.fill(Theme.BG);

  // Create your animations here

  const camera = createRef<Camera>();
  const container = createRef<Layout>();

  view.add(
    <Camera ref={camera}>
      <Layout ref={container}></Layout>
    </Camera>
  );
  // https://github.com/motion-canvas/motion-canvas/issues/1057
  camera().scene().position(view.size().div(2));

  const sim = new SimulationScreen();
  sim.name = "Skill 66";
  sim.options = "Then Half Press";
  sim.sessions = simstats[0].SESSIONS;
  sim.shooters = "10 Per Session";
  sim.tableMin = "$10";
  sim.tableMax = "$5,000";

  sim.totalThrows = simstats[0].ROLLS;
  sim.totalBet = casinostats[0].TOTAL_BET;
  sim.totalWon = casinostats[0].TOTAL_WON;
  sim.totalLost = casinostats[0].TOTAL_LOST;

  container().add(sim);

  yield* slideTransition(Direction.Right);
  // yield* waitFor(0.2);
  // yield* waitFor(1.5);
  // yield* sequence(
  //   1.3,
  //   Circumscribe(sim.paramsRows[2], Bright.YELLOW, 1, 5, 0.5),
  //   Circumscribe(sim.paramsRows[3], Bright.YELLOW, 1, 5, 0.5),
  //   Circumscribe(sim.paramsRows[4], Bright.YELLOW, 1, 5, 0.5),
  //   Circumscribe(sim.paramsRows[5], Bright.YELLOW, 1, 5, 0.5)
  // );

  //yield* waitFor(1);
  camera().save();
  yield* all(
    camera().zoom(1.1, 1.5, easeInOutCubic),
    camera().position([-400, 0], 1.5, easeInOutCubic)
  );
  yield* waitUntil("circ");
  yield* CircumscribeRect(sim.paramsRows[3], Bright.YELLOW, 1, 15, 0.3);
  yield* CircumscribeRect(sim.paramsRows[4], Bright.YELLOW, 1, 15, 0.3);
  yield* camera().restore(1, easeInOutCubic);

  yield* waitUntil("run");
  yield* sim.run(15);

  yield* waitUntil("results");
  camera().save();
  yield sim.cameraOn(camera(), sim.resultsTable(), 2, 1.4, [120, 0]);
  yield* waitFor(1);

  const arrow = sim.newArrow(1);
  yield* all(FadeIn(arrow, 1, easeOutBounce, [100, 0]), arrow.opacity(1, 1));
  yield CircumscribeRect(sim.resultRows[1], Bright.YELLOW, 1, 15, 0.5);
  yield* waitFor(1);

  yield* waitUntil("tps");
  yield* sim.moveArrowTo(arrow, 2, 1);
  yield* CircumscribeRect(sim.resultRows[2], Bright.YELLOW, 1, 15, 0.5);
  yield* waitFor(1);

  yield* waitUntil("total-bet");
  yield* sim.moveArrowTo(arrow, 3, 1);
  yield* CircumscribeRect(sim.resultRows[3], Bright.YELLOW, 1, 15, 0.5);
  //yield* waitFor(1);

  yield* waitUntil("total-won");
  yield* sim.moveArrowTo(arrow, 4, 1);
  yield CircumscribeRect(sim.resultRows[4], Bright.YELLOW, 1, 15, 0.5);
  yield* waitFor(1);

  yield* waitUntil("total-lost");
  yield* sim.moveArrowTo(arrow, 5, 1);
  yield CircumscribeRect(sim.resultRows[5], Bright.YELLOW, 1, 15, 0.5);
  yield* waitFor(1);

  yield* waitUntil("zoom-in");
  yield* sim.cameraOn(camera(), sim.resultsTable(), 2, 1.6, [120, 0]);

  yield* waitUntil("house-take");
  yield* sim.moveArrowTo(arrow, 6, 1);
  yield* CircumscribeRect(sim.resultRows[6], Bright.YELLOW, 1, 15, 2);

  yield* waitUntil("house-edge");
  yield* sim.moveArrowTo(arrow, 7, 1);
  yield* CircumscribeRect(sim.resultRows[7], Bright.YELLOW, 1, 15, 2);

  //yield* waitFor(1);

  yield* waitUntil("zoom-out");
  yield* all(camera().restore(1, easeInOutCubic), arrow.opacity(0, 1, linear));
  yield* waitUntil("end");
});
