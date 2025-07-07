// EXTRACT_FRAMES: [000685]
import {
  Icon,
  Layout,
  makeScene2D,
  Rect,
  RectProps,
  Txt,
  TxtProps,
  Node,
} from "@motion-canvas/2d";
import {
  all,
  createRef,
  createRefArray,
  createSignal,
  delay,
  easeInOutCubic,
  easeOutCubic,
  SimpleSignal,
  Vector2,
  waitFor,
  waitUntil,
} from "@motion-canvas/core";
import { PoppinsWhite } from "../../styles";
import { tw_colors } from "../../tw_colors";
import { FadeIn } from "../../utils/FadeIn";
import { commaFormmatter } from "../../components/styled/findQuantiles";
import { PLAYER_NAME } from "./DD_00_Params";

// session_yield.v1.json
import dataImport from "../../../../dicedata/output/y2025/m07/fivealive-100k/json/session_yield.v1.json";
const DATA = dataImport[PLAYER_NAME];

const TITLE = "Return on Investment";
const SUBTITLE = "How often did the bots double their money or more?";

// Extract the specific yield targets we want to show
const targetYields = [1.0, 2.0, 3.0, 4.0, 9.0];
const yieldData = targetYields.map((target, index) => {
  const entry = DATA.find((d) => d.SESSION_YIELD === target);
  const percentage = entry ? entry.CUMPCT * 100 : 0;
  const botCount = entry ? entry.CUMN : 0; // Use actual count from data

  // Color gradient from bright green to bright pink
  const colors = [
    tw_colors.emerald[500],
    tw_colors.cyan[500],
    tw_colors.blue[500],
    tw_colors.purple[500],
    tw_colors.pink[500],
  ];

  // Icon mapping for each multiplier
  const icons = [
    "noto:money-bag",
    "noto:euro-banknote",
    "noto:money-mouth-face",
    "noto:gem-stone",
    "noto:crown",
  ];

  // Headlines for each multiplier
  const headlines = [
    "DOUBLED THEIR OUTLAY",
    "TRIPLED THEIR OUTLAY",
    "QUADRUPLED THEIR OUTLAY",
    "5X'D THEIR OUTLAY",
    "10X'D THEIR OUTLAY",
  ];

  return {
    multiplier: target,
    percentage: percentage,
    botCount: botCount,
    label: `${target.toFixed(0)}x+`,
    percentIncrease: `${((target - 1) * 100).toFixed(0)}% increase`,
    headline: headlines[index],
    subheadline: `(${(target * 100).toFixed(0)}%+ Return)`,
    color: colors[index],
    bgColor: colors[index] + "20", // Add transparency for background
    icon: icons[index],
  };
});

const title = createSignal(TITLE);
const subtitle = createSignal(SUBTITLE);

const TITLE_TXT_PROPS: TxtProps = {
  ...PoppinsWhite,
  fontSize: 120,
  fontWeight: 800,
  fill: tw_colors.zinc[100],
};

const SUBTITLE_TXT_PROPS: TxtProps = {
  ...PoppinsWhite,
  fontSize: 60,
  fontWeight: 400,
  fill: tw_colors.zinc[400],
};

const CardProps: RectProps = {
  width: 1650, // 50% wider
  height: 1075, // 25% taller
  fill: tw_colors.zinc[800],
  stroke: tw_colors.zinc[600],
  lineWidth: 4,
  radius: 30,
};

const MultiplierProps: TxtProps = {
  ...PoppinsWhite,
  fontSize: 150,
  fontWeight: 900,
};

const PercentIncreaseProps: TxtProps = {
  ...PoppinsWhite,
  fontSize: 60,
  fontWeight: 500,
  fill: tw_colors.zinc[400],
};

const PercentageProps: TxtProps = {
  ...PoppinsWhite,
  fontSize: 200,
  fontWeight: 800,
};

const PercentSignProps: TxtProps = {
  ...PoppinsWhite,
  fontSize: 100,
  fontWeight: 700,
};

const BotCountProps: TxtProps = {
  ...PoppinsWhite,
  fontSize: 80,
  fontWeight: 400,
  fill: tw_colors.zinc[400],
};

