import {
  Circle,
  CircleProps,
  Layout,
  LayoutProps,
  Line,
  LineProps,
  Txt,
  TxtProps,
  initial,
  signal,
} from "@motion-canvas/2d";
import {
  PossibleVector2,
  SignalValue,
  SimpleSignal,
  TimingFunction,
  Vector2,
  all,
  easeInOutExpo,
} from "@motion-canvas/core";
import { AxisDirection, PlotAxis, TickLabelProps } from "./PlotAxis";
import { PlotBox } from "./PlotBox";

export interface PlotProps extends LayoutProps {
  xMin?: SignalValue<number>;
  xMax?: SignalValue<number>;
  yMin?: SignalValue<number>;
  yMax?: SignalValue<number>;
  xAxisProps?: SignalValue<LineProps>;
  yAxisProps?: SignalValue<LineProps>;
  xTickProps?: SignalValue<LineProps>;
  yTickProps?: SignalValue<LineProps>;
  xLabelProps?: SignalValue<TickLabelProps>;
  yLabelProps?: SignalValue<TickLabelProps>;
  xTitleProps?: SignalValue<TxtProps>;
  yTitleProps?: SignalValue<TxtProps>;
}

export enum PlotSpace {
  "WORLD" = 1,
  "LOCAL" = 2,
}

const DEFAULT_X_TITLE_PADDING = 100;
const DEFAULT_Y_TITLE_PADDING = -250;

export class Plot extends Layout {
  /**
   * The minimum value for the X axis. This is in plotting (data) space.
   */
  @initial(0)
  @signal()
  public declare readonly xMin: SimpleSignal<number, this>;

  /**
   * The maximum value for the X axis axis. This is in plotting (data) space.
   */
  @initial(100)
  @signal()
  public declare readonly xMax: SimpleSignal<number, this>;

  /**
   * The minimum value for the Y axis. This is in plotting (data) space.
   */
  @initial(0)
  @signal()
  public declare readonly yMin: SimpleSignal<number, this>;

  /**
   * The maximum value for the Y axis axis. This is in plotting (data) space.
   */
  @initial(100)
  @signal()
  public declare readonly yMax: SimpleSignal<number, this>;

  /**
   * Properties for drawing the X Axis
   */
  @signal()
  public declare readonly xAxisProps: SimpleSignal<LineProps>;

  /**
   * Properties for drawing the Y Axis
   */
  @signal()
  public declare readonly yAxisProps: SimpleSignal<LineProps>;

  /**
   * Properties for drawing the X Axis tick marks
   */
  @signal()
  public declare readonly xTickProps: SimpleSignal<LineProps>;

  /**
   * Properties for drawing the Y Axis tick marks
   */
  @signal()
  public declare readonly yTickProps: SimpleSignal<LineProps>;

  /**
   * Properties for drawing the X Axis tick labels
   */
  @initial({})
  @signal()
  public declare readonly xLabelProps: SimpleSignal<TickLabelProps>;

  /**
   * Properties for drawing the Y Axis tick labels
   */
  @initial({})
  @signal()
  public declare readonly yLabelProps: SimpleSignal<TickLabelProps>;

  /**
   * Properties for the X axis title
   */
  @initial({})
  @signal()
  public declare readonly xTitleProps: SimpleSignal<TickLabelProps>;
  public declare xTitle: Txt;

  /**
   * Properties for the Y axis title
   */
  @initial({})
  @signal()
  public declare readonly yTitleProps: SimpleSignal<TickLabelProps>;
  public declare yTitle: Txt;

  /**
   * The X axis.
   */
  public declare readonly xAxis: PlotAxis;

  /**
   * The Y axis.
   */
  public declare readonly yAxis: PlotAxis;

  public constructor(props?: PlotProps) {
    super({
      ...props,
    });

    this.yAxis = new PlotAxis({
      lineWidth: 20,
      stroke: "green",
      lineCap: "square",
      ...this.yAxisProps(),
      plot: this,
      dir: AxisDirection.Y,
      tickLength: 20,
      tickProps: {
        rotation: 90,
        ...this.yTickProps(),
      },
      tickLabelProps: this.yLabelProps(),
      points: [
        () =>
          this.c2p([this.xMin(), this.yMin()]).transformAsPoint(
            this.worldToLocal()
          ),
        () =>
          this.c2p([this.xMin(), this.yMax()]).transformAsPoint(
            this.worldToLocal()
          ),
      ],
    });

    this.xAxis = new PlotAxis({
      lineWidth: 20,
      stroke: "green",
      lineCap: "square",
      ...this.xAxisProps(),
      plot: this,
      dir: AxisDirection.X,
      tickLength: 20,
      tickProps: {
        ...this.xTickProps(),
      },
      tickLabelProps: this.xLabelProps(),
      points: [
        () =>
          this.c2p([this.xMin(), this.yMin()]).transformAsPoint(
            this.worldToLocal()
          ),
        () =>
          this.c2p([this.xMax(), this.yMin()]).transformAsPoint(
            this.worldToLocal()
          ),
      ],
    });

    this.add(this.yAxis);
    this.add(this.xAxis);

    // Oof...this finds the middle position of the X axis
    this.xTitle = new Txt({
      ...this.xTitleProps(),
      position: () =>
        this.c2p(
          [this.xMin() + (this.xMax() - this.xMin()) / 2, this.yMin()],
          PlotSpace.LOCAL
        ).addY(DEFAULT_X_TITLE_PADDING),
    });
    this.add(this.xTitle);

    // Oof...this finds the middle position of the Y axis
    this.yTitle = new Txt({
      ...this.yTitleProps(),
      position: () =>
        this.c2p(
          [this.xMin(), this.yMin() + (this.yMax() - this.yMin()) / 2],
          PlotSpace.LOCAL
        ).addX(DEFAULT_Y_TITLE_PADDING),
    });
    this.add(this.yTitle);
  }

