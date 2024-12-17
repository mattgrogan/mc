import {
  initial,
  Line,
  LineProps,
  Node,
  signal,
  Txt,
  TxtProps,
} from "@motion-canvas/2d";
import {
  all,
  createDeferredEffect,
  PossibleVector2,
  sequence,
  SimpleSignal,
  spawn,
  Vector2,
  clamp,
} from "@motion-canvas/core";

import { Plot } from "./plot";

const DEFAULT_LABEL_DECIMALS = 0;

const DEFAULT_X_LABEL_PROPS: TickLabelProps = {
  fill: "#fff",
  decimalNumbers: 0,
  suffix: "%",
  fontSize: 30,
  offsetY: -1,
  lineToLabelPadding: 30,
};

const DEFAULT_Y_LABEL_PROPS: TickLabelProps = {
  fill: "#fff",
  decimalNumbers: 0,
  suffix: "%",
  fontSize: 30,
  offsetX: 1,
  lineToLabelPadding: -30,
};

export enum AxisDirection {
  X = "X",
  Y = "Y",
}

export interface TickLabelProps extends TxtProps {
  /**
   * The distance between the NumberLine and the tick label text.
   */
  lineToLabelPadding?: number;
  decimalNumbers?: number;
  suffix?: string;
}

export interface PlotAxisProps extends LineProps {
  plot: Plot;
  dir: AxisDirection;
  axisLineWidth?: number;
  tickLength?: number;
  tickProps?: LineProps;
  tickLabelProps?: TickLabelProps;
}

/**
 * X or Y axis for a plot.
 */
export class PlotAxis extends Line {
  /**
   * The plot that this axis belongs to.
   *
   * This is used for looking up the proper coordinates for tick marks, etc.
   */
  @signal()
  public declare readonly plot: SimpleSignal<Plot, this>;

  /**
   * The axis direction X or Y.
   *
   */
  @signal()
  public declare readonly dir: SimpleSignal<AxisDirection, this>;

  /**
   * The width of the axis line
   */
  @initial(10)
  @signal()
  public declare readonly axisLineWidth: SimpleSignal<number, this>;

  /**
   * The length of the tick marks
   */
  @initial(20)
  @signal()
  public declare readonly tickLength: SimpleSignal<number, this>;

  /**
   * Properties for drawing the tick marks.
   */
  @initial({})
  @signal()
  public declare readonly tickProps: SimpleSignal<LineProps, this>;

  /**
   * Properties for drawing the tick mark labels.
   */
  @initial({})
  @signal()
  public declare readonly tickLabelProps: SimpleSignal<TickLabelProps>;

  private readonly tickSet = new Set<number>();
  private readonly tickMarks: { [id: number]: Line } = {};
  private readonly tickLabels: { [id: number]: Node } = {};
  private unsubscribe: () => void;

  public constructor(props?: PlotAxisProps) {
    super({
      ...props,
    });
    this.lineWidth(() => clamp(0, this.axisLineWidth(), this.arcLength()));
  }

  public enableTickEffect(start: number, stop: number, step: number) {
    /**
     * Enable redrawing ticks within the new start, stop, step parameters.
     *
     */
    this.unsubscribe = createDeferredEffect(() =>
      this.updateTicks(start, stop, step)
    );
  }

  public disableTickEffect() {
    /**
     * Stop updating the ticks. This is for performance.
     */
    this.unsubscribe();
  }

  public tickIndex(where: PossibleVector2) {
    /**
     * Return the index of the tick, depending on the axis direction.
     */
    const vectorWhere = new Vector2(where);

    if (this.dir() === AxisDirection.X) {
      return vectorWhere.x;
    }

    return vectorWhere.y;
  }

  public getTickRange(start: number, stop: number, step: number): Set<number> {
    /**
     * Generate an array of the places where we want the ticks
     */
    const tickRange = new Set<number>();
    let x = start;
    do {
      tickRange.add(x);
      x += step;
    } while (x <= stop);
    return tickRange;
  }

  public createTick(where: PossibleVector2) {
    /**
     * Create a new tick mark at the coordinates.
     */
    const tickPrototype = new Line({
      stroke: "white",
      lineWidth: 5,
      opacity: 1,
      points: [
        [0, this.tickLength() / 2],
        [0, -this.tickLength() / 2],
      ],
      ...this.tickProps(),
    });

    const tick = tickPrototype.clone();

    if (this.dir() === AxisDirection.X) {
      tick.absolutePosition(() => this.plot().xAxisC2P(where));
    }

    if (this.dir() === AxisDirection.Y) {
      tick.absolutePosition(() => this.plot().yAxisC2P(where));
    }

    return tick;
  }

