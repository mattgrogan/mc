import {
  Layout,
  LayoutProps,
  Line,
  LineProps,
  signal,
  Node,
  Txt,
  TxtProps,
  Circle,
} from "@motion-canvas/2d";
import {
  createDeferredEffect,
  createEffect,
  createSignal,
  SignalValue,
  SimpleSignal,
  Vector2,
} from "@motion-canvas/core";

export interface NumberLineProps extends LayoutProps {
  minNumber: SignalValue<number>;
  maxNumber: SignalValue<number>;
  tickStep: SignalValue<number>;
  length: SignalValue<number>;
  numberLineProps?: LineProps;
  tickMarkProps?: TickMarkProps;
  tickLabelProps?: TickLabelProps;

  // minPoint: SignalValue<number>;
  // maxPoint: SignalValue<number>;
}

export interface TickMarkProps extends LineProps {
  /**
   * The length of the tick mark
   */
  length: number;
}

export interface TickLabelProps extends TxtProps {
  /**
   * The distance between the NumberLine and the tick label text.
   */
  lineToLabelPadding: number;
  decimalNumbers: number;
}

const defaultLineProps = {
  lineWidth: 5,
  stroke: "white",
};

/**
 * A node for converting coordinates into points and vice versa.
 */
export class NumberLine extends Layout {
  /**
   * The minimum number for this axis. This is in plotting (data) space.
   */
  @signal()
  public declare readonly minNumber: SimpleSignal<number, this>;

  /**
   * The maximum number for this axis. This is in plotting (data) space.
   */
  @signal()
  public declare readonly maxNumber: SimpleSignal<number, this>;

  /**
   * The amount between each tick mark. This is in plotting (data) space.
   */
  @signal()
  public declare readonly tickStep: SimpleSignal<number, this>;

  /**
   * The length of this NumberLine.
   */
  @signal()
  public declare readonly length: SimpleSignal<number, this>;

  /**
   * The maximum point for this axis. This is in view (motioncanvas) space.
   */
  @signal()
  public declare readonly minPoint: SimpleSignal<number, this>;

  /**
   * The maximum point for this axis. This is in view (motioncanvas) space.
   */
  @signal()
  public declare readonly maxPoint: SimpleSignal<number, this>;

  /**
   * Properties for drawing the number line.
   */
  @signal()
  public declare readonly numberLineProps: SimpleSignal<LineProps>;

  /**
   * Properties for drawing the tick marks.
   */
  @signal()
  public declare readonly tickMarkProps: SimpleSignal<TickMarkProps>;

  /**
   * Properties for drawing the tick mark labels.
   */
  @signal()
  public declare readonly tickLabelProps: SimpleSignal<TickLabelProps>;

  private declare readonly numberLine: Line;
  private declare readonly tickContainer: Node;

  public constructor(props?: NumberLineProps) {
    super({ ...props });

    this.numberLine = new Line({
      ...defaultLineProps,
      ...this.numberLineProps(),
      points: [[0, 0], () => Vector2.zero.addX(this.length())],
    });
    this.add(this.numberLine);

    this.tickContainer = new Node({});
    this.add(this.tickContainer);

    this.minPoint(0);
    this.maxPoint(this.length());

    // Redraw the ticks if the numbers change
    createDeferredEffect(() => {
      this.tickContainer.removeChildren();
      this.addTicks();
    });
  }

  public n2p(x: number): SimpleSignal<number> {
    /**
     * Return a point given a number along this NumberLine.
     */

    const signal = createSignal(
      () =>
        ((this.maxPoint() - this.minPoint()) /
          (this.maxNumber() - this.minNumber())) *
          (x - this.minNumber()) +
        this.minPoint()
    );

    return signal;
  }

  public addTicks() {
    /**
     * Add a tick along the numberline
     */
    let x = this.minNumber();
    do {
      this.addTick(x);
      this.addTickLabel(x);
      x += this.tickStep();
    } while (x <= this.maxNumber());
  }

  public addTick(where: number) {
    /**
     * Add a tick along the numberline
     */
    const tickPrototype = new Line({
      stroke: "white",
      lineWidth: 5,
      points: [
        [0, this.tickMarkProps().length / 2],
        [0, -this.tickMarkProps().length / 2],
      ],
      ...this.tickMarkProps(),
    });

    const tick = tickPrototype.clone();
    tick.x(() => this.n2p(where)());
    this.tickContainer.add(tick);
  }

  public addTickLabel(where: number) {
    /**
     * Add a tick label along the numberline
     */
    const tickLabelPrototype = new Txt({
      ...this.tickLabelProps(),
      y: this.tickLabelProps().lineToLabelPadding,
      text: where.toFixed(this.tickLabelProps().decimalNumbers),
    });

    const label = tickLabelPrototype.clone();
    label.x(() => this.n2p(where)());

    this.tickContainer.add(label);
  }

  public addPoint(where: number) {
    const point = (
      <Circle
        size={50}
        fill={"red"}
      />
    );
    this.add(point);
    point.x(this.n2p(20));
  }
}
