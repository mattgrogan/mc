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

import { Node } from "@motion-canvas/2d";
import {
  easeInOutCubic,
  SignalValue,
  TimingFunction,
  unwrap,
  Vector2,
} from "@motion-canvas/core";

export function* Indicate(
  nodeOrRef: SignalValue<Node>,
  scale: number = 2,
  hold: number = 0.1,
  seconds: number = 0.6,
  ease: TimingFunction = easeInOutCubic
) {
  const node = unwrap(nodeOrRef);
  const originalScale = node.scale();
  const tempScale = originalScale.mul(new Vector2(scale, scale));
  yield* node
    .scale(tempScale, seconds / 2, ease)
    .wait(hold)
    .to(originalScale, seconds / 2, ease);
}
