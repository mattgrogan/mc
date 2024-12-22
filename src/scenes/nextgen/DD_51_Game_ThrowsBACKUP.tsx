import {
  Circle,
  Gradient,
  Icon,
  Layout,
  makeScene2D,
  Rect,
  Txt,
  Node,
  Line,
  View2D,
} from "@motion-canvas/2d";
import {
  all,
  createRef,
  createRefArray,
  createSignal,
  delay,
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
  makeRef,
  makeRefs,
  range,
  Reference,
  ReferenceArray,
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
  LightBlueGradient,
  MonoWhite,
  PoppinsBlack,
  PoppinsWhite,
  redGradient,
  silverGradient,
  Theme,
  whiteGradientH,
} from "../../styles";
import { FadeIn } from "../../utils/FadeIn";

import { sim } from "./DD_00_Params";
import { CircumscribeRect } from "../../utils/Circumscribe";
import { Plot } from "../../components/plot/plot";

//-sessions-shooters-rolls.json
import simstats from "../../../../dicedata/output/skill66halfpress-100k/skill66halfpress-100k-sessions-shooters-rolls.json";

//-rolls_by_session.json
import rollsBySession from "../../../../dicedata/output/pushit-new/pushit-new-rolls_by_session.json";
//-rolls_by_shooter.json
import rollsByShooter from "../../../../dicedata/output/pushit-new/pushit-new-rolls_by_shooter.json";

