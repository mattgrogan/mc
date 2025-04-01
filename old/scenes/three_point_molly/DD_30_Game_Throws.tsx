import {
  Camera,
  Gradient,
  Layout,
  Line,
  makeScene2D,
  Node,
  Rect,
  Txt,
} from "@motion-canvas/2d";
import {
  all,
  createRef,
  createRefArray,
  createSignal,
  delay,
  easeInOutCubic,
  easeOutCubic,
  easeOutSine,
  linear,
  range,
  sequence,
  Vector2,
  waitFor,
  waitUntil,
} from "@motion-canvas/core";
import {
  Bright,
  Darker,
  Darkest,
  Grays,
  LightBlueGradient,
  MonoWhite,
  PoppinsBlack,
  PoppinsWhite,
  silverGradient,
  Theme,
} from "../../styles";
import { FadeIn } from "../../utils/FadeIn";

import { Plot } from "../../components/plot/plot";
import * as params from "./DD_00_Params";

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

  const camera = createRef<Camera>();
  const container = createRef<Layout>();
  view.add(
    <Camera ref={camera}>
      <Layout ref={container}></Layout>
    </Camera>
  );

  const title = createRef<Rect>();
  const headNode = createRef<Node>();
  const subNode = createRef<Node>();
  const titleLines = createRefArray<Txt>();

  container().add(
    <Rect
      ref={title}
      width={"100%"}
      height={"20%"}
      fill={titleGradient}
      offsetY={-1}
      y={view.height() / -2}
      shadowColor={Darker.BLUE}
      shadowBlur={15}
      shadowOffsetY={10}
      direction={"column"}
      justifyContent={"center"}
      // alignContent={"start"}
      padding={100}
      // gap={0}
      layout
    >
      <Node
        ref={headNode}
        opacity={0}
      >
        <Txt
          ref={titleLines}
          {...PoppinsWhite}
          fill={Darker.BLUE}
          text={params.name}
          fontSize={240}
          fontWeight={600}
          lineHeight={200}
          opacity={1}
        />
      </Node>
      <Node
        ref={subNode}
        opacity={0}
      >
        <Txt
          ref={titleLines}
          {...PoppinsWhite}
          fill={Grays.GRAY4}
          fontSize={120}
          fontWeight={600}
          text={"SIMULATION"}
          opacity={1}
        />
      </Node>
    </Rect>
  );
  // https://github.com/motion-canvas/motion-canvas/issues/1057
  camera().scene().position(view.size().div(2));

  yield* waitFor(1);

  // Animate the title
  yield FadeIn(headNode, 0.6, easeOutCubic, [80, 0]);
  yield* waitFor(0.4);
  yield* FadeIn(subNode, 0.6, easeOutCubic, [80, 0]);

  const container2 = createRef<Layout>();
  const rows = createRefArray<Rect>();
  const rowTxts = createRefArray<Txt>();
  const nodes = createRefArray<Txt>();
  let z = -100;
  container().add(
    <Layout
      ref={container2}
      direction={"column"}
      width={"14%"}
      height={"80%"}
      y={view.height() * 0.1}
      x={view.width() / -2}
      offsetX={-1}
      gap={0}
      layout
      opacity={1}
      zIndex={-100}
    >
      {range(6).map((index) => (
        <Node
          ref={nodes}
          opacity={0}
          zIndex={z--}
        >
          <Rect
            ref={rows}
            width={"100%"}
            height={"100%"}
            fill={Grays.BLACK}
            justifyContent={"start"}
            alignItems={"center"}
            padding={50}
            stroke={Grays.GRAY2}
            lineWidth={5}
          >
            <Txt
              ref={rowTxts}
              {...PoppinsWhite}
              fill={Grays.GRAY2}
              text={"SESSIONS"}
              fontSize={65}
              fontWeight={600}
              textWrap
            ></Txt>
          </Rect>
        </Node>
      ))}
    </Layout>
  );
  // https://github.com/motion-canvas/motion-canvas/issues/1057
  camera().scene().position(view.size().div(2));

  rowTxts[0].text("DICE AND GAME FLOW");
  rowTxts[1].text("HOUSE TAKE AND EDGE");
  rowTxts[2].text("WON/LOST BY SHOOTER");
  rowTxts[3].text("WON/LOST BY SESSION");
  rowTxts[4].text("BANKROLL SURVIVAL");
  rowTxts[5].text("STRATEGY SCORE");

  yield* sequence(
    0.2,
    ...nodes.map((node) => FadeIn(node, 0.4, easeOutSine, [0, -200]))
  );

  yield* waitFor(1);

  // POP OUT THE CURRENT SECTION AS A TITLE
  const newNode = rows[0].clone({
    width: rows[0].width(),
    height: rows[0].height(),
    layout: true,
    opacity: 0,
  });
  view.add(newNode);
  newNode.absolutePosition(rows[0].absolutePosition());
  yield newNode.opacity(1, 0, linear);
  yield newNode.scale(4, 1, easeInOutCubic);
  yield newNode.fill(Darkest.RED, 1, linear);
  yield newNode.childrenAs<Rect>()[0].fill(Grays.WHITE, 1, linear);
  yield* newNode.position(CONTENT_CENTER, 1, easeInOutCubic);
  yield* waitFor(1);
  yield newNode.scale(1, 1, easeInOutCubic);
  yield* newNode.absolutePosition(
    rows[0].absolutePosition(),
    1,
    easeInOutCubic
  );
  rows[0].fill(Darkest.RED);
  rowTxts[0].fill(Grays.WHITE);
  newNode.remove();
  yield* waitFor(1);
  // END OF POPOUT

  // SHOW TOTAL THROWS TABLE

  const parameterTable = createRef<Layout>();
  const rowNodes = createRefArray<Node>();
  const rowRects = createRefArray<Rect>();
  const rowTitles = createRefArray<Txt>();
  const rowValues = createRefArray<Txt>();

  container().add(
    <Layout
      ref={parameterTable}
      direction={"column"}
      width={"45%"}
      height={"60%"}
      position={CONTENT_CENTER}
      gap={20}
      layout
      opacity={1}
    >
      <Node
        ref={rowNodes}
        opacity={0}
      >
        <Rect
          width={"100%"}
          height={"18%"}
          fill={Darker.BLUE}
          justifyContent={"center"}
          alignItems={"center"}
          stroke={Grays.GRAY3}
          lineWidth={5}
        >
          <Txt
            {...PoppinsWhite}
            // fill={Darker.BLUE}
            text={"SIMULATED DICE THROWS"}
            fontSize={120}
            fontWeight={600}
          />
        </Rect>
      </Node>
      {range(3).map((index) => (
        <Node
          ref={rowNodes}
          opacity={0}
          zIndex={z--}
        >
          <Rect
            ref={rowRects}
            opacity={1}
            width={"100%"}
            height={"18%"}
            stroke={Grays.GRAY3}
            lineWidth={5}
          >
            <Rect
              width={"50%"}
              height={"100%"}
              fill={Grays.WHITE}
              justifyContent={"start"}
              alignItems={"center"}
              padding={50}
            >
              <Txt
                ref={rowTitles}
                {...PoppinsWhite}
                fill={Grays.BLACK}
                textWrap
                textAlign={"left"}
                // text={"SESSIONS"}
                fontSize={90}
                fontWeight={600}
              ></Txt>
            </Rect>
            <Rect
              width={"50%"}
              height={"100%"}
              fill={Grays.GRAY1}
              justifyContent={"start"}
              alignItems={"center"}
              padding={50}
            >
              <Txt
                ref={rowValues}
                {...MonoWhite}
                fill={Grays.BLACK}
                // text={"100,000"}
                fontSize={120}
                fontWeight={600}
              ></Txt>
            </Rect>
          </Rect>
        </Node>
      ))}
    </Layout>
  );

  rowTitles[0].text("TOTAL THROWS");
  rowTitles[1].text("AVERAGE PER SESSION");
  rowTitles[2].text("AVERAGE PER SHOOTER");

  const totalThrowsSignal = createSignal(params.simstats[0].ROLLS * 0.8);
  const perSessionSignal = createSignal(0);
  const perShooterSignal = createSignal(0);

  rowValues[0].text(() =>
    totalThrowsSignal().toLocaleString("en-US", { maximumFractionDigits: 0 })
  );
  rowValues[1].text(() => perSessionSignal().toFixed(1));
  rowValues[2].text(() => perShooterSignal().toFixed(1));

  yield* waitFor(1);
  //yield* FadeIn(parameterTable, 1, easeOutCubic, [0, 100]);

  //yield* waitFor(1);
  yield sequence(
    0.4,
    totalThrowsSignal(params.simstats[0].ROLLS, 0.8, easeOutCubic),
    perSessionSignal(
      params.simstats[0].ROLLS / params.simstats[0].SESSIONS,
      0.8,
      easeOutCubic
    ),
    perShooterSignal(
      params.simstats[0].ROLLS / params.simstats[0].SHOOTERS,
      0.8,
      easeOutCubic
    )
  );
  yield* sequence(
    0.4,
    ...rowNodes.map((r) => FadeIn(r, 1, easeOutCubic, [0, 50]))
  );
  yield* waitFor(2);

  // Hide bottom two rows
  yield rowNodes[2].opacity(0, 0.6);
  yield* rowNodes[3].opacity(0, 0.6);
  yield* parameterTable().y(parameterTable().y() - 150, 0.6, easeInOutCubic);

  // Draw the dice plot
  const plot = createRef<Plot>();

  container().add(
    <Plot
      ref={plot}
      position={CONTENT_CENTER.addY(150)}
      xMin={1}
      xMax={13}
      yMax={20}
      size={[2400, 700]}
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
        fontSize: 80,
        suffix: "%",
      }}
      xTitleProps={{
        fill: Grays.GRAY1,
        text: "THROW",
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

  yield* waitFor(1);

  // Draw the Axis
  yield* all(
    plot().xAxis.end(1, 0.6, easeOutCubic)
    // plot().yAxis.end(1, 0.6, easeOutCubic)
  );

  // Add the ticks. Wait for them to be drawn
  plot().xAxis.updateTicks(2, 12, 1);
  // plot().yAxis.updateTicks(0, 20, 5);
  // yield* waitFor(2);

  // Draw the Titles
  yield* plot().xTitle.opacity(1, 0.6);
  // yield* plot().yTitle.opacity(1, 1);

  // Add the bars
  const bars: Line[] = [];
  const labels: Txt[] = [];

  const diceData = [
    {
      throw: 2,
      pct: 1 / 36,
    },
    { throw: 3, pct: 2 / 36 },
    { throw: 4, pct: 3 / 36 },
    { throw: 5, pct: 4 / 36 },
    { throw: 6, pct: 5 / 36 },
    { throw: 7, pct: 6 / 36 },
    { throw: 8, pct: 5 / 36 },
    { throw: 9, pct: 4 / 36 },
    { throw: 10, pct: 3 / 36 },
    { throw: 11, pct: 2 / 36 },
    { throw: 12, pct: 1 / 36 },
  ];

  for (let index = 0; index < diceData.length; index++) {
    const offset = 50;
    const point = new Vector2(diceData[index].throw, diceData[index].pct * 100);
    const line = plot().vLine(point, {
      stroke: Bright.BLUE,
      lineWidth: 140,
      opacity: 1,
      end: 0,
    });
    bars.push(line);

    const pct = (diceData[index].pct * 100).toFixed(2) + "%";
    const label = plot().text(point, {
      text: pct,
      offsetY: 1.5,
      fill: "white",
      opacity: 0,
      fontSize: 60,
    });
    labels.push(label);
  }

  yield* sequence(0.1, ...bars.map((line) => line.end(1, 0.6, easeOutCubic)));
  // yield* waitFor(0.2);
  yield* sequence(0.1, ...labels.map((pct) => pct.opacity(1, 0.6)));

  yield* waitFor(5);
  yield* waitUntil("end-dice");
  yield parameterTable().opacity(0, 0.6);
  yield* plot().opacity(0, 0.6);
  parameterTable().remove();
  plot().remove();

  camera().save();
  yield delay(3, camera().position(CONTENT_CENTER, 2, easeInOutCubic));
  yield delay(3, camera().zoom(1.3, 2, easeInOutCubic));
  yield* doSessionPlot(container());
  yield* camera().restore(2, easeInOutCubic);

  yield* waitFor(2);

  camera().save();
  yield delay(3, camera().position(CONTENT_CENTER, 2, easeInOutCubic));
  yield delay(3, camera().zoom(1.3, 2, easeInOutCubic));
  yield* doShooterPlot(container());
  yield* camera().restore(2, easeInOutCubic);

  yield* waitFor(10);
  yield* waitUntil("end");
});

