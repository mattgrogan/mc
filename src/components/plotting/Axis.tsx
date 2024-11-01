import { LineProps, Node, NodeProps, signal } from "@motion-canvas/2d";
import {
  createEffect,
  createSignal,
  SignalValue,
  SimpleSignal,
  Vector2,
} from "@motion-canvas/core";

export interface AxisProps extends NodeProps {
  minCoord: SignalValue<number>;
  maxCoord: SignalValue<number>;
  minPoint: SignalValue<number>;
  maxPoint: SignalValue<number>;
}

/**
 * A node for converting coordinates into points and vice versa.
 */
export class Axis extends Node {
  /**
   * The minimum coordinate for this axis. This is in plotting (data) space.
   */
  @signal()
  public declare readonly minCoord: SimpleSignal<number, this>;

  /**
   * The maximum coordinate for this axis. This is in plotting (data) space.
   */
  @signal()
  public declare readonly maxCoord: SimpleSignal<number, this>;

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

  public constructor(props?: AxisProps) {
    super({ ...props });
  }

  public c2p(coord: number): SimpleSignal<number> {
    /**
     * Return a point given a coordinate.
     */

    const signal = createSignal(
      () =>
        ((this.maxPoint() - this.minPoint()) /
          (this.maxCoord() - this.minCoord())) *
          (coord - this.minCoord()) +
        this.minPoint()
    );

    //createEffect(() => signal());

    return signal;
  }
}
