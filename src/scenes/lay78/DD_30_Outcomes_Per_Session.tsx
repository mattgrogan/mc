// EXTRACT_FRAMES: [000525]
import { Layout, Line, Txt } from "@motion-canvas/2d/lib/components";
import {
  createRef,
  createSignal,
  easeInOutCubic,
  Reference,
  SimpleSignal,
} from "@motion-canvas/core";
import { Gradient, PossibleCanvasStyle, Rect } from "@motion-canvas/2d";
import { waitFor } from "@motion-canvas/core";
import { makeScene2D, NodeProps } from "@motion-canvas/2d";
import { MonoWhite, PoppinsWhite } from "../../styles";
import { commaFormmatter } from "../../components/styled/findQuantiles";
import { FadeIn } from "../../utils/FadeIn";
import { tw_colors } from "../../tw_colors";

// outcomes_by_session.v1.json
import bySession from "../../../../dicedata/output/lay78-100k/json/outcomes_by_session.v1.json";

// const byHandData = byhand["440Regress"];
const bySessionData = bySession["VigOnWin"];

interface WinLossBarProps {
  ref: Reference<Layout>;
  title: string;
  totalNumber: number;
  totalWon: SimpleSignal<number>;
  totalLoss: SimpleSignal<number>;
  units?: string;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  winColor?: PossibleCanvasStyle;
  lossColor?: PossibleCanvasStyle;
  backgroundColor?: PossibleCanvasStyle;
  backgroundOutlineColor?: PossibleCanvasStyle;
  backgroundBarColor?: PossibleCanvasStyle;
  centerLineColor?: PossibleCanvasStyle;
  secondaryTextColor?: PossibleCanvasStyle;
  titleColor?: PossibleCanvasStyle;
  showPercentages?: boolean;
  showNumbers?: boolean;
  animationDuration?: number;
}

export const winnerGradient = new Gradient({
  type: "linear",

  from: [0, -100],
  to: [0, 100],
  stops: [
    { offset: 0, color: "#15803d" }, // Tailwind 700
    { offset: 1, color: "#14532d" }, // Tailwind 900
  ],
});

export const loserGradient = new Gradient({
  type: "linear",

  from: [0, -100],
  to: [0, 100],
  stops: [
    { offset: 0, color: "#b91c1c" }, // Tailwind 700
    { offset: 1, color: "#7f1d1d" }, // Tailwind 900
  ],
});

