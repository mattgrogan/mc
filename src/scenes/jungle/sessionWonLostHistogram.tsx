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
import { HistogramV2 } from "../../components/charts/HistogramV2";
import { FadeIn } from "../../utils/FadeIn";
import { FadeOut } from "../../utils/FadeOut";
import { Bright, Grays, PoppinsWhite, Theme } from "../../styles";

// -amount-wonlost-quantiles.json
import winlose from "../../../../dicedata/output/jungle-100k/jungle-100k-amount-wonlost-quantiles.json";

// -session_hist.json
import histogramData from "../../../../dicedata/output/jungle-100k/jungle-100k-session_hist.json";

const MOST_LOST = winlose.find((stat) => stat.STAT == "MIN_WONLOST").BY_SESSION;
const MOST_WON = winlose.find((stat) => stat.STAT == "MAX_WONLOST").BY_SESSION;

export default makeScene2D(function* (view) {
  view.fill(Theme.BG);

  const camera = createRef<Camera>();
  const chart = createRef<HistogramV2>();
  const title = createRef<Txt>();

  view.add(
    <Camera ref={camera}>
      <HistogramV2
        ref={chart}
        height={"60%"}
        width={"80%"}
        nBars={histogramData.length - 1}
        yMax={100000}
        barFill={Bright.BLUE}
        barWidth={50}
        tickLabelsEvery={2}
        tickLabelFractionDigits={0}
        //
        barLineProps={{ lineWidth: 30, stroke: Bright.BLUE }}
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

  chart().setData(histogramData);

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

  yield* waitUntil("hist");

  yield* all(...chart().growBars(3));
  yield* chart().addZeroLine();

  yield* waitUntil("zoomin");
  yield all(
    camera().x(0, 1, easeInOutCubic),
    camera().zoom(1.3, 1, easeInOutCubic)
  );

  // yield* waitUntil("hide-minmax");
  // yield* sequence(
  //   0.5,
  //   FadeOut(min, 0.6, easeInExpo, [0, 100])
  //   // FadeOut(max, 0.6, easeInExpo, [0, 100])
  // );

  yield* waitUntil("highlight-1");
  yield* all(
    chart().highlightBar(10, Bright.ORANGE)
    //chart().highlightBar(upperBar, Bright.ORANGE)
  );
  yield* chart().moveBox(
    histogramData[10].cuts,
    histogramData[11].cuts,
    chart().getPercentForBars([10])
  );
  yield* chart().drawBox();
  yield* waitFor(1);

  yield* waitUntil("highlight-2");
  yield* all(
    chart().highlightBar(9, Bright.ORANGE),
    chart().moveBox(
      histogramData[9].cuts,
      histogramData[11].cuts,
      chart().getPercentForBars([9, 10])
    )
  );
  yield* waitFor(1);

  yield* waitUntil("highlight-3");
  yield* all(
    chart().highlightBar(8, Bright.ORANGE),
    chart().highlightBar(11, Bright.ORANGE),
    chart().moveBox(
      histogramData[8].cuts,
      histogramData[12].cuts,
      chart().getPercentForBars([8, 9, 10, 11])
    )
  );
  yield* waitFor(1);

  yield* waitUntil("highlight-4");
  yield* all(
    chart().highlightBar(7, Bright.ORANGE),
    chart().highlightBar(12, Bright.ORANGE),
    chart().moveBox(
      histogramData[7].cuts,
      histogramData[13].cuts,
      chart().getPercentForBars([7, 8, 9, 10, 11, 12])
    )
  );
  yield* waitFor(1);

  yield* waitUntil("highlight-5");
  yield* all(
    chart().highlightBar(6, Bright.ORANGE),
    chart().highlightBar(13, Bright.ORANGE),
    chart().moveBox(
      histogramData[6].cuts,
      histogramData[14].cuts,
      chart().getPercentForBars([6, 7, 8, 9, 10, 11, 12, 13])
    )
  );
  yield* waitFor(1);

  yield* waitUntil("highlight-6");
  yield* all(
    chart().highlightBar(5, Bright.ORANGE),
    chart().highlightBar(14, Bright.ORANGE),
    chart().moveBox(
      histogramData[5].cuts,
      histogramData[15].cuts,
      chart().getPercentForBars([5, 6, 7, 8, 9, 10, 11, 12, 13, 14])
    )
  );
  yield* waitFor(1);

  yield* waitUntil("highlight-7");
  yield* all(
    chart().highlightBar(4, Bright.ORANGE),
    chart().highlightBar(15, Bright.ORANGE),
    chart().moveBox(
      histogramData[4].cuts,
      histogramData[16].cuts,
      chart().getPercentForBars([4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15])
    )
  );
  yield* waitFor(1);

  // yield* waitUntil("highlight-7");
  // yield* all(
  //   chart().moveBox(
  //     histogramData[2].cuts,
  //     histogramData[16].cuts,
  //     chart().getPercentForBars([
  //       2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15,
  //     ])
  //   )
  // );
  // yield* waitFor(2);

  // yield* waitUntil("highlight-2");
  // upperBar += 1;
  // lowerBar -= 1;
  // bars.push(lowerBar, upperBar);
  // yield* all(
  //   chart().highlightBar(lowerBar, Bright.ORANGE),
  //   chart().highlightBar(upperBar, Bright.ORANGE),
  //   chart().moveBox(
  //     histogramData[lowerBar].cuts,
  //     histogramData[upperBar + 1].cuts,
  //     chart().getPercentForBars(bars)
  //   )
  // );
  // yield* waitFor(1);

  // yield* waitUntil("highlight-3");
  // upperBar += 1;
  // lowerBar -= 1;
  // bars.push(lowerBar, upperBar);
  // yield* all(
  //   chart().highlightBar(lowerBar, Bright.ORANGE),
  //   chart().highlightBar(upperBar, Bright.ORANGE),
  //   chart().moveBox(
  //     histogramData[lowerBar].cuts,
  //     histogramData[upperBar + 1].cuts,
  //     chart().getPercentForBars(bars)
  //   )
  // );
  // yield* waitFor(1);

  // yield* waitUntil("highlight-4");
  // upperBar += 1;
  // lowerBar -= 1;
  // bars.push(lowerBar, upperBar);
  // yield* all(
  //   chart().highlightBar(lowerBar, Bright.ORANGE),
  //   chart().highlightBar(upperBar, Bright.ORANGE),
  //   chart().moveBox(
  //     histogramData[lowerBar].cuts,
  //     histogramData[upperBar + 1].cuts,
  //     chart().getPercentForBars(bars)
  //   )
  // );
  // yield* waitFor(1);

  // yield* waitUntil("highlight-5");
  // upperBar += 1;
  // lowerBar -= 1;
  // bars.push(lowerBar, upperBar);
  // yield* all(
  //   chart().highlightBar(lowerBar, Bright.ORANGE),
  //   chart().highlightBar(upperBar, Bright.ORANGE),
  //   chart().moveBox(
  //     histogramData[lowerBar].cuts,
  //     histogramData[upperBar + 1].cuts,
  //     chart().getPercentForBars(bars)
  //   )
  // );
  // yield* waitFor(1);

  // yield* waitUntil("highlight-6");
  // upperBar += 1;
  // lowerBar -= 1;
  // bars.push(lowerBar, upperBar);
  // yield* all(
  //   chart().highlightBar(lowerBar, Bright.ORANGE),
  //   chart().highlightBar(upperBar, Bright.ORANGE),
  //   chart().moveBox(
  //     histogramData[lowerBar].cuts,
  //     histogramData[upperBar + 1].cuts,
  //     chart().getPercentForBars(bars)
  //   )
  // );
  // yield* waitFor(1);

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
