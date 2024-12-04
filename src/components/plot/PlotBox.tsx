import { Line, LineProps, signal } from "@motion-canvas/2d";
import {
  all,
  PossibleVector2,
  SignalValue,
  SimpleSignal,
  TimingFunction,
  Vector2,
  Vector2Signal,
} from "@motion-canvas/core";
import { Plot, PlotSpace } from "./plot";

export interface PlotBoxProps extends LineProps {
  plot: Plot;
  upperLeft: SignalValue<PossibleVector2>;
  lowerRight: SignalValue<PossibleVector2>;
}

export class PlotBox extends Line {
  /**
   * The plot that this axis belongs to.
   *
   * This is used for looking up the proper coordinates for tick marks, etc.
   */
  @signal()
  public declare readonly plot: SimpleSignal<Plot, this>;

  /**
   * The upper left corner of the box in plotting space.
   */
  @signal()
  public declare readonly upperLeft: SimpleSignal<PossibleVector2, this>;
  // I'm casting these into vectors so I can get the components individually.
  // Is this the right way?
  @signal()
  public declare readonly upperLeftVector: Vector2Signal;

  /**
   * The lower right corner of the box in plotting space.
   */
  @signal()
  public declare readonly lowerRight: SimpleSignal<PossibleVector2, this>;
  @signal()
  public declare readonly lowerRightVector: Vector2Signal;

  private declare readonly upperLeftPoint: Vector2Signal;
  private declare readonly upperRightPoint: Vector2Signal;
  private declare readonly lowerRightPoint: Vector2Signal;
  private declare readonly lowerLeftPoint: Vector2Signal;

  public constructor(props?: PlotBoxProps) {
    super({
      ...props,
      closed: true,
    });

    this.upperLeftVector = Vector2.createSignal(() => this.upperLeft());
    this.lowerRightVector = Vector2.createSignal(() => this.lowerRight());

    // The four points of the box
    this.upperLeftPoint = Vector2.createSignal(() =>
      this.plot().c2p(this.upperLeft(), PlotSpace.LOCAL)
    );
    this.upperRightPoint = Vector2.createSignal(() =>
      this.plot().c2p(
        [this.lowerRightVector().x, this.upperLeftVector().y],
        PlotSpace.LOCAL
      )
    );
    this.lowerRightPoint = Vector2.createSignal(() =>
      this.plot().c2p(this.lowerRight(), PlotSpace.LOCAL)
    );
    this.lowerLeftPoint = Vector2.createSignal(() =>
      this.plot().c2p(
        [this.upperLeftVector().x, this.lowerRightVector().y],
        PlotSpace.LOCAL
      )
    );

    this.points([
      this.upperLeftPoint,
      this.upperRightPoint,
      this.lowerRightPoint,
      this.lowerLeftPoint,
    ]);
  }

  public *shiftPositionTo(
    ul: PossibleVector2,
    lr: PossibleVector2,
    secs: number,
    ease: TimingFunction
  ) {
    /**
     * Animate the movement to a new position
     */

    yield* all(this.upperLeft(ul, secs, ease), this.lowerRight(lr, secs, ease));
  }
}
