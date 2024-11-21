import {
  Layout,
  LayoutProps,
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
  createSignal,
  easeInOutExpo,
  easeOutCubic,
  sequence,
  SignalValue,
  SimpleSignal,
  spawn,
  TimingFunction,
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
  suffix?: string;
}

const defaultLineProps = {
  lineWidth: 5,
  stroke: "white",
  start: 0.5,
  end: 0.5,
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
  private readonly tickMarks: { [id: number]: Node } = {};
  private readonly tickLabels: { [id: number]: Node } = {};
  private readonly tickSet = new Set<number>();

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
  }
  public *drawFromCenter(seconds: number, ease: TimingFunction = easeOutCubic) {
    /**
     * Animate drawing the line from the center
     */
    yield* all(
      this.numberLine.start(0, seconds, ease),
      this.numberLine.end(1, seconds, ease)
    );
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

  public createTick(where: number) {
    /**
     * Create a new tick mark
     */
    const tickPrototype = new Line({
      stroke: "white",
      lineWidth: 5,
      opacity: 0,
      points: [
        [0, this.tickMarkProps().length / 2],
        [0, -this.tickMarkProps().length / 2],
      ],
      ...this.tickMarkProps(),
    });

    const tick = tickPrototype.clone();
    tick.x(() => this.n2p(where)());
    return tick;
  }

  public createTickLabel(where: number) {
    /**
     * Create a new tick label
     */
    let text = where.toFixed(this.tickLabelProps().decimalNumbers);
    if (this.tickLabelProps().suffix != null) {
      text += this.tickLabelProps().suffix;
    }

    const tickLabelPrototype = new Txt({
      opacity: 0,
      ...this.tickLabelProps(),
      y: this.tickLabelProps().lineToLabelPadding,
      text: text,
    });

    const label = tickLabelPrototype.clone();
    label.x(() => this.n2p(where)());

    return label;
  }

  public *rescale(
    min: number,
    max: number,
    step: number,
    seconds: number,
    ease: TimingFunction = easeInOutExpo
  ) {
    /**
     * Rescale the axis
     */

    // Redraw the ticks as the min and max change
    const unsubscribe = createDeferredEffect(() =>
      this.updateTicks(min, max, step)
    );

    yield* all(this.minNumber(min, seconds), this.maxNumber(max, seconds));

    unsubscribe();
  }

  public updateTicks(min: number, max: number, step: number, buffer = 0.5) {
    /**
     * Remove unneeded ticks and draw new ticks.
     * buffer will allow ticks to be drawn even if they're outside the current range.
     * which leads to a smoother animation.
     */

    // These are the ticks we want to end up with.
    const desiredTickSet = this.getTickRange(min, max, step);

    // Find the ticks that need to be added - those that are not in the existing
    // tick set, but are in the desired tick set.
    const ticksToAdd = new Set(
      [...desiredTickSet]
        .filter((x) => !this.tickSet.has(x))
        .filter(
          (x) =>
            x >= this.minNumber() - buffer && x <= this.maxNumber() + buffer
        )
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

  public *addTick(where: number, seconds: number = 0.4) {
    /**
     * Add the tick to the node tree.
     */

    if (where in this.tickMarks) {
      // Tick already exists, return
      return;
    }

    if (where in this.tickLabels) {
      // Tick label already exists, return
      return;
    }

    const tick = this.createTick(where);
    const tickLabel = this.createTickLabel(where);
    this.tickMarks[where] = tick;
    this.tickLabels[where] = tickLabel;
    this.tickContainer.add(tick);
    this.tickContainer.add(tickLabel);
    this.tickSet.add(where);
    yield* all(tick.opacity(1, seconds), tickLabel.opacity(1, seconds));
  }

  public *removeTickAt(where: number, seconds: number = 0.4) {
    /**
     * Remove the tick at the specified position
     */

    if (!(where in this.tickMarks)) {
      return;
    }
    const tick = this.tickMarks[where];
    const tickLabel = this.tickLabels[where];

    yield* all(tick.opacity(0, seconds), tickLabel.opacity(0, seconds));

    // Remove the items from the scene
    tick.remove();
    tickLabel.remove();

    // Remove the items from the dictionary
    delete this.tickMarks[where];
    delete this.tickLabels[where];

    // Remove this item from the set
    this.tickSet.delete(where);
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
}
