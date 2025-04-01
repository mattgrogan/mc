import { Circle, Img, Layout, makeScene2D, Rect, Txt } from "@motion-canvas/2d";
import {
  all,
  createRef,
  createRefArray,
  createRefMap,
  delay,
  Direction,
  easeInOutExpo,
  easeOutBounce,
  easeOutElastic,
  linear,
  range,
  sequence,
  slideTransition,
  Vector2,
  waitFor,
  waitUntil,
} from "@motion-canvas/core";

import chip15Png from "../../../assets/Chips/Chip_0015.png";
import chip16Png from "../../../assets/Chips/Chip_0016.png";
import chip18Png from "../../../assets/Chips/Chip_0018.png";
import chip24Png from "../../../assets/Chips/Chip_0024.png";
import chip30Png from "../../../assets/Chips/Chip_0030.png";
import { Theme } from "../../styles";

const dieProps = {
  scale: 0,
  rotation: 360,
};

const TitleFont = {
  fontFamily: "Poppins",
  fontWeight: 500,
  fontSize: 80,
  fill: "#fff",
};

const TableHeaderFont = {
  fontFamily: "Poppins",
  fontWeight: 700,
  fontSize: 60,
  fill: "#fff",
};

const TableFont = {
  fontFamily: "Poppins",
  fontWeight: 700,
  fontSize: 50,
  fill: "#fff",
};

