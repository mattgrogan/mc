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
  easeInOutCubic,
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
  Vector2,
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
import { CircumscribeRect } from "../../utils/Circumscribe";

//-sessions-shooters-rolls.json
import simstats from "../../../../dicedata/output/skill66halfpress-100k/skill66halfpress-100k-sessions-shooters-rolls.json";

// This is the center of the content area
// OffsetX by the TOC height 14%
// OffsetY by the title height 20%
const CONTENT_CENTER = new Vector2([269, 216]);

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
  const headNode = createRef<Node>();
  const subNode = createRef<Node>();
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
      <Node
        ref={headNode}
        opacity={0}
      >
        <Txt
          ref={titleLines}
          {...PoppinsWhite}
          fill={Darker.BLUE}
          text={sim.name}
          fontSize={240}
          fontWeight={600}
          lineHeight={200}
          opacity={1}
        />
      </Node>
      <Node
        ref={subNode}
        opacity={0}
      >
        <Txt
          ref={titleLines}
          {...PoppinsWhite}
          fill={Grays.GRAY4}
          fontSize={120}
          fontWeight={600}
          text={"SIMULATION"}
          opacity={1}
        />
      </Node>
    </Rect>
  );

  yield* waitFor(1);

  // Animate the title
  yield FadeIn(headNode, 0.6, easeOutCubic, [80, 0]);
  yield* waitFor(0.4);
  yield* FadeIn(subNode, 0.6, easeOutCubic, [80, 0]);

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

  // POP OUT THE CURRENT SECTION AS A TITLE
  const newNode = rows[0].clone({
    width: rows[0].width(),
    height: rows[0].height(),
    layout: true,
    opacity: 0,
  });
  view.add(newNode);
  newNode.absolutePosition(rows[0].absolutePosition());
  yield newNode.opacity(1, 0, linear);
  yield newNode.scale(4, 1, easeInOutCubic);
  yield newNode.fill(Darkest.RED, 1, linear);
  yield newNode.childrenAs()[0].fill(Grays.WHITE, 1, linear);
  yield* newNode.position(CONTENT_CENTER, 1, easeInOutCubic);
  yield* waitFor(1);
  yield newNode.scale(1, 1, easeInOutCubic);
  yield* newNode.absolutePosition(
    rows[0].absolutePosition(),
    1,
    easeInOutCubic
  );
  rows[0].fill(Darkest.RED);
  rowTxts[0].fill(Grays.WHITE);
  newNode.remove();
  yield* waitFor(1);
  // END OF POPOUT

  // SHOW TOTAL THROWS TABLE

  const parameterTable = createRef<Layout>();
  const rowNodes = createRefArray<Node>();
  const rowRects = createRefArray<Rect>();
  const rowTitles = createRefArray<Txt>();
  const rowValues = createRefArray<Txt>();

  view.add(
    <Layout
      ref={parameterTable}
      direction={"column"}
      width={"45%"}
      height={"60%"}
      position={CONTENT_CENTER}
      gap={20}
      layout
      opacity={1}
    >
      <Node
        ref={rowNodes}
        opacity={0}
      >
        <Rect
          width={"100%"}
          height={"18%"}
          fill={Darker.BLUE}
          justifyContent={"center"}
          alignItems={"center"}
          stroke={Grays.GRAY3}
          lineWidth={5}
        >
          <Txt
            {...PoppinsWhite}
            // fill={Darker.BLUE}
            text={"SIMULATED DICE THROWS"}
            fontSize={120}
            fontWeight={600}
          />
        </Rect>
      </Node>
      {range(3).map((index) => (
        <Node
          ref={rowNodes}
          opacity={0}
          zIndex={z--}
        >
          <Rect
            ref={rowRects}
            opacity={1}
            width={"100%"}
            height={"18%"}
            stroke={Grays.GRAY3}
            lineWidth={5}
          >
            <Rect
              width={"50%"}
              height={"100%"}
              fill={Grays.WHITE}
              justifyContent={"start"}
              alignItems={"center"}
              padding={50}
            >
              <Txt
                ref={rowTitles}
                {...PoppinsWhite}
                fill={Grays.BLACK}
                textWrap={"wrap"}
                textAlign={"left"}
                // text={"SESSIONS"}
                fontSize={90}
                fontWeight={600}
              ></Txt>
            </Rect>
            <Rect
              width={"50%"}
              height={"100%"}
              fill={Grays.GRAY1}
              justifyContent={"right"}
              alignItems={"center"}
              padding={50}
            >
              <Txt
                ref={rowValues}
                {...MonoWhite}
                fill={Grays.BLACK}
                // text={"100,000"}
                fontSize={120}
                fontWeight={600}
              ></Txt>
            </Rect>
          </Rect>
        </Node>
      ))}
    </Layout>
  );

  rowTitles[0].text("TOTAL THROWS");
  rowTitles[1].text("AVERAGE PER SESSION");
  rowTitles[2].text("AVERAGE PER SHOOTER");

  const totalThrowsSignal = createSignal(simstats[0].ROLLS * 0.8);
  const perSessionSignal = createSignal(0);
  const perShooterSignal = createSignal(0);

  rowValues[0].text(() =>
    totalThrowsSignal().toLocaleString("en-US", { maximumFractionDigits: 0 })
  );
  rowValues[1].text(() => perSessionSignal().toFixed(1));
  rowValues[2].text(() => perShooterSignal().toFixed(1));

  yield* waitFor(1);
  //yield* FadeIn(parameterTable, 1, easeOutCubic, [0, 100]);

  //yield* waitFor(1);
  yield sequence(
    0.4,
    totalThrowsSignal(simstats[0].ROLLS, 0.8, easeOutCubic),
    perSessionSignal(
      simstats[0].ROLLS / simstats[0].SESSIONS,
      0.8,
      easeOutCubic
    ),
    perShooterSignal(
      simstats[0].ROLLS / simstats[0].SHOOTERS,
      0.8,
      easeOutCubic
    )
  );
  yield* sequence(
    0.4,
    ...rowNodes.map((r) => FadeIn(r, 1, easeOutCubic, [0, 50]))
  );
  yield* waitFor(1);

  yield* waitFor(10);
  yield* waitUntil("end");
});