export function WinLossBar({
  ref,
  title,
  totalNumber,
  totalWon,
  totalLoss,
  units = "",
  x = 0,
  y = 0,
  width = 800,
  height = 120,
  winColor = tw_colors.emerald[700],
  lossColor = tw_colors.pink[700],
  backgroundColor = tw_colors.zinc[800],
  backgroundOutlineColor = tw_colors.zinc[700],
  backgroundBarColor = tw_colors.zinc[500],
  centerLineColor = tw_colors.zinc[400],
  titleColor = tw_colors.zinc[100],
  secondaryTextColor = tw_colors.zinc[300],
  showPercentages = true,
  showNumbers = true,
}: WinLossBarProps) {
  // Calculate percentages from the signals
  const winPercent = () => (totalWon() / totalNumber) * 100;
  const lossPercent = () => (totalLoss() / totalNumber) * 100;

  // Create refs for the text elements
  const winPercentText = createRef<Txt>();
  const lossPercentText = createRef<Txt>();
  const winNumberText = createRef<Txt>();
  const lossNumberText = createRef<Txt>();
  const titleText = createRef<Txt>();
  const totalText = createRef<Txt>();
  const containerBox = createRef<Rect>();

  // Container dimensions - much larger to fit everything
  const containerWidth = width + 200;
  const containerHeight = height + 600;
  const containerOffsetY = -100;

  // Text positions (matching your layout)
  const upperOffsetY = -20;
  const winTextX = -width / 2;
  const winTextY = -height / 2 + upperOffsetY;
  const lossTextX = width / 2;
  const lossTextY = -height / 2 + upperOffsetY;

  // Lower offset to push the totals down
  const lowerOffsetY = 20;

  return (
    <Layout
      ref={ref}
      layout={false}
      x={x}
      y={y}
      opacity={0}
    >
      {/* Container box */}
      <Rect
        ref={containerBox}
        width={containerWidth}
        height={containerHeight}
        fill={backgroundColor}
        stroke={backgroundOutlineColor}
        lineWidth={2}
        radius={12}
        y={containerOffsetY}
      />

      {/* vertical center line (50% mark) */}
      <Line
        points={[
          [0, -height * 0.5],
          [0, height * 0.5],
        ]}
        stroke={centerLineColor}
        lineWidth={8}
        zIndex={1}
      ></Line>

      {/* Title text (left side) */}
      <Txt
        ref={titleText}
        text={title}
        {...PoppinsWhite}
        fill={titleColor}
        fontSize={height * 0.5}
        fontWeight={600}
        offset={[-1, -1]}
        left={containerBox().topLeft().add([50, 50])}
        x={-containerWidth / 2 + 40}
        y={-containerHeight / 2 + 60}
      />

      {/* Total number (right side) */}
      <Txt
        ref={totalText}
        text={commaFormmatter(totalNumber) + units}
        {...PoppinsWhite}
        fill={secondaryTextColor}
        fontSize={height * 0.3}
        fontWeight={600}
        offset={[1, -1]}
        right={containerBox().topRight().add([-50, 50])}
        x={containerWidth / 2 - 40}
        y={-containerHeight / 2 + 60}
      />

      {/* background bar */}
      <Line
        points={[
          [-width / 2, 0],
          [width / 2, 0],
        ]}
        stroke={backgroundBarColor}
        lineWidth={height}
      ></Line>

      {/* win bar */}
      <Line
        points={[
          [-width / 2, 0],
          [width / 2, 0],
        ]}
        stroke={winColor}
        lineWidth={height}
        end={() => winPercent() / 100}
      ></Line>
      {/* lose bar */}
      <Line
        points={[
          [width / 2, 0],
          [-width / 2, 0],
        ]}
        stroke={lossColor}
        lineWidth={height}
        end={() => lossPercent() / 100}
      ></Line>

      {/* Win percentage text */}
      {showPercentages && (
        <Txt
          offset={[-1, 1]}
          x={winTextX}
          y={winTextY}
          opacity={() => (winPercent() > 0 ? 1 : 0)}
        >
          <Txt
            ref={winPercentText}
            {...MonoWhite}
            text={() => `${winPercent().toFixed(1)}`}
            fontSize={height * 0.6}
            fontWeight={700}
          ></Txt>
          <Txt
            {...MonoWhite}
            fontSize={height * 0.25}
          >
            %
          </Txt>
        </Txt>
      )}

      {/* Loss percentage text */}
      {showPercentages && (
        <Txt
          offset={[1, 1]}
          x={lossTextX}
          y={lossTextY}
          opacity={() => (lossPercent() > 0 ? 1 : 0)}
        >
          <Txt
            ref={lossPercentText}
            {...MonoWhite}
            text={() => `${lossPercent().toFixed(1)}`}
            fontSize={height * 0.6}
            fontWeight={700}
          ></Txt>
          <Txt
            {...MonoWhite}
            fontSize={height * 0.25}
          >
            %
          </Txt>
        </Txt>
      )}

      {/* Win number text (below bar, opposite the win percentage) */}
      {showNumbers && (
        <Txt
          ref={winNumberText}
          text={() => commaFormmatter(totalWon())}
          {...MonoWhite}
          fill={secondaryTextColor}
          fontSize={height * 0.3}
          fontWeight={600}
          offset={[-1, -1]}
          x={winTextX}
          y={height / 2 + lowerOffsetY}
          opacity={() => (totalWon() > 0 ? 1 : 0)}
        />
      )}

      {/* Win label */}
      {showNumbers && (
        <Txt
          {...MonoWhite}
          text="WINNERS"
          fill={secondaryTextColor}
          fontSize={height * 0.2}
          fontWeight={400}
          offset={[-1, -1]}
          x={winTextX}
          y={height / 2 + height * 0.35 + lowerOffsetY}
        />
      )}

      {/* Loss number text (below bar, opposite the loss percentage) */}
      {showNumbers && (
        <Txt
          ref={lossNumberText}
          {...MonoWhite}
          fill={secondaryTextColor}
          text={() => commaFormmatter(totalLoss())}
          fontSize={height * 0.3}
          fontWeight={600}
          offset={[1, -1]}
          x={lossTextX}
          y={height / 2 + lowerOffsetY}
          opacity={() => (totalLoss() > 0 ? 1 : 0)}
        />
      )}

      {/* Loss label */}
      {showNumbers && (
        <Txt
          {...MonoWhite}
          text="LOSERS"
          fill={secondaryTextColor}
          fontSize={height * 0.2}
          fontWeight={400}
          offset={[1, -1]}
          x={lossTextX}
          y={height / 2 + height * 0.35 + lowerOffsetY}
        />
      )}
    </Layout>
  );
}

// Usage example in a scene:
export default makeScene2D(function* (view) {
  // Create animated signals for the numbers
  const totalWon = createSignal(0);
  const totalLoss = createSignal(0);
  const winLossBar = createRef<Layout>();

  view.add(
    <WinLossBar
      ref={winLossBar}
      title="Outcomes by Session"
      totalNumber={bySessionData.N}
      totalWon={totalWon}
      totalLoss={totalLoss}
      width={2000}
      height={200}
      units={" bots"}
    />
  );

  yield* waitFor(1);
  yield* FadeIn(winLossBar, 1, easeInOutCubic, [0, 100]);
  yield* waitFor(2);
  yield* totalWon(bySessionData.N_UP, 3, easeInOutCubic);
  yield* totalLoss(bySessionData.N_DOWN, 3, easeInOutCubic);

  yield* waitFor(10);
});