//-quantiles.json
import quantiles from "../../../../dicedata/output/pushit-new/pushit-new-quantiles.json";

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

  const container = createRef<Layout>();
  view.add(
    <Layout
      ref={container}
      direction={"column"}
      justifyContent={"center"}
      alignItems={"center"}
      width={"90%"}
      height={"90%"}
      gap={100}
      padding={100}
      layout
    ></Layout>
  );

  yield* waitFor(1);

  //yield* doSessionPlot(container());

  // const titleNode = { instance: null as Node };
  // const titleTxt = createRef<Txt>();
  // const title = createPlotTitle(titleNode, titleTxt);
  // view.add(title);
  //titleNode.instance().position([100, 100]);
  //titleTxt().text("DISTRIBUTION OF THROWS PER SHOOTER");

  const plotTitle = makeRefs<typeof PlotTitle>();
  container().add(
    <PlotTitle
      refs={plotTitle}
      fontSize={120}
      nodeOpacity={0}
    >
      NUMBER OF DICE THROWS
    </PlotTitle>
  );
  plotTitle.subhead.text("BY SESSION");
  yield* FadeIn(plotTitle.container);
  yield* FadeIn(plotTitle.headerContainer);
  yield* FadeIn(plotTitle.subheadContainer);

  // ADD THE PLOT AREA
  const plotArea = makeRefs<typeof PlotArea>();
  const plot = createRef<Plot>();
  const X_MAX = 240;

  container().add(<PlotArea refs={plotArea}></PlotArea>);

  // ADD THE TABLE
  const dataTable = makeRefs<typeof DataTable>();

  // Find the correct data from the json file
  const id = "SESSION_ROLL_BY_SESSION";
  const p00 = quantiles.find(
    (stat) => stat.ID === id && stat.QUANTILE === 0
  ).VALUE;
  const p05 = quantiles.find(
    (stat) => stat.ID === id && stat.QUANTILE === 0.05
  ).VALUE;
  const p25 = quantiles.find(
    (stat) => stat.ID === id && stat.QUANTILE === 0.25
  ).VALUE;
  const p50 = quantiles.find(
    (stat) => stat.ID === id && stat.QUANTILE === 0.5
  ).VALUE;
  const p75 = quantiles.find(
    (stat) => stat.ID === id && stat.QUANTILE === 0.75
  ).VALUE;
  const p95 = quantiles.find(
    (stat) => stat.ID === id && stat.QUANTILE === 0.95
  ).VALUE;
  const p100 = quantiles.find(
    (stat) => stat.ID === id && stat.QUANTILE === 1
  ).VALUE;

  const tableData = [
    { label: "MIN", val: p00.toFixed(0) },
    { label: "5TH", val: p05.toFixed(0) },
    { label: "25TH", val: p25.toFixed(0) },
    { label: "MEDIAN", val: p50.toFixed(0) },
    { label: "75TH", val: p75.toFixed(0) },
    { label: "95TH", val: p95.toFixed(0) },
    { label: "MAX", val: p100.toFixed(0) },
  ];

  // Initialize array of references for the columns
  const dataTableCols = [];
  // Can I initialize this in the function?
  for (let i = 0; i < tableData.length; i++) {
    dataTableCols[i] = makeRefs<typeof DataTableColumn>();
  }

  // Create the data table and pass in the references
  container().add(
    <DataTable
      refs={dataTable}
      // colRefs={dataTableCols}
      data={tableData}
      fontSize={120}
    ></DataTable>
  );
  dataTableCols[2].container.position(
    dataTableCols[2].container.position().addY(-50)
  );
  dataTableCols[0].headerRect.fill("red");
  dataTableCols[6].valueRect.fill("green");
  dataTableCols[6].headerTxt.text("green");
  dataTableCols[6].valueTxt.text("1M");

  // yield* container().scale(0.7, 1, easeInOutCubic);
  // useLogger().debug({ message: "dataTable", object: dataTable() });

  // Plot is only added after all the layout has been completed.
  plotArea.layout.add(
    <Plot
      ref={plot}
      // position={CONTENT_CENTER.addY(-300)}
      xMin={0}
      xMax={X_MAX}
      yMax={20}
      // size={[2600, 800]}
      // size={plotArea.rect.size().mul(0.5)}
      width={plotArea.rect.width() * 0.8}
      height={plotArea.rect.height() * 0.5}
      xAxisProps={{
        opacity: 1,
        stroke: Grays.GRAY1,
        lineWidth: 8,
        end: 0,
      }}
      xLabelProps={{ fill: Grays.GRAY1, decimalNumbers: 0, fontSize: 80 }}
      yLabelProps={{
        fill: Grays.GRAY1,
        decimalNumbers: 0,
        fontSize: 85,
        suffix: "%",
      }}
      xTitleProps={{
        fill: Grays.GRAY1,
        text: "THROWS PER SESSION",
        lineToLabelPadding: 200,
        opacity: 0,
        fontSize: 100,
      }}
      yAxisProps={{ opacity: 1, stroke: Grays.GRAY1, lineWidth: 8, end: 0 }}
      yTitleProps={{
        fill: Grays.GRAY1,
        text: "FREQUENCY",
        rotation: -90,
        lineToLabelPadding: -280,
        opacity: 0,
        fontSize: 100,
      }}
    ></Plot>
  );

  yield* plot().xAxis.end(1, 0.6, easeOutCubic);
  plot().xAxis.updateTicks(0, X_MAX, 20);
  // yield* plot().xTitle.opacity(1, 0.6);

  // ************************
  // FACTOR THIS STUFF OUT
  // ************************

  const sessionThrowslines: Line[] = [];
  const sessionThrowsPcts: Txt[] = [];

  for (let index = 0; index < rollsBySession.length; index++) {
    const offset = 50;
    const point = new Vector2(
      rollsBySession[index].MIDPOINT,
      rollsBySession[index].PCT
    );
    const line = plot().vLine(point, {
      stroke: Bright.BLUE,
      lineWidth: 80,
      opacity: 1,
      end: 0,
    });
    if (rollsBySession[index].COUNT > 0) {
      sessionThrowslines.push(line);
    }

    if (rollsBySession[index].PCT > 0.5) {
      const pct = rollsBySession[index].PCT.toFixed(1) + "%";
      const label = plot().text(point, {
        text: pct,
        offsetY: 1.5,
        fill: "white",
        opacity: 0,
        fontSize: 38,
      });

      sessionThrowsPcts.push(label);
    }
  }

  yield* sequence(
    0.1,
    ...sessionThrowslines.map((line) => line.end(1, 1, easeOutCubic))
  );
  yield* waitFor(0.2);
  yield* sequence(0.2, ...sessionThrowsPcts.map((pct) => pct.opacity(1, 1)));

  // ************************
  // END FACTOR
  // ************************

  yield* waitFor(10);
  yield* waitUntil("end");
});

