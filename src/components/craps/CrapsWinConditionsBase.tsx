import { Rect, RectProps, Txt, signal, initial, LayoutProps, TxtProps, Layout, is } from "@motion-canvas/2d";
import { DEFAULT, Direction, sequence, SignalValue, SimpleSignal, ThreadGenerator, createSignal, createRef } from "@motion-canvas/core";
import { Bright, Grays, PoppinsWhite } from "../../styles";
import { RollText } from "../../utils/RollText";

type ValueContainer = {
  /**
  * Rect component holding each cell's RollText component
  */
  rect: Rect,

  /**
   * signal value for each cell 
   */
  value: SimpleSignal<number>
}

export interface CrapsWinConditionsBaseProps extends LayoutProps {
  // labelProps?: TxtProps;
  tableProps: RectProps;
  labelProps?: TxtProps;
  extensionLength?: SignalValue<number>;
}

export abstract class CrapsWinConditionsBase extends Layout {

  @initial(100)
  @signal()
  public declare readonly extensionLength: SimpleSignal<number, this>

  /*
  * Column Or Row values for easy throws.
  */
  protected readonly values: ValueContainer[] = Array.from({ length: 11 }, (_, i) => ({ rect: null, value: createSignal(0) }) as ValueContainer);


  /*
  * Column Or Row values for hard throws.
  */
  protected readonly hardValues: ValueContainer[] = Array.from({ length: 11 }, (_, i) => ({ rect: null, value: createSignal(0) }) as ValueContainer);


  public declare readonly labelBasisRect: Rect;

  protected readonly defaultLabelProps: TxtProps = {
    alignSelf: "center",
    textAlign: "center",
    fontSize: 25,
    ...PoppinsWhite
  };

  public constructor(props?: CrapsWinConditionsBaseProps) {
    const { tableProps, labelProps, ...others } = props;
    super({
      ...others,
      layout: true,
      gap: 2
    });
    this.extensionLength(0);
    this.addTable(tableProps, labelProps);
    this.hardValues.forEach((x) => x.rect?.findFirst(is(Rect))?.size(x.rect.size))
    this.values.forEach((x) => x.rect?.findFirst(is(Rect))?.size(x.rect.size))
  }

  abstract addTable(tableProps: RectProps, labelProps: TxtProps): void;

  private valueCellAt(diceValue: number): ValueContainer {
    return this.values[diceValue - 2]
  }

  private hardValueCellAt(diceValue: number): ValueContainer {
    return this.hardValues[diceValue - 2]
  }


  protected valueColor(value: number) {
    if (value > 0) return Bright.GREEN;
    if (value < 0) return Bright.RED;
    return Grays.GRAY2
  }

  protected formatValue(value: number | string): string {
    if (typeof value == "string") return value;

    if (value > 0) return "+" + value.toFixed(0)
    if (value < 0) return value.toFixed(0)
    return "-"
  }

  /*
  * This function converts the throw values array object to a simple array where the throw value is the index
  * and the winloss value is the data at that index.
  * 
  * N:B  The throw value is converted by substracting 2.         5   ->   index 3.        10   -> index 8.   5H  -> index 3.
  *   
  * 
  * example.
  *   input:
  *     data: [ { throw: 5, winloss: 30 },  { throw: 3, winloss: 40 }, { throw: 6, winloss: 70 }]
  *
  * 
  *   result: [ undefined, 40, undefined, 30, 70 ]
  */
  private indexByThrowValues(data: { throw: string; winloss: number }[], useHardPattern: boolean = false): number[] {
    const result = [];

    const regex = useHardPattern ? /^([2-9]|1[0-2])H$/ : /^([2-9]|1[0-2])E?$/
    for (let i = 0; i < data.length; i++) {
      const match = (data[i].throw.match(regex) || [])[1];
      if (!match) continue;

      result[Number(match) - 2] = data[i].winloss;
    }
    return result;
  }

  private updateValuesGenerators(data: { data: number; winloss: number }[]): ThreadGenerator[] {
    return data.map(x => this.updateRectGenerator(x.data, x.winloss))
  }
  
  private updateHardValuesGenerators(data: { data: number; winloss: number }[]): ThreadGenerator[] {
    const result = [this.extensionLength(0, .1)]

    if (!data.length) return result;
    return [
      ...result,
      this.extensionLength(DEFAULT, .1),
      ...data.map(x => this.updateRectGenerator(x.data, x.winloss, true))
    ]
  }

  private updateRectGenerator(index: number, winloss: number, isHard: boolean = false): ThreadGenerator {
    const val = isHard ? this.hardValues[index] : this.values[index];
    val.value(winloss)
    return val.rect.findFirst(is(RollText)).next(this.formatValue(winloss), Direction.Right, { fill: this.valueColor(winloss) })
  }

  private *reset() {
    yield* sequence(0.05,
      ...this.values.map(x => x.value(0, .5)),
      ...this.hardValues.map(x => x.value(0, .5)),
      ...this.values.map(x => x.rect.findFirst(is(RollText)).next("-", Direction.Right, { fill: this.valueColor(0) })),
      ...this.hardValues.map(x => x.rect.findFirst(is(RollText)).next("-", Direction.Right, { fill: this.valueColor(0) })),
      this.extensionLength(0, .1)
    )
  }

  public *highlight(d1: number, d2: number, highlighterProp?: RectProps) {
    const rect = d1 === d2 && this.hardValues[d1 + d2 - 2].value() ? this.hardValues[d1 + d2 - 2].rect : this.values[d1 + d2 - 2].rect;
    const props = highlighterProp ?? {
      fill: rect.findFirst(is(Txt)).fill(),
      opacity: .1,
    }
    const highlighter = createRef<Rect>();
    rect.findFirst(is(Rect)).add(<Rect zIndex={-1} ref={highlighter} size={0} layout={false} {...props}></Rect>);
    yield* highlighter().size(rect.size(), 1).back(1);
    highlighter().remove();
  }

  public valueCellRectAt(diceValue: number): Rect {
    return this.valueCellAt(diceValue).rect
  }

  public hardValueCellRectAt(diceValue: number): Rect {
    return this.hardValueCellAt(diceValue).rect;
  }

  public valueCellTxtAt(diceValue: number): Txt {
    return this.valueCellAt(diceValue).rect.findFirst(is(Txt))
  }

  public hardValueCellTxtAt(diceValue: number): Txt {
    return this.hardValueCellAt(diceValue).rect.findFirst(is(Txt));
  }

  public labelCellRectAt(diceValue: number): Rect {
    return this.labelBasisRect.children()[diceValue - 2] as Rect
  }

  public labelCellTxtAt(diceValue: number): Txt {
    return this.labelCellRectAt(diceValue).findFirst(is(Txt));
  }

  public *update(data: { throw: string; winloss: number }[]) {
    yield* this.reset();

    const newValues = this.indexByThrowValues(data);
    const newHardValues = this.indexByThrowValues(data, true);
    const filteredCollidingHardValue = newHardValues.map((x, i) => (x && newValues[i] === x) ? undefined : x);

    yield* sequence(
      0.05,
      ...this.updateValuesGenerators(newValues.map((x, i) => ({ data: i, winloss: x })).filter(x => x.winloss)),
      ...this.updateHardValuesGenerators(filteredCollidingHardValue.map((x, i) => ({ data: i, winloss: x })).filter(x => x.winloss))
    )
  }
}
