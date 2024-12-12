import { Camera, Line, makeScene2D, Txt } from "@motion-canvas/2d";
import {
  all,
  Color,
  createRef,
  createSignal,
  delay,
  Direction,
  easeInOutCubic,
  easeOutCirc,
  easeOutCubic,
  easeOutExpo,
  linear,
  sequence,
  slideTransition,
  Vector2,
  waitFor,
  waitUntil,
} from "@motion-canvas/core";
import { HistogramV2 } from "../../components/charts/HistogramV2";
import { Bright, Grays, PoppinsWhite, Theme } from "../../styles";
import { FadeIn } from "../../utils/FadeIn";

// -amount-wonlost-quantiles.json
import winlose from "../../../../dicedata/output/skill66halfpress-100k/skill66halfpress-100k-amount-wonlost-quantiles.json";
// -shooter_winloss_histogram.json
import histogramData from "../../../../dicedata/output/skill66halfpress-100k/skill66halfpress-100k-shooter_winloss_histogram.json";
import { Plot } from "../../components/plot/plot";

const MOST_LOST = winlose.find((stat) => stat.STAT == "MIN_WONLOST").BY_SHOOTER;
const MOST_WON = winlose.find((stat) => stat.STAT == "MAX_WONLOST").BY_SHOOTER;

