import {
  PossibleVector2,
  Reference,
  SimpleVector2Signal,
  Vector2,
} from "@motion-canvas/core";
import { Plot, PlotSpace } from "./plot";
import { Layout, Line, LineProps } from "@motion-canvas/2d";

export interface LayoutToCoordLineProps {
  /**
   * The plot to draw on.
   */
  plot: Reference<Plot>;

  /**
   * The source of the line.
   *
   * This is a signal to a position on the layout.
   * For example, layout.top or layout.bottom
   */
  source: PossibleVector2;

  /**
   * The target that the arrow line ends at in plot
   * coordinate space.
   */
  target: PossibleVector2;

  /**
   * The distance from the source to the first elbow.
   *
   * Defaults to zero.
   */
  sourceElbowOffset?: PossibleVector2;

  /**
   * The distance from the last elbow to the target.
   *
   * Defaults to zero.
   */
  targetElbowOffset?: PossibleVector2;

  /**
   * The distance from the first elbow to the second.
   * Use this to dodge other items in the plot.
   *
   * Defaults to zero.
   */
  sourceElbowOffset2?: PossibleVector2;

  /**
   * The line properties.
   */
  lineProps?: LineProps;
}

/**
 * Draw a Line from the source (the cardinal point of a layout) to
 * the target (in coordinate space).
 */
export function createLayoutToCoordLine(props: LayoutToCoordLineProps) {
  const sourceVector = () => new Vector2(props.source);
  const targetCoordinates = new Vector2(props.target);

  // Convert the target plot coordinates to a point
  const target = () =>
    props
      .plot()
      .c2p([targetCoordinates.x, targetCoordinates.y], PlotSpace.LOCAL);

  // p1 is the first elbow from off the source. It only moves vertically.
  const p1 = () => sourceVector().add(props.sourceElbowOffset);

  // p4 is the last elbow from the target. It moves vertically from the target.
  const p4 = () => target().add(props.targetElbowOffset);

  // p2 is the second elbow off the source. It moves from p1 in a horizontal direction.
  const p2 = () => p1().add(props.sourceElbowOffset2);

  // p3 is the third elbow. It's aligned with p2 vertically (same X)
  // and p4 vertically (same y)
  const p3 = () => new Vector2([p2().x, p4().y]);

  // Create the line
  const line = new Line({
    points: [sourceVector, p1, p2, p3, p4, target],
    ...props.lineProps,
  });

  // Add to the plot and return
  props.plot().add(line);
  return line;
}
