import { makeRef, range, SignalValue, SimpleSignal } from "@motion-canvas/core";
import { CrapsWinConditionsBase, CrapsWinConditionsBaseProps } from "./CrapsWinConditionsBase";
import { initial, Length, Rect, RectProps, signal, Txt, TxtProps } from "@motion-canvas/2d";
import { RollText } from "../../utils/RollText";
import { grayGradient, Grays, PoppinsWhite } from "../../styles";


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
      offsetY: 1
    });
  }

  addTable(tableProps: RectProps, labelProps: TxtProps): void {
    const txtLabelProps = labelProps ?? this.defaultLabelProps
    this.add(
      <>
        <Rect width={tableProps.width} height={() => this.extensionLength()} layout alignItems={"center"} justifyContent={"center"} zIndex={0}>
          {
            this.hardValues.map((v) => (
              <Rect ref={makeRef(v, "rect")} lineWidth={() => (v.value() ? 1 : 0) * 2} stroke={Grays.GRAY4} fill={grayGradient} height={() => (v.value() ? 1 : 0) * this.extensionLength()} grow={1} width={"100%"} justifyContent={"center"} alignItems={"center"}>
                <RollText justifyContent={"center"} alignItems={"center"} initialText={"-"} fill={grayGradient} txtProps={{ ...PoppinsWhite, textAlign: "right", fontSize: 25, fill: this.valueColor(v.value()) }} ></RollText>
              </Rect>
            ))
          }
        </Rect>
        <Rect {...tableProps} zIndex={1} layout direction={"column"}>
          <Rect width={"100%"} height={this.valueRowHeight} layout >
            {
              this.values.map((v) => (
                <Rect ref={makeRef(v, "rect")} fill={grayGradient} grow={1} width={"100%"} height={"100%"} lineWidth={2} stroke={Grays.GRAY4}>
                  <RollText fill={{ r: 0, g: 0, b: 0, a: .1 }}  justifyContent={"center"} alignItems={"center"} initialText={"-"}  txtProps={{ ...PoppinsWhite, textAlign: "right", fontSize: 25, fill: this.valueColor(v.value()) }} />
                </Rect>
              ))
            }
          </Rect>
          <Rect ref={makeRef(this, "labelBasisRect")} width={"100%"} grow={1} layout>
            {
              range(2, 13).map((key) => (
                <Rect fill={grayGradient} width={"100%"} grow={1} lineWidth={2} stroke={Grays.GRAY4} justifyContent={"center"} alignItems={"center"}>
                  <Txt text={key.toString()} {...txtLabelProps} ></Txt>
                </Rect>
              ))
            }
          </Rect>
        </Rect>
      </>
    );
  }
}