export default makeScene2D(function* (view) {
  view.fill(Theme.BG);
  const container = createRef<Layout>();
  const title = createRef<Txt>();
  const dice = createRefMap<Img>();
  const puck = createRef<Circle>();

  const payTable = createRef<Layout>();
  const headers = createRefArray<Txt>();
  const pays = createRefArray<Txt>();
  const mins = createRefArray<Txt>();
  const toWinChips = createRefArray<Img>();
  const wins = createRefArray<Txt>();
  const youLayChips = createRefArray<Img>();

  view.add(
    <Layout ref={container}>
      <Txt
        {...TitleFont}
        position={[0, 0]}
        ref={title}
      >
        LAYING ODDS: MINIMUMS AND PAYOUTS
      </Txt>

      {/* PLAYER VIEW LAYOUT */}
      <Layout
        layout
        ref={payTable}
        gap={0}
        padding={10}
        width={1536}
        position={[0, 100]}
        scale={1}
        opacity={0}
      >
        {range(7).map(() => (
          <Rect
            direction={"column"}
            width={"20%"}
            height={600}
            stroke={"white"}
            lineWidth={2}
            margin={0}
          >
            <Rect
              width={"100%"}
              height={"50%"}
              stroke={"white"}
              lineWidth={2}
              margin={0}
              padding={30}
              alignItems={"center"}
              justifyContent={"center"}
              fill={"#434343"}
            >
              <Txt
                {...TableHeaderFont}
                ref={headers}
                margin={10}
                textAlign={"center"}
                textWrap={"wrap"}
                text={""}
              />
            </Rect>

            <Rect
              width={"100%"}
              height={"50%"}
              stroke={"white"}
              lineWidth={2}
              margin={0}
              alignItems={"center"}
              justifyContent={"center"}
            >
              <Txt
                {...TableFont}
                ref={pays}
                opacity={0}
                scale={0}
                // text={() => `${formatter.format(value())}`}
              />
            </Rect>

            <Rect
              width={"100%"}
              height={"50%"}
              stroke={"white"}
              lineWidth={2}
              margin={0}
              alignItems={"center"}
              justifyContent={"center"}
            >
              <Txt
                {...TableFont}
                ref={wins}
                // text={() => `${formatter.format(value())}`}
              />
              <Rect
                layout={false}
                ref={toWinChips}
              ></Rect>
            </Rect>

            <Rect
              width={"100%"}
              height={"50%"}
              stroke={"white"}
              lineWidth={2}
              margin={0}
              alignItems={"center"}
              justifyContent={"center"}
            >
              <Txt
                {...TableFont}
                ref={mins}
                // text={() => `${formatter.format(value())}`}
              />
              <Rect
                ref={youLayChips}
                layout={false}
              ></Rect>
            </Rect>
          </Rect>
        ))}
      </Layout>
    </Layout>
  );

  yield* slideTransition(Direction.Right);

  yield* waitFor(0.6);
  title().moveOffset(new Vector2(-1, 0));
  yield* all(
    title().position([-850, -350], 0.8, easeInOutExpo),
    title().scale(0.8, 0.8, easeInOutExpo)
  );

  headers[0].text("POINT");
  headers[1].text("4");
  headers[2].text("5");
  headers[3].text("6");
  headers[4].text("8");
  headers[5].text("9");
  headers[6].text("10");

  pays[0].text("Pays");
  pays[0].opacity(1);
  pays[0].scale(1);
  pays[1].text("1:2");
  pays[2].text("2:3");
  pays[3].text("5:6");
  pays[4].text("5:6");
  pays[5].text("2:3");
  pays[6].text("1:2");

  wins[0].text("To Win");

  mins[0].text("You Lay");

  yield* waitUntil("show-payout-table");
  yield* payTable().opacity(1, 1, linear);

  const chipScale = 0.9;
  ///////////////////////////////////////////////
  yield* waitUntil("show-4-10");
  yield* sequence(
    0.2,
    all(
      pays[1].opacity(1, 1, easeInOutExpo),
      pays[1].scale(1.5, 1, easeOutBounce)
    ),
    all(
      pays[6].opacity(1, 1, easeInOutExpo),
      pays[6].scale(1.5, 1, easeOutBounce)
    )
  );

  const win4 = (
    <Img
      src={chip15Png}
      scale={0}
      opacity={0}
    />
  );
  const win10 = (
    <Img
      src={chip15Png}
      scale={0}
      opacity={0}
    />
  );
  toWinChips[1].add(win4);
  toWinChips[6].add(win10);

  yield* waitUntil("show-4-10-2");
  yield* sequence(
    0.2,
    all(
      win4.opacity(1, 1, easeInOutExpo),
      win4.scale(chipScale, 1, easeOutBounce)
    ),
    all(
      win10.opacity(1, 1, easeInOutExpo),
      win10.scale(chipScale, 1, easeOutBounce)
    )
  );

  const lay4 = (
    <Img
      src={chip30Png}
      scale={0}
      opacity={0}
    />
  );
  const lay10 = (
    <Img
      src={chip30Png}
      scale={0}
      opacity={0}
    />
  );
  youLayChips[1].add(lay4);
  youLayChips[6].add(lay10);
  yield* waitUntil("show-4-10-3");
  yield* sequence(
    0.2,
    all(
      lay4.opacity(1, 1, easeInOutExpo),
      lay4.scale(chipScale, 1, easeOutBounce)
    ),
    all(
      lay10.opacity(1, 1, easeInOutExpo),
      lay10.scale(chipScale, 1, easeOutBounce)
    )
  );

  ///////////////////////////////////////////////
  yield* waitUntil("show-5-9");
  yield* sequence(
    0.2,
    all(
      pays[2].opacity(1, 1, easeInOutExpo),
      pays[2].scale(1.5, 1, easeOutBounce)
    ),
    all(
      pays[5].opacity(1, 1, easeInOutExpo),
      pays[5].scale(1.5, 1, easeOutBounce)
    )
  );

  const win5 = (
    <Img
      src={chip16Png}
      scale={0}
      opacity={0}
    />
  );
  const win9 = (
    <Img
      src={chip16Png}
      scale={0}
      opacity={0}
    />
  );
  toWinChips[2].add(win5);
  toWinChips[5].add(win9);

  yield* waitUntil("win-5-9");
  yield* sequence(
    0.2,
    all(
      win5.opacity(1, 1, easeInOutExpo),
      win5.scale(chipScale, 1, easeOutBounce)
    ),
    all(
      win9.opacity(1, 1, easeInOutExpo),
      win9.scale(chipScale, 1, easeOutBounce)
    )
  );

  yield* waitUntil("lay-5-9");
  const lay5 = (
    <Img
      src={chip24Png}
      scale={0}
      opacity={0}
    />
  );
  const lay9 = (
    <Img
      src={chip24Png}
      scale={0}
      opacity={0}
    />
  );
  youLayChips[2].add(lay5);
  youLayChips[5].add(lay9);
  yield* sequence(
    0.2,
    all(
      lay5.opacity(1, 1, easeInOutExpo),
      lay5.scale(chipScale, 1, easeOutBounce)
    ),
    all(
      lay9.opacity(1, 1, easeInOutExpo),
      lay9.scale(chipScale, 1, easeOutBounce)
    )
  );

  ///////////////////////////////////////////////
  yield* waitUntil("show-6-8");
  yield* sequence(
    0.2,
    all(
      pays[3].opacity(1, 1, easeInOutExpo),
      pays[3].scale(1.5, 1, easeOutBounce)
    ),
    all(
      pays[4].opacity(1, 1, easeInOutExpo),
      pays[4].scale(1.5, 1, easeOutBounce)
    )
  );

  const win6 = (
    <Img
      src={chip15Png}
      scale={0}
      opacity={0}
    />
  );
  const win8 = (
    <Img
      src={chip15Png}
      scale={0}
      opacity={0}
    />
  );
  toWinChips[3].add(win6);
  toWinChips[4].add(win8);

  yield* waitUntil("win-6-8");
  yield* sequence(
    0.2,
    all(
      win6.opacity(1, 1, easeInOutExpo),
      win6.scale(chipScale, 1, easeOutBounce)
    ),
    all(
      win8.opacity(1, 1, easeInOutExpo),
      win8.scale(chipScale, 1, easeOutBounce)
    )
  );

  yield* waitUntil("lay-6-8");
  const lay6 = (
    <Img
      src={chip18Png}
      scale={0}
      opacity={0}
    />
  );
  const lay8 = (
    <Img
      src={chip18Png}
      scale={0}
      opacity={0}
    />
  );
  youLayChips[3].add(lay6);
  youLayChips[4].add(lay8);
  yield* sequence(
    0.2,
    all(
      lay6.opacity(1, 1, easeInOutExpo),
      lay6.scale(chipScale, 1, easeOutBounce)
    ),
    all(
      lay8.opacity(1, 1, easeInOutExpo),
      lay8.scale(chipScale, 1, easeOutBounce)
    )
  );

  yield* waitUntil("endslide");
});
