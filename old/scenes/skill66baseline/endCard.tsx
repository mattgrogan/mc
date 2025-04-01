import { Layout, makeScene2D, Rect, Txt } from "@motion-canvas/2d";
import {
  createRef,
  Direction,
  easeOutBounce,
  easeOutCubic,
  linear,
  slideTransition,
  Vector2,
  waitFor,
  waitUntil,
} from "@motion-canvas/core";

import { Bright, Grays, PoppinsWhite, Theme } from "../../styles";
import { FadeIn } from "../../utils/FadeIn";

const producers = [
  "Billy Do Bob",
  "Kevin Osborn",
  "Mike Jacobs",
  "CaseAdams",
  "Matthew Boley",
  "Ross Allanson",
];

export default makeScene2D(function* (view) {
  view.fill(Theme.BG);
  const container = createRef<Layout>();
  const producerContainer = createRef<Layout>();
  const title = createRef<Txt>();
  const rect = createRef<Rect>();

  view.add(
    <Layout ref={container}>
      <Txt
        ref={title}
        {...PoppinsWhite}
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

  for (const producer of producers) {
    const pTxt = new Txt({ ...PoppinsWhite, text: producer });
    producerContainer().add(pTxt);
  }
  producerContainer().add(
    <Rect
      width={600}
      height={2}
      fill={"#2191fb"}
    >
      {" "}
    </Rect>
  );

  producerContainer().add(
    <Layout
      direction={"column"}
      gap={20}
    >
      <Txt
        {...PoppinsWhite}
        fontSize={40}
        text={"Get more from DiceData!"}
      ></Txt>
      <Txt
        {...PoppinsWhite}
        fontSize={40}
        text={"Access behind-the-scenes videos,"}
      ></Txt>
      <Txt
        {...PoppinsWhite}
        fontSize={40}
        text={"swag, and support the channel at"}
      ></Txt>
      <Txt
        {...PoppinsWhite}
        fontSize={40}
        fill={Bright.YELLOW}
        text={"https://dicedata.info."}
      ></Txt>
      <Txt
        {...PoppinsWhite}
        fontSize={100}
        marginTop={50}
        fill={Bright.BLUE}
      >
        Thank <Txt fontWeight={900}>You</Txt>
      </Txt>
    </Layout>
  );

  producerContainer().moveOffset(new Vector2(-1, 1));

  yield* producerContainer().y(-560, 15, linear);

  yield* waitFor(2);
  yield* waitUntil("end");
});
