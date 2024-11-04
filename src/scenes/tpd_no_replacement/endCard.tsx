import { Icon, Img, Layout, makeScene2D, Rect, Txt } from "@motion-canvas/2d";
import {
  createRef,
  createRefArray,
  Direction,
  easeInCubic,
  easeInOutCubic,
  easeOutBounce,
  easeOutCubic,
  linear,
  slideTransition,
  waitFor,
  waitUntil,
} from "@motion-canvas/core";

import logo from "../../../assets/Logo/DiceDataLogo_NoBG.png";

import { FadeIn } from "../../utils/FadeIn";
import { FadeOut } from "../../utils/FadeOut";
import { Bright, Theme, PoppinsWhite, Grays } from "../../styles";

const producers = ["Billy Do Bob", "Kevin Osborn", "Mike Jacobs"];

export default makeScene2D(function* (view) {
  view.fill(Theme.BG);
  const container = createRef<Layout>();
  const producerContainer = createRef<Layout>();
  const title = createRef<Txt>();
  const rect = createRef<Rect>();
  const pointer = createRef<Icon>();

  view.add(
    <Layout ref={container}>
      <Txt
        ref={title}
        {...PoppinsWhite}
        opacity={1}
        x={400}
        y={-400}
        fontWeight={500}
        fontSize={100}
        opacity={0}
      >
        WATCH NEXT
      </Txt>
      <Rect
        ref={rect}
        width={800}
        height={600}
        stroke={Bright.WHITE}
        fill={Grays.GRAY4}
        lineWidth={2}
        x={400}
        scale={0}
      ></Rect>
      {/* <Img
        src={logo}
        scale={1}
        position={[-550, -300]}
      />
      <Rect
        ref={rect}
        lineWidth={10}
        stroke={Bright.YELLOW}
        width={900}
        height={550}
        position={[350, 100]}
        end={0}
      />
      <Icon
        icon={"mdi:hand-pointing-right"}
        ref={pointer}
        scale={25}
        color={Bright.YELLOW}
        x={-400}
        y={100}
        opacity={0}
      /> */}
      <Layout
        layout
        ref={producerContainer}
        direction={"column"}
        gap={70}
        x={-850}
        y={560}
        offset={[-1, -1]}
      >
        <Layout
          direction={"column"}
          gap={20}
        >
          <Txt
            {...PoppinsWhite}
            fontSize={40}
            text={"This video was made possible by"}
          ></Txt>
          <Txt
            {...PoppinsWhite}
            fontSize={40}
            text={"the generous support of these Patrons."}
          ></Txt>
        </Layout>
        <Rect
          width={600}
          height={2}
          fill={"#2191fb"}
        >
          {" "}
        </Rect>
      </Layout>
    </Layout>
  );

  yield* slideTransition(Direction.Right);

  yield* waitFor(1);
  yield* rect().scale(1, 1, easeOutBounce);
  yield* waitFor(0.5);
  yield* FadeIn(title, 1, easeOutCubic, [0, -100]);
  //   yield* FadeIn(title, 1.5, easeOutCubic, [0, -100]);
  //   yield* rect().end(1, 1, easeInOutCubic);
  //   yield* FadeIn(pointer, 1, easeOutBounce, [-200, 0]);
  //   yield* waitFor(1);
  //   yield* pointer().rotation(360 * 3, 2, easeInOutCubic);

  for (const producer of producers) {
    const pTxt = new Txt({ ...PoppinsWhite, text: producer });
    producerContainer().add(pTxt);
  }

  yield* producerContainer().y(
    -560 + producerContainer().height() * -1,
    20,
    linear
  );

  yield* waitFor(10);
  yield* waitUntil("end");
});
