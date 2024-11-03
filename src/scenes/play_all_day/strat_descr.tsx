import { Img, Layout, Line, makeScene2D, Rect, Txt } from "@motion-canvas/2d";
import {
  all,
  createRef,
  easeInBounce,
  easeInCubic,
  easeInOutCubic,
  easeOutCubic,
  sequence,
  waitFor,
  waitUntil,
} from "@motion-canvas/core";

import {
  Bright,
  Darkest,
  Grays,
  MonoWhite,
  PoppinsWhite,
  Theme,
} from "../../styles";

import chip25 from "../../../assets/Chips/Chip_0025.png";
import { FadeIn } from "../../utils/FadeIn";
import { FadeOut } from "../../utils/FadeOut";

const LabelFont = {
  ...PoppinsWhite,
  fontWeight: 600,
  fontSize: 40,
  fill: Bright.WHITE,
};

const NumberFont = {
  ...MonoWhite,
  fontWeight: 600,
  fontSize: 80,
};

export default makeScene2D(function* (view) {
  view.fill(Theme.BG);
  view.opacity(1);

  const container = createRef<Layout>();

  const dp = createRef<Rect>();
  const come1 = createRef<Rect>();
  const come2 = createRef<Rect>();
  const dc = createRef<Rect>();
  const outline = createRef<Rect>();

  const come1win = createRef<Img>();
  const come2lose = createRef<Img>();

  const dparrow = createRef<Line>();
  const comearrow = createRef<Line>();
  const dcarrow = createRef<Line>();

  const label = createRef<Txt>();

  view.add(
    <Layout ref={container}>
      <Rect
        ref={dp}
        width={300}
        height={200}
        radius={10}
        stroke={Bright.BLUE}
        lineWidth={2}
        fill={Darkest.BLUE}
        opacity={0}
      >
        <Img
          src={chip25}
          scale={0.8}
          y={-100}
        />
        <Txt
          {...LabelFont}
          text="DON'T PASS"
        />
      </Rect>

      <Rect
        ref={come1}
        width={300}
        height={200}
        radius={10}
        x={-214}
        stroke={Bright.BLUE}
        lineWidth={2}
        fill={Darkest.BLUE}
        opacity={0}
      >
        <Img
          src={chip25}
          scale={0.8}
          y={-100}
        />
        <Txt
          {...LabelFont}
          text="COME"
        />
      </Rect>

      <Rect
        ref={come2}
        width={300}
        height={200}
        radius={10}
        x={214}
        stroke={Bright.BLUE}
        lineWidth={2}
        fill={Darkest.BLUE}
        opacity={0}
      >
        <Img
          ref={come2lose}
          src={chip25}
          scale={0.8}
          y={-100}
        />
        <Txt
          {...LabelFont}
          text="COME"
        />
      </Rect>

      <Rect
        ref={dc}
        width={300}
        height={200}
        radius={10}
        x={640}
        stroke={Bright.BLUE}
        lineWidth={2}
        fill={Darkest.BLUE}
        opacity={0}
      >
        <Img
          src={chip25}
          scale={0.8}
          y={-100}
        />
        <Txt
          {...LabelFont}
          text="DON'T COME"
        />
      </Rect>

      <Line
        ref={dparrow}
        lineWidth={30}
        stroke={Grays.GRAY2}
        startOffset={20}
        endOffset={20}
        endArrow
        end={0}
        arrowSize={40}
        points={[dp().right, come1().left]}
      />
      <Line
        ref={comearrow}
        lineWidth={30}
        stroke={Grays.GRAY2}
        startOffset={20}
        endOffset={20}
        endArrow
        end={0}
        arrowSize={40}
        points={[come1().right, come2().left]}
      />
      <Line
        ref={dcarrow}
        lineWidth={30}
        stroke={Grays.GRAY2}
        startOffset={20}
        endOffset={20}
        endArrow
        end={0}
        arrowSize={40}
        points={[come2().right, dc().left]}
      />
      <Img
        ref={come1win}
        src={chip25}
        scale={0.8}
        y={-600}
        opacity={0}
      />
      <Rect
        ref={outline}
        lineWidth={7}
        radius={20}
        lineDash={[20, 5]}
        stroke={Bright.YELLOW}
        width={1450}
        height={140}
        y={-100}
        end={0}
      />
      <Txt
        ref={label}
        {...LabelFont}
        text="$100 PER SHOOTER"
        y={-250}
        fill={Bright.YELLOW}
        fontSize={80}
        opacity={0}
      />
    </Layout>
  );

  yield* waitFor(1);

  yield* waitUntil("dp");
  yield* FadeIn(dp, 1, easeOutCubic, [0, 100]);
  yield* dp().x(-640, 1, easeInOutCubic);

  yield* sequence(
    0.6,
    FadeIn(come1, 1, easeOutCubic, [0, 100]),
    dparrow().end(1, 1, easeInOutCubic),
    FadeIn(come2, 1, easeOutCubic, [0, 100]),
    comearrow().end(1, 1, easeInOutCubic)
  );

  yield* waitUntil("dc");

  yield* sequence(
    0.6,
    FadeIn(dc, 1, easeOutCubic, [0, 100]),
    dcarrow().end(1, 1, easeInOutCubic)
  );

  yield* waitUntil("win");
  yield* all(
    FadeIn(come1win),
    come1win().position(come1().position().add([100, -100]), 0.6, easeOutCubic)
  );

  yield* come1win()
    .scale(1.3, 0.6, easeInOutCubic)
    .to(0.8, 0.6, easeInOutCubic);
  yield* come1win().position([0, 350], 0.6, easeInOutCubic);

  yield* FadeOut(come2lose, 0.6, easeInCubic, [0, -100]);
  yield* come1win().position(
    come2().position().addY(-100),
    0.6,
    easeInOutCubic
  );

  yield* waitUntil("max");
  yield* outline().end(1, 1, easeOutCubic);

  yield* waitFor(0.5);
  yield* FadeIn(label, 1, easeOutCubic, [200, 0]);

  // END
  yield* waitFor(5);
  yield* FadeOut(container);
  yield* waitUntil("end");
});
