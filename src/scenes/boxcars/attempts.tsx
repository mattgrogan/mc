import {
  Circle,
  Img,
  Layout,
  makeScene2D,
  Txt,
  Node,
  Icon,
  Rect,
} from "@motion-canvas/2d";
import {
  all,
  createRef,
  createRefArray,
  createSignal,
  easeInBack,
  easeInBounce,
  easeInCubic,
  easeInOutCubic,
  easeOutBack,
  easeOutBounce,
  easeOutCubic,
  easeOutElastic,
  easeOutQuint,
  fadeTransition,
  linear,
  makeRef,
  range,
  sequence,
  waitFor,
  waitUntil,
} from "@motion-canvas/core";

import {
  Bright,
  Darkest,
  dollarFormatter,
  Grays,
  MonoWhite,
  PoppinsWhite,
  Theme,
} from "../../styles";

import chip5Png from "../../../assets/Chips/Chip_0005.png";
import chip50Png from "../../../assets/Chips/Chip_0050.png";
import chip150Png from "../../../assets/Chips/Chip_0150.png";
import chip1500Png from "../../../assets/Chips/Chip_1500.png";
import { FadeIn } from "../../utils/FadeIn";
import { FadeOut } from "../../utils/FadeOut";

export default makeScene2D(function* (view) {
  view.fill(Theme.BG);

  const container = createRef<Layout>();
  const container2 = createRef<Node>();

  const chip200 = createRef<Img>();
  const chip1500 = createRef<Img>();

  const chips5 = createRefArray<Img>();
  const chips50 = createRefArray<Img>();
  const chips150 = createRefArray<Img>();
  const chips1500 = createRefArray<Img>();
  const icons = createRefArray<Img>();

  const rect = createRef<Rect>();

  view.add(
    <Node
      ref={container2}
      scale={0.8}
    >
      <Layout
        ref={container}
        layout
        width={"85%"}
        height={"80%"}
        wrap={"wrap"}
      >
        {range(40).map((index) => (
          <Layout>
            <Img
              layout={true}
              gap={-100}
              ref={chips5}
              src={chip5Png}
              margin={-50}
              scale={0}
            >
              <Img
                layout={false}
                gap={-100}
                ref={chips50}
                src={chip50Png}
                margin={-50}
                opacity={0}
              />
              <Img
                layout={false}
                gap={-100}
                ref={chips1500}
                src={chip1500Png}
                margin={-50}
                opacity={0}
                y={40}
              />
              <Img
                layout={false}
                gap={-100}
                ref={chips150}
                src={chip150Png}
                margin={-50}
                opacity={0}
                y={40}
              />

              <Icon
                layout={false}
                ref={icons}
                scale={8}
                icon={"carbon:stop-sign-filled"}
                color={"#cf142b"}
                shadowColor={"black"}
                shadowOffset={5}
                opacity={0}
                y={60}
                x={-40}
              >
                <Txt
                  fill={"white"}
                  text={"STOP"}
                  fontWeight={600}
                  fontSize={4}
                  y={1}
                />
              </Icon>
            </Img>
          </Layout>
        ))}
      </Layout>
    </Node>
  );

  view.add(
    <Rect
      ref={rect}
      stroke={Bright.YELLOW}
      lineWidth={10}
      width={140}
      height={180}
      end={0}
    />
  );

  yield* fadeTransition();

  yield* waitFor(1);

  yield* sequence(0.15, ...chips5.map((chip) => chip.scale(1, 1, easeOutBack)));

  rect().position(
    chips5[0].absolutePosition().transformAsPoint(container2().worldToParent())
  );

  yield* waitUntil("draw-rect");
  yield* rect().end(1, 1, easeInOutCubic);

  yield* waitUntil("start-bets");
  for (let i = 0; i < 23; i++) {
    yield* sequence(
      0.2,
      chips5[i].opacity(0.2, 0.6, linear),
      rect().position(
        chips5[i + 1]
          .absolutePosition()
          .transformAsPoint(container2().worldToParent()),
        0.6,
        easeInOutCubic
      )
    );
  }
  yield* FadeIn(chips150[23], 1, easeOutBounce, [0, 50]);

  yield* waitUntil("bet50");
  yield* rect().position(
    chips5[24]
      .absolutePosition()
      .transformAsPoint(container2().worldToParent()),
    0.6,
    easeInOutCubic
  );
  yield* chips50[24].opacity(1, 0.6, linear);
  chips5[24].src(chip50Png);

  yield* waitFor(2);
  yield* waitUntil("lose50");
  yield* chips5[24].opacity(0.2, 0.6, linear);

  yield* waitUntil("restart-bets");
  yield* rect().position(
    chips5[25]
      .absolutePosition()
      .transformAsPoint(container2().worldToParent()),
    0.6,
    easeInOutCubic
  );

  for (let i = 25; i < 31; i++) {
    yield* sequence(
      0.2,
      chips5[i].opacity(0.2, 0.6, linear),
      rect().position(
        chips5[i + 1]
          .absolutePosition()
          .transformAsPoint(container2().worldToParent()),
        0.6,
        easeInOutCubic
      )
    );
  }

  yield* waitUntil("win-150-2");
  yield* FadeIn(chips150[31], 1, easeOutBounce, [0, 50]);

  yield* waitFor(1);
  yield* waitUntil("bet50-2");
  yield* rect().position(
    chips5[32]
      .absolutePosition()
      .transformAsPoint(container2().worldToParent()),
    0.6,
    easeInOutCubic
  );
  yield* chips50[32].opacity(1, 0.6, linear);
  chips5[32].src(chip50Png);
  yield* waitFor(2);

  yield* waitUntil("win-1500");
  yield* FadeIn(chips1500[32], 1, easeOutBounce, [0, 50]);

  yield* waitFor(1);
  yield* rect().end(0, 0.6, easeInOutCubic);
  yield* FadeIn(icons[33], 1, easeOutBounce, [0, 50]);

  yield* waitUntil("count");
  yield* all(
    container2().scale(0.6, 1, easeInOutCubic),
    container2().x(-300, 1, easeInOutCubic)
  );

  const winContainer = createRef<Rect>();
  const winSignal = createSignal(0);
  view.add(
    <Rect
      ref={winContainer}
      layout
      direction={"column"}
      stroke={Bright.GREEN}
      // width={"20%"}
      // height={"40%"}
      lineWidth={5}
      padding={40}
      radius={10}
      fill={Darkest.GREEN}
      minWidth={"25%"}
      position={[550, -300]}
      scale={0.8}
      opacity={0}
    >
      <Txt
        {...MonoWhite}
        text={() => `${dollarFormatter.format(winSignal())}`}
        fontSize={100}
        y={0}
      />
      <Txt
        {...PoppinsWhite}
        text={"WON"}
        fontWeight={600}
        fontSize={70}
        y={100}
      />
      <Txt
        {...PoppinsWhite}
        text={"(including original bankroll)"}
        fontWeight={200}
        fontSize={30}
        y={80}
      />
    </Rect>
  );

  const loseContainer = createRef<Rect>();
  const loseSignal = createSignal(0);
  view.add(
    <Rect
      ref={loseContainer}
      layout
      direction={"column"}
      stroke={Bright.RED}
      // width={"20%"}
      // height={"40%"}
      lineWidth={5}
      padding={40}
      radius={10}
      fill={Darkest.RED}
      minWidth={"25%"}
      top={winContainer().bottom().addY(150)}
      scale={0.8}
      opacity={0}
    >
      <Txt
        {...MonoWhite}
        text={() => `${dollarFormatter.format(loseSignal())}`}
        fontSize={100}
        y={0}
      />
      <Txt
        {...PoppinsWhite}
        text={"LOST"}
        fontWeight={600}
        fontSize={70}
        y={100}
      />
    </Rect>
  );

  const netContainer = createRef<Rect>();
  const netSignal = createSignal(0);
  view.add(
    <Rect
      ref={netContainer}
      layout
      direction={"column"}
      stroke={Bright.WHITE}
      // width={"20%"}
      // height={"40%"}
      lineWidth={5}
      padding={40}
      radius={10}
      fill={Grays.GRAY3}
      minWidth={"25%"}
      top={loseContainer().bottom().addY(150)}
      scale={0.8}
      opacity={0}
    >
      <Txt
        {...MonoWhite}
        text={() => `${dollarFormatter.format(netSignal())}`}
        fontSize={100}
        y={0}
      />
      <Txt
        {...PoppinsWhite}
        text={"NET"}
        fontWeight={600}
        fontSize={70}
        y={100}
      />
    </Rect>
  );

  yield* waitUntil("count-wins");

  yield* FadeIn(winContainer, 1, easeOutCubic, [0, 100]);
  yield* winSignal(5 * 9 + 150 * 2 + 50 + 1500, 1, easeOutQuint);
  yield* waitFor(1);

  yield* waitUntil("count-lose");
  yield* FadeIn(loseContainer, 1, easeOutCubic, [0, 100]);
  yield* loseSignal(5 * 29 + 50, 1, easeOutQuint);
  yield* waitFor(1);

  yield* waitUntil("count-net");
  yield* FadeIn(netContainer, 1, easeOutCubic, [0, 100]);
  yield* netSignal(winSignal() - loseSignal(), 1, easeOutQuint);

  yield* waitUntil("end");
});