export default makeScene2D(function* (view) {
  view.fill(Theme.BG);

  const plot = createRef<Plot>();

  view.add(
    <Plot
      ref={plot}
      xMin={-300}
      xMax={300}
      yMax={100}
      size={[1400, 700]}
      xAxisProps={{
        opacity: 1,
        stroke: Grays.GRAY1,
        lineWidth: 8,
        end: 0,
      }}
      xLabelProps={{ fill: Grays.GRAY1, decimalNumbers: 0 }}
      yLabelProps={{ fill: Grays.GRAY1, decimalNumbers: 1 }}
      xTitleProps={{
        fill: Grays.GRAY1,
        text: "SHOOTER AMOUNT WON OR LOST",
        lineToLabelPadding: 120,
        opacity: 0,
      }}
      yAxisProps={{ opacity: 1, stroke: Grays.GRAY1, lineWidth: 8, end: 0 }}
      yTitleProps={{
        fill: Grays.GRAY1,
        text: "PERCENT OF 1M SHOOTERS",
        rotation: -90,
        lineToLabelPadding: -160,
        opacity: 0,
      }}
    ></Plot>
  );

  yield* waitFor(1);

  // Draw the Axis
  yield* all(
    plot().xAxis.end(1, 0.6, easeOutCubic),
    plot().yAxis.end(1, 0.6, easeOutCubic)
  );

  // Add the ticks. Wait for them to be drawn
  plot().xAxis.updateTicks(-300, 300, 100);
  plot().yAxis.updateTicks(0, 100, 10);
  yield* waitFor(2);

  // Draw the Titles
  yield* plot().xTitle.opacity(1, 1);
  yield* plot().yTitle.opacity(1, 1);

  // Add a zero line
  const zeroLine = plot().vLine([0, 100], {
    stroke: Grays.GRAY2,
    lineWidth: 2,
    lineDash: [20, 10],
    end: 0,
  });
  yield* zeroLine.end(1, 1, easeInOutCubic);

  // this.zeroLine = new Line({
  //   stroke: Grays.GRAY2,
  //   lineWidth: 2,
  //   lineDash: [20, 10],
  //   height: "100%",
  //   // opacity: 1,
  //   points: [
  //     bottomZero.addY(-50),
  //     bottomZero.addY(-this.barContainer.height() - 40),
  //   ],
  //   zIndex: -50,
  //   end: 0,
  // });

  const lines: Line[] = [];
  const pcts: Txt[] = [];
  let pctTotal = 0;

  for (let index = 2; index <= 7; index++) {
    const offset = 50;
    const point = new Vector2(
      histogramData[index].MIDPOINT,
      histogramData[index].PCT
    );
    const line = plot().vLine(point, {
      stroke: Bright.BLUE,
      lineWidth: 100,
      opacity: 1,
      end: 0,
    });
    lines.push(line);

    if (histogramData[index].PCT > 0.5) {
      const pct = histogramData[index].PCT.toFixed(1) + "%";
      const label = plot().text(point, {
        text: pct,
        offsetY: 1.5,
        fill: "white",
        opacity: 0,
      });
      pcts.push(label);
    }

    pctTotal += histogramData[index].PCT;
  }

  yield* sequence(0.1, ...lines.map((line) => line.end(1, 1, easeOutCubic)));
  yield* waitFor(0.2);
  yield* sequence(0.2, ...pcts.map((pct) => pct.opacity(1, 1)));

  yield* waitFor(2);
  yield* waitUntil("draw-box");

  const box = plot().box([-90, 70], [290, -3], {
    stroke: Bright.YELLOW,
    opacity: 0.9,
    lineWidth: 10,
    lineDash: [20, 5],
    radius: 5,
    end: 0,
  });

  yield* box.end(1, 1, easeInOutCubic);
  yield* sequence(
    0.1,
    ...lines.map((line) =>
      line.stroke(Bright.ORANGE, 1, linear, Color.createLerp("rgb"))
    )
  );

  const pctSignal = createSignal(0);
  const pctLabel = plot().text([100, 80], {
    ...PoppinsWhite,
    fontSize: 70,
    fontWeight: 800,
    fill: Bright.YELLOW,
    text: () => pctSignal().toFixed(1) + "%",
    opacity: 0,
  });

  yield pctLabel.opacity(1, 0.4);
  yield* pctSignal(pctTotal, 1, easeOutCubic);

  yield* waitFor(3);
  yield* waitUntil("hidebox");

  yield pctLabel.opacity(0, 0.4);
  yield all(...pcts.map((pct) => pct.opacity(0, 1)));
  yield* box.start(1, 1, easeInOutCubic);

  yield* waitFor(2);
  yield* waitUntil("zoom1");

  yield* plot().rescale(-300, 300, 100, 0, 20, 10, 5);
  yield* all(
    plot().rescale(-1000, 1000, 200, 0, 5, 1, 5),
    ...lines.map((line) => line.lineWidth(30, 5, easeInOutCubic))
  );

  // SHOW THE BIG WINNERS
  const bigWinLines: Line[] = [];

  for (let index = 8; index < histogramData.length; index++) {
    const offset = 50;
    const point = new Vector2(
      histogramData[index].MIDPOINT,
      histogramData[index].PCT
    );
    const line = plot().vLine(point, {
      stroke: Bright.BLUE,
      lineWidth: 30,
      opacity: 1,
      end: 0,
    });
    bigWinLines.push(line);
  }
  yield* all(...bigWinLines.map((line) => line.end(1, 1, easeOutCubic)));

  yield* waitFor(2);
  yield* waitUntil("zoom2");
  yield* all(
    ...lines.map((line) => line.lineWidth(10, 5, easeInOutCubic)),
    ...bigWinLines.map((line) => line.lineWidth(10, 5, easeInOutCubic)),
    plot().rescale(-5000, 5000, 1000, 0, 1, 0.2, 5)
  );

  yield* waitFor(2);
  yield* waitUntil("zoom-all");

  plot().yLabelProps().decimalNumbers = 3;
  yield* plot().rescale(-5000, 5000, 1000, 0, 0.2, 0.02, 5);
  yield* all(
    ...lines.map((line) => line.lineWidth(5, 5, easeInOutCubic)),
    ...bigWinLines.map((line) => line.lineWidth(5, 5, easeInOutCubic)),
    plot().rescale(-5000, 45000, 5000, 0, 0.01, 0.001, 5)
  );

  plot().yLabelProps().decimalNumbers = 4;
  yield* all(
    ...lines.map((line) => line.lineWidth(5, 5, easeInOutCubic)),
    ...bigWinLines.map((line) => line.lineWidth(5, 5, easeInOutCubic)),
    plot().rescale(-5000, 45000, 5000, 0, 0.001, 0.0001, 5)
  );
  yield* waitFor(5);

  yield* waitUntil("showmax");

  const maxLine = plot().vLine([41299, 50], {
    stroke: Bright.GREEN,
    lineWidth: 10,
    lineDash: [20, 10],
    startArrow: true,
    startOffset: 100,
    start: 1,
  });
  yield* maxLine.start(0, 5, easeOutCirc);

  yield* waitFor(2);
  yield* waitUntil("zoomout");

  plot().yLabelProps().decimalNumbers = 3;
  yield* all(plot().rescale(-5000, 45000, 5000, 0, 0.01, 0.001, 5));
  plot().yLabelProps().decimalNumbers = 2;
  yield* all(plot().rescale(-5000, 45000, 5000, 0, 0.1, 0.01, 5));
  plot().yLabelProps().decimalNumbers = 1;
  yield* all(plot().rescale(-5000, 45000, 5000, 0, 1, 0.1, 5));
  plot().yLabelProps().decimalNumbers = 0;
  yield* all(plot().rescale(-5000, 45000, 5000, 0, 10, 1, 5));
  yield* all(plot().rescale(-5000, 45000, 5000, 0, 100, 10, 5));

  // yield* waitUntil("zo1");
  // yield* waitFor(5);
  // plot().yLabelProps().decimalNumbers = 0;
  // yield* all(plot().rescale(-5000, 45000, 5000, 0, 100, 10, 5));
  // yield* all(
  //   ...lines.map((line) => line.lineWidth(60, 5, easeInOutCubic)),
  //   plot().rescale(-500, 500, 100, 0, 100, 10, 5)
  // );

  // for (let index = 8; index <= 30; index++) {
  //   const offset = 50;
  //   const point = new Vector2(
  //     histogramData[index].cuts + offset,
  //     histogramData[index].count
  //   );
  //   const line = plot().vLine(point, {
  //     stroke: Bright.BLUE,
  //     lineWidth: 10,
  //     opacity: 1,
  //   });
  //   const pct = ((histogramData[index].count / 1000000) * 100).toFixed(1) + "%";
  //   // const label = plot().text(point, {
  //   //   text: pct,
  //   //   offsetY: 1.5,
  //   //   fill: "white",
  //   // });
  // }
  // yield* plot().rescale(-500, 5000, 500, 0, 2000, 200, 5);

  yield* waitFor(5);

  yield* waitUntil("end");
});
