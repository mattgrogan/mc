import { Rect, RectProps, Txt, signal, initial, LayoutProps, TxtProps, Layout, is, NodeProps, Node } from "@motion-canvas/2d";
import { Direction, sequence, SignalValue, SimpleSignal, ThreadGenerator, createSignal, TimingFunction, InterpolationFunction, Vector2 } from "@motion-canvas/core";
import { Bright, grayGradient, Grays, PoppinsWhite } from "../../styles";

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
  tableProps: RectProps;
  labelProps?: TxtProps;
  labelCellRectProps?: RectProps;
  easyValueTxtProps?: TxtProps;
  hardValueTxtProps?: TxtProps;
  easyCellRectProps?: RectProps;
  hardCellRectProps?: RectProps;
  extensionLength?: SignalValue<number>;
  easyAnimationDirection?: SignalValue<Direction>
  hardAnimationDirection?: SignalValue<Direction>
}

export abstract class CrapsWinConditionsBase extends Layout {

  @initial(100)
  @signal()
  public declare readonly extensionLength: SimpleSignal<number, this>

  @initial(Direction.Right)
  @signal()
  public declare readonly easyAnimationDirection: SimpleSignal<Direction, this>

  @initial(Direction.Right)
  @signal()
  public declare readonly hardAnimationDirection: SimpleSignal<Direction, this>


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

  protected readonly defaultValueTxtProps: TxtProps = {
    ...PoppinsWhite, textAlign: "right", fontSize: 25,
  }

  protected readonly defaultCellRectProps: RectProps = {
    fill: grayGradient,
    stroke: Grays.GRAY4,
    lineWidth: 2
  }

  public constructor(props?: CrapsWinConditionsBaseProps) {
    const {
      tableProps,
      labelProps,
      labelCellRectProps,
      easyValueTxtProps,
      hardValueTxtProps,
      easyCellRectProps,
      hardCellRectProps,
      ...others 
  } = props;
    super({
      ...others,
      layout: true,
      gap: 2
    });
    this.addTable(tableProps, labelProps, labelCellRectProps, easyValueTxtProps, hardValueTxtProps, easyCellRectProps, hardCellRectProps);
    this.hardValues.forEach((x) => x.rect?.findFirst(is(Rect))?.size(x.rect.size))
    this.values.forEach((x) => x.rect?.findFirst(is(Rect))?.size(x.rect.size))
  }

  abstract addTable(
    tableProps: RectProps,
    labelProps: TxtProps,
    labelCellRectProps: RectProps,
    easyValueTxtProp: TxtProps,
    hardValueTxtProp: TxtProps,
    easyCellRectProps: RectProps,
    hardCellRectProps: RectProps
  ): void;

  protected abstract generatorForCellUpdate(index: number, winloss: number, isHard: boolean): ThreadGenerator;

  protected abstract highlightCell(
    cell: Rect,
    props?: NodeProps,
    time?: number,
    timingFunction?: TimingFunction,
    interpolationFunction?: InterpolationFunction<unknown, any[]>
  ): ThreadGenerator

  private valueCellAt(diceValue: number): ValueContainer {
    return this.values[diceValue - 2]
  }

  private hardValueCellAt(diceValue: number): ValueContainer {
    return this.hardValues[diceValue - 2]
  }

  private valueCellFromDiceRoll(diceOne: number, diceTwo: number): ValueContainer {
    if (diceOne === diceTwo) {
      const valueCell = this.hardValueCellAt(diceOne + diceTwo);
      if (valueCell.value()) return valueCell
    }
    
    return this.valueCellAt(diceOne + diceTwo);
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
  * 
  *   result: [ 0, 40, 0, 30, 70, 0, 0, 0, 0, 0, 0 ]
  */
  private indexByThrowValues(data: { throw: string; winloss: number }[], useHardPattern: boolean = false): number[] {
    const result = Array.from({ length: 11 }, (_, i) => 0);

    const regex = useHardPattern ? /^([2-9]|1[0-2])H$/ : /^([2-9]|1[0-2])E?$/
    for (let i = 0; i < data.length; i++) {
      const match = (data[i].throw.match(regex) || [])[1];
      if (!match) continue;

      result[Number(match) - 2] = data[i].winloss;
    }
    return result;
  }

  private generatorsForEasyCellsUpdate(data: { data: number; winloss: number }[]): ThreadGenerator[] {
    return data.map(x => this.generatorForCellUpdate(x.data, x.winloss, false))
  }

  private generatorsForHardCellsUpdate(data: { data: number; winloss: number }[]): ThreadGenerator[] {
    return data.map(x => this.generatorForCellUpdate(x.data, x.winloss, true))
  }

  private setCellZIndex(rect: Rect, value: number) {
    rect.findAncestor(is(Node)).zIndex(value);
    rect.zIndex(value)
  }
    
  public *reset() {
    yield* sequence(0.05,
      ...this.values.map((_, i) => this.generatorForCellUpdate(i, 0, false)),
      ...this.hardValues.map((_, i) => this.generatorForCellUpdate(i, 0, true))
    )
  }

  public *highlight<T extends NodeProps>(
    d1: number, 
    d2: number,
    defaultHighlighterProp?:  T & { time?: number, timingFunction?: TimingFunction, interpolationFunction?: InterpolationFunction<unknown, any[]> },
    customCellHighlighter?: (cell: Rect) => ThreadGenerator
  ) {
    const rect = this.valueCellFromDiceRoll(d1, d2).rect;
    this.setCellZIndex(rect, 10)
    if (customCellHighlighter) {
      yield* customCellHighlighter(rect);
      this.setCellZIndex(rect, 0)
      return;
    }

    const { time, timingFunction, interpolationFunction, ...props } = defaultHighlighterProp || {};

    yield* this.highlightCell(rect, defaultHighlighterProp ? props: undefined, time, timingFunction, interpolationFunction);
    this.setCellZIndex(rect, 10)
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
    const newValues = this.indexByThrowValues(data);
    const newHardValues = this.indexByThrowValues(data, true);
    const filteredCollidingHardValue = newHardValues.map((x, i) => (x && newValues[i] === x) ? 0 : x);
    const closingHardValue = filteredCollidingHardValue.map((x, i) => !x && this.hardValues[i].value() ? 0 : undefined);

    const allGenerators = [
      ...this.generatorsForHardCellsUpdate(closingHardValue.map((x, i) => ({ data: i, winloss: x })).filter(x => x.winloss === 0)),
      ...this.generatorsForEasyCellsUpdate(newValues.map((x, i) => ({ data: i, winloss: x }))),
      ...this.generatorsForHardCellsUpdate(filteredCollidingHardValue.map((x, i) => ({ data: i, winloss: x })))
    ]

    yield* sequence(
      0.05,
      ...allGenerators
    )
  }

}
