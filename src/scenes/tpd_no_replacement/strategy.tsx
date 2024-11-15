import { Camera, Circle, Layout, makeScene2D, Txt } from "@motion-canvas/2d";
import {
  all,
  createRef,
  easeInOutCubic,
  easeOutCubic,
  sequence,
  waitFor,
  waitUntil,
} from "@motion-canvas/core";

import { PoppinsWhite, Theme } from "../../styles";

import { CrapsTable } from "../../components/craps/CrapsTable";
import { FadeIn } from "../../utils/FadeIn";

import felt from "../../../assets/Tables/Craps_Table_Red_Felt.png";
import { c, tableCoords } from "../../components/craps/CrapsTableCoords";
import { Spotlight } from "../../utils/Spotlight";

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

  table().setTableSrc(felt);

  yield* FadeIn(table(), 1, easeOutCubic, [0, 500]);

  yield* table().bets().makeBet(15, c.DONTPASS);
  yield* table().movePuckTo(c.PUCK4);

  yield* table().bets().makeBet(15, c.DONTCOME);
  yield* table().bets().moveBet(c.DONTCOME, c.DONTCOME5);
  yield* table().bets().makeBet(15, c.DONTCOME);
  yield* table().bets().moveBet(c.DONTCOME, c.DONTCOME8);

  camera().save();
  yield* all(
    camera().zoom(1.5, 4, easeInOutCubic),
    camera().position([0, -100], 4, easeInOutCubic)
  );

  yield* waitFor(1);

  yield* waitUntil("odds");
  yield* sequence(
    0.5,
    table().bets().makeBet(30, c.DONTPASSODDS),
    table().bets().makeBet(24, c.DONTCOME5ODDS),
    table().bets().makeBet(18, c.DONTCOME8ODDS)
  );

  yield* waitUntil("spotlight");
  const spotlight = new Spotlight({ moveTo: [-10, 120] });
  view.add(spotlight);

  yield* waitFor(1);
  yield* spotlight.turnOn([-90, -280], 300, 2);
  yield* sequence(
    0.4,
    table().bets().loseBet(c.DONTCOME5),
    table().bets().loseBet(c.DONTCOME5ODDS)
  );
  yield* spotlight.moveTo([700, -185], 1, easeInOutCubic);
  yield* waitFor(1);

  yield* spotlight.turnOff();
  yield* waitFor(1);

  yield* camera().reset(2, easeInOutCubic);

  yield* waitFor(1);
  yield* waitUntil("dp");

  yield* table().dice().throw(2, 2);
  yield* sequence(
    0.3,
    table().bets().loseBet(c.DONTPASS),
    table().bets().loseBet(c.DONTPASSODDS)
  );
  yield* table().movePuckTo(c.PUCKOFF);
  yield* table().dice().removeDice();
  yield* waitFor(1);
  yield* table().bets().makeBet(15, c.DONTPASS);

  yield* waitFor(5);

  yield* waitUntil("end");
});
