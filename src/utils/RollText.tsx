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
  initial,
  Rect,
  RectProps,
  signal,
  Txt,
  TxtProps,
} from "@motion-canvas/2d";
import {
  all,
  createRef,
  Direction,
  easeInOutCubic,
  SignalValue,
  SimpleSignal,
  useLogger,
  Vector2,
} from "@motion-canvas/core";
import { FadeIn } from "./FadeIn";
import { FadeOut } from "./FadeOut";

export interface RollTextProps extends RectProps {
  initialText?: SignalValue<string>;
  txtProps?: TxtProps;
  seconds?: SignalValue<number>;
}

export class RollText extends Rect {
  @initial("")
  @signal()
  private declare readonly initialText: SimpleSignal<string, this>;
  @signal()
  public declare readonly txtProps: SimpleSignal<TxtProps>;
  @initial(0.4)
  @signal()
  public declare readonly seconds: SimpleSignal<number, this>;

  private declare txtField: Txt;

  public constructor(props?: RollTextProps) {
    super({
      layout: false,
      clip: true,
      ...props,
    });

    if (this.width() == 0 || this.height() == 0) {
      const logger = useLogger();
      logger.warn("Reminder: set size on RollText to make it visible.");
    }

    this.txtField = new Txt({
      text: this.initialText(),
      ...this.txtProps(),
    });
    this.add(this.txtField);
  }

  public *next(
    text: string,
    from: Direction | boolean = Direction.Bottom,
    props: TxtProps = {}
  ) {
    const nextTxt = new Txt({
      layout: false,
      text: text,
      opacity: 0,
      ...this.txtProps(),
      ...props,
    });
    this.add(nextTxt);

    let fadeOutTo = Vector2.zero;
    let fadeInFrom = Vector2.zero;

    switch (from) {
      case Direction.Bottom: {
        fadeOutTo = fadeOutTo.addY((this.height() / 2) * -1);
        fadeInFrom = fadeInFrom.addY(this.height() / 2);
        break;
      }
      case Direction.Top: {
        fadeOutTo = fadeOutTo.addY(this.height() / 2);
        fadeInFrom = fadeInFrom.addY((this.height() / 2) * -1);
        break;
      }
      case Direction.Right: {
        fadeOutTo = fadeOutTo.addX((this.width() / 2) * -1);
        fadeInFrom = fadeInFrom.addX(this.width() / 2);
        break;
      }
      case Direction.Left: {
        fadeOutTo = fadeOutTo.addX(this.width() / 2);
        fadeInFrom = fadeInFrom.addX((this.width() / 2) * -1);
        break;
      }
    }

    yield* all(
      FadeOut(this.txtField, this.seconds(), easeInOutCubic, fadeOutTo),
      FadeIn(nextTxt, this.seconds(), easeInOutCubic, fadeInFrom)
    );
    this.txtField.remove();
    this.txtField = nextTxt;
  }
}
