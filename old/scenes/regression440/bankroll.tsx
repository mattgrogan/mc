import { Layout, Line, makeScene2D, Rect, Txt } from "@motion-canvas/2d";
import {
  all,
  createRef,
  createSignal,
  delay,
  Direction,
  easeInOutCubic,
  easeOutCubic,
  linear,
  range,
  slideTransition,
  waitFor,
  waitUntil,
} from "@motion-canvas/core";
import { Theme } from "../../styles";

// Create our number formatter.
// https://stackoverflow.com/questions/149055/how-to-format-numbers-as-currency-strings
const formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,

  // These options are needed to round to whole numbers if that's what you want.
  //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
  //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
});

const TitleFont = {
  fontFamily: "Poppins",
  fontWeight: 600,
  fontSize: 60,
  fill: "#FFF",
};

const TickFont = {
  fontFamily: "Poppins",
  fontWeight: 400,
  fontSize: 30,
  fill: "#FFF",
};

const AxisFont = {
  fontFamily: "Poppins",
  fontWeight: 400,
  fontSize: 45,
  fill: "#FFF",
};

const LabelFont = {
  fontFamily: "Poppins",
  fontWeight: 400,
  fontSize: 30,
  fill: "#FFF",
};

const GROUP000 = 0;
const GROUP100 = 30421;
const GROUP200 = 33576;
const GROUP300 = 21547;
const GROUP400 = 9942;
const GROUP500 = 3451;
const GROUP600 = 856;
const GROUP700 = 188;
const GROUP800 = 15;
const GROUP900 = 4;
const GROUP1000 = 0;
const TOTAL = 100000;

// TODO: Add assertion to ensure totals add to 100k