  public *rescale(
    xMin: number,
    xMax: number,
    xStep: number,
    yMin: number,
    yMax: number,
    yStep: number,
    seconds: number,
    ease: TimingFunction = easeInOutExpo
  ) {
    /**
     * Rescale the plot to new coordinates.
     */

    this.xAxis.enableTickEffect(xMin, xMax, xStep);
    this.yAxis.enableTickEffect(yMin, yMax, yStep);

    yield* all(
      this.xMin(xMin, seconds, ease),
      this.xMax(xMax, seconds, ease),
      this.yMin(yMin, seconds, ease),
      this.yMax(yMax, seconds, ease)
    );

    this.xAxis.disableTickEffect();
    this.yAxis.disableTickEffect();
  }

  public xAxisC2P(c: PossibleVector2) {
    /**
     * Return the absolute position of c along the x Axis
     */

    let vectorC = new Vector2(c);
    // Clamp to minimum y value
    return this.c2p([vectorC.x, this.yMin()]);
  }

  public yAxisC2P(c: PossibleVector2) {
    /**
     * Return the absolute position of c along the y Axis
     */

    let vectorC = new Vector2(c);
    // Clamp to minimum x value
    return this.c2p([this.xMin(), vectorC.y]);
  }

  public c2p(c: PossibleVector2, space: PlotSpace = PlotSpace.WORLD): Vector2 {
    /**
     * Return the position of the given coordinates in the given space.
     */

    const point = this.c2pWorld(c);

    if (space == PlotSpace.LOCAL) {
      return point.transformAsPoint(this.worldToLocal());
    }

    return point;
  }

  public c2pWorld(c: PossibleVector2): Vector2 {
    /**
     * Return the absolute position of the given coordinates.
     */

    const vectorC = new Vector2(c);

    const absoluteTopLeft = this.topLeft().transformAsPoint(
      this.parentToWorld()
    );

    const absoluteBottomLeft = this.bottomLeft().transformAsPoint(
      this.parentToWorld()
    );

    const absoluteBottomRight = this.bottomRight().transformAsPoint(
      this.parentToWorld()
    );

    const x = () =>
      ((absoluteBottomRight.x - absoluteBottomLeft.x) /
        (this.xMax() - this.xMin())) *
        (vectorC.x - this.xMin()) +
      absoluteBottomLeft.x;

    const y = () =>
      ((absoluteTopLeft.y - absoluteBottomLeft.y) /
        (this.yMax() - this.yMin())) *
        (vectorC.y - this.yMin()) +
      absoluteBottomLeft.y;

    return new Vector2(x(), y());
  }

  public circle(c: PossibleVector2, props: CircleProps = {}): Circle {
    /**
     * Create a circle at the given coordinates
     */
    const circle = new Circle(props);

    circle.absolutePosition(() => this.c2p(c));
    this.add(circle);

    return circle;
  }

  public vLine(c: PossibleVector2, props: LineProps = {}): Line {
    /**
     * Create a vertical line from the x-axis to the given coordinates.
     */
    const vectorC = new Vector2(c);
    const start = () => this.c2p([vectorC.x, this.yMin()], PlotSpace.LOCAL);
    const end = () => this.c2p([vectorC.x, vectorC.y], PlotSpace.LOCAL);

    const line = new Line({ ...props, points: [start, end] });
    this.add(line);

    return line;
  }

  public hLine(c: PossibleVector2, props: LineProps = {}): Line {
    /**
     * Create a horizontal line from the y-axis to the given coordinates.
     */
    const vectorC = new Vector2(c);
    const start = () => this.c2p([this.xMin(), vectorC.y], PlotSpace.LOCAL);
    const end = () => this.c2p([vectorC.x, vectorC.y], PlotSpace.LOCAL);

    const line = new Line({ ...props, points: [start, end] });
    this.add(line);

    return line;
  }

  public text(c: PossibleVector2, props: TxtProps = {}): Txt {
    /**
     * Create a Txt at the given coordinates.
     */
    const vectorC = new Vector2(c);

    const text = new Txt({ ...props });
    text.absolutePosition(() => this.c2p(c));
    this.add(text);

    return text;
  }

  public box(
    ul: PossibleVector2,
    lr: PossibleVector2,
    props: LineProps = {}
  ): PlotBox {
    /**
     * Create a Line box given upper-left and lower-right coordinates.
     *
     */
    const box = new PlotBox({
      plot: this,
      upperLeft: ul,
      lowerRight: lr,
      ...props,
    });
    this.add(box);
    return box;
  }
}