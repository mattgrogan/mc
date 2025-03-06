import { initial, Layout, LayoutProps, Rect, RectProps, signal, Txt, Node, is, Length, TxtProps } from "@motion-canvas/2d";
import { createRef, createSignal, DEFAULT, Direction, makeRef, PossibleColor, range, sequence, SignalValue, SimpleSignal, spawn, ThreadGenerator } from "@motion-canvas/core";
import { Bright, grayGradient, Grays, PoppinsWhite } from "../../styles";
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

export interface CrapsWinConditionsProps extends LayoutProps {
  tableProps: RectProps;
  labelProps?: TxtProps;
  extensionWidth?: SignalValue<number>;
  valueColumnWidth?: SignalValue<Length>;
  valueCellWidth?: SignalValue<Length>;
  valueCellHeight?: SignalValue<Length>;
}

export class CrapsWinConditions extends Layout {

  /*
  * Column values for easy throws.
  */
  private readonly values: ValueContainer[] = Array.from({ length: 11 }, (_, i) => ({ rect: null, value: createSignal(0) }) as ValueContainer);

  
  /*
  * Column values for hard throws.
  */
  private readonly hardValues: ValueContainer[] = Array.from({ length: 11 }, (_, i) => ({ rect: null, value: createSignal(0) }) as ValueContainer);

  
  /*
  * Width of hard throw extension
  */
  @initial(100)
  @signal()
  public declare readonly extensionWidth: SimpleSignal<number, this>;

  /*
  * Width of the values column
  */
  @initial(100)
  @signal()
  public declare readonly valueColumnWidth: SimpleSignal<Length, this>;

  /*
  * Width of individual cells rect
  */
  @initial(50)
  @signal()
  public declare readonly valueCellWidth: SimpleSignal<Length, this>;

  /*
  * Height of individual cells rect
  */
  @initial(50)
  @signal()
  public declare readonly valueCellHeight: SimpleSignal<Length, this>;

  public declare readonly labelColumnRect: Rect;


  constructor(props: CrapsWinConditionsProps) {
    const { tableProps, labelProps, ...others } = props;
    super({
      ...others,
      layout: true,
      gap: 2,
      offsetX: -1
    });

    this.extensionWidth(0);

    const defaultLabelProps: TxtProps = {
      alignSelf: "center",
      textAlign: "center",
      fontSize: 25,
      ...PoppinsWhite
    }
    const txtLabelProps = labelProps ?? defaultLabelProps

    this.add(
      <>
        <Rect {...tableProps} zIndex={1}>
          <Rect ref={makeRef(this, "labelColumnRect")}  grow={1} height={"100%"} layout direction={"column"}>
            {
              range(2, 13).map((key) => (
                <Rect fill={grayGradient} width={"100%"} height={"100%"} grow={1} lineWidth={2} stroke={Grays.GRAY4} justifyContent={"center"} alignItems={"center"}>
                  <Txt {...txtLabelProps} text={key.toString()}></Txt>
                </Rect>
              ))
            }
          </Rect>
          <Rect width={this.valueColumnWidth} height={"100%"} layout direction={"column"}>
            {
              this.values.map((v) => (
                <Rect ref={makeRef(v, "rect")} fill={grayGradient} grow={1} width={"100%"} height={"100%"} lineWidth={2} stroke={Grays.GRAY4} justifyContent={"end"} alignItems={"center"} padding={10}>
                  <RollText width={this.valueCellWidth} height={this.valueCellHeight} justifyContent={"center"} alignItems={"center"} initialText={"-"} fill={{r: 0, g: 0, b: 0, a: .1 }} txtProps={{ ...PoppinsWhite, textAlign: "right", fontSize: 25, fill: this.valueColor(v.value()) }} />
                </Rect>
              ))
            }
          </Rect>
        </Rect>
        <Rect width={() => this.extensionWidth()} height={tableProps.height} layout direction={"column"} alignItems={"center"} justifyContent={"center"} zIndex={0}>
          {
            this.hardValues.map((v) => (
              <Rect ref={makeRef(v, "rect")} lineWidth={() => (v.value() ? 1 : 0) * 2 } stroke={Grays.GRAY4} fill={grayGradient} grow={1} width={() => (v.value() ? 1 : 0) * this.extensionWidth()} height={"100%"} justifyContent={"center"} alignItems={"center"}>
                <RollText layout width={"80%"} height={"80%"} justifyContent={"center"} alignItems={"center"} initialText={"-"} fill={{r: 0, g: 0, b: 0, a: .1 }} txtProps={{ ...PoppinsWhite, textAlign: "right", fontSize: 25, fill: this.valueColor(v.value()) }} ></RollText>
              </Rect>
            ))
          }
        </Rect>
      </>
    )
  }

