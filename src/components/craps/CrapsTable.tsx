import { Img, Layout, LayoutProps } from "@motion-canvas/2d";
import { all, createRef, easeInOutCubic } from "@motion-canvas/core";

import felt from "../../../assets/Tables/Craps_Table_Steel_Felt.png";
import { c, tableCoords } from "./CrapsTableCoords";
import { CrapsPuck } from "./CrapsPuck";
import { CrapsDice } from "./CrapsDice";
import { CrapsBets } from "./CrapsBets";

export interface CrapsTableProps extends LayoutProps {}

export class CrapsTable extends Layout {
  private readonly tableImg = createRef<Img>();
  private readonly puck = createRef<CrapsPuck>();
  public readonly dice = createRef<CrapsDice>();
  public readonly bets = createRef<CrapsBets>();

  public constructor(props?: CrapsTableProps) {
    super({ ...props });
    this.add(
      <Img
        ref={this.tableImg}
        src={felt}
      >
        <CrapsPuck
          ref={this.puck}
          position={tableCoords[c.PUCKOFF]}
        />
        <CrapsBets ref={this.bets} />
        <CrapsDice
          ref={this.dice}
          startPosition={tableCoords[c.DICE_START]}
          bounceTopLeft={tableCoords[c.DICE_BOUNCE_TL]}
          bounceBottomRight={tableCoords[c.DICE_BOUNCE_BR]}
          landTopLeft={tableCoords[c.DICE_LAND_TL]}
          landBottomRight={tableCoords[c.DICE_LAND_BR]}
          restPosition={tableCoords[c.DICE_REST]}
        />
      </Img>
    );
  }

  public setTableSrc(tablePng: string) {
    this.tableImg().src(tablePng);
  }

  public *movePuckTo(where: c) {
    yield* all(
      this.puck().position(tableCoords[where], 0.6, easeInOutCubic),
      this.puck().flip(0.6, easeInOutCubic)
    );
  }
}
