/*
MIT License

Copyright (c) 2024 Matthew Grogan

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

import {
  Circle,
  colorSignal,
  initial,
  Layout,
  LayoutProps,
  Rect,
  signal,
} from "@motion-canvas/2d";
import {
  all,
  ColorSignal,
  easeInQuint,
  easeOutQuint,
  PossibleColor,
  PossibleVector2,
  SignalValue,
  SimpleSignal,
  TimingFunction,
  Vector2,
} from "@motion-canvas/core";

export interface SpotlightProps extends LayoutProps {
  radius?: SignalValue<number>;
  shadowOpacity?: SignalValue<number>;
  shadowColor?: SignalValue<PossibleColor>;
  moveTo?: SignalValue<PossibleVector2>;
}

// This should be big enough to cover the
// entire screen.
const BIG_RADIUS = 4000;

export class Spotlight extends Layout {
  // Radius of the spotlight
  @initial(BIG_RADIUS)
  @signal()
  public declare readonly radius: SimpleSignal<number, this>;

  // Opacity of the fill that isn't in the spotlight
  @initial(0.8)
  @signal()
  public declare readonly shadowOpacity: SimpleSignal<number, this>;

  // Color of the fill that isn't in the spotlight
  @initial("#000")
  @colorSignal()
  public declare readonly shadowColor: ColorSignal<this>;

  // Location of the spotlight
  @initial(new Vector2(0, 0))
  @signal()
  public declare readonly moveTo: SimpleSignal<PossibleVector2, this>;

  private declare readonly mask: Circle;

  public constructor(props?: SpotlightProps) {
    super({
      layout: false,
      cache: true,
      ...props,
    });

    this.mask = new Circle({
      width: () => this.radius(),
      height: () => this.radius(),
      fill: "#fff",
      position: () => this.moveTo(),
    });

    this.add(this.mask);
    this.add(
      <Rect
        width={"100%"}
        height={"100%"}
        fill={() => this.shadowColor()}
        opacity={() => this.shadowOpacity()}
        compositeOperation={"source-out"}
      ></Rect>
    );
  }

  public *turnOn(
    where: PossibleVector2,
    radius: number,
    seconds: number = 1,
    ease: TimingFunction = easeOutQuint
  ) {
    yield* all(
      this.radius(radius, seconds, ease),
      this.moveTo(where, seconds, ease)
    );
  }

  public *turnOff(seconds: number = 1, ease: TimingFunction = easeInQuint) {
    yield* all(this.radius(BIG_RADIUS, seconds, ease));
  }
}