  public *update(data: { throw: string; winloss: number }[]) {
    yield* this.reset();
    const valuesArr = data.reduce<Array<number>>((acc, val) => {
      const t = (val.throw.match(/^([2-9]|1[0-2])E?$/) || [])[1];
      if (!t) return acc;
      acc[Number(t) - 2] = val.winloss;
      return acc;
    }, []);

    const newValues = data.reduce<{ data: number, winloss: number }[]>((acc, val) => {
      const t = (val.throw.match(/^([2-9]|1[0-2])E?$/) || [])[1];
      if (!t) return acc;
      acc.push({ data: Number(t) - 2, winloss: val.winloss });
      return acc;
    }, []);

    const newHardValues = data.reduce<{ data: number, winloss: number }[]>((acc, val) => {
      const t = (val.throw.match(/^([2-9]|1[0-2])H$/) || [])[1];
      if (!t || (valuesArr[Number(t) - 2] && valuesArr[Number(t) - 2] === val.winloss) || (!valuesArr[Number(t) - 2] && this.values[Number(t) - 2].value() === val.winloss)) return acc;
      acc.push({ data: Number(t) - 2, winloss: val.winloss });
      return acc;
    },
      []
    );

    yield* sequence(
      0.05,
      ...this.updateValuesGenerators(newValues),
      ...this.updateHardValuesGenerators(newHardValues)
    )
  }

  public valueCellRectAt(diceValue: number): Rect {
    return this.valueCellAt(diceValue).rect
  }

  public hardValueCellRectAt(diceValue: number): Rect{
    return this.hardValueCellAt(diceValue).rect;
  }

  public valueCellTxtAt(diceValue: number): Txt {
    return this.valueCellAt(diceValue).rect.findFirst(is(Txt))
  }

  public hardValueCellTxtAt(diceValue: number): Txt{
    return this.hardValueCellAt(diceValue).rect.findFirst(is(Txt));
  }

  public labelCellRectAt(diceValue: number): Rect {
    return this.labelColumnRect.children()[diceValue - 2] as Rect
  }

  public labelCellTxtAt(diceValue: number): Txt {
    return this.labelCellRectAt(diceValue).findFirst(is(Txt));
  }

  public *highlight(d1: number, d2: number, highlighterProp?: RectProps) {
    const rect = d1 === d2 && this.hardValues[d1 + d2 -2].value() ? this.hardValues[d1 + d2 -2].rect : this.values[d1 + d2 - 2].rect;
    const props = highlighterProp ?? {
      fill: rect.findFirst(is(Txt)).fill(),
      opacity: .1,
    }
    const highlighter = createRef<Rect>();
    rect.add(<Rect ref={highlighter} size={0} layout={false} {...props}></Rect>);
    yield*  highlighter().size(rect.size(), 1).back(1);
    highlighter().remove();
  }

  private valueCellAt(diceValue: number): ValueContainer {
    return this.values[diceValue - 2]
  }

  private hardValueCellAt(diceValue: number): ValueContainer {
    return this.hardValues[diceValue - 2]
  }


  private updateValuesGenerators(data: { data: number; winloss: number }[]): ThreadGenerator[] {
    return data.map(x => this.updateRectGenerator(x.data, x.winloss))
  }
  
  private updateHardValuesGenerators(data: { data: number; winloss: number }[]): ThreadGenerator[] {
    const result = [this.extensionWidth(0, .1)]

    if (!data.length) return result;
    return [
      ...result,
      this.extensionWidth(DEFAULT, .1),
      ...data.map(x => this.updateRectGenerator(x.data, x.winloss, true))
    ]
  }

  private updateRectGenerator(index: number, winloss: number, isHard: boolean = false): ThreadGenerator {
    const val = isHard ? this.hardValues[index] : this.values[index];
    val.value(winloss)
    return val.rect.findFirst(is(RollText)).next(this.formatValue(winloss), Direction.Right, { fill: this.valueColor(winloss) })
  }

  private valueColor(value: number) {
    if (value > 0) return Bright.GREEN;
    if (value < 0) return Bright.RED;
    return Grays.GRAY2
  }

  private formatValue(value: number | string): string {
    if (typeof value == "string") return value;
    
    if (value > 0) return "+" + value.toFixed(0)
    if (value < 0) return value.toFixed(0)
    return "-"
  }

  private *reset() {
    yield* sequence(0.05,
      ...this.values.map(x => x.value(0, .5)),
      ...this.hardValues.map(x => x.value(0, .5)),
      ...this.values.map(x => x.rect.findFirst(is(RollText)).next("-", Direction.Right, { fill: this.valueColor(0) })),
      ...this.hardValues.map(x => x.rect.findFirst(is(RollText)).next("-", Direction.Right, { fill: this.valueColor(0) })),
      this.extensionWidth(0, .1)
    )
  }
}