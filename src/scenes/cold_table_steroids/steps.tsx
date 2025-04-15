import {
  makeScene2D,
  Layout,
  Txt,
  Line,
  LineProps,
  Node,
  TxtProps,
} from "@motion-canvas/2d";
import {
  createRef,
  createSignal,
  delay,
  easeInBack,
  easeInOutCubic,
  easeOutBack,
  easeOutCubic,
  linear,
  sequence,
  waitFor,
} from "@motion-canvas/core";
import { Bright, PoppinsWhite } from "../../styles";
import { FadeIn } from "../../utils/FadeIn";
import { tw_colors } from "../../tw_colors";
import { ChipColors, CrapsChip } from "../../components/craps/CrapsChip";

const FONT_SIZE = 80;
const FONT_WEIGHT = 400;

const LABEL_PROPS: TxtProps = {
  fontSize: 40,
  fill: Bright.BLUE,
  fontWeight: 400,
  layout: false,
};
const DASHED_LINE_PROPS: LineProps = {
  endArrow: true,
  arrowSize: 40,
  stroke: tw_colors.blue[400],
  startOffset: 80,
  endOffset: 80,
  // lineDash: [50, 20],
  lineWidth: 30,
  end: 1,
  opacity: 0,
};

const x1 = -1152;
const x2 = -384;
const x3 = 384;
const x4 = 1152;

const leftColX = createSignal(0);
const rightColX = createSignal(0);
const TOP_ROW_Y = 0;
const BOTTOM_ROW_Y = 0;

