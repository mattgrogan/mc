import {
  Layout,
  LayoutProps,
  Line,
  LineProps,
  signal,
} from "@motion-canvas/2d";
import {
  createSignal,
  SignalValue,
  SimpleSignal,
  Vector2,
} from "@motion-canvas/core";

export interface NumberLineProps extends LayoutProps {
  minNumber: SignalValue<number>;
  maxNumber: SignalValue<number>;
  length: SignalValue<number>;
  numberLineProps?: LineProps;
  // minPoint: SignalValue<number>;
  // maxPoint: SignalValue<number>;
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

  private declare readonly numberLine: Line;

  public constructor(props?: NumberLineProps) {
    super({ ...props });

    this.numberLine = new Line({
      ...defaultLineProps,
      ...this.numberLineProps(),
      points: [[0, 0], () => Vector2.zero.addX(this.length())],
    });
    this.add(this.numberLine);
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
}
