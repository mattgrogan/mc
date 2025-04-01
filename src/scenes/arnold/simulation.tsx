import {
  makeScene2D,
  Circle,
  Layout,
  Rect,
  Txt,
  Line,
  LineProps,
  Node,
  TxtProps,
  Camera,
} from "@motion-canvas/2d";
import {
  all,
  createRef,
  createSignal,
  easeInBack,
  easeInCubic,
  easeInOutCubic,
  easeOutBack,
  easeOutCubic,
  linear,
  waitFor,
  waitUntil,
} from "@motion-canvas/core";
import {
  blueGradient,
  Bright,
  Darker,
  grayGradient,
  Grays,
  greenGradient,
  PoppinsBlack,
  PoppinsWhite,
  redGradient,
  silverGradient,
} from "../../styles";
import { FadeIn } from "../../utils/FadeIn";
import { tw_colors } from "../../tw_colors";

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
  lineDash: [50, 20],
  lineWidth: 20,
  end: 1,
  opacity: 0,
};

const leftColX = createSignal(0);
const rightColX = createSignal(0);
const TOP_ROW_Y = -600;
const BOTTOM_ROW_Y = 600;

export default makeScene2D(function* (view) {
  // REAL GAME
  const realGame = createRef<Txt>();
  const realGameNode = createRef<Node>();
  const realGameSig = createSignal("Real\nGame");
  view.add(
    <Node
      ref={realGameNode}
      opacity={0}
    >
      <Layout
        layout
        direction={"column"}
        alignItems={"center"}
        ref={realGame}
        x={() => leftColX()}
        y={TOP_ROW_Y}
      >
        {() =>
          realGameSig()
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

  // ACTUAL OUTCOMES
  const actualOutcomes = createRef<Txt>();
  const actualOutcomesNode = createRef<Node>();
  const actualOutcomesSig = createSignal("Actual\nOutcomes");
  view.add(
    <Node
      ref={actualOutcomesNode}
      opacity={0}
    >
      <Layout
        layout
        direction={"column"}
        alignItems={"center"}
        ref={actualOutcomes}
        x={() => leftColX()}
        y={BOTTOM_ROW_Y}
      >
        {() =>
          actualOutcomesSig()
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

  // REAL GAME TO ACTUAL OUTCOMES
  const realToActual = createRef<Line>();
  view.add(
    <Line
      ref={realToActual}
      {...DASHED_LINE_PROPS}
      points={[() => realGame().bottom(), () => actualOutcomes().top()]}
      end={0}
    ></Line>
  );

  // BUILD A COMPUTER MODEL
  const buildAModel = createRef<Txt>();
  const buildAModelNode = createRef<Node>();
  const buildAModelSig = createSignal("DiceData\nSimulation Engine");
  view.add(
    <Node
      ref={buildAModelNode}
      opacity={0}
    >
      <Layout
        layout
        direction={"column"}
        alignItems={"center"}
        ref={buildAModel}
        x={() => rightColX()}
        y={TOP_ROW_Y}
      >
        {() =>
          buildAModelSig()
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

  // REAL GAME TO BUILD A COMPUTER MODEL
  const realToBuild = createRef<Line>();
  view.add(
    <Line
      ref={realToBuild}
      {...DASHED_LINE_PROPS}
      points={[() => realGame().right(), () => buildAModel().left()]}
      end={0}
      stroke={tw_colors.neutral[400]}
    ></Line>
  );

  // SIMULATE THOUSANDS OF GAMES
  const simulateGames = createRef<Txt>();
  const simulateGamesNode = createRef<Node>();
  const simulateGamesSig = createSignal("Simulate Thousands\nof Games");
  view.add(
    <Node
      ref={simulateGamesNode}
      opacity={0}
    >
      <Layout
        layout
        direction={"column"}
        alignItems={"center"}
        ref={simulateGames}
        x={() => rightColX()}
        y={0}
      >
        {() =>
          simulateGamesSig()
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

  // ANALYZE PATTERNS
  const analyzePatterns = createRef<Txt>();
  const analyzePatternsGamesNode = createRef<Node>();
  const analyzePatternsSig = createSignal("Analyze Patterns");
  const analyzePatternsSigLine2 = createSignal(
    "(Win/Loss, Variability, Bankroll)"
  );
  view.add(
    <Node
      ref={analyzePatternsGamesNode}
      opacity={0}
    >
      <Layout
        layout
        direction={"column"}
        alignItems={"center"}
        ref={analyzePatterns}
        x={() => rightColX()}
        y={BOTTOM_ROW_Y}
      >
        <Node>
          {() =>
            analyzePatternsSig()
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
        </Node>
        <Node>
          {() =>
            analyzePatternsSigLine2()
              .split("\n")
              .map((l2) => (
                <Txt
                  {...PoppinsWhite}
                  fill={"white"}
                  fontSize={FONT_SIZE - 30}
                  fontWeight={FONT_WEIGHT}
                  text={l2}
                />
              ))
          }
        </Node>
      </Layout>
    </Node>
  );

  // BUILD TO SIMULATE
  const buildToSimulate = createRef<Line>();
  view.add(
    <Line
      ref={buildToSimulate}
      {...DASHED_LINE_PROPS}
      points={[() => buildAModel().bottom(), () => simulateGames().top()]}
      end={0}
    ></Line>
  );

  //  SIMULATE TO ANALYZE
  const simulateToAnalyze = createRef<Line>();
  view.add(
    <Line
      ref={simulateToAnalyze}
      {...DASHED_LINE_PROPS}
      points={[() => simulateGames().bottom(), () => analyzePatterns().top()]}
      end={0}
    ></Line>
  );

  // ANIMATIONS
  leftColX(0);
  rightColX(1000);
  yield* waitFor(1);

  yield* FadeIn(realGameNode, 0.6, easeOutBack, [0, 100]);
  yield realToActual().opacity(1, 0.3, easeOutCubic);
  yield realToActual().end(1, 0.6, easeOutCubic);
  yield* waitFor(0.2);
  yield* FadeIn(actualOutcomesNode, 0.3, easeOutCubic, [0, -50]);

  yield* waitFor(1);

  // Slide left
  yield* leftColX(-1000, 2, easeInOutCubic);

  // Show build a model
  yield realToBuild().opacity(1, 0.3, easeOutCubic);
  yield realToBuild().end(1, 0.6, easeOutCubic);
  yield* waitFor(0.2);
  yield* FadeIn(buildAModelNode, 0.6, easeOutBack, [0, 100]);

  yield* waitFor(1);
  // Show simulate thousands of games
  yield buildToSimulate().opacity(1, 0.3, easeOutCubic);
  yield buildToSimulate().end(1, 0.6, easeOutCubic);
  yield* waitFor(0.2);
  yield* FadeIn(simulateGamesNode, 0.6, easeOutBack, [0, 100]);

  yield* waitFor(1);
  // Show analyze patterns
  yield simulateToAnalyze().opacity(1, 0.3, easeOutCubic);
  yield simulateToAnalyze().end(1, 0.6, easeOutCubic);
  yield* waitFor(0.2);
  yield* FadeIn(analyzePatternsGamesNode, 0.6, easeOutBack, [0, 100]);

  // START ANTS ANIMATION
  const offsetPerSecond = -50;
  const secs = 30;
  const fastFactor = 10;
  yield realToActual().lineDashOffset(offsetPerSecond * secs, secs, linear);
  yield buildToSimulate().lineDashOffset(
    offsetPerSecond * secs * fastFactor,
    secs,
    linear
  );
  yield simulateToAnalyze().lineDashOffset(
    offsetPerSecond * secs * fastFactor,
    secs,
    linear
  );

  yield* waitFor(30);
});
