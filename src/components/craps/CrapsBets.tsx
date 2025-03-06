import { Layout, LayoutProps } from "@motion-canvas/2d";
import { c, tableCoords } from "./CrapsTableCoords";
import { ChipColors, CrapsChip } from "./CrapsChip";
import {
  all,
  easeInOutCubic,
  easeInOutExpo,
  easeOutCubic,
  easeOutExpo,
  sequence,
  TimingFunction,
  useLogger,
  waitFor,
} from "@motion-canvas/core";
import { Indicate } from "../../utils/Indicate";

export interface CrapsBetsProps extends LayoutProps {}

export class CrapsBets extends Layout {
  private chips: { [id: string]: CrapsChip } = {};

  public constructor(props?: CrapsBetsProps) {
    super({ ...props });
  }

  public newChip(denom: number, where: c): Layout {
    const chip = new CrapsChip({ denom: denom, chipColor: ChipColors.AUTO });
    chip.position(tableCoords[where]);
    this.add(chip);
    return chip;
  }

  public chip(where: c): CrapsChip {
    return this.chips[where];
  }

  public *moveChipTo(
    chip: Layout,
    where: c,
    dur: number = 0.6,
    ease: TimingFunction = easeInOutCubic,
    opacity: number = 1,
    opacityEase: TimingFunction = easeInOutExpo
  ) {
    yield* all(
      chip.position(tableCoords[where], dur, ease),
      chip.opacity(opacity, dur, opacityEase)
    );
  }

  public *makeBet(
    denom: number,
    where: c,
    indicate: boolean = true,
    is_buy: boolean = false
  ) {
    const chip = this.newChip(denom, c.PLAYER);
    this.chips[where] = chip;
    yield* this.moveChipTo(chip, where);

    if (indicate) {
      //yield* Indicate(chip, 1.5);
      yield* Indicate(chip, 1.3, 0, 0.4);
    }

    if (is_buy) {
      yield* chip.showBuy();
    }
  }

  public *moveBet(from: c, to: c, opacity: number = 1) {
    const chip = this.chips[from];
    yield* this.moveChipTo(chip, to, 0.6, easeInOutCubic, opacity);
    delete this.chips[from];
    this.chips[to] = chip;
  }

  public *loseBet(where: c) {
    const chip = this.chips[where];
    yield* this.moveChipTo(chip, c.DEALER, 0.6, easeInOutCubic, 0);
    delete this.chips[where];
    chip.remove();
  }

  public *removeBet(where: c) {
    // useLogger().debug("Removing chip from " + where.toString());
    const chip = this.chips[where];

    if (chip === undefined) {
      useLogger().error("NO CHIP AT " + where.toString());
      return;
    }
    yield* this.moveChipTo(chip, c.PLAYER, 0.6, easeInOutCubic, 0);
    delete this.chips[where];
    chip.remove();
  }

  public *winBet(
    denom: number,
    where: c,
    both: boolean = false,
    indicate: boolean = true,
    offset: number = 25,
    dur: number = 0.6,
    ease: TimingFunction = easeOutCubic,
    opacity: number = 1,
    opacityEase: TimingFunction = easeOutExpo
  ) {
    const winChip = this.newChip(denom, c.DEALER);
    const chip = this.chips[where];

    yield* all(
      winChip.position(chip.right().addX(offset), dur, ease),
      winChip.opacity(opacity, dur, opacityEase)
    );
    if (indicate) {
      yield* Indicate(winChip, 1.5);
    }
    yield* waitFor(0.5);

    const anims = [];
    anims.push(this.moveChipTo(winChip, c.PLAYER, 0.6, easeOutCubic, 0));

    if (both) {
      anims.push(this.moveChipTo(chip, c.PLAYER, 0.6, easeInOutCubic, 0));
    }
    yield* sequence(0.1, ...anims);
    winChip.remove();

    if (both) {
      chip.remove();
    }
  }
}
