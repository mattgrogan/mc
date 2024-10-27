import { Camera, Line, makeScene2D, Rect, Txt } from "@motion-canvas/2d";
import {
  all,
  createRef,
  createSignal,
  easeInCubic,
  easeInOutCubic,
  easeOutCubic,
  waitFor,
  waitUntil,
} from "@motion-canvas/core";
import { Theme } from "../../styles";

const WINNERS = 561996;
const PUSHERS = 0;
const LOSERS = 438004;
const TOTAL = 1000000;

const TitleFont = {
  fontFamily: "Poppins",
  fontWeight: 600,
  fontSize: 60,
  fill: "#FFF",
};

const LabelFont = {
  fontFamily: "Poppins",
  fontWeight: 400,
  fontSize: 50,
  fill: "#FFF",
};

const NumberFont = {
  fontFamily: "Poppins",
  fontWeight: 400,
  fontSize: 45,
  fill: "#FFF",
};

export default makeScene2D(function* (view) {
  view.fill(Theme.BG);
  const camera = createRef<Camera>();
  const title = createRef<Txt>();
  const axis = createRef<Line>();
  const winners = createRef<Line>();
  const losers = createRef<Line>();
  const pushes = createRef<Line>();

  const wins_label = createRef<Txt>();
  const wins_pct = createRef<Txt>();
  const lose_label = createRef<Txt>();
  const lose_pct = createRef<Txt>();
  const push_label = createRef<Txt>();
  const push_pct = createRef<Txt>();

  const win_pct_signal = createSignal(0);
  const lose_pct_signal = createSignal(0);
  const push_pct_signal = createSignal(0);

  const losersSignal = createSignal(0);
  const winnersSignal = createSignal(0);
  const pushersSignal = createSignal(0);

  const box = createRef<Rect>();

  const titleSignal = createSignal("");

  view.add(
    <Camera ref={camera}>
      <Txt
        ref={title}
        width={1400}
        offsetY={-1}
        {...TitleFont}
        textWrap={"wrap"}
        text={() => titleSignal()}
      />
      <Line
        ref={axis}
        lineWidth={6}
        points={[
          [-600, -160],
          [-600, 400],
        ]}
        stroke={"#fff"}
        start={0.5}
        end={0.5}
      />

      <Line
        ref={winners}
        lineWidth={120}
        points={[
          [-600, -60],
          [640, -60],
        ]}
        stroke={"#63c69f"}
        zIndex={-500}
        end={() => win_pct_signal()}
      />

      <Txt
        {...LabelFont}
        ref={wins_label}
        margin={10}
        text={"% WIN"}
        opacity={0}
        offset={[1.3, 0]}
        position={winners().points()[0]}
      />

      <Txt
        {...LabelFont}
        ref={wins_pct}
        margin={10}
        //text={() => (win_pct_signal() * 100).toFixed(1) + " %"}
        text={() =>
          `${((winnersSignal() / TOTAL) * 100).toFixed(
            1
          )}% (${winnersSignal().toLocaleString("en-US", {
            maximumFractionDigits: 0,
          })} SHOOTERS)`
        }
        offset={[-1.1, 0]}
        opacity={0}
        position={() =>
          winners().getPointAtPercentage(win_pct_signal()).position
        }
      />

      <Line
        ref={pushes}
        lineWidth={120}
        points={[
          [-600, 120],
          [640, 120],
        ]}
        stroke={"#e7e7e7"}
        zIndex={-500}
        end={() => push_pct_signal()}
      />

      <Txt
        {...LabelFont}
        ref={push_label}
        margin={10}
        text={"% PUSH"}
        opacity={0}
        offset={[1.3, 0]}
        position={pushes().points()[0]}
      />

      <Txt
        {...LabelFont}
        ref={push_pct}
        margin={10}
        text={() =>
          `${((pushersSignal() / TOTAL) * 100).toFixed(
            1
          )}% (${pushersSignal().toLocaleString("en-US", {
            maximumFractionDigits: 0,
          })} SHOOTERS)`
        }
        offset={[-1.1, 0]}
        opacity={0}
        position={() =>
          pushes().getPointAtPercentage(push_pct_signal()).position
        }
      />

      <Line
        ref={losers}
        lineWidth={120}
        points={[
          [-600, 300],
          [640, 300],
        ]}
        stroke={"#ba274a"}
        zIndex={-500}
        end={() => lose_pct_signal()}
      />

      <Txt
        {...LabelFont}
        ref={lose_label}
        margin={10}
        text={"% LOSE"}
        opacity={0}
        offset={[1.3, 0]}
        position={losers().points()[0]}
      />

      <Txt
        {...LabelFont}
        ref={lose_pct}
        margin={10}
        opacity={0}
        text={() =>
          `${((losersSignal() / TOTAL) * 100).toFixed(
            1
          )}% (${losersSignal().toLocaleString("en-US", {
            maximumFractionDigits: 0,
          })} SHOOTERS)`
        }
        offset={[-1.1, 0]}
        position={() =>
          losers().getPointAtPercentage(lose_pct_signal()).position
        }
      />

      <Rect
        ref={box}
        lineWidth={20}
        stroke={"#f79256"}
        width={400}
        height={600}
        x={100}
        y={120}
        lineDash={[10, 10]}
        end={0}
      />

      {/* <Line
                ref={bar}
                lineWidth={50}
                points={[barBG().left, barBG().right]}
                end={0}
                zIndex={-500}
            ></Line> */}
    </Camera>
  );

  //yield* slideTransition(Direction.Right);
  yield* waitFor(0.2);
  yield* titleSignal(
    "On a per-shooter basis, how often did this strategy win or lose?",
    2
  );

  yield* waitUntil("show-chart");
  yield* title().position(title().position().addY(-450), 1, easeInOutCubic);
  yield* waitFor(0.25);

  yield* all(
    axis().end(1, 0.5, easeOutCubic),
    axis().start(0, 0.5, easeOutCubic)
  );
  //yield* waitFor(0.25)
  yield* all(
    wins_label().opacity(1, 0.5),
    lose_label().opacity(1, 0.5),
    push_label().opacity(1, 0.5)
  );
  yield* waitFor(0.25);

  // Draw the lines
  //yield* winners().end(0.43622, 1, easeOutCubic)
  yield* all(
    wins_pct().opacity(1, 0.1),
    win_pct_signal(WINNERS / TOTAL, 1, easeOutCubic),
    winnersSignal(WINNERS, 1, easeOutCubic)
  );

  yield* waitUntil("show-pushes");
  yield* all(
    push_pct().opacity(1, 0.1),
    push_pct_signal(PUSHERS / TOTAL, 1, easeOutCubic),
    pushersSignal(PUSHERS, 1, easeOutCubic)
  );

  yield* waitUntil("show-losers");
  yield* all(
    lose_pct().opacity(1, 0.1),
    lose_pct_signal(LOSERS / TOTAL, 1, easeOutCubic),
    losersSignal(LOSERS, 1, easeOutCubic)
  );

  yield camera().zoom(1.1, 10, easeInCubic);
  //yield* losers().end(0.56194, 1, easeOutCubic)

  yield* waitUntil("end");
});
