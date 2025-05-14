import {
  Camera,
  Layout,
  makeScene2D,
  Txt,
  Node,
  TxtProps,
} from "@motion-canvas/2d";
import {
  createRef,
  createSignal,
  easeInOutCubic,
  easeOutCubic,
  linear,
  makeRefs,
  sequence,
  waitFor,
} from "@motion-canvas/core";
import { Grays, PoppinsWhite } from "../../styles";
import { data } from "././DD_00_Params";
import { plusCommaFormmatter } from "../../components/styled/findQuantiles";
import { tw_colors } from "../../../src/tw_colors";
import { ComparisonDataTable } from "../../components/styled/comparisonDataTable";
import { FadeIn } from "../../utils/FadeIn";

const TITLE = "Comparison of the Amounts Won and Lost ";
const TITLE_OFFSET_Y = -200;

const DATA = data.QUANTILES_BY_SESSION;
const KEYS = ["ATS_Baseline", "ATS_Lay"];
const COLS = [
  "PLAYER_NAME",
  "MIN_WONLOST",
  "P05",
  "P25",
  "MEDIAN_WONLOST",
  "MEAN_WONLOST",
  "P75",
  "P95",
  "MAX_WONLOST",
];
const HEADERS = [
  "STRATEGY",
  "MIN",
  "5TH",
  "25TH",
  "MEDIAN",
  "AVERAGE",
  "75TH",
  "95TH",
  "MAX",
];

// THEME
const LABEL_RECT_PROPS = {
  fill: tw_colors.blue[800],
  stroke: Grays.GRAY1,
};

const VALUE_RECT_PROPS = {
  fill: tw_colors.zinc[950],
  stroke: Grays.GRAY1,
};

const TITLE_TXT_PROPS: TxtProps = {
  ...PoppinsWhite,
  fontSize: 100,
  fontWeight: 600,
  fill: tw_colors.zinc[300],
};

// --------------- makeScene2d ----------------

export default makeScene2D(function* (view) {
  // --------------- container ----------------
  const camera = createRef<Camera>();
  const container = createRef<Layout>();
  view.add(
    <Camera ref={camera}>
      <Layout
        ref={container}
        direction={"column"}
        justifyContent={"center"}
        alignItems={"center"}
        width={"100%"}
        height={"100%"}
        gap={50}
        padding={0}
        layout
      ></Layout>
    </Camera>
  );

  // https://github.com/motion-canvas/motion-canvas/issues/1057
  camera().scene().position(view.size().div(2));

  // --------------- table ----------------
  const dataTable = makeRefs<typeof ComparisonDataTable>();
  container().add(
    <ComparisonDataTable
      refs={dataTable}
      data={DATA}
      keys={KEYS}
      cols={COLS}
      formatter={plusCommaFormmatter}
      headers={HEADERS}
      headerRectProps={{ ...LABEL_RECT_PROPS }}
      valueRectProps={{ ...VALUE_RECT_PROPS }}
      headerTxtProps={{ ...PoppinsWhite }}
      valueTxtProps={{ ...PoppinsWhite }}
      fontSize={48}
    ></ComparisonDataTable>
  );
  dataTable.layout.width("75%");
  dataTable.layout.height("30%");
  dataTable.layout.y(1100);

  // --------------- title ----------------
  const title = createSignal(TITLE);
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
          alignItems={"start"}
          ref={titleRef}
          position={() => dataTable.layout.topLeft().addY(TITLE_OFFSET_Y)}
          offset={[-1, 0]}
        >
          {() =>
            title()
              .split("\n")
              .map((line) => (
                <Txt
                  {...TITLE_TXT_PROPS}
                  text={line}
                />
              ))
          }
        </Layout>
      </Layout>
    </Node>
  );

  // START DRAWING THE COMPONENTS HERE
  // =================================

  // --------------- center camera on title ----------------
  camera().save();
  camera().zoom(1.3);
  yield camera().centerOn(titleRef().middle(), 0);

  yield* waitFor(1);

  // --------------- title ----------------
  yield* FadeIn(titleNode, 1, easeOutCubic, [100, 0]);
  yield* waitFor(1);

  // --------------- data table ----------------
  yield camera().restore(2, easeInOutCubic);
  yield* waitFor(0.5);
  yield* sequence(
    0.1,
    ...dataTable.columns.map((c) => c.opacity(1, 1, linear))
  );

  yield* waitFor(0.5);

  // --------------- camera ----------------
  yield* camera().zoom(1.1, 1, easeInOutCubic);

  yield* waitFor(5);
});
