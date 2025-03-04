import { initial, Layout, LayoutProps, Rect, RectProps, signal, Txt, Node, is } from "@motion-canvas/2d";
import { createSignal, DEFAULT, Direction, makeRef, range, sequence, SignalValue, SimpleSignal, spawn, ThreadGenerator } from "@motion-canvas/core";
import { Bright, grayGradient, Grays, PoppinsWhite } from "../../styles";
import { RollText } from "../../utils/RollText";
import { CircumscribeRect } from "../../utils/Circumscribe";

type ValueContainer = {
   /**
   * Rect component holding each row RollText component
   */
  rect: Rect,

  /**
   * signal value for each row 
   */
  value: SimpleSignal<number>
}

export interface CrapsWinConditionsProps extends LayoutProps {
  tableProps: RectProps;
  extensionWidth?: SignalValue<number>;
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
  public declare readonly extensionWidth: SimpleSignal<number, this>

  constructor(props: CrapsWinConditionsProps) {
    const { tableProps, ...others } = props;
    super({
      ...others,
      layout: true,
      gap: 2,
      offsetX: -1
    });

    this.extensionWidth(0);
    createSignal()

    this.add(
      <>
        <Rect {...tableProps} zIndex={1}>
          <Rect width={"30%"} height={"100%"} layout direction={"column"}>
            {
              range(2, 13).map((key) => (
                <Rect fill={grayGradient} width={"100%"} grow={1} lineWidth={2} stroke={Grays.GRAY4} justifyContent={"center"} alignItems={"center"}>
                  <Txt text={key.toString()} alignSelf={"center"} textAlign={"center"}{...PoppinsWhite} fontSize={25} ></Txt>
                </Rect>
              ))
            }
          </Rect>
          <Rect width={"70%"} height={"100%"} layout direction={"column"}>
            {
              this.values.map((v) => (
                <Rect ref={makeRef(v, "rect")} fill={grayGradient} grow={1} width={"100%"} height={"100%"} lineWidth={2} stroke={Grays.GRAY4} justifyContent={"end"} alignItems={"center"} padding={10}>
                  <RollText layout width={"100%"} height={"100%"} justifyContent={"center"} alignItems={"center"} initialText={"-"} fill={grayGradient} txtProps={{ ...PoppinsWhite, textAlign: "right", fontSize: 25, fill: this.valueColor(v.value()) }} />
                </Rect>
              ))
            }
          </Rect>
        </Rect>
        <Rect width={() => this.extensionWidth()} height={tableProps.height} layout direction={"column"} alignItems={"center"} justifyContent={"center"} zIndex={0}>
          {
            this.hardValues.map((v) => (
              <Rect ref={makeRef(v, "rect")} lineWidth={() => (v.value() ? 1 : 0) * 2 } stroke={Grays.GRAY4} fill={grayGradient} grow={1} width={() => (v.value() ? 1 : 0) * this.extensionWidth()} justifyContent={"center"} alignItems={"center"}>
                <RollText layout width={"80%"} height={"80%"} justifyContent={"center"} alignItems={"center"} initialText={"-"} fill={grayGradient} txtProps={{ ...PoppinsWhite, textAlign: "right", fontSize: 25, fill: this.valueColor(v.value()) }} ></RollText>
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

  public *highlight(d1: number, d2: number) {
    const rect = d1 === d2 && this.hardValues[d1 + d2 -2].value() ? this.hardValues[d1 + d2 -2].rect : this.values[d1 + d2 - 2].rect;
    rect.zIndex(1);
    rect.parent().zIndex(1);
    yield* rect.scale(1.3, .2);
    yield* CircumscribeRect(rect.findFirst(is(RollText)), Bright.YELLOW, 0.95, 10, 1);
    yield* rect.scale(1, .2);
    rect.zIndex(0);
    rect.parent().zIndex(0);
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