const HeadlineProps: TxtProps = {
  ...PoppinsWhite,
  fontSize: 100,
  fontWeight: 700,
  fill: tw_colors.zinc[100],
};

const SubheadlineProps: TxtProps = {
  ...PoppinsWhite,
  fontSize: 80,
  fontWeight: 500,
  fill: tw_colors.zinc[400],
};

// Card component function
function createMultiplierCard(
  data: (typeof yieldData)[0],
  percentageSignal: SimpleSignal<number, void>,
  botCountSignal: SimpleSignal<number, void>,
  percentOpacitySignal: SimpleSignal<number, void>
) {
  return (
    <Layout
      layout={false}
      width={CardProps.width}
      height={CardProps.height}
    >
      <Rect
        {...CardProps}
        fill={data.bgColor}
        stroke={data.color}
      />
      {/* Icon - positioned to overlap top of card */}
      <Icon
        icon={data.icon}
        size={350}
        color={data.color}
        y={-CardProps.height / 2 + 50}
      />

      <Layout
        direction={"column"}
        justifyContent={"center"}
        alignItems={"center"}
        padding={100}
        paddingTop={250} // Extra top padding to account for icon
        width={CardProps.width}
        height={CardProps.height}
        gap={5}
        layout
      >
        {/* Main Percentage Display - Most Prominent */}
        <Layout
          direction={"row"}
          alignItems={"baseline"}
          gap={5}
          marginBottom={10}
          opacity={() => percentOpacitySignal()}
        >
          {() => {
            const pct = percentageSignal();
            if (data.percentage === 0) {
              // Show "NO BOTS" in red for 0%
              return (
                <Txt
                  {...PercentageProps}
                  text="NO BOTS"
                  fill={tw_colors.red[500]}
                />
              );
            } else {
              // Show percentage normally
              return (
                <>
                  <Txt
                    {...PercentageProps}
                    text={pct < 0.1 && pct > 0 ? "< 0.1" : pct.toFixed(1)}
                    fill={data.color}
                  />
                  <Txt
                    {...PercentSignProps}
                    text={"%"}
                    fill={data.color}
                  />
                </>
              );
            }
          }}
        </Layout>

        {/* Headline */}
        <Txt
          {...HeadlineProps}
          text={data.headline}
          textAlign={"center"}
          marginBottom={100}
        />

        {/* Subheadline */}
        <Txt
          {...SubheadlineProps}
          text={data.subheadline}
          marginTop={-100}
        />

        {/* Bot Count */}
        <Txt
          {...BotCountProps}
          text={() =>
            `${commaFormmatter(
              Math.round(botCountSignal()),
              0
            )} out of 100,000 bots`
          }
          marginTop={60}
        />
      </Layout>
    </Layout>
  );
}

// Test function to display a single card
export function createTestCard(index: number = 0) {
  return makeScene2D(function* (view) {
    const testPercentageSignal = createSignal(0);
    const testBotCountSignal = createSignal(0);
    const testPercentOpacitySignal = createSignal(0);
    const testData = yieldData[index] || yieldData[0];

    view.add(
      <Layout
        width={"100%"}
        height={"100%"}
        justifyContent={"center"}
        alignItems={"center"}
      >
        {createMultiplierCard(
          testData,
          testPercentageSignal,
          testBotCountSignal,
          testPercentOpacitySignal
        )}
      </Layout>
    );

    yield* waitFor(1);
    yield* all(
      testPercentageSignal(testData.percentage, 2, easeInOutCubic),
      testBotCountSignal(testData.botCount, 2, easeInOutCubic),
      delay(0.3, testPercentOpacitySignal(1, 0.5, easeOutCubic))
    );
    yield* waitFor(3);
  });
}

