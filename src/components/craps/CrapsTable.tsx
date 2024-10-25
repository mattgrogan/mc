import { Img, Layout, LayoutProps } from "@motion-canvas/2d";
import { createRef } from "@motion-canvas/core";

export interface CrapsTableProps extends LayoutProps {}

export class CrapsTable extends Layout {
  private readonly tableImg = createRef<Img>();

  public constructor(props?: CrapsTableProps) {
    super({ scale: 0.7, ...props });
    this.add(<Img ref={this.tableImg} />);
  }

  public setTableSrc(tablePng: string) {
    this.tableImg().src(tablePng);
  }
}
