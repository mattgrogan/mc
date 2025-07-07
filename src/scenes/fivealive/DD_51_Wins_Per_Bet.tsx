// EXTRACT_FRAMES: [000325]
import {
  Layout,
  makeScene2D,
  Rect,
  RectProps,
  Txt,
  TxtProps,
  Node,
  Line,
} from "@motion-canvas/2d";
import {
  all,
  chain,
  createRef,
  createRefArray,
  createSignal,
  delay,
  easeInOutCubic,
  easeOutCubic,
  range,
  SimpleSignal,
  Vector2,
  waitFor,
  waitUntil,
} from "@motion-canvas/core";
import { Grays, PoppinsWhite } from "../../styles";
import { tw_colors } from "../../tw_colors";
import { FadeIn } from "../../utils/FadeIn";
import { commaFormmatter } from "../../components/styled/findQuantiles";
import { PLAYER_NAME } from "./DD_00_Params";

// resolved_bets.v1.json
import dataImport from "../../../../dicedata/output/y2025/m07/fivealive-100k/json/resolved_bets.v1.json";

const DATA = dataImport[PLAYER_NAME];

const TITLE = "Which bets drove the wins?";
const SUBTITLE =
  "Each bet's share of the total gains across 100,000 simulated bots.";

// Sorting for the bets
const preferredOrder: string[] = [
  "DONTPASS",
  "DONTPASS_ODDS",
  "BUY4",
  "PLACE4",
  "PLACE5",
  "PLACE6",
  "PLACE8",
  "PLACE9",
  "PLACE10",
  "BUY10",
  "LAY4",
  "LAY5",
  "LAY6",
  "LAY8",
  "LAY9",
  "LAY10",
  "ALLSMALL",
  "ALLTALL",
  "ALLTALLSMALL",
  "DONTCOME",
  "DONTCOME4",
  "DONTCOME5",
  "DONTCOME6",
  "DONTCOME8",
  "DONTCOME9",
  "DONTCOME10",
];

DATA.sort(
  (a, b) => preferredOrder.indexOf(a.BET) - preferredOrder.indexOf(b.BET)
);

const title = createSignal(TITLE);
const subtitle = createSignal(SUBTITLE);

// Time to draw each percentage
const DRAW_SECS = 0.1;
// Time between incrementing each percentage
const BETWEEN_SECS = 0.001;

const TITLE_TXT_PROPS: TxtProps = {
  ...PoppinsWhite,
  fontSize: 100,
  fontWeight: 800,
  fill: tw_colors.zinc[100],
};

const SUBTITLE_TXT_PROPS: TxtProps = {
  ...PoppinsWhite,
  fontSize: 60,
  fontWeight: 400,
  fill: tw_colors.zinc[400],
};

const RowProps: RectProps = {
  width: "100%",
  height: 120,
  stroke: tw_colors.zinc[600],
  lineWidth: 0,
};

const ValueProps: RectProps = {
  width: "33.333%",
  fill: tw_colors.zinc[950],
  stroke: tw_colors.zinc[800],
  lineWidth: 1,
  justifyContent: "center",
  alignItems: "center",
};

const ValueTxtProps: TxtProps = {
  ...PoppinsWhite,
  fontSize: 60,
  fontWeight: 500,
};

export default makeScene2D(function* (view) {
  yield* waitFor(1);

  const signals: SimpleSignal<number, void>[] = [];
  range(DATA.length).map((index) => {
    signals[index] = createSignal(0);
  });

  // --------------- main container ----------------
  const mainContainer = createRef<Layout>();
  const tableContainer = createRef<Layout>();
  const tableRect = createRefArray<Rect>();

  view.add(
    <Layout
      ref={mainContainer}
      direction={"column"}
      justifyContent={"center"}
      alignItems={"center"}
      width={"100%"}
      height={"100%"}
      gap={50}
      padding={100}
      layout
    >
      {/* Table Container with responsive height */}
      <Layout
        ref={tableContainer}
        direction={"column"}
        justifyContent={"start"}
        alignItems={"center"}
        width={"90%"}
        maxHeight={"85%"}
        gap={0}
        opacity={0}
      >
        {range(DATA.length).map((index) => (
          <Rect
            {...RowProps}
            direction={"row"}
            ref={tableRect}
          >
            <Rect
              {...ValueProps}
              justifyContent={"start"}
              alignItems={"center"}
              padding={50}
              width={"20%"}
              height={"100%"}
            >
              <Txt
                {...ValueTxtProps}
                text={DATA[index].BET}
              ></Txt>
            </Rect>
            <Rect
              {...ValueProps}
              justifyContent={"end"}
              alignItems={"center"}
              // padding={80}
              paddingRight={150}
              width={"20%"}
              height={"100%"}
            >
              <Txt
                {...ValueTxtProps}
                text={() =>
                  commaFormmatter(signals[index]() * 100, 2, "-  ") + "%"
                }
              ></Txt>
            </Rect>
            <Rect
              {...ValueProps}
              width={"60%"}
              height={"100%"}
              alignItems={"center"}
            >
              <Layout layout={false}>
                <Line
                  points={[
                    [-650, 0],
                    [650, 0],
                  ]}
                  lineWidth={100}
                  stroke={tw_colors.zinc[700]}
                ></Line>
                <Line
                  points={[
                    [-650, 0],
                    [650, 0],
                  ]}
                  lineWidth={100}
                  end={() => signals[index]()}
                  stroke={tw_colors.emerald[500]}
                ></Line>
              </Layout>
            </Rect>
          </Rect>
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
    >
      <Txt
        {...TITLE_TXT_PROPS}
        text={title}
      />
      <Txt
        {...SUBTITLE_TXT_PROPS}
        text={subtitle}
      />
    </Layout>
  );

  // Scale table if needed to fit
  const tableHeight = DATA.length * 120;
  const availableHeight = view.height() * 0.7;
  if (tableHeight > availableHeight) {
    const scale = availableHeight / tableHeight;
    tableContainer().scale(scale);
  }

  // Calculate final title position (just above the table, left-aligned)
  const tableBounds = tableContainer().cacheBBox();
  const titleFinalY = tableBounds.top - 100;
  const titleFinalX = tableBounds.left;

  // Set initial scale
  titleContainer().scale(1.5);

  // Calculate initial position - 15% from left edge of view
  // View width is from -view.width()/2 to view.width()/2
  const leftEdge = -view.width() / 2;
  const titleInitialX = leftEdge + view.width() * 0.15;
  titleContainer().position.x(titleInitialX);

  // START ANIMATIONS
  // =================================

  // 1. Fade in title at center (scaled up)
  yield* FadeIn(titleContainer, 1, easeOutCubic, [0, 50]);
  yield* waitFor(1.5);

  // 2. Move title to final position and scale down simultaneously
  yield* all(
    titleContainer().position(
      new Vector2(titleFinalX, titleFinalY),
      1.5,
      easeInOutCubic
    ),
    titleContainer().scale(1, 1.5, easeInOutCubic)
  );

  // 3. Fade in table
  yield* delay(0.5, FadeIn(tableContainer, 1.5, easeOutCubic, [0, 50]));

  yield* waitFor(1);

  // 4. Animate the data bars
  yield* waitUntil("show-data");
  const generators = [];
  let waitSecs = 0;
  for (const i in range(DATA.length)) {
    generators.push(signals[i](DATA[i].PCT_OF_WINS, DRAW_SECS, easeOutCubic));
    generators.push(waitFor(BETWEEN_SECS));
    waitSecs += DRAW_SECS + BETWEEN_SECS;
  }
  yield* chain(...generators);

  yield* waitFor(5);
});