export default makeScene2D(function* (view) {
  yield* waitFor(1);

  // Create signals for animated values
  const percentageSignals: SimpleSignal<number, void>[] = [];
  const botCountSignals: SimpleSignal<number, void>[] = [];
  const percentOpacitySignals: SimpleSignal<number, void>[] = [];
  const cardRefs = createRefArray<Node>();

  yieldData.forEach((_, index) => {
    percentageSignals[index] = createSignal(0);
    botCountSignals[index] = createSignal(0);
    percentOpacitySignals[index] = createSignal(0);
  });

  // --------------- main container ----------------
  const mainContainer = createRef<Layout>();
  const cardsContainer = createRef<Layout>();

  view.add(
    <Layout
      ref={mainContainer}
      direction={"column"}
      justifyContent={"center"}
      alignItems={"center"}
      width={"100%"}
      height={"100%"}
      gap={120}
      padding={50}
      layout
    >
      {/* Cards Container - absolute positioning for overlapping */}
      <Layout
        ref={cardsContainer}
        justifyContent={"center"}
        alignItems={"center"}
        width={"100%"}
        height={"100%"}
        layout={false}
      >
        {yieldData.map((data, index) => (
          <Node
            ref={cardRefs}
            opacity={0}
            scale={0.9}
            position={[0, 0]}
          >
            {createMultiplierCard(
              data,
              percentageSignals[index],
              botCountSignals[index],
              percentOpacitySignals[index]
            )}
          </Node>
        ))}
      </Layout>
    </Layout>
  );

  // --------------- title and subtitle ----------------
  const titleContainer = createRef<Layout>();

  view.add(
    <Layout
      ref={titleContainer}
      direction={"column"}
      alignItems={"start"}
      position={[0, 0]}
      gap={10}
      opacity={0}
      layout
      offsetX={-1}
      offsetY={-1}
    >
      <Txt
        {...TITLE_TXT_PROPS}
        text={title}
      />
      <Txt
        {...SUBTITLE_TXT_PROPS}
        text={subtitle}
        textAlign={"left"}
        width={1600}
      />
    </Layout>
  );

  // Calculate final title position (upper left corner of view with padding)
  const titleFinalX = -view.width() / 2 + 100; // 100px from left edge
  const titleFinalY = -view.height() / 2 + 100; // 100px from top edge

  // Set initial scale
  titleContainer().scale(1.5);

  // Calculate initial position - 15% from left edge of view, vertically centered
  const leftEdge = -view.width() / 2;
  const titleInitialX = leftEdge + view.width() * 0.15;

  // Since offsetY={-1}, we need to account for the title's height to center it
  // The title's top edge should be at -height/2 to center the whole title
  const titleBounds = titleContainer().cacheBBox();
  const titleInitialY = -titleBounds.height / 2;

  titleContainer().position(new Vector2(titleInitialX, titleInitialY));

  // START ANIMATIONS
  // =================================

  // 1. Fade in title at initial position (scaled up)
  yield* FadeIn(titleContainer, 1, easeOutCubic, [0, 50]);
  yield* waitFor(1.5);

  // 2. Move title to upper left corner and scale down simultaneously
  yield* all(
    titleContainer().position(
      new Vector2(titleFinalX, titleFinalY),
      1.5,
      easeInOutCubic
    ),
    titleContainer().scale(1, 1.5, easeInOutCubic)
  );
  yield* waitFor(0.5);

  yield* waitUntil("show-data");

  // 3. Show cards one at a time, replacing each other
  for (let i = 0; i < yieldData.length; i++) {
    // Reset signals for this card
    percentageSignals[i](0);
    botCountSignals[i](0);
    percentOpacitySignals[i](0);

    // Fade in and scale up the card
    yield* all(
      cardRefs[i].opacity(1, 0.8, easeOutCubic),
      cardRefs[i].scale(1, 0.8, easeOutCubic)
    );

    // Start animating percentage and bot count
    yield* all(
      percentageSignals[i](yieldData[i].percentage, 1.5, easeInOutCubic),
      botCountSignals[i](yieldData[i].botCount, 1.5, easeInOutCubic),
      // Fade in percentage after a short delay to avoid showing "0" -> "< 0.1" transition
      delay(0.3, percentOpacitySignals[i](1, 0.5, easeOutCubic))
    );

    // Hold the card on screen
    yield* waitFor(2.5);

    // If not the last card, fade out before showing next
    if (i < yieldData.length - 1) {
      yield* all(
        cardRefs[i].opacity(0, 0.6, easeInOutCubic),
        cardRefs[i].scale(0.9, 0.6, easeInOutCubic)
      );
      yield* waitFor(0.2);
    }
  }

  yield* waitFor(5);
});
