import { Layout, makeScene2D } from "@motion-canvas/2d";
import {
  createRef,
  easeOutCubic,
  sequence,
  waitFor,
} from "@motion-canvas/core";
import { CrapsTable } from "../../components/craps/CrapsTable";

import { CrapsProcessor } from "../../components/craps/CrapsProcessor";
import { CrapsScoreBug } from "../../components/craps/CrapsScoreBug";
import { FadeIn } from "../../utils/FadeIn";

import simData from "../../../../dicedata/output/skill66-100k/skill66-100k-sessions.json";
import { Theme } from "../../styles";

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

  yield* waitFor(1);

  const processor = new CrapsProcessor(table, bug);

  //const session = simData[0].SESSION;
  const session = 61200;
  const firstSession = simData.filter(({ SESSION }) => SESSION === session);

  for (const roll of firstSession) {
    yield* processor.round(roll);
  }

  // yield* bug().hideLabel();
  // yield* bug().hidePlayer();

  yield* bug().updateLabel("GAME OVER");
  yield* waitFor(10);
});
