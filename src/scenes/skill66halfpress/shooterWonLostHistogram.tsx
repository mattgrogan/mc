import { Camera, makeScene2D, Txt } from "@motion-canvas/2d";
import {
  all,
  createRef,
  delay,
  Direction,
  easeInOutCubic,
  easeOutCubic,
  easeOutExpo,
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
      yMax={510610}
      size={[1600, 700]}
      xAxisProps={{ opacity: 1, stroke: Grays.GRAY1, lineWidth: 8 }}
      xLabelProps={{ fill: Grays.GRAY1 }}
      xTitleProps={{ fill: Grays.GRAY1, text: "SHOOTER AMOUNT WON OR LOST" }}
      yAxisProps={{ opacity: 1, stroke: Grays.GRAY1, lineWidth: 8 }}
    ></Plot>
  );

  plot().xAxis.updateTicks(-300, 300, 100);
  plot().xAxis.updateTicks(0, 500000, 100000);

  for (let index = 2; index <= 7; index++) {
    const offset = 50;
    const point = new Vector2(
      histogramData[index].cuts + offset,
      histogramData[index].count
    );
    const line = plot().vLine(point, {
      stroke: Bright.BLUE,
      lineWidth: 10,
      opacity: 1,
    });
    const pct = ((histogramData[index].count / 1000000) * 100).toFixed(1) + "%";
    const label = plot().text(point, {
      text: pct,
      offsetY: 1.5,
      fill: "white",
    });
  }

  yield* plot().rescale(-500, 5000, 500, 0, 510600, 100000, 5);
  for (let index = 8; index <= 30; index++) {
    const offset = 50;
    const point = new Vector2(
      histogramData[index].cuts + offset,
      histogramData[index].count
    );
    const line = plot().vLine(point, {
      stroke: Bright.BLUE,
      lineWidth: 10,
      opacity: 1,
    });
    const pct = ((histogramData[index].count / 1000000) * 100).toFixed(1) + "%";
    // const label = plot().text(point, {
    //   text: pct,
    //   offsetY: 1.5,
    //   fill: "white",
    // });
  }
  yield* plot().rescale(-500, 5000, 500, 0, 2000, 200, 5);

  yield* waitFor(5);

  yield* waitUntil("end");
});