export default makeScene2D(function* (view) {
  // STEP 1
  const step1 = createRef<Txt>();
  const step1Node = createRef<Node>();
  const step1Sig = createSignal("Passline\nOne Unit");
  view.add(
    <Node
      ref={step1Node}
      opacity={0}
    >
      <Layout
        layout
        direction={"column"}
        alignItems={"center"}
        ref={step1}
        x={x1}
        y={TOP_ROW_Y}
      >
        {() =>
          step1Sig()
            .split("\n")
            .map((line) => (
              <Txt
                {...PoppinsWhite}
                fill={"white"}
                fontSize={FONT_SIZE}
                fontWeight={FONT_WEIGHT}
                text={line}
              />
            ))
        }
      </Layout>
    </Node>
  );

  // STEP 2
  const step2 = createRef<Txt>();
  const step2Node = createRef<Node>();
  const step2Sig = createSignal("Don't Come\nTwo Units");
  view.add(
    <Node
      ref={step2Node}
      opacity={0}
    >
      <Layout
        layout
        direction={"column"}
        alignItems={"center"}
        ref={step2}
        x={x2}
        y={BOTTOM_ROW_Y}
      >
        {() =>
          step2Sig()
            .split("\n")
            .map((line) => (
              <Txt
                {...PoppinsWhite}
                fill={"white"}
                fontSize={FONT_SIZE}
                fontWeight={FONT_WEIGHT}
                text={line}
              />
            ))
        }
      </Layout>
    </Node>
  );

  // STEP 1 TO STEP 2
  const oneToTwo = createRef<Line>();
  view.add(
    <Line
      ref={oneToTwo}
      {...DASHED_LINE_PROPS}
      points={[() => step1().right(), () => step2().left()]}
      end={0}
    ></Line>
  );

  // STEP 3
  const step3 = createRef<Txt>();
  const step3Node = createRef<Node>();
  const step3Sig = createSignal("Come\nOne Unit");
  view.add(
    <Node
      ref={step3Node}
      opacity={0}
    >
      <Layout
        layout
        direction={"column"}
        alignItems={"center"}
        ref={step3}
        x={x3}
        y={TOP_ROW_Y}
      >
        {() =>
          step3Sig()
            .split("\n")
            .map((line) => (
              <Txt
                {...PoppinsWhite}
                fill={"white"}
                fontSize={FONT_SIZE}
                fontWeight={FONT_WEIGHT}
                text={line}
              />
            ))
        }
      </Layout>
    </Node>
  );

  // STEP 2 TO STEP 3
  const stepTwoToThree = createRef<Line>();
  view.add(
    <Line
      ref={stepTwoToThree}
      {...DASHED_LINE_PROPS}
      points={[() => step2().right(), () => step3().left()]}
      end={0}
    ></Line>
  );

  // STEP 4
  const step4 = createRef<Txt>();
  const step4Node = createRef<Node>();
  const step4Sig = createSignal("Come\nOne Unit");
  view.add(
    <Node
      ref={step4Node}
      opacity={0}
    >
      <Layout
        layout
        direction={"column"}
        alignItems={"center"}
        ref={step4}
        x={x4}
        y={0}
      >
        {() =>
          step4Sig()
            .split("\n")
            .map((line) => (
              <Txt
                {...PoppinsWhite}
                fill={"white"}
                fontSize={FONT_SIZE}
                fontWeight={FONT_WEIGHT}
                text={line}
              />
            ))
        }
      </Layout>
    </Node>
  );

  // STEP 3 TO STEP 4
  const stepThreeToFour = createRef<Line>();
  view.add(
    <Line
      ref={stepThreeToFour}
      {...DASHED_LINE_PROPS}
      points={[() => step3().right(), () => step4().left()]}
      end={0}
    ></Line>
  );

  // ANIMATIONS
  yield* waitFor(1);

  // Step 1 to 2
  yield* FadeIn(step1Node, 0.6, easeOutBack, [0, 100]);
  yield* waitFor(0.5);
  yield oneToTwo().opacity(1, 0.3, easeOutCubic);
  yield oneToTwo().end(1, 0.6, easeOutCubic);
  yield* waitFor(0.5);
  yield* FadeIn(step2Node, 0.6, easeOutBack, [0, 100]);

  yield* waitFor(1);

  // Step 2 to three

  // Show build a model
  yield stepTwoToThree().opacity(1, 0.3, easeOutCubic);
  yield stepTwoToThree().end(1, 0.6, easeOutCubic);
  yield* waitFor(0.5);
  yield* FadeIn(step3Node, 0.6, easeOutBack, [0, 100]);

  yield* waitFor(1);
  // Show simulate thousands of games
  yield stepThreeToFour().opacity(1, 0.3, easeOutCubic);
  yield stepThreeToFour().end(1, 0.6, easeOutCubic);
  yield* waitFor(0.5);
  yield* FadeIn(step4Node, 0.6, easeOutBack, [0, 100]);

  // Create seven chips for 25
  const chip1 = new CrapsChip({ denom: 25, chipColor: ChipColors.AUTO });
  const chip2 = new CrapsChip({ denom: 25, chipColor: ChipColors.AUTO });
  const chip3 = new CrapsChip({ denom: 25, chipColor: ChipColors.AUTO });
  const chip4 = new CrapsChip({ denom: 25, chipColor: ChipColors.AUTO });
  const chip5 = new CrapsChip({ denom: 25, chipColor: ChipColors.AUTO });
  const chip6 = new CrapsChip({ denom: 25, chipColor: ChipColors.AUTO });
  const chip7 = new CrapsChip({ denom: 25, chipColor: ChipColors.AUTO });

  const chips = [];
  const nChips = 7;

  const chipX = x1;
  const chipOffset = 380;
  const chipY = 650;
  const chipScale = 0.8;

  for (let i = 0; i < nChips; i++) {
    const chip = new CrapsChip({ denom: 25, chipColor: ChipColors.AUTO });
    chip.y(chipY);
    chip.scale(chipScale);
    chip.x(chipX + i * chipOffset);
    // chip.opacity(1);
    chips[i] = chip;
  }

  view.add(chips);

  yield* waitFor(1);
  // Animate chips
  yield* sequence(
    0.2,
    ...chips.map((chip) => FadeIn(chip, 0.5, easeOutBack, [0, 100]))
  );

  yield* waitFor(1);
  yield* chips[0].position([x1, 250], 0.6, easeInOutCubic);
  yield* waitFor(0.2);
  yield* sequence(
    0.2,
    chips[1].position([x2 - 100, 250], 0.6, easeInOutCubic),
    chips[2].position([x2 + 100, 250], 0.6, easeInOutCubic)
  );
  yield* chips[3].position([x3, 250], 0.6, easeInOutCubic);
  yield* chips[4].position([x4, 250], 0.6, easeInOutCubic);

  yield* waitFor(1);
  // Remove a chip
  yield* chips[0].scale(0, 0.6, easeInBack);
  yield* chips[5].position([x1, 250], 0.6, easeInOutCubic);
  yield* waitFor(1);
  // Remove a chip
  yield* chips[3].scale(0, 0.6, easeInBack);
  yield* chips[6].position([x3, 250], 0.6, easeInOutCubic);

  yield* waitFor(5);
});