function PlotTitle({
  refs,
  fontSize = 120,
  nodeOpacity = 1,
  children = "",
}: {
  refs: {
    rect: Rect; // The containing Rect (top Layout node)
    container: Node; // Node containing everything
    header: Txt; // Header Txt
    headerContainer: Node; // Node containing the header Txt
    subhead: Txt; // Sub header Txt
    subheadContainer: Node; // Node containing sub header Txt
  };
  nodeOpacity?: number;
  fontSize?: number;
  children?: string;
}) {
  /**
   * Create a nice looking title with bounded Rect.
   * Use the refs to animate (with the nodes).
   * TODO:
   * - Remove dependency on titleGradient
   * - Remove dependency on PoppinsBlack
   * - Remove dependency on Grays
   * Q: Consider removing the hard coding from width and
   *    height, fontWeight, etc.
   */
  return (
    <Node
      ref={makeRef(refs, "container")}
      opacity={nodeOpacity}
    >
      <Rect
        ref={makeRef(refs, "rect")}
        width={"100%"}
        // height={"20%"}
        fill={titleGradient}
        direction={"column"}
        justifyContent={"center"}
        alignItems={"start"}
        padding={40}
        layout
        clip
      >
        <Node
          ref={makeRef(refs, "headerContainer")}
          opacity={nodeOpacity}
        >
          <Txt
            ref={makeRef(refs, "header")}
            {...PoppinsBlack}
            fill={Grays.BLACK}
            fontSize={fontSize}
            fontWeight={600}
          >
            {children}
          </Txt>
        </Node>
        <Node
          ref={makeRef(refs, "subheadContainer")}
          opacity={nodeOpacity}
        >
          <Txt
            ref={makeRef(refs, "subhead")}
            {...PoppinsBlack}
            fill={Grays.GRAY3}
            fontSize={fontSize}
            fontWeight={600}
          >
            {children}
          </Txt>
        </Node>
      </Rect>
    </Node>
  );
}

function DataTable({
  refs,
  colRefs,
  data,
  fontSize = 120,
}: {
  refs: {
    container: Node;
    columns: Node[];
    headerRects: Rect[];
    headerTxts: Txt[];
    valueRects: Rect[];
    valueTxts: Txt[];
    valueTxts: Txt[];
  };
  colRefs: {
    container: Node;
    headerRect: Rect;
    headerTxt: Txt;
    valueRect: Rect;
    valueTxt: Txt;
  }[];
  data: { label: string; val: string }[];
  fontSize?: number;
}) {
  const tbl = (
    <Node ref={makeRef(refs, "container")}>
      <Layout
        // ref={percentileTable}
        width={"100%"}
        height={"20%"}
        direction={"row"}
        gap={0}
        justifyContent={"space-evenly"}
        layout
      >
        {range(data.length).map((index) => (
          <DataTableColumn
            refs={colRefs[index]}
            data={data[index]}
            fontSize={fontSize}
            // ref={(instance: Node) => {
            //   cols[index] = instance;
            // }}
          ></DataTableColumn>
        ))}
      </Layout>
    </Node>
  );
  return tbl;
}

function DataTableColumn({
  refs,
  data,
  fontSize = 120,
}: {
  refs: {
    container: Node;
    headerRect: Rect;
    headerTxt: Txt;
    valueRect: Rect;
    valueTxt: Txt;
  };
  data: { label: string; val: string };
  fontSize?: number;
}) {
  return (
    <Node ref={makeRef(refs, "container")}>
      <Layout
        direction={"column"}
        grow={1}
        // width={"13%"}
        height={"100%"}
      >
        <Rect
          ref={makeRef(refs, "headerRect")}
          height={"50%"}
          fill={LightBlueGradient}
          justifyContent={"center"}
          alignItems={"center"}
          stroke={Grays.GRAY1}
          lineWidth={3}
        >
          <Txt
            ref={makeRef(refs, "headerTxt")}
            {...PoppinsWhite}
            fontSize={fontSize}
            fontWeight={600}
            text={data.label}
          ></Txt>
        </Rect>
        <Rect
          ref={makeRef(refs, "valueRect")}
          height={"50%"}
          fill={silverGradient}
          stroke={Grays.GRAY1}
          justifyContent={"center"}
          alignItems={"center"}
          lineWidth={3}
        >
          <Txt
            ref={makeRef(refs, "valueTxt")}
            {...PoppinsBlack}
            fontSize={fontSize}
            fontWeight={600}
            text={data.val}
          ></Txt>
        </Rect>
      </Layout>
    </Node>
  );
}

