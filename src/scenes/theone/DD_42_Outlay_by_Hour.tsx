// EXTRACT_FRAMES: [000225]
import {
  Camera,
  Layout,
  makeScene2D,
  Rect,
  RectProps,
  Txt,
  TxtProps,
  Node,
} from "@motion-canvas/2d";
import {
  createRef,
  createSignal,
  easeInOutCubic,
  easeOutCubic,
  waitFor,
  waitUntil,
} from "@motion-canvas/core";
import { Grays, PoppinsWhite } from "../../styles";
import { tw_colors } from "../../tw_colors";
import { FadeIn } from "../../utils/FadeIn";

// Import hourly outlay data
import hourlyOutlayData from "./hourly_outlay.v1.json";
import { commaFormmatter } from "../../components/styled/findQuantiles";

const TITLE = "Estimated Outlay per Hour";

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
  TheOne: "The One",
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
  fontSize: 100,
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
  const camera = createRef<Camera>();
  const container = createRef<Layout>();
  const containerNode = createRef<Node>();
  const tableRect = createRef<Rect>();

  view.add(
    <Camera ref={camera}>
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
    </Camera>
  );

  // --------------- title ----------------
  const titleNode = createRef<Node>();
  const titleRef = createRef<Layout>();

  container().add(
    <Node
      ref={titleNode}
      opacity={0}
    >
      <Layout layout={false}>
        <Layout
          layout
          direction={"column"}
          alignItems={"center"}
          ref={titleRef}
          position={() => tableRect().topLeft().addY(-120)}
          offset={[-1, 0]}
        >
          <Txt
            {...TITLE_TXT_PROPS}
            text={TITLE}
          />
        </Layout>
      </Layout>
    </Node>
  );

  // --------------- footnote ----------------
  const footnoteNode = createRef<Node>();
  const footnoteRef = createRef<Layout>();

  container().add(
    <Node
      ref={footnoteNode}
      opacity={0}
    >
      <Layout layout={false}>
        <Layout
          layout
          direction={"column"}
          alignItems={"end"}
          ref={footnoteRef}
          position={() => container().bottomRight().add([-100, -100])}
          offset={[1, 0]}
        >
          <Txt
            {...FootnoteTxtProps}
            text={"* Based on a table speed of 100 throws per hour."}
          />
        </Layout>
      </Layout>
    </Node>
  );

  // https://github.com/motion-canvas/motion-canvas/issues/1057
  camera().scene().position(view.size().div(2));

  camera().save();
  camera().position(titleRef().middle());
  camera().zoom(1.5);

  // START DRAWING THE COMPONENTS HERE
  // =================================
  yield* FadeIn(titleNode, 1, easeOutCubic, [100, 0]);
  yield* waitFor(0.5);
  yield camera().restore(2, easeInOutCubic);
  yield* FadeIn(containerNode, 2, easeOutCubic, [100, 0]);
  yield* FadeIn(footnoteNode, 1, easeOutCubic, [50, 0]);

  yield* waitFor(1);

  yield* waitUntil("show-data");

  yield* waitFor(5);
});
