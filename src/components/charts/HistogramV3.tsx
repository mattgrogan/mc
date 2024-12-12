import {
  colorSignal,
  Icon,
  IconProps,
  initial,
  Layout,
  LayoutProps,
  Line,
  LineProps,
  Rect,
  RectProps,
  signal,
  Txt,
  TxtProps,
} from "@motion-canvas/2d";
import {
  all,
  Color,
  ColorSignal,
  createSignal,
  easeInOutCubic,
  easeOutCubic,
  easeOutExpo,
  linear,
  PossibleColor,
  range,
  sequence,
  SignalValue,
  SimpleSignal,
  useLogger,
} from "@motion-canvas/core";
import { dollarFormatter, Grays } from "../../styles";
import { FadeIn } from "../../utils/FadeIn";

export interface HistogramProps extends LayoutProps {
  nBars: SignalValue<number>;
  yMin?: SignalValue<number>;
  yMax: SignalValue<number>;
  xMin?: SignalValue<number>;
  xMax?: SignalValue<number>;
  barFill?: SignalValue<PossibleColor>;
  barWidth: SignalValue<number>;
  // Label every X tick
  tickLabelsEvery: SignalValue<number>;
  tickLabelFractionDigits?: SignalValue<number>;

  // Props for the individual components
  barLineProps?: LineProps;
  tickLabelProps?: TxtProps;
  minMaxRectProps?: RectProps;
  minMaxValueProps?: TxtProps;
  minMaxIconProps?: IconProps;
  minMaxTitleProps?: TxtProps;
  boxRectProps?: RectProps;
  boxLabelProps?: TxtProps;
}

export class HistogramV2 extends Layout {
  @signal()
  public declare readonly nBars: SimpleSignal<number, this>;
  @initial(0)
  @signal()
  public declare readonly yMin: SimpleSignal<number, this>;
  @signal()
  public declare readonly yMax: SimpleSignal<number, this>;
  @signal()
  public declare readonly xMin: SimpleSignal<number, this>;
  @signal()
  public declare readonly xMax: SimpleSignal<number, this>;

  @initial("#FFF")
  @colorSignal()
  public declare readonly barFill: ColorSignal<this>;

  @initial(50)
  @signal()
  public declare readonly barWidth: SimpleSignal<number, this>;

  // Where should the ticks be?
  @initial(1)
  @signal()
  public declare readonly tickLabelsEvery: SimpleSignal<number, this>;
  // Rounding for the tick labels
  @initial(0)
  @signal()
  public declare readonly tickLabelFractionDigits: SimpleSignal<number, this>;

  // Configure the sub components
  @signal()
  public declare readonly barLineProps: SimpleSignal<LineProps>;
  @signal()
  public declare readonly tickLabelProps: SimpleSignal<TxtProps>;
  @signal()
  public declare readonly minMaxRectProps: SimpleSignal<RectProps>;
  @signal()
  public declare readonly minMaxValueProps: SimpleSignal<TxtProps>;
  @signal()
  public declare readonly minMaxIconProps: SimpleSignal<IconProps>;
  @signal()
  public declare readonly minMaxTitleProps: SimpleSignal<TxtProps>;
  @signal()
  public declare readonly boxRectProps: SimpleSignal<RectProps>;
  @signal()
  public declare readonly boxLabelProps: SimpleSignal<TxtProps>;

  private declare data: any[];

