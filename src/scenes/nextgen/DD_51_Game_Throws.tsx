import {
  Gradient,
  Layout,
  makeScene2D,
  Rect,
  Txt,
  Node,
  Line,
} from "@motion-canvas/2d";
import {
  createRef,
  easeOutCubic,
  linear,
  makeRef,
  makeRefs,
  range,
  sequence,
  Vector2,
  waitFor,
  waitUntil,
} from "@motion-canvas/core";
import {
  blueGradient,
  Bright,
  Darker,
  grayGradient,
  Grays,
  LightBlueGradient,
  PoppinsBlack,
  PoppinsWhite,
  purpleGradient,
  silverGradient,
  Theme,
  yellowGradient,
} from "../../styles";
import { FadeIn } from "../../utils/FadeIn";

import { Plot } from "../../components/plot/plot";

//-sessions-shooters-rolls.json
import simstats from "../../../../dicedata/output/skill66halfpress-100k/skill66halfpress-100k-sessions-shooters-rolls.json";

//-rolls_by_session.json
import rollsBySession from "../../../../dicedata/output/pushit-new/pushit-new-rolls_by_session.json";

//-quantiles.json
import quantiles from "../../../../dicedata/output/pushit-new/pushit-new-quantiles.json";

let titleGradient = new Gradient({
  from: [0, -300],
  to: [0, 100],
  stops: [
    { offset: 0, color: "#2191fb" },
    { offset: 1, color: "#1d4e89" },
  ],
});

