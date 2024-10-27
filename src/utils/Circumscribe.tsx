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

import { Circle, Layout, Rect, Node, is } from "@motion-canvas/2d";
import {
  all,
  PossibleColor,
  SignalValue,
  unwrap,
  useLogger,
  waitFor,
} from "@motion-canvas/core";

export function* CircumscribeRect(
  nodeOrRef: SignalValue<Layout>,
  color: PossibleColor,
  scale: number = 1.1,
  lineWidth: number = 5,
  holdSecs: number = 0
) {
  const node = unwrap(nodeOrRef);
  const rect = new Rect({
    layout: false,
    lineWidth: lineWidth,
    stroke: color,
    end: 0,
    position: node.position,
  });
  const width = node.cacheBBox().width;
  const height = node.cacheBBox().height;
  rect.width(width * scale);
  rect.height(height * scale);
  const parent = node.findAncestor(is(Node));
  if (parent === null) {
    useLogger().debug("Returning");
    return;
  }
  parent.add(rect);
  rect.moveAbove(node);
  yield* rect.end(1, 1);
  yield* waitFor(holdSecs);
  yield* rect.start(1, 1);
  rect.remove();
}

export function* CircumscribeCircle(
  nodeOrRef: SignalValue<Layout>,
  color: PossibleColor,
  lineWidth: number = 10,
  scale: number = 1,
  drawSecs: number = 2, // Will be divided by 2 for draw on and draw off
  holdSecs: number = 0.1
) {
  const node = unwrap(nodeOrRef);
  const circle = new Circle({
    layout: false,
    lineWidth: lineWidth,
    stroke: color,
    end: 0,
    position: node.position,
  });
  const width = node.cacheBBox().width;
  const height = node.cacheBBox().height;
  circle.width(width * scale);
  circle.height(height * scale);
  const parent = node.findAncestor(is(Node));
  if (parent === null) {
    return;
  }
  parent.add(circle);
  circle.moveAbove(node);
  yield* all(circle.end(1, drawSecs / 2.0), circle.rotation(360, drawSecs / 2));
  yield* waitFor(holdSecs);
  yield* all(circle.start(1, drawSecs / 2.0));
  circle.remove();
}
