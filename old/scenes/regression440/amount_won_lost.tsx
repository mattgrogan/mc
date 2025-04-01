import { Camera, makeScene2D, Txt } from "@motion-canvas/2d";
import {
  all,
  createRef,
  delay,
  Direction,
  easeInExpo,
  easeInOutCubic,
  easeOutCubic,
  easeOutExpo,
  sequence,
  slideTransition,
  waitFor,
  waitUntil,
} from "@motion-canvas/core";
import { Histogram } from "../../components/charts/Histogram";
import { FadeIn } from "../../utils/FadeIn";
import { FadeOut } from "../../utils/FadeOut";
import { Bright, Grays, PoppinsWhite, Theme } from "../../styles";

const MOST_LOST = -4040;
const MOST_WON = 2696;

export default makeScene2D(function* (view) {
  view.fill(Theme.BG);

  const camera = createRef<Camera>();
  const chart = createRef<Histogram>();
  const title = createRef<Txt>();

  view.add(
    <Camera ref={camera}>
      <Histogram
        ref={chart}
        height={"60%"}
        width={"80%"}
        nBars={18}
        yMax={100000}
        xMin={-4500}
        xMax={4500}
        barFill={Bright.BLUE}
        barWidth={50}
        tickLabelsEvery={2}
        tickLabelFractionDigits={0}
        //
        barLineProps={{ lineWidth: 50, stroke: Bright.BLUE }}
        minMaxRectProps={{
          fill: Grays.BLACK,
          stroke: Bright.YELLOW,
          lineWidth: 2,
          gap: 10,
          padding: 10,
        }}
        minMaxValueProps={{
          fill: Bright.YELLOW,
          fontWeight: 600,
          fontSize: 60,
        }}
        minMaxTitleProps={{ fill: "white", fontSize: 50 }}
        minMaxIconProps={{ icon: "", color: Bright.YELLOW }}
        boxRectProps={{ stroke: Bright.YELLOW }}
        boxLabelProps={{ fill: Bright.YELLOW, fontWeight: 800 }}
      />
      <Txt
        ref={title}
        y={360}
        text="Amount Won or Lost"
        {...PoppinsWhite}
        fill={Grays.GRAY1}
        fontSize={40}
        opacity={0}
      />
    </Camera>
  );
  // https://github.com/motion-canvas/motion-canvas/issues/1057
  camera().scene().position(view.size().div(2));

  yield* slideTransition(Direction.Right);

  yield* chart().drawAxis();

  yield* FadeIn(title(), 0.6, easeOutCubic, [0, 50]);

  camera().save();

  yield* waitUntil("show-min");
  const max = chart().getMaxPointer(MOST_WON);
  const min = chart().getMinPointer(MOST_LOST);
  yield* all(
    FadeIn(min, 2, easeOutExpo, [-100, 0]),
    camera().zoom(1.3, 1, easeInOutCubic),
    camera().x(-400, 1, easeInOutCubic)
  );
  yield* waitUntil("show-max");
  yield* all(
    camera().x(400, 1.5, easeInOutCubic),
    delay(1.2, FadeIn(max, 1, easeOutExpo, [100, 0]))
  );
  yield* waitFor(1.5);
  yield* camera().restore(2, easeInOutCubic);

  const barValues = [
    1, 7, 82, 313, 1431, 4084, 9305, 16081, 21447, 20939, 15530, 7954, 2420,
    396, 10, 0, 0,
  ];

  yield* waitUntil("hist");

  chart().setValues(barValues);
  yield* all(...chart().growBars(3));
  yield* chart().addZeroLine();

  yield* waitUntil("zoomin");
  yield all(
    camera().x(0, 1, easeInOutCubic),
    camera().zoom(1.3, 1, easeInOutCubic)
  );

  yield* waitUntil("hide-minmax");
  yield* sequence(
    0.5,
    FadeOut(min, 0.6, easeInExpo, [0, 100]),
    FadeOut(max, 0.6, easeInExpo, [0, 100])
  );

  yield* waitUntil("highlight-200-200");
  yield* all(
    chart().highlightBar(8, Bright.ORANGE),
    chart().highlightBar(9, Bright.ORANGE)
  );
  yield* chart().moveBox(-500, 500, chart().getPercentForBars([8, 9]));
  yield* chart().drawBox();

  yield* waitUntil("highlight-400-400");
  yield* all(
    //chart().highlightBar(10, Bright.BLUE),
    chart().highlightBar(7, Bright.ORANGE),
    chart().highlightBar(10, Bright.ORANGE),
    chart().moveBox(-1000, 1000, chart().getPercentForBars([7, 8, 9, 10]))
  );

  yield* waitUntil("highlight-1500");
  yield* all(
    //chart().highlightBar(10, Bright.BLUE),
    chart().highlightBar(6, Bright.ORANGE),
    chart().highlightBar(11, Bright.ORANGE),
    chart().moveBox(
      -1500,
      1500,
      chart().getPercentForBars([6, 7, 8, 9, 10, 11])
    )
  );
  yield* waitFor(1);

  yield* waitUntil("highlight-2000");
  yield* all(
    //chart().highlightBar(10, Bright.BLUE),
    chart().highlightBar(5, Bright.ORANGE),
    chart().highlightBar(12, Bright.ORANGE),
    chart().moveBox(
      -2000,
      2000,
      chart().getPercentForBars([5, 6, 7, 8, 9, 10, 11, 12])
    )
  );
  yield* waitFor(1);

  yield* waitUntil("highlight-2500");
  yield* all(
    //chart().highlightBar(10, Bright.BLUE),
    chart().highlightBar(4, Bright.ORANGE),
    chart().highlightBar(13, Bright.ORANGE),
    chart().moveBox(
      -2500,
      2500,
      chart().getPercentForBars([4, 5, 6, 7, 8, 9, 10, 11, 12, 13])
    )
  );
  yield* waitFor(1);

  yield* waitUntil("highlight-3000");
  yield* all(
    //chart().highlightBar(10, Bright.BLUE),
    chart().highlightBar(3, Bright.ORANGE),
    chart().highlightBar(14, Bright.ORANGE),
    chart().moveBox(
      -3000,
      3000,
      chart().getPercentForBars([3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14])
    )
  );
  yield* waitFor(1);

  // yield* waitUntil("highlight-600-600");
  // yield* all(
  //   //chart().highlightBar(10, Bright.BLUE),
  //   chart().highlightBar(12, Bright.ORANGE),
  //   chart().highlightBar(17, Bright.ORANGE),
  //   chart().moveBox(
  //     -6000,
  //     6000,
  //     chart().getPercentForBars([12, 13, 14, 15, 16, 17])
  //   )
  // );

  // yield* waitUntil("highlight-800-800");
  // yield* all(
  //   //chart().highlightBar(10, Bright.BLUE),
  //   chart().highlightBar(11, Bright.ORANGE),
  //   chart().highlightBar(18, Bright.ORANGE),
  //   chart().moveBox(
  //     -8000,
  //     8000,
  //     chart().getPercentForBars([11, 12, 13, 14, 15, 16, 17, 18])
  //   )
  // );

  // yield* waitUntil("highlight-1000-1000");
  // yield* all(
  //   //chart().highlightBar(10, Bright.BLUE),
  //   chart().highlightBar(10, Bright.ORANGE),
  //   chart().highlightBar(19, Bright.ORANGE),
  //   chart().moveBox(
  //     -10000,
  //     10000,
  //     chart().getPercentForBars([10, 11, 12, 13, 14, 15, 16, 17, 18, 19])
  //   )
  // );

  // yield* waitUntil("highlight-1200-1200");
  // yield* all(
  //   //chart().highlightBar(10, Bright.BLUE),
  //   chart().highlightBar(9, Bright.ORANGE),
  //   chart().highlightBar(20, Bright.ORANGE),
  //   chart().moveBox(
  //     -12000,
  //     12000,
  //     chart().getPercentForBars([9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20])
  //   )
  // );

  // yield* waitUntil("highlight-1400-1400");
  // yield* all(
  //   //chart().highlightBar(10, Bright.BLUE),
  //   chart().highlightBar(8, Bright.ORANGE),
  //   chart().highlightBar(21, Bright.ORANGE),
  //   chart().moveBox(
  //     -14000,
  //     14000,
  //     chart().getPercentForBars([
  //       8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
  //     ])
  //   )
  // );

  yield* waitUntil("hide-box");
  yield* chart().unDrawBox();

  //yield* chart().setBarTo(0, 100);

  //chart().addTickLabels(2);

  yield* waitUntil("end");
});
