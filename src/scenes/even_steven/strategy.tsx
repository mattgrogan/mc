import {
  CODE,
  Code,
  Layout,
  LezerHighlighter,
  lines,
  makeScene2D,
} from "@motion-canvas/2d";
import {
  createRef,
  DEFAULT,
  easeInOutCubic,
  easeOutCubic,
  fadeTransition,
  linear,
  sequence,
  waitFor,
  waitUntil,
} from "@motion-canvas/core";

import { Theme } from "../../styles";

import { FadeIn } from "../../utils/FadeIn";

import { parser } from "@lezer/markdown";
import { CrapsProcessor } from "../../components/craps/CrapsProcessor";
import { CrapsScoreBug } from "../../components/craps/CrapsScoreBug";
import { CrapsTable } from "../../components/craps/CrapsTable";

import simData from "../../../../dicedata/output/evensteven-fixed/evensteven-fixed-sessions.json";
import { c } from "../../components/craps/CrapsTableCoords";

Code.defaultHighlighter = new LezerHighlighter(parser);

function roll(r: number): number {
  return r - 1;
}

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
# EVEN STEVEN

`}
      />
      ,
    </Layout>
  );

  yield* fadeTransition();
  yield* waitFor(1);

  yield* waitUntil("step1");

  const step1 = CODE`\
1. Wait for a point 
   to be established
`;
  yield* code().code.append(step1, 1);
  yield* waitFor(1);

  yield* waitUntil("step2");
  const step2 = CODE`\
2. Bet $110 on the 
   evens
`;
  yield* code().code.append(step2, 1);
  yield* waitFor(1);

  yield* waitUntil("step3");
  const step3 = CODE`\
3. First hit: Bump 6
   and 8 to $42 each.
`;
  yield* code().code.append(step3, 1);
  yield* waitFor(1);

  yield* waitUntil("step4");
  const step4 = CODE`\
4. Collect on 2nd and 
   3rd hits
`;
  yield* code().code.append(step4, 1);
  yield* waitFor(1);

  yield* waitUntil("step5");
  const step5 = CODE`\
5. Fourth hit: Add 
   $25 on 5/9
`;
  yield* code().code.append(step5, 1);
  yield* waitFor(1);

  yield* waitUntil("step6");
  const step6 = CODE`\
6. Alternate press 
   and collect until 
   seven out
`;
  yield* code().code.append(step6, 1);
  yield* waitFor(1);

  yield* waitFor(1);

  yield* waitUntil("scale-down");
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

  const badChip = table().bets().newChip(15, c.PLAYER);
  yield table().bets().moveChipTo(badChip, c.PASSLINE, 0, linear, 0);

  const processor = new CrapsProcessor(table, bug);
  //const session = simData[0].SESSION;
  const session = 32472;
  const firstSession = simData.filter(({ SESSION }) => SESSION === session);

  yield* code().selection(lines(2, 3), 0.6);
  yield* processor.round(firstSession[roll(1)]);
  yield* code().selection(lines(4, 5), 0.6);
  yield* processor.round(firstSession[roll(2)]);
  yield* waitFor(2)
  yield* waitUntil("problem area")
  yield* code().selection(lines(6, 7), 0.6);
  yield* processor.round(firstSession[roll(3)]);
  yield* code().selection(lines(8, 9), 0.6);
  yield* processor.round(firstSession[roll(4)]);
  yield* processor.round(firstSession[roll(5)]);
  yield* processor.round(firstSession[roll(6)]);
  yield* processor.round(firstSession[roll(7)]);
  yield* code().selection(lines(10, 11), 0.6);
  yield* processor.round(firstSession[roll(8)]);
  yield* code().selection(lines(12, 14), 0.6);
  yield* processor.round(firstSession[roll(9)]);
  yield* processor.round(firstSession[roll(10)]);
  yield* processor.round(firstSession[roll(11)]);
  yield* processor.round(firstSession[roll(12)]);
  // yield* processor.round(firstSession[roll(13)]);
  // yield* processor.round(firstSession[roll(14)]);
  // yield* processor.round(firstSession[roll(15)]);
  // yield* processor.round(firstSession[roll(16)]);
  // yield* processor.round(firstSession[roll(17)]);
  // yield* processor.round(firstSession[roll(18)]);
  // yield* processor.round(firstSession[roll(19)]);
  // yield* processor.round(firstSession[roll(20)]);
  // yield* processor.round(firstSession[roll(21)]);
  // yield* processor.round(firstSession[roll(22)]);
  // yield* processor.round(firstSession[roll(23)]);
  // yield* processor.round(firstSession[roll(24)]);
  yield* code().selection(DEFAULT, 0.6);

  yield* waitFor(3);

  yield* waitUntil("end");
});
