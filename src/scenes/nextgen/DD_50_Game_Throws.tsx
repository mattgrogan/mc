import {
  Circle,
  Gradient,
  Icon,
  Layout,
  makeScene2D,
  Rect,
  Txt,
  Node,
} from "@motion-canvas/2d";
import {
  createRef,
  createRefArray,
  createSignal,
  easeInCirc,
  easeInCubic,
  easeOutBounce,
  easeOutCubic,
  easeOutElastic,
  easeOutExpo,
  easeOutQuint,
  easeOutSine,
  linear,
  range,
  sequence,
  SimpleSignal,
  useLogger,
  waitFor,
  waitUntil,
} from "@motion-canvas/core";
import {
  Bright,
  Darker,
  Darkest,
  grayGradient,
  Grays,
  MonoWhite,
  PoppinsWhite,
  Theme,
  whiteGradientH,
} from "../../styles";
import { FadeIn } from "../../utils/FadeIn";

import { sim } from "./DD_00_Params";

const titleGradient = new Gradient({
  type: "linear",

  from: [0, -200],
  to: [0, 200],
  stops: [
    { offset: 0, color: "#fff" },
    { offset: 1, color: "#c9c9c9" },
  ],
});

export default makeScene2D(function* (view) {
  view.fill(Theme.BG);

  const title = createRef<Rect>();
  const titleLines = createRefArray<Txt>();

  view.add(
    <Rect
      ref={title}
      width={"100%"}
      height={"20%"}
      fill={titleGradient}
      offsetY={-1}
      y={view.height() / -2}
      shadowColor={Darker.BLUE}
      shadowBlur={15}
      shadowOffsetY={10}
      direction={"column"}
      justifyContent={"center"}
      // alignContent={"start"}
      padding={100}
      // gap={0}
      layout
    >
      <Txt
        ref={titleLines}
        {...PoppinsWhite}
        fill={Darker.BLUE}
        text={sim.name}
        fontSize={240}
        fontWeight={600}
        lineHeight={200}
        opacity={0}
      />
      <Txt
        ref={titleLines}
        {...PoppinsWhite}
        fill={Grays.GRAY3}
        fontSize={120}
        fontWeight={600}
        text={"THROWS"}
        opacity={0}
      />
    </Rect>
  );

  // suppress the layout for a while and remember the positions
  title()
    .children()
    .forEach((ref) => ref.save());
  title().layout(false);
  title()
    .children()
    .forEach((ref) => ref.restore());

  // Animate the title
  yield FadeIn(titleLines[0], 0.6, easeOutCubic, [80, 0]);
  yield* waitFor(0.4);
  yield* FadeIn(titleLines[1], 0.6, easeOutCubic, [80, 0]);

  const container = createRef<Layout>();
  const rows = createRefArray<Rect>();
  const rowTxts = createRefArray<Txt>();
  const nodes = createRefArray<Txt>();
  let z = -100;
  view.add(
    <Layout
      ref={container}
      direction={"column"}
      width={"14%"}
      height={"80%"}
      y={view.height() * 0.1}
      x={view.width() / -2}
      offsetX={-1}
      gap={0}
      layout
      opacity={1}
      zIndex={-100}
    >
      {range(6).map((index) => (
        <Node
          ref={nodes}
          opacity={0}
          zIndex={z--}
        >
          <Rect
            ref={rows}
            width={"100%"}
            height={"100%"}
            fill={Grays.BLACK}
            justifyContent={"start"}
            alignItems={"center"}
            padding={50}
            stroke={Grays.GRAY2}
            lineWidth={5}
          >
            <Txt
              ref={rowTxts}
              {...PoppinsWhite}
              fill={Grays.GRAY2}
              text={"SESSIONS"}
              fontSize={65}
              fontWeight={600}
              textWrap={"wrap"}
            ></Txt>
          </Rect>
        </Node>
      ))}
    </Layout>
  );

  rowTxts[0].text("DICE AND GAME FLOW");
  rowTxts[1].text("HOUSE TAKE AND EDGE");
  rowTxts[2].text("WON/LOST BY SHOOTER");
  rowTxts[3].text("WON/LOST BY SESSION");
  rowTxts[4].text("BANKROLL SURVIVAL");
  rowTxts[5].text("STRATEGY SCORE");

  yield* sequence(
    0.4,
    ...nodes.map((node) => FadeIn(node, 0.6, easeOutSine, [0, -200]))
  );

  yield* waitFor(1);

  yield rows[0].fill(Darkest.RED, 1, easeOutElastic);
  yield* rowTxts[0].fill(Grays.WHITE, 1, linear);

  // container().add(
  // );

  // container().add(
  //   <Rect
  //     ref={rows}
  //     opacity={0}
  //     width={"100%"}
  //     height={"18%"}
  //     stroke={Grays.GRAY3}
  //     lineWidth={5}
  //   >
  //     <Rect
  //       width={"50%"}
  //       height={"100%"}
  //       fill={Grays.WHITE}
  //       justifyContent={"start"}
  //       alignItems={"center"}
  //       padding={50}
  //     >
  //       <Txt
  //         {...PoppinsWhite}
  //         fill={Grays.BLACK}
  //         text={"SESSIONS"}
  //         fontSize={90}
  //         fontWeight={600}
  //       ></Txt>
  //     </Rect>
  //     <Rect
  //       width={"50%"}
  //       height={"100%"}
  //       fill={Grays.GRAY1}
  //       justifyContent={"center"}
  //       alignItems={"center"}
  //       padding={50}
  //     >
  //       <Txt
  //         {...PoppinsWhite}
  //         fill={Grays.BLACK}
  //         text={"100,000"}
  //         fontSize={150}
  //         fontWeight={600}
  //       ></Txt>
  //     </Rect>
  //   </Rect>
  // );

  // container().add(
  //   <Rect
  //     ref={rows}
  //     opacity={0}
  //     width={"100%"}
  //     height={"18%"}
  //     stroke={Grays.GRAY3}
  //     lineWidth={5}
  //   >
  //     <Rect
  //       width={"50%"}
  //       height={"100%"}
  //       fill={Grays.WHITE}
  //       justifyContent={"start"}
  //       alignItems={"center"}
  //       padding={50}
  //     >
  //       <Txt
  //         {...PoppinsWhite}
  //         fill={Grays.BLACK}
  //         text={"SHOOTERS PER SESSION"}
  //         textWrap={"wrap"}
  //         textAlign={"left"}
  //         fontSize={90}
  //         fontWeight={600}
  //       ></Txt>
  //     </Rect>
  //     <Rect
  //       width={"50%"}
  //       height={"100%"}
  //       fill={Grays.GRAY1}
  //       justifyContent={"center"}
  //       alignItems={"center"}
  //       padding={50}
  //     >
  //       <Txt
  //         {...PoppinsWhite}
  //         fill={Grays.BLACK}
  //         text={"10"}
  //         fontSize={150}
  //         fontWeight={600}
  //       ></Txt>
  //     </Rect>
  //   </Rect>
  // );

  // container().add(
  //   <Rect
  //     ref={rows}
  //     opacity={0}
  //     width={"100%"}
  //     height={"18%"}
  //     stroke={Grays.GRAY3}
  //     lineWidth={5}
  //   >
  //     <Rect
  //       width={"50%"}
  //       height={"100%"}
  //       fill={Grays.WHITE}
  //       justifyContent={"start"}
  //       alignItems={"center"}
  //       padding={50}
  //     >
  //       <Txt
  //         {...PoppinsWhite}
  //         fill={Grays.BLACK}
  //         text={"TABLE MINIMUM"}
  //         textWrap={"wrap"}
  //         textAlign={"left"}
  //         fontSize={90}
  //         fontWeight={600}
  //       ></Txt>
  //     </Rect>
  //     <Rect
  //       width={"50%"}
  //       height={"100%"}
  //       fill={Grays.GRAY1}
  //       justifyContent={"center"}
  //       alignItems={"center"}
  //       padding={50}
  //     >
  //       <Txt
  //         {...PoppinsWhite}
  //         fill={Grays.BLACK}
  //         text={"$15"}
  //         fontSize={150}
  //         fontWeight={600}
  //       ></Txt>
  //     </Rect>
  //   </Rect>
  // );

  // container().add(
  //   <Rect
  //     ref={rows}
  //     opacity={0}
  //     width={"100%"}
  //     height={"18%"}
  //     stroke={Grays.GRAY3}
  //     lineWidth={5}
  //   >
  //     <Rect
  //       width={"50%"}
  //       height={"100%"}
  //       fill={Grays.WHITE}
  //       justifyContent={"start"}
  //       alignItems={"center"}
  //       padding={50}
  //     >
  //       <Txt
  //         {...PoppinsWhite}
  //         fill={Grays.BLACK}
  //         text={"TABLE MAXIMUM"}
  //         textWrap={"wrap"}
  //         textAlign={"left"}
  //         fontSize={90}
  //         fontWeight={600}
  //       ></Txt>
  //     </Rect>
  //     <Rect
  //       width={"50%"}
  //       height={"100%"}
  //       fill={Grays.GRAY1}
  //       justifyContent={"center"}
  //       alignItems={"center"}
  //       padding={50}
  //     >
  //       <Txt
  //         {...PoppinsWhite}
  //         fill={Grays.BLACK}
  //         text={"$5,000"}
  //         fontSize={150}
  //         fontWeight={600}
  //       ></Txt>
  //     </Rect>
  //   </Rect>
  // );

  yield* waitFor(1);

  yield* waitFor(10);
  yield* waitUntil("end");
});