function PlotArea({
  refs,
}: {
  refs: { container: Node; rect: Rect; layout: Layout };
}) {
  return (
    <Node ref={makeRef(refs, "container")}>
      <Rect
        ref={makeRef(refs, "rect")}
        width={"100%"}
        // height={"50%"}
        grow={1}
        fill={Grays.BLACK}
        layout
      >
        <Layout
          ref={makeRef(refs, "layout")}
          layout={false}
        ></Layout>
      </Rect>
    </Node>
  );
}

// function* doSessionPlot(container: Layout) {
//   /**
//    * Create the histogram of session throws
//    */
//   const sessionThrowsPlot = createRef<Plot>();
//   const maxX = 240;

//   container.add(
//     <Plot
//       ref={sessionThrowsPlot}
//       position={CONTENT_CENTER.addY(-300)}
//       xMin={0}
//       xMax={maxX}
//       yMax={20}
//       size={[2600, 700]}
//       xAxisProps={{
//         opacity: 1,
//         stroke: Grays.GRAY1,
//         lineWidth: 8,
//         end: 0,
//       }}
//       xLabelProps={{ fill: Grays.GRAY1, decimalNumbers: 0, fontSize: 80 }}
//       yLabelProps={{
//         fill: Grays.GRAY1,
//         decimalNumbers: 0,
//         fontSize: 85,
//         suffix: "%",
//       }}
//       xTitleProps={{
//         fill: Grays.GRAY1,
//         text: "THROWS PER SESSION",
//         lineToLabelPadding: 200,
//         opacity: 0,
//         fontSize: 100,
//       }}
//       yAxisProps={{ opacity: 1, stroke: Grays.GRAY1, lineWidth: 8, end: 0 }}
//       yTitleProps={{
//         fill: Grays.GRAY1,
//         text: "FREQUENCY",
//         rotation: -90,
//         lineToLabelPadding: -280,
//         opacity: 0,
//         fontSize: 100,
//       }}
//     ></Plot>
//   );

//   yield* waitFor(1);

//   // Draw the Axis
// yield* all(
//   sessionThrowsPlot().xAxis.end(1, 0.6, easeOutCubic)
//   // plot().yAxis.end(1, 0.6, easeOutCubic)
// );

//   // Add the ticks. Wait for them to be drawn
//   sessionThrowsPlot().xAxis.updateTicks(0, maxX, 20);
//   // plot().yAxis.updateTicks(0, 20, 5);
//   // yield* waitFor(2);

//   // Draw the Titles
//   yield* sessionThrowsPlot().xTitle.opacity(1, 0.6);
//   // yield* plot().yTitle.opacity(1, 1);

//   const sessionThrowslines: Line[] = [];
//   const sessionThrowsPcts: Txt[] = [];

//   for (let index = 0; index < rollsBySession.length; index++) {
//     const offset = 50;
//     const point = new Vector2(
//       rollsBySession[index].MIDPOINT,
//       rollsBySession[index].PCT
//     );
//     const line = sessionThrowsPlot().vLine(point, {
//       stroke: Bright.BLUE,
//       lineWidth: 80,
//       opacity: 1,
//       end: 0,
//     });
//     if (rollsBySession[index].COUNT > 0) {
//       sessionThrowslines.push(line);
//     }

//     if (rollsBySession[index].PCT > 0.5) {
//       const pct = rollsBySession[index].PCT.toFixed(1) + "%";
//       const label = sessionThrowsPlot().text(point, {
//         text: pct,
//         offsetY: 1.5,
//         fill: "white",
//         opacity: 0,
//         fontSize: 38,
//       });

//       sessionThrowsPcts.push(label);
//     }
//   }

//   yield* sequence(
//     0.1,
//     ...sessionThrowslines.map((line) => line.end(1, 1, easeOutCubic))
//   );
//   yield* waitFor(0.2);
//   yield* sequence(0.2, ...sessionThrowsPcts.map((pct) => pct.opacity(1, 1)));

//   yield* waitFor(1);
// }