  public declare readonly bars: Line[];
  public declare readonly ticks: Line[];
  public declare readonly tickLabels: Txt[];
  public declare barContainer: Rect;
  public declare box: Rect;
  public declare boxLabel: Txt;
  public declare sumOfBars: number;
  private declare barValues: number[];
  public declare pct: SimpleSignal<number>;
  public declare zeroLine: Line;
  public declare xax: Line;
  public declare topOfBox: SimpleSignal<number>;
  public constructor(props?: HistogramProps) {
    super({
      ...props,
      alignItems: "center",
      clip: false,
      gap: 0,
      padding: 0,
      margin: 0,
    });
    this.sumOfBars = 0;

    // Create a container to hold all the bars
    this.barContainer = new Rect({
      layout: true,
      width: this.width() * 0.9,
      height: this.height() * 0.8,
      direction: "row",
      justifyContent: "space-evenly",
    });

    // Add a box
    this.box = new Rect({
      lineWidth: 10,
      lineDash: [20, 5],
      radius: 5,
      width: 50,
      height: this.barContainer.height() * 1.05,
      offset: [-1, 1],
      end: 0,
      ...this.boxRectProps(),
    });
    this.add(this.box);
    this.box.y(this.barContainer.bottom().y);
    // Add a label to the box
    ///this.topOfBox = createEffect(() => this.box.top)
    this.pct = createSignal(0);
    this.boxLabel = new Txt({
      text: () => `${(this.pct() * 100).toFixed(1)}` + "%",

      //position: () => this.box.top(),
      y: () => this.box.top().y,
      offsetY: 1.5,
      opacity: 0,
      ...this.boxLabelProps(),
    });
    this.box.add(this.boxLabel);

    this.add(this.barContainer);

    this.bars = [];
    this.ticks = [];
    this.tickLabels = [];
    this.addBars(this.barContainer);

    // Add the axis
    this.xax = new Line({
      stroke: "white",
      lineWidth: 5,
      startArrow: true,
      endArrow: true,
      arrowSize: 15,
      start: 0.5,
      end: 0.5,
      points: [
        this.barContainer.bottomLeft().addY(-20).addX(-20),
        this.barContainer.bottomRight().addY(-20).addX(20),
      ],
    });
    this.add(this.xax);

    // Add the tick labels
    //this.addTickLabels(this.tickLabelsEvery());

    // Add a vertical line at zero
  }

  public addBars(container: Rect) {
    const line = new Line({
      stroke: "white",
      lineWidth: 10,
      height: "100%",
      points: [container.bottom().addY(-20), container.top()],
      end: 0,
      ...this.barLineProps(),
    });

    const tick = new Line({
      stroke: "white",
      lineWidth: 2,
      //width: 48,
      alignSelf: "end",
      opacity: 0,

      //height: "5%"
      points: [
        [0, 20],
        [0, -20],
      ],
    });

    for (let i in range(this.nBars())) {
      this.bars[i] = line.clone();
      // Add a tick
      const newTick = tick.clone();
      this.ticks.push(newTick);
      container.add(newTick);
      //Add the bar
      container.add(this.bars[i]);
    }
    // Add one last tick
    const newTick = tick.clone();
    this.ticks.push(newTick);
    container.add(newTick);
  }

  public setBarTo(bar: number, val: number, dur: number = 3) {
    return this.bars[bar].end(val / this.yMax(), dur, easeOutCubic);
  }

  public c2pX(x: number) {
    // Translate coordinte to point

    const originalMin = this.xMin();
    const originalMax = this.xMax();
    const newMin = this.ticks[0].bottom().x;
    const newMax = this.ticks.at(-1).bottom().x;
    const pointX =
      ((newMax - newMin) / (originalMax - originalMin)) * (x - originalMin) +
      newMin;
    return pointX;
  }

  public addTickLabel(where: number, props: TxtProps) {
    // Add a label to the tick
    const label = new Txt({
      ...props,
      offsetY: -1,
      opacity: 0,
    });
    const x = this.c2pX(where);
    label.x(x);
    label.y(this.barContainer.bottom().y);
    this.add(label);
    this.tickLabels.push(label);
  }

  public addTickLabels(every: number = 1) {
    const start = this.xMin();
    const step = (this.xMax() - this.xMin()) / this.nBars();
    for (const i of range(this.nBars() + 1)) {
      if (i % every == 0) {
        const labelText = start + i * step;
        this.addTickLabel(labelText, {
          fill: "#fff",
          fontSize: 30,
          ...this.tickLabelProps(),
          //text: labelText.toFixed(this.tickLabelFractionDigits()),
          // Changed for 3PM 100x 5
          text: labelText.toFixed(0),
        });
      }
    }
  }

  public setValues(barValues: number[]) {
    this.barValues = barValues;
    this.yMax(Math.max(...barValues));
    for (const val of barValues) {
      this.sumOfBars += val;
    }
  }

  public growBars(dur: number = 3) {
    const generators = [];
    for (const i of range(this.nBars())) {
      generators.push(this.setBarTo(i, this.barValues[i], dur));
    }
    return generators;
  }

  public addZeroLine() {
    return this.zeroLine.end(1, 1, easeInOutCubic);
  }

