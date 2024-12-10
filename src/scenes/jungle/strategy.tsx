import {
  CODE,
  Code,
  Icon,
  Img,
  Layout,
  LezerHighlighter,
  Line,
  lines,
  makeScene2D,
  Rect,
  Txt,
} from "@motion-canvas/2d";
import {
  all,
  createRef,
  createSignal,
  DEFAULT,
  easeInElastic,
  easeInOutCubic,
  easeOutCubic,
  fadeTransition,
  linear,
  sequence,
  waitFor,
  waitUntil,
} from "@motion-canvas/core";

import {
  Bright,
  Grays,
  ITCBenguiatNormal,
  MonoWhite,
  PoppinsWhite,
  Theme,
} from "../../styles";

import { FadeIn } from "../../utils/FadeIn";
import bg from "../../../assets/dark_craps_layout_bg.png";

import { parser } from "@lezer/markdown";
import { CrapsTable } from "../../components/craps/CrapsTable";
import { CrapsScoreBug } from "../../components/craps/CrapsScoreBug";
import { CrapsProcessor } from "../../components/craps/CrapsProcessor";

import simData from "../../../../dicedata/output/jungle-new/jungle-new-sessions.json";

Code.defaultHighlighter = new LezerHighlighter(parser);

const step5 = CODE`\
5. All bets on table are now pure profit, so 
feel free to change into any strategy from this 
point onwards. Start a press and collect strategy, 
use further winnings to spread out to the 4 and 10, 
switch to double-tap or triple-lux system, etc.`;

export default makeScene2D(function* (view) {
  view.fill(Theme.BG);

  // view.add(
  //   <Img
  //     src={bg}
  //     opacity={0.3}
  //   />
  // );

  const container = createRef<Layout>();
  const code = createRef<Code>();

  view.add(
    <Layout ref={container}>
      <Code
        ref={code}
        fontSize={50}
        offsetX={-1}
        x={-660}
        code={`\
# THE JUNGLE

`}
      />
      ,
    </Layout>
  );

  yield* fadeTransition();
  yield* waitFor(1);

  const step1 = CODE`\
1. Wait for a point 
   to be established
`;
  yield* code().code.append(step1, 1);
  yield* waitFor(1);

  const step2 = CODE`\
2. Place $66 Inside
`;
  yield* code().code.append(step2, 1);
  yield* waitFor(1);

  const step3 = CODE`\
3. With each hit: 
   - Go up one unit
   - Make a $15 DC
`;
  yield* code().code.append(step3, 1);
  yield* waitFor(1);

  const step4 = CODE`\
4. On an 11: 
   - Wait for another win 
     before replacing the 
     Don't Come
`;
  yield* code().code.append(step4, 1);
  yield* waitFor(1);

  const step5 = CODE`\
5. After three hits:
   - Regress the number 
     to the base bet.
`;
  yield* code().code.append(step5, 1);
  yield* waitFor(1);

  yield code().scale(0.7, 1, easeInOutCubic);
  yield code().y(-100, 1, easeInOutCubic);
  yield* code().x(420, 1, easeInOutCubic);

  const table = createRef<CrapsTable>();
  const bug = createRef<CrapsScoreBug>();
  view.add(
    <Layout ref={container}>
      <CrapsTable
        ref={table}
        opacity={0}
        scale={0.7}
        x={-270}
        y={-100}
      ></CrapsTable>
      <CrapsScoreBug
        ref={bug}
        opacity={0}
        scale={0.8}
      />
    </Layout>
  );

  yield* FadeIn(table(), 1, easeOutCubic, [0, 500]);
  bug().position([-270, 360]);
  yield* sequence(
    0.5,
    FadeIn(bug(), 0.6, easeOutCubic, [0, 100]),
    bug().updateLabel("GOOD LUCK!")
  );

  const processor = new CrapsProcessor(table, bug);
  //const session = simData[0].SESSION;
  const session = 82436;
  const firstSession = simData.filter(({ SESSION }) => SESSION === session);

  yield* code().selection(lines(2, 3), 0.6);
  yield* processor.round(firstSession[0]);
  yield* processor.round(firstSession[1]);
  yield* processor.round(firstSession[2]);
  yield* code().selection(lines(4), 0.6);
  yield* processor.round(firstSession[3]);
  yield* code().selection(lines(5, 7), 0.6);
  yield* processor.round(firstSession[4]);
  yield* processor.round(firstSession[5]);
  yield* code().selection(DEFAULT, 0.6);
  yield* processor.round(firstSession[6]);
  yield* processor.round(firstSession[7]);
  yield* processor.round(firstSession[8]);
  yield* processor.round(firstSession[9]);
  yield* processor.round(firstSession[10]);
  yield* processor.round(firstSession[11]);
  yield* code().selection(lines(12, 14), 0.6);
  yield* processor.round(firstSession[12]);
  yield* processor.round(firstSession[13]);
  yield* processor.round(firstSession[14]);
  yield* processor.round(firstSession[15]);
  yield* processor.round(firstSession[16]);

  yield* waitFor(3);

  yield* waitUntil("end");
});
