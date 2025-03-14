import { Rect, RectProps, Txt, Length, initial, signal, TxtProps } from "@motion-canvas/2d";
import { makeRef, range, SignalValue, SimpleSignal } from "@motion-canvas/core";
import { grayGradient, Grays, PoppinsWhite } from "../../styles";
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
      offsetX: -1
    });
  }


  addTable(tableProps: RectProps, labelProps: TxtProps): void {
    const txtLabelProps = labelProps ?? this.defaultLabelProps

    this.add(
      <>
        <Rect {...tableProps} zIndex={1}>
          <Rect ref={makeRef(this, "labelBasisRect")} grow={1} height={"100%"} layout direction={"column"}>
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
                <Rect ref={makeRef(v, "rect")} fill={grayGradient} grow={1} width={"100%"} height={"100%"} lineWidth={2} stroke={Grays.GRAY4}>
                  <RollText justifyContent={"center"} alignItems={"center"} initialText={"-"} fill={{ r: 0, g: 0, b: 0, a: .1 }} txtProps={{ ...PoppinsWhite, textAlign: "right", fontSize: 25, fill: this.valueColor(v.value()) }} />
                </Rect>
              ))
            }
          </Rect>
        </Rect>
        <Rect width={() => this.extensionLength()} height={tableProps.height} layout direction={"column"} alignItems={"center"} justifyContent={"center"} zIndex={0}>
          {
            this.hardValues.map((v) => (
              <Rect layout ref={makeRef(v, "rect")} lineWidth={() => (v.value() ? 1 : 0) * 2} stroke={Grays.GRAY4} fill={grayGradient} grow={1} width={() => (v.value() ? 1 : 0) * this.extensionLength()} height={"100%"}>
                <RollText justifyContent={"center"} alignItems={"center"} initialText={"-"} fill={{ r: 0, g: 0, b: 0, a: .1 }} txtProps={{ ...PoppinsWhite, textAlign: "right", fontSize: 25, fill: this.valueColor(v.value()) }} ></RollText>
              </Rect>
            ))
          }
        </Rect>
      </>
    );
  }
}