  public getMaxPointer(x: number) {
    const pointer = (
      <Layout
        layout
        direction={"row"}
        alignItems={"end"}
        gap={10}
        // offsetX={-1}
        // offsetY={1}
        opacity={0}
        //scale={0}
      >
        <Rect
          direction={"column"}
          justifyContent={"center"}
          alignItems={"center"}
          lineHeight={40}
          padding={10}
          lineWidth={2}
          radius={5}
          {...this.minMaxRectProps()}
        >
          <Txt
            text="MAX WON"
            scale={0.8}
            {...this.minMaxTitleProps()}
          ></Txt>

          <Txt
            {...this.minMaxValueProps()}
            text={dollarFormatter.format(x)}
            scale={0.8}
          ></Txt>
        </Rect>
        <Icon
          scale={5}
          offsetX={-0.2} // FIXME
          offsetY={1.5}
          {...this.minMaxIconProps()}
          icon="mdi:arrow-right-bold"
        ></Icon>
      </Layout>
    );
    pointer.x(this.c2pX(x));
    pointer.y(this.barContainer.bottom().y - 50);
    this.add(pointer);
    return pointer;
  }

  public getMinPointer(x: number) {
    const pointer = (
      <Layout
        layout
        direction={"row"}
        alignItems={"end"}
        gap={10}
        offsetX={1}
        offsetY={1}
        //scale={0}
        opacity={0}
      >
        <Rect
          direction={"column"}
          justifyContent={"center"}
          alignItems={"center"}
          lineHeight={40}
          padding={10}
          lineWidth={2}
          radius={5}
          {...this.minMaxRectProps()}
        >
          <Txt
            text={"MAX LOST"}
            {...this.minMaxTitleProps()}
            scale={0.8}
          ></Txt>

          <Txt
            {...this.minMaxValueProps()}
            text={dollarFormatter.format(x)}
            scale={0.8}
          ></Txt>
        </Rect>
        <Icon
          scale={5}
          {...this.minMaxIconProps()}
          icon={"mdi:arrow-down-right-bold"}
          zIndex={-50}
          offsetX={0.2}
        ></Icon>
      </Layout>
    );
    pointer.x(this.c2pX(x));
    pointer.y(this.barContainer.bottom().y - 50);
    this.add(pointer);
    return pointer;
  }

  public *highlightBar(bar: number, color: PossibleColor) {
    yield* this.bars[bar].stroke(color, 1, linear, Color.createLerp("rgb"));
  }

  public *drawBox(showPercent: boolean = true) {
    yield* this.box.end(1, 1, easeInOutCubic);
    if (showPercent) {
      yield* FadeIn(this.boxLabel, 1, easeOutExpo, [0, 50]);
    }
  }

  public *unDrawBox() {
    yield* all(
      this.box.start(1, 1, easeInOutCubic),
      this.boxLabel.opacity(0, 1, easeInOutCubic)
    );
    this.box.start(0);
    this.box.end(0);
  }

  public *moveBox(left: number, right: number, val: number, dur: number = 1) {
    yield* all(
      this.box.x(this.c2pX(left), dur, easeInOutCubic),
      this.box.width(this.c2pX(right) - this.c2pX(left), dur, easeInOutCubic),
      this.pct(val, dur, easeInOutCubic)
    );
  }

  public getPercentForBars(bars: number[]) {
    const logger = useLogger();
    let total = 0;
    for (const i of bars) {
      total += this.barValues[i] / this.sumOfBars;
    }
    logger.debug(total.toString());
    return total;
  }

  public *drawAxis(seconds: number = 1) {
    yield* all(
      this.xax.start(0, seconds, easeInOutCubic),
      this.xax.end(1, seconds, easeInOutCubic)
    );

    const generators = [];
    for (const tick of this.ticks) {
      generators.push(tick.opacity(1, 0.1));
    }
    yield* sequence(0.02, ...generators);

    const generators2 = [];
    for (const label of this.tickLabels) {
      generators2.push(label.opacity(1, 0.1));
    }
    yield* sequence(0.02, ...generators2);
  }

  public setData(data: any[]) {
    this.data = data;
    this.xMin(data[0].CUTS);
    this.xMax(data[data.length - 1].CUTS);

    this.addTickLabels(this.tickLabelsEvery());

    this.barValues = [];

    for (const bin of data) {
      this.barValues.push(bin.COUNT);
      this.sumOfBars += bin.COUNT;
    }
    this.yMax(Math.max(...this.barValues));

    const bottomZero = this.barContainer.bottom();
    bottomZero.x = this.c2pX(0);
    this.zeroLine = new Line({
      stroke: Grays.GRAY2,
      lineWidth: 2,
      lineDash: [20, 10],
      height: "100%",
      // opacity: 1,
      points: [
        bottomZero.addY(-50),
        bottomZero.addY(-this.barContainer.height() - 40),
      ],
      zIndex: -50,
      end: 0,
    });
    this.add(this.zeroLine);
  }
}
