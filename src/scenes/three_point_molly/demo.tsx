import { Layout, makeScene2D } from "@motion-canvas/2d";
import {
  createRef,
  easeOutCubic,
  sequence,
  useLogger,
  waitFor,
} from "@motion-canvas/core";
import { CrapsTable } from "../../components/craps/CrapsTable";

import { CrapsProcessor } from "../../components/craps/CrapsProcessor";
import { CrapsScoreBug } from "../../components/craps/CrapsScoreBug";
import { FadeIn } from "../../utils/FadeIn";

//-sessions.json
import simData from "../../../../dicedata/output/three_point_molly-100k/three_point_molly-100k-sessions.json";
//-all-sessions.json
import sessions from "../../../../dicedata/output/three_point_molly-100k/three_point_molly-100k-all_sessions.json";

import { Theme } from "../../styles";
import { c } from "../../components/craps/CrapsTableCoords";

enum s {
  BEST = 1,
  WORST = 2,
}

const whichSession = s.WORST;

export default makeScene2D(function* (view) {
  view.fill(Theme.BG);
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
    bug().updateLabel("GOOD LUCK!")
  );

  const chip = table().bets().newChip(15, c.PLAYER);
  chip.opacity(0);

  yield* waitFor(1);

  const processor = new CrapsProcessor(table, bug);

  // let session = simData[15].SESSION;
  // let session = 188;
  // useLogger().debug("SESSION=" + session);

  let session = simData[0].SESSION;

  if (whichSession == s.BEST) {
    session = sessions[0].SESSION;
  }
  if (whichSession == s.WORST) {
    session = sessions[sessions.length - 1].SESSION;
  }

  const firstSession = simData.filter(({ SESSION }) => SESSION === session);

  for (const roll of firstSession) {
    useLogger().debug("ROLL=" + roll.ROLL);
    yield* processor.round(roll);
  }

  // yield* bug().hideLabel();
  // yield* bug().hidePlayer();

  yield* bug().updateLabel("GAME OVER");
  yield* waitFor(10);
});
