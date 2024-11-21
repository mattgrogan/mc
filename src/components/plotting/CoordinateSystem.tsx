import { Layout, LayoutProps } from "@motion-canvas/2d";
import { NumberLine } from "./NumberLine";
import { easeInOutCubic } from "@motion-canvas/core";

export interface CoordinateSystemProps extends LayoutProps {}

/**
 * A node for plotting against coordinates
 */
export class CoordinateSystem extends Layout {
  public declare readonly xAxis: NumberLine;
  public declare readonly yAxis: NumberLine;

  public constructor(props?: CoordinateSystemProps) {
    super({ ...props });

    // this.width(2800);
    // this.height(1000);

    this.xAxis = new NumberLine({
      minNumber: 0,
      maxNumber: 10,
      tickStep: 2,
      length: 2800,
      width: 2800,
      height: 1000,
      position: [0, 0],
      numberLineProps: {
        lineWidth: 10,
        stroke: "white",
      },
      tickMarkProps: {
        lineWidth: 5,
        stroke: "white",
        length: 50,
      },
      tickLabelProps: {
        fill: "white",
        fontSize: 60,
        fontWeight: 600,
        lineToLabelPadding: 50,
        decimalNumbers: 2,
        //rotation: -90,
        //offsetX: 1,
        suffix: "%",
      },
    });

    this.add(this.xAxis);
    this.xAxis.updateTicks(0, 4, 0.25);
  }

  public *draw() {
    yield* this.xAxis.drawFromCenter(1, easeInOutCubic);
  }
}
