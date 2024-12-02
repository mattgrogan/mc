import { Circle, makeScene2D, Rect, Txt } from "@motion-canvas/2d";
import { createRef, waitFor } from "@motion-canvas/core";
import { CoordinateSystem } from "./CoordinateSystem";

export default makeScene2D(function* (view) {
  // Create your animations here

  view.fill("#2c2c2c");

  const circle = createRef<Circle>()
  const label = createRef<Txt>()
  const label2 = createRef<Txt>()
  const rect = createRef<Rect>()



  view.add(
    <Circle
    ref={circle}
      width={10}
      height={10}
      position={[100, 100]}
      fill={"white"}
    />
  );

  view.add(
    <Txt ref={label} text={() => circle().position().toString()} position={() => circle().position()} fontSize={30} fill={"white"} offset={[-1.2, 1.2]}/>
  )
  view.add(
    <Txt ref={label2} text={() => circle().absolutePosition().toString()} position={() => circle().position()} fontSize={30} fill={"white"} offset={[1.2, -1.2]}/>
  )

  // absolutePositions get things to stick to each other when they
  // have different parents.
  label2().absolutePosition(() => circle().absolutePosition())

  yield* waitFor(1)
  yield* circle().position([200, 200], 1)
  yield* waitFor(1)

  view.add(<Rect ref={rect} size={[500, 500]} fill={"#555"} opacity={0.2}></Rect>)
  circle().reparent(rect())
  label().reparent(rect())
  yield* waitFor(1)
  yield* rect().position([-200, -200], 1)
  yield* waitFor(1)
  yield* circle().position([0, 0], 1)

  const circle2 = createRef<Circle>()
  view.add(<Circle ref={circle2} position={[-100, 100]} size={20} opacity={0.5} fill={"skyblue"}/>)

  yield* waitFor(1)
  // Goal: get the blue circle on top of the white circle
  yield* circle2().absolutePosition(() => circle().position().transformAsPoint(circle().localToWorld()), 1)
  // ok. so me().localToWorld() will get my local position into world coordinates
  
  yield* waitFor(1)
  yield* circle2().position([0, 0], 1)

  // Goal: get the gray circle (the child of the box) on top of the blue circle
  yield* circle().position(circle2().absolutePosition().transformAsPoint(circle().worldToLocal()), 1)





  yield* waitFor(10);
});