function* doSessionPlot(container: Layout) {
  /**
   * Create the histogram of session throws
   */
  const sessionThrowsPlot = createRef<Plot>();
  const maxX = 240;

  container.add(
    <Plot
      ref={sessionThrowsPlot}
      position={CONTENT_CENTER.addY(-300)}
      xMin={0}
      xMax={maxX}
      yMax={20}
      size={[2600, 700]}
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

  yield* waitFor(1);

  // Draw the Axis
  yield* all(
    sessionThrowsPlot().xAxis.end(1, 0.6, easeOutCubic)
    // plot().yAxis.end(1, 0.6, easeOutCubic)
  );

  // Add the ticks. Wait for them to be drawn
  sessionThrowsPlot().xAxis.updateTicks(0, maxX, 20);
  // plot().yAxis.updateTicks(0, 20, 5);
  // yield* waitFor(2);

  // Draw the Titles
  yield* sessionThrowsPlot().xTitle.opacity(1, 0.6);
  // yield* plot().yTitle.opacity(1, 1);

  const sessionThrowslines: Line[] = [];
  const sessionThrowsPcts: Txt[] = [];

  for (let index = 0; index < params.rollsBySession.length; index++) {
    const offset = 50;
    const point = new Vector2(
      params.rollsBySession[index].MIDPOINT,
      params.rollsBySession[index].PCT
    );
    const line = sessionThrowsPlot().vLine(point, {
      stroke: Bright.BLUE,
      lineWidth: 80,
      opacity: 1,
      end: 0,
    });
    if (params.rollsBySession[index].COUNT > 0) {
      sessionThrowslines.push(line);
    }

    if (params.rollsBySession[index].PCT > 0.5) {
      const pct = params.rollsBySession[index].PCT.toFixed(1) + "%";
      const label = sessionThrowsPlot().text(point, {
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

  yield* waitFor(1);

  // Show the table
  const percentileTable = createRef<Layout>();
  const percentileNodes = createRefArray<Node>();
  const percentileHeaders = createRefArray<Txt>();
  const percentileValues = createRefArray<Txt>();
  container.add(
    <Layout
      ref={percentileTable}
      width={2800}
      height={300}
      position={CONTENT_CENTER.addY(600)}
      direction={"row"}
      justifyContent={"center"}
      layout
    >
      {range(7).map((index) => (
        <Layout
          direction={"column"}
          width={"13%"}
          height={"100%"}
        >
          <Node
            ref={percentileNodes}
            opacity={0}
          >
            <Rect
              height={"50%"}
              fill={LightBlueGradient}
              justifyContent={"center"}
              alignItems={"center"}
              stroke={Grays.GRAY1}
              lineWidth={3}
            >
              <Txt
                ref={percentileHeaders}
                {...PoppinsWhite}
                fontSize={80}
                fontWeight={600}
              ></Txt>
            </Rect>
            <Rect
              height={"50%"}
              fill={silverGradient}
              stroke={Grays.GRAY1}
              justifyContent={"center"}
              alignItems={"center"}
              lineWidth={3}
            >
              <Txt
                ref={percentileValues}
                {...PoppinsBlack}
                fontSize={80}
                fontWeight={600}
              ></Txt>
            </Rect>
          </Node>
        </Layout>
      ))}
    </Layout>
  );

  percentileHeaders[0].text("MIN");
  percentileHeaders[1].text("5TH");
  percentileHeaders[2].text("25TH");
  percentileHeaders[3].text("MEDIAN");
  percentileHeaders[4].text("75TH");
  percentileHeaders[5].text("95TH");
  percentileHeaders[6].text("MAX");

  const id = "SESSION_ROLL_BY_SESSION";
  const p00 = params.quantiles.find(
    (stat) => stat.ID === id && stat.QUANTILE === 0
  ).VALUE;
  const p05 = params.quantiles.find(
    (stat) => stat.ID === id && stat.QUANTILE === 0.05
  ).VALUE;
  const p25 = params.quantiles.find(
    (stat) => stat.ID === id && stat.QUANTILE === 0.25
  ).VALUE;
  const p50 = params.quantiles.find(
    (stat) => stat.ID === id && stat.QUANTILE === 0.5
  ).VALUE;
  const p75 = params.quantiles.find(
    (stat) => stat.ID === id && stat.QUANTILE === 0.75
  ).VALUE;
  const p95 = params.quantiles.find(
    (stat) => stat.ID === id && stat.QUANTILE === 0.95
  ).VALUE;
  const p100 = params.quantiles.find(
    (stat) => stat.ID === id && stat.QUANTILE === 1
  ).VALUE;

  // useLogger().error({ message: minVal.VALUE.toFixed(0) });
  percentileValues[0].text(p00.toFixed(0));
  percentileValues[1].text(p05.toFixed(0));
  percentileValues[2].text(p25.toFixed(0));
  percentileValues[3].text(p50.toFixed(0));
  percentileValues[4].text(p75.toFixed(0));
  percentileValues[5].text(p95.toFixed(0));
  percentileValues[6].text(p100.toFixed(0));

  yield* sequence(0.2, ...percentileNodes.map((pct) => pct.opacity(1, 1)));

  yield* waitFor(5);
  yield* waitUntil("end-throws");
  yield sessionThrowsPlot().opacity(0, 2);
  yield percentileTable().opacity(0, 2);
}

function* doShooterPlot(container: Layout) {
  /**
   * Create the histogram of session throws
   */
  const plot = createRef<Plot>();
  const maxX = 120;

  container.add(
    <Plot
      ref={plot}
      position={CONTENT_CENTER.addY(-300)}
      xMin={0}
      xMax={maxX}
      yMax={40}
      size={[2600, 700]}
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
        fontSize: 80,
        suffix: "%",
      }}
      xTitleProps={{
        fill: Grays.GRAY1,
        text: "THROWS PER SHOOTER",
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

  yield* waitFor(1);

  // Draw the Axis
  yield* all(
    plot().xAxis.end(1, 0.6, easeOutCubic)
    // plot().yAxis.end(1, 0.6, easeOutCubic)
  );

  // Add the ticks. Wait for them to be drawn
  plot().xAxis.updateTicks(0, maxX, 20);
  // plot().yAxis.updateTicks(0, 20, 5);
  // yield* waitFor(2);

  // Draw the Titles
  yield* plot().xTitle.opacity(1, 0.6);
  // yield* plot().yTitle.opacity(1, 1);

  const sessionThrowslines: Line[] = [];
  const sessionThrowsPcts: Txt[] = [];

  for (let index = 0; index < params.rollsByShooter.length; index++) {
    const offset = 50;
    const point = new Vector2(
      params.rollsByShooter[index].MIDPOINT,
      params.rollsByShooter[index].PCT
    );
    const line = plot().vLine(point, {
      stroke: Bright.BLUE,
      lineWidth: 80,
      opacity: 1,
      end: 0,
    });
    if (params.rollsByShooter[index].COUNT > 0) {
      sessionThrowslines.push(line);
    }

    if (params.rollsByShooter[index].PCT > 0.5) {
      const pct = params.rollsByShooter[index].PCT.toFixed(1) + "%";
      const label = plot().text(point, {
        text: pct,
        offsetY: 1.5,
        fill: "white",
        opacity: 0,
        fontSize: 35,
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

  yield* waitFor(1);

  // Show the table
  const percentileTable = createRef<Layout>();
  const percentileNodes = createRefArray<Node>();
  const percentileHeaders = createRefArray<Txt>();
  const percentileValues = createRefArray<Txt>();
  container.add(
    <Layout
      ref={percentileTable}
      width={2800}
      height={300}
      position={CONTENT_CENTER.addY(600)}
      direction={"row"}
      justifyContent={"center"}
      layout
    >
      {range(7).map((index) => (
        <Layout
          direction={"column"}
          width={"13%"}
          height={"100%"}
        >
          <Node
            ref={percentileNodes}
            opacity={0}
          >
            <Rect
              height={"50%"}
              fill={LightBlueGradient}
              justifyContent={"center"}
              alignItems={"center"}
              stroke={Grays.GRAY1}
              lineWidth={3}
            >
              <Txt
                ref={percentileHeaders}
                {...PoppinsWhite}
                fontSize={80}
                fontWeight={600}
              ></Txt>
            </Rect>
            <Rect
              height={"50%"}
              fill={silverGradient}
              stroke={Grays.GRAY1}
              justifyContent={"center"}
              alignItems={"center"}
              lineWidth={3}
            >
              <Txt
                ref={percentileValues}
                {...PoppinsBlack}
                fontSize={80}
                fontWeight={600}
              ></Txt>
            </Rect>
          </Node>
        </Layout>
      ))}
    </Layout>
  );

  percentileHeaders[0].text("MIN");
  percentileHeaders[1].text("5TH");
  percentileHeaders[2].text("25TH");
  percentileHeaders[3].text("MEDIAN");
  percentileHeaders[4].text("75TH");
  percentileHeaders[5].text("95TH");
  percentileHeaders[6].text("MAX");

  const id = "SHOOTER_ROLL_BY_SHOOTER";
  const p00 = params.quantiles.find(
    (stat) => stat.ID === id && stat.QUANTILE === 0
  ).VALUE;
  const p05 = params.quantiles.find(
    (stat) => stat.ID === id && stat.QUANTILE === 0.05
  ).VALUE;
  const p25 = params.quantiles.find(
    (stat) => stat.ID === id && stat.QUANTILE === 0.25
  ).VALUE;
  const p50 = params.quantiles.find(
    (stat) => stat.ID === id && stat.QUANTILE === 0.5
  ).VALUE;
  const p75 = params.quantiles.find(
    (stat) => stat.ID === id && stat.QUANTILE === 0.75
  ).VALUE;
  const p95 = params.quantiles.find(
    (stat) => stat.ID === id && stat.QUANTILE === 0.95
  ).VALUE;
  const p100 = params.quantiles.find(
    (stat) => stat.ID === id && stat.QUANTILE === 1
  ).VALUE;

  // useLogger().error({ message: minVal.VALUE.toFixed(0) });
  percentileValues[0].text(p00.toFixed(0));
  percentileValues[1].text(p05.toFixed(0));
  percentileValues[2].text(p25.toFixed(0));
  percentileValues[3].text(p50.toFixed(0));
  percentileValues[4].text(p75.toFixed(0));
  percentileValues[5].text(p95.toFixed(0));
  percentileValues[6].text(p100.toFixed(0));

  yield* sequence(0.2, ...percentileNodes.map((pct) => pct.opacity(1, 1)));

  yield* waitFor(5);
  yield* waitUntil("end-sessionthrows");
  yield plot().opacity(0, 2);
  yield percentileTable().opacity(0, 2);
}