  public createTickLabel(where: PossibleVector2) {
    /**
     * Create a new tick label
     */
    const vectorWhere = new Vector2(where);

    // Text for the label
    let textWhere = vectorWhere.x;
    if (this.dir() == AxisDirection.Y) {
      textWhere = vectorWhere.y;
    }

    let text = textWhere.toFixed(
      this.tickLabelProps().decimalNumbers ?? DEFAULT_LABEL_DECIMALS
    );

    if (this.tickLabelProps().suffix != null) {
      text += this.tickLabelProps().suffix;
    }

    const defaults =
      this.dir() === AxisDirection.X
        ? DEFAULT_X_LABEL_PROPS
        : DEFAULT_Y_LABEL_PROPS;

    const tickLabelPrototype = new Txt({
      ...defaults,
      opacity: 0,
      ...this.tickLabelProps(),
      text: text,
    });

    const label = tickLabelPrototype.clone();

    const padding = defaults.lineToLabelPadding;

    if (this.dir() === AxisDirection.X) {
      label.absolutePosition(() => this.plot().xAxisC2P(where).addY(padding));
    }

    if (this.dir() === AxisDirection.Y) {
      label.absolutePosition(() => this.plot().yAxisC2P(where).addX(padding));
    }

    return label;
  }

  public updateTicks(min: number, max: number, step: number, buffer = 0.5) {
    /**
     * Remove unneeded ticks and draw new ticks.
     * buffer will allow ticks to be drawn even if they're outside the current range.
     * which leads to a smoother animation.
     */

    // These are the ticks we want to end up with.
    const desiredTickSet = this.getTickRange(min, max, step);

    // Find the min and max to filter
    let filterMin = this.plot().xMin();
    let filterMax = this.plot().xMax();
    if (this.dir() == AxisDirection.Y) {
      filterMin = this.plot().yMin();
      filterMax = this.plot().yMax();
    }

    // Find the ticks that need to be added - those that are not in the existing
    // tick set, but are in the desired tick set.
    const ticksToAdd = new Set(
      [...desiredTickSet]
        .filter((x) => !this.tickSet.has(x))
        .filter((x) => x >= filterMin - buffer && x <= filterMax + buffer)
    );
    const additions = [];
    for (const where of ticksToAdd) {
      additions.push(this.addTick(where));
    }
    spawn(sequence(0.1, ...additions));

    // Find the ticks that need to be removed. These are in the existing set,
    // but are not in the desired tick set.
    const ticksToRemove = new Set(
      [...this.tickSet].filter((x) => !desiredTickSet.has(x))
    );
    const removals = [];
    for (const where of ticksToRemove) {
      removals.push(this.removeTickAt(where));
    }
    spawn(sequence(0.1, ...removals));
  }

  public *removeTickAt(where: PossibleVector2, seconds: number = 0.4) {
    /**
     * Remove the tick at the specified position
     */
    const index = this.tickIndex(where);

    if (!(index in this.tickMarks)) {
      return;
    }

    const tick = this.tickMarks[index];
    const tickLabel = this.tickLabels[index];

    yield* all(tick.opacity(0, seconds)); //, tickLabel.opacity(0, seconds));

    // Remove the items from the scene
    tick.remove();
    tickLabel.remove();

    // Remove the items from the dictionary
    delete this.tickMarks[index];
    delete this.tickLabels[index];

    // Remove this item from the set
    this.tickSet.delete(index);
  }

  public *addTick(where: PossibleVector2, seconds: number = 0.4) {
    /**
     * Add the tick to the node tree.
     */
    const index = this.tickIndex(where);

    if (index in this.tickMarks) {
      // Tick already exists, return
      return;
    }

    if (index in this.tickLabels) {
      // Tick label already exists, return
      return;
    }

    const tick = this.createTick(where);
    const tickLabel = this.createTickLabel(where);
    this.tickMarks[index] = tick;
    this.tickLabels[index] = tickLabel;
    this.add(tick);
    this.add(tickLabel);
    this.tickSet.add(index);
    yield* all(tick.opacity(1, seconds), tickLabel.opacity(1, seconds));
  }
}