const plotAreaFill = new Gradient({
  type: "linear",

  from: [0, -200],
  to: [0, 500],
  stops: [
    { offset: 0, color: "#d2d2d2" },
    { offset: 1, color: "#818181" },
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
      width={"80%"}
      height={"90%"}
      gap={50}
      padding={100}
      layout
    ></Layout>
  );

  yield* waitFor(1);

  const plotTitle = makeRefs<typeof PlotTitle>();
  container().add(
    <PlotTitle
      refs={plotTitle}
      fontSize={100}
      nodeOpacity={0}
    >
      NUMBER OF DICE THROWS
    </PlotTitle>
  );
  plotTitle.subhead.text("BY SESSION");

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
    {
      label: "AVG",
      val: (simstats[0].ROLLS / simstats[0].SESSIONS).toFixed(2),
    },
  ];

  // Create the data table and pass in the references
  container().add(
    <DataTable
      refs={dataTable}
      data={tableData}
      fontSize={80}
    ></DataTable>
  );

  dataTable.headerRects[7].fill(purpleGradient);

  // Plot is only added after all the layout has been completed.
  plotArea.layout.add(
    <Plot
      ref={plot}
      // position={CONTENT_CENTER.addY(-300)}
      position={() => plotArea.layout.position()}
      xMin={0}
      xMax={X_MAX}
      yMax={20}
      // size={[2600, 800]}
      // size={plotArea.rect.size().mul(0.5)}
      width={plotArea.rect.width() * 0.9}
      height={plotArea.rect.height() * 0.7}
      xAxisProps={{
        opacity: 1,
        stroke: Grays.BLACK,
        lineWidth: 8,
        end: 0,
      }}
      xLabelProps={{ fill: Grays.BLACK, decimalNumbers: 0, fontSize: 40 }}
      yLabelProps={{
        fill: Grays.BLACK,
        decimalNumbers: 0,
        fontSize: 85,
        suffix: "%",
      }}
      xTitleProps={{
        fill: Grays.BLACK,
        text: "THROWS PER SESSION",
        lineToLabelPadding: 200,
        opacity: 0,
        fontSize: 100,
      }}
      xTickProps={{ stroke: Grays.BLACK }}
      yAxisProps={{ opacity: 1, stroke: Grays.BLACK, lineWidth: 8, end: 0 }}
      yTitleProps={{
        fill: Grays.BLACK,
        text: "FREQUENCY",
        rotation: -90,
        lineToLabelPadding: -280,
        opacity: 0,
        fontSize: 100,
      }}
    ></Plot>
  );

  // START DRAWING THE COMPONENTS HERE

  // Draw the title
  yield* FadeIn(plotTitle.headerContainer, 0, easeOutCubic, [100, 0]);
  yield* FadeIn(plotTitle.subheadContainer, 0, easeOutCubic, [100, 0]);
  yield* FadeIn(plotTitle.container, 0.6, easeOutCubic, [100, 0]);

  // yield* waitFor(1);

  // Draw the Plot
  yield* FadeIn(plotArea.container, 1, easeOutCubic, [100, 0]);

  // yield* waitFor(2);
  yield plot().xAxis.end(1, 0.6, easeOutCubic);
  plot().xAxis.updateTicks(0, X_MAX, 20);

  // yield* waitFor(1); // Wait for ticks to be drawn

  // yield* plot().xTitle.opacity(1, 0.6);

  // Add the Min line
  const minLine = plot().vLine([p00, 2], {
    stroke: Grays.GRAY3,
    lineWidth: 6,
    end: 0,
  });

  // Add the Max line
  const maxLine = plot().vLine([p100, 2], {
    stroke: Grays.GRAY3,
    lineWidth: 6,
    end: 0,
  });

  // Try a box
  const lowerRangeBox = plot().box([0, 2], [p00, 0], {
    fill: Grays.GRAY3,
    opacity: 0,
    zIndex: -200,
  });
  const upperRangeBox = plot().box([p100, 2], [X_MAX, 0], {
    fill: Grays.GRAY3,
    opacity: 0,
    zIndex: -200,
  });

  yield* waitFor(2);

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

    if (rollsBySession[index].PCT >= 0.1) {
      const pct = rollsBySession[index].PCT.toFixed(1);
      const label = plot().text(point, {
        ...PoppinsWhite,
        text: pct,
        offsetY: 1.5,
        fill: Grays.BLACK,
        fontWeight: 500,
        fontSize: 40,
        opacity: 0,
      });
      label.add(
        <Txt
          text="%"
          fontSize={24}
        />
      );

      sessionThrowsPcts.push(label);
    }
  }
  // ************************
  // END FACTOR
  // ************************

  yield* sequence(
    0.1,
    ...sessionThrowslines.map((line) => line.end(1, 1, easeOutCubic))
  );
  yield* sequence(0.1, ...sessionThrowsPcts.map((pct) => pct.opacity(1, 0.6)));

  // Show data ranges in plot
  yield* minLine.end(1, 1, easeOutCubic);
  yield* lowerRangeBox.opacity(0.2, 1, linear);
  yield* maxLine.end(1, 1, easeOutCubic);
  yield* upperRangeBox.opacity(0.2, 1, linear);

  // Show the data table
  yield* sequence(0.1, ...dataTable.columns.map((pct) => pct.opacity(1, 0.6)));

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
        padding={30}
        paddingLeft={60}
        stroke={Grays.GRAY1}
        lineWidth={3}
        layout
        clip
      >
        <Node
          ref={makeRef(refs, "headerContainer")}
          opacity={nodeOpacity}
        >
          <Txt
            ref={makeRef(refs, "header")}
            {...PoppinsWhite}
            // fill={Bright.ORANGE}
            fontSize={fontSize}
            fontWeight={700}
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
            {...PoppinsWhite}
            // fill={Grays.GRAY1}
            fontSize={fontSize * 0.8}
            fontWeight={400}
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
  };
  data: { label: string; val: string }[];
  fontSize?: number;
}) {
  // Initialize the arrays
  refs.columns = [];
  refs.headerRects = [];
  refs.headerTxts = [];
  refs.valueRects = [];
  refs.valueTxts = [];

  return (
    <Node ref={makeRef(refs, "container")}>
      <Layout
        width={"100%"}
        height={"20%"}
        direction={"row"}
        gap={0}
        justifyContent={"space-evenly"}
        layout
      >
        {range(data.length).map((index) => (
          <Node
            ref={makeRef(refs.columns, index)}
            opacity={0}
          >
            <Layout
              direction={"column"}
              grow={1}
              height={"100%"}
              basis={0}
            >
              <Rect
                ref={makeRef(refs.headerRects, index)}
                height={"50%"}
                fill={LightBlueGradient}
                justifyContent={"center"}
                alignItems={"center"}
                stroke={Grays.GRAY1}
                lineWidth={3}
              >
                <Txt
                  ref={makeRef(refs.headerTxts, index)}
                  {...PoppinsWhite}
                  fontSize={fontSize}
                  fontWeight={600}
                  text={data[index].label}
                ></Txt>
              </Rect>
              <Rect
                ref={makeRef(refs.valueRects, index)}
                height={"50%"}
                fill={silverGradient}
                stroke={Grays.GRAY1}
                justifyContent={"center"}
                alignItems={"center"}
                lineWidth={3}
              >
                <Txt
                  ref={makeRef(refs.valueTxts, index)}
                  {...PoppinsBlack}
                  fontSize={fontSize}
                  fontWeight={600}
                  text={data[index].val}
                ></Txt>
              </Rect>
            </Layout>
          </Node>
        ))}
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
    <Node
      ref={makeRef(refs, "container")}
      opacity={0}
    >
      <Rect
        ref={makeRef(refs, "rect")}
        width={"100%"}
        // height={"50%"}
        grow={1}
        fill={plotAreaFill}
        stroke={Grays.GRAY1}
        lineWidth={3}
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
