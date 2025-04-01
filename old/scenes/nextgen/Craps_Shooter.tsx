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
  easeInBack,
  easeInCubic,
  easeInOutCubic,
  easeOutBack,
  easeOutCubic,
  linear,
  waitFor,
} from "@motion-canvas/core";
import {
  blueGradient,
  Bright,
  Darker,
  Grays,
  greenGradient,
  PoppinsWhite,
  redGradient,
} from "../../styles";

const RECT_WIDTH = "15%";
const FONT_SIZE = 70;
const FONT_WEIGHT = 700;
const LINE_PROPS: LineProps = {
  arrowSize: 40,
  stroke: Grays.GRAY2,
  startOffset: 10,
  end: 0,
};
const LABEL_PROPS: TxtProps = {
  fontSize: 40,
  fill: Bright.BLUE,
  fontWeight: 800,
  opacity: 0,
  layout: false,
};
const DASHED_LINE_PROPS: LineProps = {
  endArrow: false,
  stroke: Bright.YELLOW,
  endOffset: 100,
  lineDash: [50, 20],
  lineWidth: 20,
  end: 1,
  opacity: 0,
};

export default makeScene2D(function* (view) {
  const camera = createRef<Camera>();
  const container = createRef<Layout>();
  view.add(
    <Camera ref={camera}>
      <Layout
        ref={container}
        direction={"row"}
        justifyContent={"space-around"}
        alignItems={"center"}
        width={"100%"}
        height={"100%"}
        gap={50}
        padding={100}
        layout
      ></Layout>
    </Camera>
  );

  // NEW SHOOTER
  const newShooter = createRef<Rect>();
  const newShooterNode = createRef<Node>();
  container().add(
    <Node
      ref={newShooterNode}
      opacity={0}
    >
      <Rect
        ref={newShooter}
        height={"15%"}
        width={RECT_WIDTH}
        fill={greenGradient}
        stroke={"white"}
        lineWidth={5}
        radius={10}
        justifyContent={"center"}
        alignItems={"center"}
      >
        <Txt
          {...PoppinsWhite}
          text={"New Shooter"}
          fontSize={FONT_SIZE}
          fontWeight={FONT_WEIGHT}
        ></Txt>
      </Rect>
    </Node>
  );

  // COME OUT ROLL
  const comeOutRoll = createRef<Rect>();
  const comeOutRollNode = createRef<Node>();
  container().add(
    <Node
      ref={comeOutRollNode}
      opacity={0}
    >
      <Rect
        ref={comeOutRoll}
        height={"15%"}
        width={RECT_WIDTH}
        fill={blueGradient}
        stroke={"white"}
        lineWidth={5}
        radius={10}
        justifyContent={"center"}
        alignItems={"center"}
      >
        <Txt
          {...PoppinsWhite}
          text={"Come Out Roll"}
          fontSize={FONT_SIZE}
          fontWeight={FONT_WEIGHT}
        ></Txt>
      </Rect>
    </Node>
  );

  // POINT ROLL
  const pointRoll = createRef<Rect>();
  const pointRollNode = createRef<Node>();
  container().add(
    <Node
      ref={pointRollNode}
      opacity={0}
    >
      <Rect
        ref={pointRoll}
        height={"15%"}
        width={RECT_WIDTH}
        fill={blueGradient}
        stroke={"white"}
        lineWidth={5}
        radius={10}
        justifyContent={"center"}
        alignItems={"center"}
      >
        <Txt
          {...PoppinsWhite}
          text={"Point Roll"}
          fontSize={FONT_SIZE}
          fontWeight={FONT_WEIGHT}
        ></Txt>
      </Rect>
    </Node>
  );

  // SEVEN OUT
  const sevenOut = createRef<Rect>();
  const sevenOutNode = createRef<Node>();
  container().add(
    <Node
      ref={sevenOutNode}
      opacity={0}
    >
      <Rect
        ref={sevenOut}
        height={"15%"}
        width={RECT_WIDTH}
        fill={redGradient}
        stroke={"white"}
        lineWidth={5}
        radius={10}
        justifyContent={"center"}
        alignItems={"center"}
      >
        <Txt
          {...PoppinsWhite}
          text={"Seven Out"}
          fontSize={FONT_SIZE}
          fontWeight={FONT_WEIGHT}
        ></Txt>
      </Rect>
    </Node>
  );

  // NEW SHOOTER TO COME OUT ROLL LINE
  const newShooterToComeOut = createRef<Line>();
  container().add(
    <Line
      ref={newShooterToComeOut}
      lineWidth={20}
      stroke={"white"}
      layout={false}
      points={[() => newShooter().right(), () => comeOutRoll().left()]}
      startOffset={20}
      endOffset={20}
      endArrow
      {...LINE_PROPS}
    ></Line>
  );

  // COME OUT ROLL TO POINT ROLL LINE
  const comeoutToPoint = createRef<Line>();
  container().add(
    <Line
      ref={comeoutToPoint}
      lineWidth={20}
      stroke={"white"}
      layout={false}
      points={[() => comeOutRoll().right(), () => pointRoll().left()]}
      startOffset={20}
      endOffset={20}
      endArrow
      {...LINE_PROPS}
    ></Line>
  );

  // POINT ROLL TO SEVEN OUT LINE
  const pointToSevenOut = createRef<Line>();
  container().add(
    <Line
      ref={pointToSevenOut}
      lineWidth={20}
      stroke={"white"}
      layout={false}
      points={[() => pointRoll().right(), () => sevenOut().left()]}
      startOffset={20}
      endOffset={20}
      endArrow
      {...LINE_PROPS}
    ></Line>
  );

  // COME OUT LOOP BACK
  const comeoutLoop = createRef<Line>();
  container().add(
    <Line
      ref={comeoutLoop}
      stroke={"white"}
      lineWidth={20}
      layout={false}
      points={[
        () =>
          comeOutRoll()
            .top()
            .addX(comeOutRoll().width() * 0.25),
        () =>
          comeOutRoll()
            .top()
            .addX(comeOutRoll().width() * 0.25)
            .addY(-250),
        () =>
          comeOutRoll()
            .top()
            .addX(comeOutRoll().width() * 0.25)
            .addY(-250)
            .addX(comeOutRoll().width() * -0.5),
        () =>
          comeOutRoll()
            .top()
            .addX(comeOutRoll().width() * 0.25)
            .addY(-250)
            .addX(comeOutRoll().width() * -0.5)
            .addY(250),
      ]}
      radius={120}
      startOffset={50}
      endOffset={50}
      endArrow
      {...LINE_PROPS}
    ></Line>
  );

  // POINT LOOP BACK
  const pointLoop = createRef<Line>();
  container().add(
    <Line
      ref={pointLoop}
      stroke={"white"}
      lineWidth={20}
      layout={false}
      points={[
        () =>
          pointRoll()
            .top()
            .addX(pointRoll().width() * 0.25),
        () =>
          pointRoll()
            .top()
            .addX(pointRoll().width() * 0.25)
            .addY(-250),
        () =>
          pointRoll()
            .top()
            .addX(pointRoll().width() * 0.25)
            .addY(-250)
            .addX(pointRoll().width() * -0.5),
        () =>
          pointRoll()
            .top()
            .addX(pointRoll().width() * 0.25)
            .addY(-250)
            .addX(pointRoll().width() * -0.5)
            .addY(250),
      ]}
      radius={120}
      startOffset={50}
      endOffset={50}
      endArrow
      {...LINE_PROPS}
    ></Line>
  );

  // POINT ROLL TO COME OUT ROLL
  const pointToComeOut = createRef<Line>();
  container().add(
    <Line
      ref={pointToComeOut}
      stroke={"white"}
      lineWidth={20}
      layout={false}
      points={[
        () => pointRoll().bottom(),
        () => pointRoll().bottom().addY(350),
        () => comeOutRoll().bottom().addY(350),
        () => comeOutRoll().bottom(),
      ]}
      radius={140}
      startOffset={50}
      endOffset={50}
      endArrow
      {...LINE_PROPS}
    ></Line>
  );

  // SEVEN OUT TO NEW SHOOTER
  const sevenOutToNewShooter = createRef<Line>();
  container().add(
    <Line
      ref={sevenOutToNewShooter}
      stroke={"white"}
      lineWidth={20}
      layout={false}
      points={[
        () => sevenOut().bottom(),
        () => sevenOut().bottom().addY(600),
        () => newShooter().bottom().addY(600),
        () => newShooter().bottom(),
      ]}
      radius={240}
      startOffset={50}
      endOffset={50}
      endArrow
      {...LINE_PROPS}
    ></Line>
  );

  // SET POINT
  const setPoint = createRef<Txt>();
  container().add(
    <Layout layout={false}>
      <Txt
        ref={setPoint}
        text={"SET POINT"}
        layout={false}
        {...PoppinsWhite}
        position={() =>
          comeoutToPoint().getPointAtPercentage(0.5).position.addY(75)
        }
        {...LABEL_PROPS}
      ></Txt>
    </Layout>
  );

  // HIT POINT
  const hitPoint = createRef<Txt>();
  container().add(
    <Layout layout={false}>
      <Txt
        ref={hitPoint}
        text={"HIT POINT"}
        layout={false}
        {...PoppinsWhite}
        position={() =>
          pointToComeOut().getPointAtPercentage(0.5).position.addY(-75)
        }
        {...LABEL_PROPS}
      ></Txt>
    </Layout>
  );

  // ANY SEVEN
  const anySeven = createRef<Txt>();
  container().add(
    <Layout layout={false}>
      <Txt
        ref={anySeven}
        text={"ANY SEVEN"}
        layout={false}
        {...PoppinsWhite}
        position={() =>
          pointToSevenOut().getPointAtPercentage(0.5).position.addY(75)
        }
        {...LABEL_PROPS}
      ></Txt>
    </Layout>
  );

  // https://github.com/motion-canvas/motion-canvas/issues/1057
  camera().scene().position(view.size().div(2));

  // ANIMATIONS
  yield* waitFor(1);
  const waitTime = 0.05;
  yield* newShooterNode().opacity(1, 0.6, linear);
  yield* newShooterToComeOut().end(1, 0.6, easeInOutCubic);
  yield* comeOutRollNode().opacity(1, 0.6, linear);
  yield setPoint().opacity(1, 0.6, linear);
  yield* comeoutToPoint().end(1, 0.6, easeInOutCubic);
  yield* pointRollNode().opacity(1, 0.6, linear);
  yield anySeven().opacity(1, 0.6, linear);
  yield* pointToSevenOut().end(1, 0.6, easeInOutCubic);
  yield* sevenOutNode().opacity(1, 0.6, linear);
  yield* waitFor(1);
  yield* sevenOutToNewShooter().end(1, 1.2, easeInOutCubic);
  yield* waitFor(1);

  // Loopbacks
  yield hitPoint().opacity(1, 0.6, linear);
  yield* pointToComeOut().end(1, 1, easeInOutCubic);

  yield* waitFor(1);
  yield* comeoutLoop().end(1, 0.6, easeInOutCubic);
  yield* pointLoop().end(1, 0.6, easeInOutCubic);

  // HIGHLIGHT BOXES
  yield* waitFor(1);
  yield* newShooter()
    .scale(1.2, 0.6, easeInOutCubic)
    .to(1, 0.6, easeInOutCubic);
  yield* waitFor(0.2);
  yield* comeOutRoll()
    .scale(1.2, 0.6, easeInOutCubic)
    .to(1, 0.6, easeInOutCubic);
  yield* waitFor(0.2);
  yield* pointRoll().scale(1.2, 0.6, easeInOutCubic).to(1, 0.6, easeInOutCubic);
  yield* waitFor(0.2);
  yield* sevenOut().scale(1.2, 0.6, easeInOutCubic).to(1, 0.6, easeInOutCubic);
  yield* waitFor(1);

  // HIGHLIGHT LINES
  const comeoutToPointAnts = comeoutToPoint().clone(DASHED_LINE_PROPS);
  comeoutToPointAnts.endOffset(60); // Looks weird for whatever reason
  const pointToComeOutAnts = pointToComeOut().clone(DASHED_LINE_PROPS);
  const comeoutLoopAnts = comeoutLoop().clone(DASHED_LINE_PROPS);
  const pointLoopAnts = pointLoop().clone(DASHED_LINE_PROPS);

  const sevenOutToNewShooterAnts =
    sevenOutToNewShooter().clone(DASHED_LINE_PROPS);

  container().add(comeoutToPointAnts);
  container().add(pointToComeOutAnts);
  container().add(comeoutLoopAnts);
  container().add(pointLoopAnts);

  // Start ants animation
  camera().save();
  yield camera().zoom(2, 2, easeInOutCubic);

  const offsetPerSecond = -200;
  const secs = 10;
  yield comeoutToPointAnts.lineDashOffset(offsetPerSecond * secs, secs, linear);
  yield pointToComeOutAnts.lineDashOffset(offsetPerSecond * secs, secs, linear);
  yield comeoutLoopAnts.lineDashOffset(offsetPerSecond * secs, secs, linear);
  yield pointLoopAnts.lineDashOffset(offsetPerSecond * secs, secs, linear);

  // Fade them in
  yield comeoutToPointAnts.opacity(1, 0.4);
  yield pointToComeOutAnts.opacity(1, 0.4);
  yield comeoutLoopAnts.opacity(1, 0.4);
  yield pointLoopAnts.opacity(1, 0.4);

  //   yield sevenOutToNewShooterAnts.opacity(1, 0.5, easeInCubic);
  //   yield sevenOutToNewShooterAnts.lineDashOffset(-1000, 5);

  yield* waitFor(secs);
  yield camera().restore(2, easeInOutCubic);

  // Fade them out
  yield comeoutToPointAnts.opacity(0, 0.4);
  yield pointToComeOutAnts.opacity(0, 0.4);
  yield comeoutLoopAnts.opacity(0, 0.4);
  yield pointLoopAnts.opacity(0, 0.4);

  yield* waitFor(2);
});
