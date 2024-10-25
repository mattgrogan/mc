import { Circle, CircleProps, Txt } from "@motion-canvas/2d";
import {
  all,
  createRef,
  easeInOutCubic,
  TimingFunction,
} from "@motion-canvas/core";

export interface CrapsPuckProps extends CircleProps {}

export class CrapsPuck extends Circle {
  private isOn: boolean = false;
  private readonly puck = createRef<Circle>();
  private readonly puckTxt = createRef<Txt>();

  public constructor(props?: CrapsPuckProps) {
    super({
      ...props,
    });

    this.add(
      <Circle
        ref={this.puck}
        fill={"black"}
        width={100}
        height={100}
        stroke={"white"}
        lineWidth={4}
        shadowColor={"black"}
        shadowBlur={5}
        shadowOffsetX={5}
        shadowOffsetY={5}
      >
        <Txt
          ref={this.puckTxt}
          fill={"white"}
          fontWeight={700}
          scale={0.8}
        >
          OFF
        </Txt>
      </Circle>
    );
  }

  public *flip(seconds: number = 0.6, ease: TimingFunction = easeInOutCubic) {
    this.isOn = !this.isOn;
    const fill = this.isOn ? "#fff" : "#000";
    const stroke = this.isOn ? "#000" : "#fff";
    const txtFill = this.isOn ? "#000" : "fff";
    const label = this.isOn ? "ON" : "OFF";

    yield* all(
      this.puck().fill(fill, seconds, ease),
      this.puck().stroke(stroke, seconds, ease),
      this.puckTxt().fill(txtFill, seconds, ease),
      this.puckTxt().text(label, seconds, ease)
    );
  }
}
