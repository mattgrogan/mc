import { all, createRef, delay, Direction, InterpolationFunction, makeRef, range, SignalValue, SimpleSignal, ThreadGenerator, TimingFunction, unwrap, Vector2 } from "@motion-canvas/core";
import { CrapsWinConditionsBase, CrapsWinConditionsBaseProps } from "./CrapsWinConditionsBase";
import { initial, is, Length, Rect, RectProps, signal, Txt, TxtProps } from "@motion-canvas/2d";
import { RollText } from "../../utils/RollText";
import { grayGradient, Grays } from "../../styles";


export interface CrapsWinConditionsHorizontalProps extends CrapsWinConditionsBaseProps {
  valueRowHeight?: SignalValue<Length>;
}

export class CrapsWinConditionsHorizontal extends CrapsWinConditionsBase {
  /*
  * Height of the values row
  */
  @initial(100)
  @signal()
  public declare readonly valueRowHeight: SimpleSignal<Length, this>;


  constructor(props: CrapsWinConditionsHorizontalProps) {
    super({
      ...props,
      direction: "column",
      easyAnimationDirection: props.easyAnimationDirection ?? Direction.Top,
      hardAnimationDirection: props.hardAnimationDirection ?? Direction.Right,
      offsetY: -1
    });
  }


  protected generatorForCellUpdate(index: number, winloss: number, isHard: boolean = false): ThreadGenerator {
    const val = isHard ? this.hardValues[index] : this.values[index];
    val.value(winloss);
    if (isHard) {
      const length = winloss ? this.extensionLength() : 0
      return all(
        delay(0.15, val.rect.findFirst(is(RollText)).next(this.formatValue(winloss), this.hardAnimationDirection(), { fill: this.valueColor(winloss) })),
        val.rect.height(length, .5)
      )
    }

    return val.rect.findFirst(is(RollText)).next(this.formatValue(winloss), this.easyAnimationDirection(), { fill: this.valueColor(winloss) });
  }

  addTable(tableProps: RectProps, labelProps: TxtProps, labelCellRectProps: RectProps, easyValueTxtProp: TxtProps, hardValueTxtProp: TxtProps, easyCellRectProps: RectProps, hardCellRectProps: RectProps): void {
    labelProps = labelProps ?? this.defaultLabelProps;
    easyValueTxtProp = easyValueTxtProp ?? this.defaultValueTxtProps;
    hardValueTxtProp = hardValueTxtProp ?? this.defaultValueTxtProps;
    hardCellRectProps = hardCellRectProps ?? this.defaultCellRectProps;
    easyCellRectProps = easyCellRectProps ?? this.defaultCellRectProps;

    this.add(
      <>
        <Rect {...tableProps} zIndex={1} layout direction={"column"}>
          <Rect ref={makeRef(this, "labelBasisRect")} width={"100%"} grow={1} layout>
            {
              range(2, 13).map((key) => (
                <Rect fill={grayGradient} width={"100%"} grow={1} lineWidth={3} stroke={Grays.GRAY4} justifyContent={"center"} alignItems={"center"}>
                  <Txt text={key.toString()} {...labelProps} ></Txt>
                </Rect>
              ))
            }
          </Rect>
          <Rect width={"100%"} height={this.valueRowHeight} layout >
            {
              this.values.map((v) => (
                <Rect ref={makeRef(v, "rect")} grow={1} width={"100%"} height={"100%"}>
                  <RollText {...easyCellRectProps} initialText={"-"} txtProps={{ ...easyValueTxtProp, fill: easyValueTxtProp.fill ?? this.valueColor(v.value()) }} />
                </Rect>
              ))
            }
          </Rect>
        </Rect>
        <Rect width={tableProps.width} height={() => this.extensionLength()} layout alignItems={"start"} justifyContent={"center"} zIndex={0}>
          {
            this.hardValues.map((v) => (
              <Rect ref={makeRef(v, "rect")} height={0} grow={1} width={"100%"} justifyContent={"end"} alignItems={"center"}>
                <RollText {...hardCellRectProps} lineWidth={() => (v.value() ? 1 : 0) * unwrap(hardCellRectProps.lineWidth)} justifyContent={"center"} alignItems={"center"} initialText={"-"} txtProps={{ ...hardValueTxtProp, fill: hardValueTxtProp.fill ?? this.valueColor(v.value()) }}  ></RollText>
              </Rect>
            ))
          }
        </Rect>
      </>
    );
  }

  protected *highlightCell(cell: Rect, props?: RectProps, time?: number, timingFunction?: TimingFunction, interpolationFunction?: InterpolationFunction<Vector2, any[]>): ThreadGenerator {
    props = props ?? {
      fill: cell.findFirst(is(Txt)).fill(),
      opacity: .1,
    } as RectProps
    time = time ?? 1
    const highlighter = createRef<Rect>();
    cell.findFirst(is(Rect)).add(<Rect zIndex={-1} ref={highlighter} size={0} layout={false} {...props}></Rect>);
    yield* highlighter().size(cell.size(), time, timingFunction, interpolationFunction).back(time, timingFunction, interpolationFunction);
    highlighter().remove();
  }
}
