import { Rect, RectProps, Txt, Length, initial, signal, TxtProps, is } from "@motion-canvas/2d";
import { all, delay, Direction, makeRef, range, SignalValue, SimpleSignal, ThreadGenerator, unwrap } from "@motion-canvas/core";
import { grayGradient, Grays } from "../../styles";
import { RollText } from "../../utils/RollText";
import { CrapsWinConditionsBase, CrapsWinConditionsBaseProps } from "./CrapsWinConditionsBase";


export interface CrapsWinConditionsProps extends CrapsWinConditionsBaseProps {
  valueColumnWidth?: SignalValue<Length>;
}

export class CrapsWinConditions extends CrapsWinConditionsBase {
  /*
  * Width of the values column
  */
  @initial(100)
  @signal()
  public declare readonly valueColumnWidth: SimpleSignal<Length, this>;

  public constructor(props?: CrapsWinConditionsProps) {
    super({
      ...props,
      easyAnimationDirection: props.easyAnimationDirection ?? Direction.Left,
      hardAnimationDirection: props.hardAnimationDirection ?? Direction.Right,
      offsetX: -1
    });
  }

  protected generatorForCellUpdate(index: number, winloss: number, isHard: boolean = false): ThreadGenerator {
    const val = isHard ? this.hardValues[index] : this.values[index];
    val.value(winloss);
    if (isHard) {
      const length = winloss ? this.extensionLength() : 0
      return all(
        delay(0.15, val.rect.findFirst(is(RollText)).next(this.formatValue(winloss), this.hardAnimationDirection(), { fill: this.valueColor(winloss) })),
        val.rect.width(length, .5)
      )
    }

    return val.rect.findFirst(is(RollText)).next(this.formatValue(winloss), this.easyAnimationDirection(), { fill: this.valueColor(winloss) });
  }

  addTable(tableProps: RectProps, labelProps: TxtProps, labelCellRectProps: RectProps, easyValueTxtProp: TxtProps, hardValueTxtProp: TxtProps, easyCellRectProps: RectProps, hardCellRectProps: RectProps): void {
    labelProps = labelProps ?? this.defaultLabelProps;
    labelCellRectProps = labelCellRectProps ?? this.defaultCellRectProps;
    easyValueTxtProp = easyValueTxtProp ?? this.defaultValueTxtProps;
    hardValueTxtProp = hardValueTxtProp ?? this.defaultValueTxtProps;
    hardCellRectProps = hardCellRectProps ?? this.defaultCellRectProps;
    easyCellRectProps = easyCellRectProps ?? this.defaultCellRectProps;

    this.add(
      <>
        <Rect {...tableProps} zIndex={1}>
          <Rect ref={makeRef(this, "labelBasisRect")} grow={1} height={"100%"} layout direction={"column"}>
            {
              range(2, 13).map((key) => (
                <Rect {...labelCellRectProps} width={"100%"} height={"100%"} grow={1} justifyContent={"center"} alignItems={"center"}>
                  <Txt {...labelProps} text={key.toString()}></Txt>
                </Rect>
              ))
            }
          </Rect>
          <Rect width={this.valueColumnWidth} height={"100%"} layout direction={"column"}>
            {
              this.values.map((v) => (
                <Rect ref={makeRef(v, "rect")} grow={1} width={"100%"} height={"100%"}>
                  <RollText {...easyCellRectProps} justifyContent={"center"} alignItems={"center"} initialText={"-"} txtProps={{ ...easyValueTxtProp, fill: easyValueTxtProp.fill ?? this.valueColor(v.value()) }} />
                </Rect>
              ))
            }
          </Rect>
        </Rect>
        <Rect width={() => this.extensionLength()} height={tableProps.height} layout direction={"column"} alignItems={"start"} justifyContent={"center"} zIndex={0}>
          {
            this.hardValues.map((v) => (
              <Rect layout ref={makeRef(v, "rect")} lineWidth={() => (v.value() ? 1 : 0) * 2} stroke={Grays.GRAY4} fill={grayGradient} grow={1} width={0} height={"100%"}>
                <RollText {...hardCellRectProps} lineWidth={() => (v.value() ? 1 : 0) * unwrap(hardCellRectProps.lineWidth)} justifyContent={"center"} alignItems={"center"} initialText={"-"} txtProps={{ ...hardValueTxtProp, fill: hardValueTxtProp.fill ?? this.valueColor(v.value()) }} ></RollText>
              </Rect>
            ))
          }
        </Rect>
      </>
    );
  }
}
