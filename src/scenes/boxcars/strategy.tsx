import { Camera, Circle, Layout, makeScene2D, Txt } from "@motion-canvas/2d";
import {
  all,
  createRef,
  easeInCubic,
  easeInOutCubic,
  easeOutCubic,
  linear,
  sequence,
  waitFor,
  waitUntil,
} from "@motion-canvas/core";

import { PoppinsWhite, Theme } from "../../styles";

import { CrapsTable } from "../../components/craps/CrapsTable";
import { FadeIn } from "../../utils/FadeIn";

import { c } from "../../components/craps/CrapsTableCoords";
import { Spotlight } from "../../utils/Spotlight";
import { Indicate } from "../../utils/Indicate";

export default makeScene2D(function* (view) {
  view.fill(Theme.BG);

  const camera = createRef<Camera>();
  const table = createRef<CrapsTable>();

  view.add(
    <Camera ref={camera}>
      <CrapsTable
        ref={table}
        opacity={0}
        scale={0.8}
      ></CrapsTable>
    </Camera>
  );

  // https://github.com/motion-canvas/motion-canvas/issues/1057
  camera().scene().position(view.size().div(2));

  yield* FadeIn(table(), 1, easeOutCubic, [0, 500]);

  camera().save();
  yield* all(
    camera().zoom(1.5, 2, easeInOutCubic),
    camera().position([-330, 130], 2, easeInOutCubic)
  );

  yield* table().bets().makeBet(5, c.PROP_12);

  yield* camera().restore(2, easeInOutCubic);
  
  yield* table().dice().throw(4, 6);
  yield* table().bets().loseBet(c.PROP_12);
  yield* table().dice().removeDice();
  
  yield* waitUntil("roll2")
  yield* table().bets().makeBet(5, c.PROP_12);
  yield* table().dice().throw(6, 6);
  
  yield* waitUntil("spotlight");
  const spotlight = new Spotlight({ moveTo: [-475, -235] });
  view.add(spotlight);
  yield* spotlight.turnOn([-475, -235], 300, 1);
  yield* spotlight.moveTo([-330, 130], 1, easeInOutCubic);
  yield* spotlight.turnOff(1, easeInOutCubic);
  yield* waitUntil("win150")
  camera().save();
  yield* all(
    camera().zoom(1.5, 2, easeInOutCubic),
    camera().position([-330, 130], 2, easeInOutCubic)
  );
  yield* table().bets().winBet(150, c.PROP_12, true);
  yield* camera().restore(2, easeInOutCubic);
  yield table().dice().removeDice();

  yield* waitUntil("bet50");
  yield* table().bets().makeBet(50, c.PROP_12);

  yield* waitUntil("roll3")
  yield* table().dice().throw(6, 6);

  camera().save();
  yield* all(
    camera().zoom(1.5, 0.6, easeInOutCubic),
    camera().position([-330, 130], 0.6, easeInOutCubic)
  );

  const bigChip = table().bets().newChip(1500, c.DEALER);
  bigChip.opacity(1);

  yield* bigChip.position([-370, 175], 1, easeInOutCubic);
  yield* Indicate(bigChip, 2);

  yield* waitUntil("remove-chips");
  yield camera().restore(2, easeInOutCubic);
  yield* waitFor(1.2);
  yield* all(
    table().bets().removeBet(c.PROP_12),
    bigChip.position([0, 800], 1, easeInCubic),
    bigChip.opacity(0, 0.6, linear)
  );

  yield* table().dice().removeDice();

  //yield* table().movePuckTo(c.PUCK4);

  // yield* table().bets().makeBet(15, c.DONTCOME);
  // yield* table().bets().moveBet(c.DONTCOME, c.DONTCOME5);
  // yield* table().bets().makeBet(15, c.DONTCOME);
  // yield* table().bets().moveBet(c.DONTCOME, c.DONTCOME8);

  // yield* waitFor(1);

  // yield* waitUntil("odds");
  // yield* sequence(
  //   0.5,
  //   table().bets().makeBet(30, c.DONTPASSODDS),
  //   table().bets().makeBet(24, c.DONTCOME5ODDS),
  //   table().bets().makeBet(18, c.DONTCOME8ODDS)
  // );

  // yield* sequence(
  //   0.4,
  //   table().bets().loseBet(c.DONTCOME5),
  //   table().bets().loseBet(c.DONTCOME5ODDS)
  // );
  // yield* spotlight.moveTo([700, -185], 1, easeInOutCubic);
  // yield* waitFor(1);

  // yield* spotlight.turnOff();
  // yield* waitFor(1);

  // yield* camera().reset(2, easeInOutCubic);

  // yield* waitFor(1);
  // yield* waitUntil("dp");

  // yield* table().dice().throw(2, 2);
  // yield* sequence(
  //   0.3,
  //   table().bets().loseBet(c.DONTPASS),
  //   table().bets().loseBet(c.DONTPASSODDS)
  // );
  // yield* table().movePuckTo(c.PUCKOFF);
  // yield* table().dice().removeDice();
  // yield* waitFor(1);
  // yield* table().bets().makeBet(15, c.DONTPASS);

  //yield* waitFor(5);

  yield* waitUntil("end");
});
