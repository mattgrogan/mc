import {
  Camera,
  Layout,
  makeScene2D,
  Node,
  Rect,
  Txt,
} from "@motion-canvas/2d";
import {
  all,
  createRef,
  createSignal,
  Direction,
  easeInCubic,
  easeInOutCubic,
  easeOutCubic,
  easeOutExpo,
  sequence,
  waitFor,
  waitUntil,
} from "@motion-canvas/core";
import { CrapsTable } from "../../components/craps/CrapsTable";

import { FadeIn } from "../../utils/FadeIn";

import { c } from "../../components/craps/CrapsTableCoords";
import { Bright, Grays, MonoWhite, PoppinsWhite, Theme } from "../../styles";
import { RollText } from "../../utils/RollText";

const LabelFont = {
  ...PoppinsWhite,
  fontWeight: 600,
  fontSize: 50,
  fill: Grays.GRAY2,
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
  const table = createRef<CrapsTable>();
  const table2 = createRef<CrapsTable>();
  const camera = createRef<Camera>();
  const score = createRef<Rect>();
  const blurMask = createRef<Rect>();
  const darken = createRef<Rect>();
  const blurGroup = createRef<Node>();
  const hits = createRef<RollText>();

  const betTitle = createRef<Txt>();
  const betField = createRef<Node>();
  const exposureTitle = createRef<Node>();
  const exposureTitleRoll = createRef<RollText>();
  const exposureField = createRef<Node>();
  const bet = createSignal(440);
  const exposure = createSignal(-440);
  view.add(
    <Layout ref={container}>
      <Camera ref={camera}>
        <CrapsTable
          ref={table}
          opacity={0}
          scale={0.8}
          compositeOperation={"source-in"}
        ></CrapsTable>
        <Node cache>
          <Rect
            ref={blurMask}
            width={800}
            height={280}
            fill={"black"}
            position={[90, 100]}
            radius={40}
            opacity={0}
          />
          <CrapsTable
            ref={table2}
            opacity={0}
            scale={0.8}
            compositeOperation={"source-in"}
          ></CrapsTable>
        </Node>
        <Rect
          ref={darken}
          width={800}
          height={280}
          fill={Theme.BG}
          position={[90, 100]}
          radius={40}
          opacity={0}
          stroke={"white"}
          lineWidth={1}
        />
      </Camera>
      <RollText
        ref={hits}
        initialText={""}
        width={1000}
        height={200}
        y={20}
        txtProps={{
          ...PoppinsWhite,
          fontSize: 90,
          fontWeight: 900,
          fill: Grays.WHITE,
        }}
      ></RollText>
      <Layout
        layout
        gap={200}
        y={180}
      >
        <Layout
          direction={"column"}
          alignItems={"center"}
        >
          <Node
            ref={betTitle}
            opacity={0}
          >
            <Txt
              text={"BET"}
              {...LabelFont}
            ></Txt>
          </Node>
          <Node
            ref={betField}
            opacity={0}
          >
            <Txt
              text={() => bet().toFixed(0)}
              {...NumberFont}
            ></Txt>
          </Node>
        </Layout>
        <Layout
          direction={"column"}
          alignItems={"center"}
        >
          <Node
            ref={exposureTitle}
            opacity={0}
          >
            <Txt
              text={() => (exposure() < 0 ? "EXPOSURE" : "WIN")}
              {...LabelFont}
            ></Txt>
          </Node>
          <Node
            ref={exposureField}
            opacity={0}
          >
            <Txt
              text={() => exposure().toFixed(0)}
              {...NumberFont}
              fill={() => (exposure() < 0 ? Bright.RED : Bright.GREEN)}
            ></Txt>
          </Node>
        </Layout>
      </Layout>
      {/* <Rect
        ref={score}
        width={1200}
        height={400}
        fill={"black"}
        y={200}
        radius={40}
        opacity={0.7}
      /> */}
    </Layout>
  );

  // https://github.com/motion-canvas/motion-canvas/issues/1057
  camera().scene().position(view.size().div(2));

  view.fill(Theme.BG);
  view.opacity(1);

  yield* waitFor(1);
  yield* sequence(
    0.3,
    FadeIn(table(), 1, easeOutCubic, [0, 500]),
    table().movePuckTo(c.PUCK5)
  );
  yield* all(
    table().bets().makeBet(100, c.PLACE5),
    table().bets().makeBet(120, c.PLACE6),
    table().bets().makeBet(120, c.PLACE8),
    table().bets().makeBet(100, c.PLACE9)
  ),
    camera().save();
  yield* all(
    camera().position([90, 0], 2, easeInOutCubic),
    camera().zoom(1.6, 2, easeInOutCubic)
  );

  yield* waitUntil("show-score");

  yield* all(
    table2().filters.blur(5, 1),
    table2().opacity(1, 1),
    blurMask().opacity(1, 1),
    darken().opacity(0.9, 1)
  );
  yield* sequence(
    0.1,
    FadeIn(betTitle, 0.4, easeOutExpo, [0, 50]),
    FadeIn(betField, 0.4, easeOutExpo, [0, 50]),
    FadeIn(exposureTitle, 0.4, easeOutExpo, [0, 50]),
    FadeIn(exposureField, 0.4, easeOutExpo, [0, 50])
  );

  yield* waitUntil("hit-1");
  yield* hits().next("FIRST HIT", Direction.Right);
  yield* table().bets().winBet(140, c.PLACE9, false, false);

  yield all(bet(220, 1.2, easeInOutCubic), exposure(-80, 1.2, easeInOutCubic));

  yield* all(
    table().bets().removeBet(c.PLACE5),
    table().bets().removeBet(c.PLACE6),
    table().bets().removeBet(c.PLACE8),
    table().bets().removeBet(c.PLACE9)
  );
  yield hits().next("", Direction.Right);
  yield* all(
    table().bets().makeBet(50, c.PLACE5),
    table().bets().makeBet(60, c.PLACE6),
    table().bets().makeBet(60, c.PLACE8),
    table().bets().makeBet(50, c.PLACE9)
  );

  yield* waitUntil("hit-2");
  yield* hits().next("SECOND HIT", Direction.Right);
  yield* table().bets().winBet(70, c.PLACE9, false, false);
  yield all(bet(110, 1.2, easeInOutCubic), exposure(100, 1.2, easeInOutCubic));
  yield* all(
    table().bets().removeBet(c.PLACE5),
    table().bets().removeBet(c.PLACE6),
    table().bets().removeBet(c.PLACE8),
    table().bets().removeBet(c.PLACE9)
  );
  yield hits().next("", Direction.Right);
  yield* all(
    table().bets().makeBet(25, c.PLACE5),
    table().bets().makeBet(30, c.PLACE6),
    table().bets().makeBet(30, c.PLACE8),
    table().bets().makeBet(25, c.PLACE9)
  ),
    yield* waitUntil("hit-3");
  yield* hits().next("THIRD HIT", Direction.Right);
  yield* table().bets().winBet(35, c.PLACE9, false, false);
  yield all(bet(44, 1.2, easeInOutCubic), exposure(201, 1.2, easeInOutCubic));
  yield* all(
    table().bets().removeBet(c.PLACE5),
    table().bets().removeBet(c.PLACE6),
    table().bets().removeBet(c.PLACE8),
    table().bets().removeBet(c.PLACE9)
  );
  yield hits().next("", Direction.Right);
  yield* all(
    table().bets().makeBet(10, c.PLACE5),
    table().bets().makeBet(12, c.PLACE6),
    table().bets().makeBet(12, c.PLACE8),
    table().bets().makeBet(10, c.PLACE9)
  ),
    yield* waitUntil("hit-4");
  yield table().bets().winBet(14, c.PLACE9, false, false);
  yield* hits().next("HIT 4", Direction.Right);
  yield* exposure(215, 0.6, easeInOutCubic);
  yield table().bets().winBet(14, c.PLACE9, false, false);
  yield* hits().next("HIT 5", Direction.Right);
  yield* exposure(229, 0.6, easeInOutCubic);
  yield table().bets().winBet(14, c.PLACE9, false, false);
  yield* hits().next("HIT 6", Direction.Right);
  yield* exposure(243, 0.6, easeInOutCubic);
  yield table().bets().winBet(14, c.PLACE9, false, false);
  yield* hits().next("HIT 7", Direction.Right);
  yield* exposure(257, 0.6, easeInOutCubic);
  yield table().bets().winBet(14, c.PLACE9, false, false);
  yield* hits().next("HIT 8", Direction.Right);
  yield* exposure(271, 0.6, easeInOutCubic);
  yield table().bets().winBet(14, c.PLACE9, false, false);
  yield* hits().next("HIT 9", Direction.Right);
  yield* exposure(285, 0.6, easeInOutCubic);
  yield table().bets().winBet(14, c.PLACE9, false, false);
  yield* hits().next("HIT 10", Direction.Right);
  yield* exposure(299, 0.6, easeInOutCubic);

  // END
  yield* waitFor(5);
});
