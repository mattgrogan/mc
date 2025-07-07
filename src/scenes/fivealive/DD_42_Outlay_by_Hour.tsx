// EXTRACT_FRAMES: [000225]
import {
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
  createSignal,
  easeInOutCubic,
  easeOutCubic,
  Vector2,
  waitFor,
  waitUntil,
} from "@motion-canvas/core";
import { Grays, PoppinsWhite } from "../../styles";
import { tw_colors } from "../../tw_colors";
import { FadeIn } from "../../utils/FadeIn";
import { PLAYER_NAME } from "./DD_00_Params";
// hourly_outlay.v1.json
import hourlyOutlayData from "../../../../dicedata/output/y2025/m07/fivealive-100k/json/hourly_outlay.v1.json";
import { commaFormmatter } from "../../components/styled/findQuantiles";

const title = createSignal("Estimated Outlay per Hour");
const subtitle = createSignal("Based on a table speed of 100 throws per hour");

// =============================================================================
// CONFIGURATION - Edit these settings to control which players to show
// =============================================================================

// Player filter - specify which players to include (empty array = show all)
const PLAYERS_TO_SHOW: string[] = [
  // "TheOne",
  // Add other player keys here if you have multiple players
];

// Player display names - rename players for display (use \n for line breaks)
const PLAYER_DISPLAY_NAMES: Record<string, string> = {
  PLYR: "DP\n+ 1x Odds\n+ 6/8",
  // Add more mappings as needed:
  // "SomeOtherPlayer": "Custom Display\nName",
  // "AnotherPlayer": "Single Line Name",
};

// =============================================================================

// Extract data and create table rows
const allPlayers = Object.keys(hourlyOutlayData);
const playersToProcess =
  PLAYERS_TO_SHOW.length > 0 ? PLAYERS_TO_SHOW : allPlayers;

const tableData = playersToProcess.map((playerKey) => {
  // @ts-expect-error
  const data = hourlyOutlayData[playerKey];
  const displayName = PLAYER_DISPLAY_NAMES[playerKey] || data.PLAYER_NAME;

  return {
    playerNameSignal: createSignal(displayName),
    p25: commaFormmatter(data.P25),
    median: commaFormmatter(data.MEDIAN),
    mean: commaFormmatter(data.MEAN),
    p75: commaFormmatter(data.P75),
  };
});

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

const TableProps: RectProps = {
  width: "90%",
  height: "20%",
  stroke: tw_colors.zinc[100],
  lineWidth: 0,
  direction: "column",
  gap: 0,
};

const HeaderRowProps: RectProps = {
  width: "100%",
  // height: 120,
  stroke: Grays.GRAY2,
  lineWidth: 1,
  direction: "row",
  gap: 0,
};

const DataRowProps: RectProps = {
  width: "100%",
  height: 300,
  stroke: Grays.GRAY2,
  lineWidth: 1,
  direction: "row",
  gap: 0,
};

const HeaderCellProps: RectProps = {
  fill: tw_colors.fuchsia[950],
  stroke: Grays.GRAY2,
  lineWidth: 1,
  justifyContent: "center",
  alignItems: "center",
  width: "20%",
  height: "100%",
  padding: 80,
};

const DataCellProps: RectProps = {
  fill: tw_colors.zinc[950],
  stroke: Grays.GRAY2,
  lineWidth: 1,
  justifyContent: "center",
  alignItems: "center",
  width: "20%",
  height: "100%",
  padding: 100,
};

const HeaderTxtProps: TxtProps = {
  ...PoppinsWhite,
  fontSize: 70,
  fontWeight: 600,
};

const DataTxtProps: TxtProps = {
  ...PoppinsWhite,
  fontSize: 70,
  fontWeight: 500,
};

const FootnoteTxtProps: TxtProps = {
  ...PoppinsWhite,
  fontSize: 50,
  fontWeight: 400,
  fill: tw_colors.zinc[300],
};

export default makeScene2D(function* (view) {
  yield* waitFor(1);

  // --------------- container ----------------
  const container = createRef<Layout>();
  const containerNode = createRef<Node>();
  const tableRect = createRef<Rect>();

  view.add(
    <Layout
      ref={container}
      direction={"column"}
      justifyContent={"center"}
      alignItems={"center"}
      width={"100%"}
      height={"100%"}
      gap={80}
      padding={50}
      layout
    >
      <Node
        ref={containerNode}
        opacity={0}
      >
        <Rect
          ref={tableRect}
          {...TableProps}
        >
            {/* Header Row */}
            <Rect {...HeaderRowProps}>
              <Rect {...HeaderCellProps}>
                <Txt
                  {...HeaderTxtProps}
                  text={"Strategy"}
                />
              </Rect>
              <Rect
                {...HeaderCellProps}
                direction={"column"}
              >
                <Txt
                  {...HeaderTxtProps}
                  text={"25th"}
                />
                <Txt
                  {...HeaderTxtProps}
                  text={"Percentile"}
                />
              </Rect>
              <Rect {...HeaderCellProps}>
                <Txt
                  {...HeaderTxtProps}
                  text={"Median"}
                />
              </Rect>
              <Rect {...HeaderCellProps}>
                <Txt
                  {...HeaderTxtProps}
                  text={"Average"}
                />
              </Rect>
              <Rect
                {...HeaderCellProps}
                direction={"column"}
              >
                <Txt
                  {...HeaderTxtProps}
                  text={"75th"}
                />
                <Txt
                  {...HeaderTxtProps}
                  text={"Percentile"}
                />
              </Rect>
            </Rect>

            {/* Data Rows */}
            {tableData.map((row, index) => (
              <Rect {...DataRowProps}>
                <Rect
                  {...DataCellProps}
                  direction={"column"}
                  justifyContent={"center"}
                  alignItems={"center"}
                >
                  {() =>
                    row
                      .playerNameSignal()
                      .split("\n")
                      // @ts-expect-error
                      .map((line) => (
                        <Txt
                          {...DataTxtProps}
                          text={line}
                        />
                      ))
                  }
                </Rect>
                <Rect {...DataCellProps}>
                  <Txt
                    {...DataTxtProps}
                    text={row.p25}
                  />
                </Rect>
                <Rect {...DataCellProps}>
                  <Txt
                    {...DataTxtProps}
                    text={row.median}
                  />
                </Rect>
                <Rect {...DataCellProps}>
                  <Txt
                    {...DataTxtProps}
                    text={row.mean}
                  />
                </Rect>
                <Rect {...DataCellProps}>
                  <Txt
                    {...DataTxtProps}
                    text={row.p75}
                  />
                </Rect>
              </Rect>
            ))}
          </Rect>
        </Node>
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


  // Calculate title positions
  const titleFinalX = -view.width() / 2 + 100;  // 100px from left edge
  const titleFinalY = -view.height() / 2 + 100; // 100px from top edge

  // Set initial scale
  titleContainer().scale(1.5);

  // Calculate initial position - 15% from left edge of view, vertically centered
  const leftEdge = -view.width() / 2;
  const titleInitialX = leftEdge + view.width() * 0.15;
  
  // Since offsetY={-1}, we need to account for the title's height to center it
  const titleBounds = titleContainer().cacheBBox();
  const titleInitialY = -titleBounds.height / 2;
  
  titleContainer().position(new Vector2(titleInitialX, titleInitialY));

  // START DRAWING THE COMPONENTS HERE
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
  
  // 3. Fade in table
  yield* FadeIn(containerNode, 2, easeOutCubic, [100, 0]);

  yield* waitFor(1);

  yield* waitUntil("show-data");

  yield* waitFor(5);
});