export default makeScene2D(function* (view) {
  view.fill(Theme.BG);
  const title = createRef<Txt>();
  const axis = createRef<Line>();
  const barContainer = createRef<Layout>();
  const tickContainer = createRef<Layout>();
  const box = createRef<Rect>();

  const axisLabel = createRef<Txt>();

  const cumPctLabel = createRef<Txt>();
  const cumPct = createSignal(0);

  const titleSignal = createSignal("");

  view.add(
    <>
      <Txt
        ref={title}
        {...TitleFont}
        text={() => titleSignal()}
      />
      <Rect
        ref={box}
        lineWidth={10}
        width={750}
        height={90}
        radius={10}
        offset={[-1, -1]}
        stroke={"#fffd98"}
        lineDash={[20, 5]}
        end={0}
      ></Rect>
      <Layout ref={tickContainer}></Layout>
      <Layout ref={barContainer}></Layout>
      <Line
        ref={axis}
        lineWidth={6}
        points={[
          [-600, -250],
          [-600, 450],
        ]}
        stroke={"#fff"}
        start={0.5}
        end={0.5}
      />
      <Txt
        {...AxisFont}
        ref={axisLabel}
        rotation={-90}
        position={[-800, 100]}
        opacity={0}
      >
        WORST BANKROLL
      </Txt>
      <Txt
        ref={cumPctLabel}
        {...LabelFont}
        fill={"#fffd98"}
        fontSize={60}
        fontWeight={700}
        offset={[-1, 0]}
        text={() => `${(cumPct() * 100).toFixed(1)}` + "%"}
        position={() => box().right().addX(30)}
        opacity={0}
      />
    </>
  );

  yield* slideTransition(Direction.Right, 1);

  yield* titleSignal(
    "What's an appropriate bankroll for this strategy?",
    1.5,
    linear
  );
  yield* waitFor(1);

  yield* waitUntil("show-chart");
  yield* title().position(title().position().addY(-350), 1, easeInOutCubic);
  yield* waitFor(0.25);

  yield* all(
    axis().end(1, 0.5, easeOutCubic),
    axis().start(0, 0.5, easeOutCubic)
  );
  yield* axisLabel().opacity(1, 0.5, linear);

  // Draw the lines
  const bars = [];
  const barSignals = [];
  const barValues = [];
  const barWidth = 35;
  const barGap = 25;

  const start = axis().parsedPoints()[0].addY(50);
  for (let i of range(11)) {
    const bs = createSignal(0);
    const bsVal = createSignal(0);
    barSignals[i] = bs;
    barValues[i] = bsVal;
    const yoffset = (barGap + barWidth) * i;
    const barRef = createRef<Line>();
    const bar = (
      <Line
        lineWidth={barWidth}
        ref={barRef}
        stroke={"#2191fb"}
        points={[start.addY(yoffset), start.addY(yoffset).addX(700)]}
        end={() => bs() * 2}
      />
    );

    const label = (
      <Txt
        {...LabelFont}
        text={() =>
          bsVal().toLocaleString("en-US", { maximumFractionDigits: 0 }) +
          " (" +
          (bs() * 100).toFixed(1) +
          "%)"
        }
        offset={[-1.2, 0]}
        position={() => barRef().getPointAtPercentage(bs() * 2).position}
        opacity={() => (bs() <= 0 ? 0 : 1)}
      />
    );
    barContainer().add(bar);
    barContainer().add(label);
    bars[i] = bar;
  }

  // Draw the ticks
  const ticks = [];
  const tickStart = start.addY((barGap + barWidth) / 2);
  for (let i of range(1, -11)) {
    const yoffset = (barGap + barWidth) * i * -1;
    const tick = (
      <Line
        lineWidth={4}
        stroke={"#fff"}
        points={[tickStart.addY(yoffset).addX(-30), tickStart.addY(yoffset)]}
        end={1}
        opacity={0}
      />
    );
    tickContainer().add(tick);
    const tickLabel = (
      <Txt
        text={(500 * i).toFixed(0)}
        {...TickFont}
        offset={[1, 0]}
        position={tickStart.addY(yoffset).addX(-50)}
        opacity={0}
      />
    );
    tickContainer().add(tickLabel);

    ticks[i] = tick;
    yield delay(0.1 * i * -1, tick.opacity(1, 0.5, linear));
    yield delay(0.1 * i * -1, tickLabel.opacity(1, 0.5, linear));
  }

  yield* waitUntil("show-bars");

  const delaySecs = 0.2;

  yield* all(
    barSignals[0](GROUP000 / TOTAL, delaySecs, linear),
    barValues[0](GROUP000, delaySecs, linear)
  );

  yield* all(
    barSignals[1](GROUP100 / TOTAL, delaySecs, linear),
    barValues[1](GROUP100, delaySecs, linear)
  );

  yield* all(
    barSignals[2](GROUP200 / TOTAL, delaySecs, linear),
    barValues[2](GROUP200, delaySecs, linear)
  );

  yield* all(
    barSignals[3](GROUP300 / TOTAL, delaySecs, linear),
    barValues[3](GROUP300, delaySecs, linear)
  );

  yield* all(
    barSignals[4](GROUP400 / TOTAL, delaySecs, linear),
    barValues[4](GROUP400, delaySecs, linear)
  );

  yield* all(
    barSignals[5](GROUP500 / TOTAL, delaySecs, linear),
    barValues[5](GROUP500, delaySecs, linear)
  );

  yield* all(
    barSignals[6](GROUP600 / TOTAL, delaySecs, linear),
    barValues[6](GROUP600, delaySecs, linear)
  );

  yield* all(
    barSignals[7](GROUP700 / TOTAL, delaySecs, linear),
    barValues[7](GROUP700, delaySecs, linear)
  );

  yield* all(
    barSignals[8](GROUP800 / TOTAL, delaySecs, linear),
    barValues[8](GROUP800, delaySecs, linear)
  );

  yield* all(
    barSignals[9](GROUP900 / TOTAL, delaySecs, linear),
    barValues[9](GROUP900, delaySecs, linear)
  );

  yield* all(
    barSignals[10](GROUP1000 / TOTAL, delaySecs, linear),
    barValues[10](GROUP1000, delaySecs, linear)
  );

  yield* waitUntil("show-box");
  let cumulativePct = barSignals[0]();
  cumulativePct += barSignals[1]();
  //cumulativePct += barSignals[2]();
  box().topLeft([-620, -260]);
  box().height(box().height() + 60);
  yield* all(
    box().end(1, 2, easeOutCubic),
    cumPctLabel().opacity(1, 0.6, linear),
    cumPct(cumulativePct, 0, linear)
  );

  // yield* waitFor(1);
  // yield* waitUntil("expand1");

  // yield* all(
  //   box().height(box().height() + 60, 2, easeInOutCubic),
  //   cumPctLabel().opacity(1, 1, linear),
  //   cumPct(cumulativePct, 1, linear)
  // );

  yield* waitUntil("expand-25");
  cumulativePct += barSignals[2]();
  yield* all(
    box().height(box().height() + 60, 3, easeInOutCubic),
    cumPctLabel().opacity(1, 3, easeInOutCubic),
    cumPct(cumulativePct, 3, easeInOutCubic)
  );

  yield* waitUntil("expand3");
  cumulativePct += barSignals[3]();
  cumulativePct += barSignals[4]();
  cumulativePct += barSignals[5]();
  cumulativePct += barSignals[6]();
  yield* all(
    box().height(box().height() + 60 * 4, 3, easeInOutCubic),
    cumPctLabel().opacity(1, 3, easeInOutCubic),
    cumPct(cumulativePct, 3, easeInOutCubic)
  );

  // yield* waitUntil("expand4");
  // cumulativePct += barSignals[6]();
  // cumulativePct += barSignals[7]();
  // cumulativePct += barSignals[8]();
  // cumulativePct += barSignals[9]();
  // yield* all(
  //   box().height(box().height() + 60 * 4, 3, easeInOutCubic),
  //   cumPctLabel().opacity(1, 3, easeInOutCubic),
  //   cumPct(cumulativePct, 3, easeInOutCubic)
  // );

  // yield* waitUntil("expand5");
  // cumulativePct += barSignals[10]();
  // yield* all(
  //   box().height(box().height() + 60, 2, easeInOutCubic),
  //   cumPctLabel().opacity(1, 2, easeInOutCubic),
  //   cumPct(cumulativePct, 2, easeInOutCubic)
  // );

  // yield* waitUntil("expand6");
  // cumulativePct += barSignals[6]();
  // cumulativePct += barSignals[7]();
  // cumulativePct += barSignals[8]();
  // cumulativePct += barSignals[9]();
  // yield* all(
  //   box().height(box().height() + 60 * 4, 2, easeInOutCubic),
  //   cumPctLabel().opacity(1, 1, linear),
  //   cumPct(cumulativePct, 1, linear)
  // );

  // //yield* waitFor(0.25)
  // yield* all(wins_label().opacity(1, 0.5), lose_label().opacity(1, 0.5));
  // yield* waitFor(0.25);

  // //yield* winners().end(0.43622, 1, easeOutCubic)
  // yield* all(
  //   lose_pct().opacity(1, 0.1),
  //   lose_pct_signal(0.562, 1, easeOutCubic)
  // );
  // yield* all(
  //   wins_pct().opacity(1, 0.1),
  //   win_pct_signal(0.438, 1, easeOutCubic)
  // );
  //yield* losers().end(0.56194, 1, easeOutCubic)

  yield* waitUntil("end");
});
