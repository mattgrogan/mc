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

Code.defaultHighlighter = new LezerHighlighter(parser);

const step5 = CODE`\
5. All bets on table are now pure profit, so 
feel free to change into any strategy from this 
point onwards. Start a press and collect strategy, 
use further winnings to spread out to the 4 and 10, 
switch to double-tap or triple-lux system, etc.`;

export default makeScene2D(function* (view) {
  view.fill("#000");
  view.add(
    <Img
      src={bg}
      opacity={0.3}
    />
  );

  const container = createRef<Layout>();
  const code = createRef<Code>();

  view.add(
    <Layout
      ref={container}
      direction={"column"}
      gap={50}
    >
      {" "}
      <Code
        ref={code}
        fontSize={28}
        code={`\
# OPENING BETS

  $66 Inside 

# THE PLAY

  1st Hit
    - $22 Pressure
      - $88 Inside

  2nd Hit
    - Regress to $44 Inside
    - ... or reinvest as you please
`}
      />
      ,
    </Layout>
  );
  yield* waitFor(1);
  yield* code().code.append(step5, 1);
  yield* waitFor(1);
  // select line 1
  yield* code().selection(lines(10, 12), 0.6);
  yield* waitFor(1);
  yield* code().selection(DEFAULT, 0.6);

  // const range = createSignal(() => {
  //   const range = code().findFirstRange("2nd");
  //   const bboxes = code().getSelectionBBox(range);
  //   // "getSelectionBBox" returns an array of bboxes,
  //   // one for each line in the range. You can just
  //   // use the first one for this example.
  //   const first = bboxes[0];
  //   return first.expand([4, 8]);
  // });

  // code().add(
  //   <Rect
  //     offset={-1}
  //     position={range().position}
  //     size={range().size}
  //     lineWidth={4}
  //     stroke={"white"}
  //     radius={8}
  //   />
  // );

  yield* waitFor(3);

  yield* waitUntil("end");
});
