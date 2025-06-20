import {
  all,
  createRef,
  delay,
  Direction,
  InterpolationFunction,
  makeRef,
  range,
  SignalValue,
  SimpleSignal,
  ThreadGenerator,
  TimingFunction,
  unwrap,
  Vector2,
} from "@motion-canvas/core";
import {
  CrapsWinConditionsBase,
  CrapsWinConditionsBaseProps,
} from "./CrapsWinConditionsBase";
import {
  initial,
  is,
  Length,
  Rect,
  RectProps,
  signal,
  Txt,
  TxtProps,
} from "@motion-canvas/2d";
import { RollText } from "../../utils/RollText";
import { grayGradient, Grays } from "../../styles";

export interface CrapsWinConditionsHorizontalProps
  extends CrapsWinConditionsBaseProps {
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
      offsetY: -1,
    });
  }

  protected generatorForCellUpdate(
    index: number,
    winloss: number,
    isHard: boolean = false
  ): ThreadGenerator {
    const val = isHard ? this.hardValues[index] : this.values[index];
    val.value(winloss);

    if (isHard) {
      const length = winloss ? this.extensionLength() : 0;

      // Skip animation for zero values
      if (winloss === 0) {
        const rollText = val.rect.findFirst(is(RollText));
        rollText.next("-", this.hardAnimationDirection(), {
          fill: this.valueColor(winloss),
        });
        return val.rect.height(length, 0.1); // Very fast height animation
      }

      return all(
        delay(
          0.1,
          val.rect
            .findFirst(is(RollText))
            .next(this.formatValue(winloss), this.hardAnimationDirection(), {
              fill: this.valueColor(winloss),
            })
        ),
        val.rect.height(length, 0.3) // Reduced from .5 to .3
      );
    }

    // Easy values optimization
    const rollText = val.rect.findFirst(is(RollText));

    // Skip animation for zero values
    if (winloss === 0) {
      return rollText.next("-", this.easyAnimationDirection(), {
        fill: this.valueColor(winloss),
      });
    }

    // Reduced delay for non-zero values
    return delay(
      0.05,
      rollText.next(this.formatValue(winloss), this.easyAnimationDirection(), {
        fill: this.valueColor(winloss),
      })
    );
  }

  addTable(
    tableProps: RectProps,
    labelProps: TxtProps,
    labelCellRectProps: RectProps,
    easyValueTxtProp: TxtProps,
    hardValueTxtProp: TxtProps,
    easyCellRectProps: RectProps,
    hardCellRectProps: RectProps
  ): void {
    labelProps = labelProps ?? this.defaultLabelProps;
    easyValueTxtProp = easyValueTxtProp ?? this.defaultValueTxtProps;
    hardValueTxtProp = hardValueTxtProp ?? this.defaultValueTxtProps;
    hardCellRectProps = hardCellRectProps ?? this.defaultCellRectProps;
    easyCellRectProps = easyCellRectProps ?? this.defaultCellRectProps;

    this.add(
      <>
        <Rect
          {...tableProps}
          zIndex={1}
          layout
          direction={"column"}
        >
          <Rect
            ref={makeRef(this, "labelBasisRect")}
            width={"100%"}
            grow={1}
            layout
          >
            {range(2, 13).map((key) => (
              <Rect
                fill={grayGradient}
                width={"100%"}
                grow={1}
                lineWidth={3}
                stroke={Grays.GRAY4}
                justifyContent={"center"}
                alignItems={"center"}
              >
                <Txt
                  text={key.toString()}
                  {...labelProps}
                ></Txt>
              </Rect>
            ))}
          </Rect>
          <Rect
            width={"100%"}
            height={this.valueRowHeight}
            layout
          >
            {this.values.map((v) => (
              <Rect
                ref={makeRef(v, "rect")}
                grow={1}
                width={"100%"}
                height={"100%"}
              >
                <RollText
                  {...easyCellRectProps}
                  initialText={"-"}
                  txtProps={{
                    ...easyValueTxtProp,
                    fill: easyValueTxtProp.fill ?? this.valueColor(v.value()),
                  }}
                  skipAnimationWhenZero={true}
                  seconds={0.2} // Reduced from default
                />
              </Rect>
            ))}
          </Rect>
        </Rect>
        <Rect
          width={tableProps.width}
          height={() => this.extensionLength()}
          layout
          alignItems={"start"}
          justifyContent={"center"}
          zIndex={0}
        >
          {this.hardValues.map((v) => (
            <Rect
              ref={makeRef(v, "rect")}
              height={0}
              grow={1}
              width={"100%"}
              justifyContent={"end"}
              alignItems={"center"}
            >
              <RollText
                {...hardCellRectProps}
                lineWidth={() =>
                  (v.value() ? 1 : 0) * unwrap(hardCellRectProps.lineWidth)
                }
                justifyContent={"center"}
                alignItems={"center"}
                initialText={"-"}
                txtProps={{
                  ...hardValueTxtProp,
                  fill: hardValueTxtProp.fill ?? this.valueColor(v.value()),
                }}
                skipAnimationWhenZero={true}
                seconds={0.2} // Reduced from default
              />
            </Rect>
          ))}
        </Rect>
      </>
    );
  }

  protected *highlightCell(
    cell: Rect,
    props?: RectProps,
    time?: number,
    timingFunction?: TimingFunction,
    interpolationFunction?: InterpolationFunction<Vector2, any[]>
  ): ThreadGenerator {
    props =
      props ??
      ({
        fill: cell.findFirst(is(Txt)).fill(),
        opacity: 0.1,
      } as RectProps);
    time = time ?? 0.5; // Reduced from 1 to 0.5
    const highlighter = createRef<Rect>();
    cell.findFirst(is(Rect)).add(
      <Rect
        zIndex={-1}
        ref={highlighter}
        size={0}
        layout={false}
        {...props}
      ></Rect>
    );
    yield* highlighter()
      .size(cell.size(), time, timingFunction, interpolationFunction)
      .back(time, timingFunction, interpolationFunction);
    highlighter().remove();
  }
}
