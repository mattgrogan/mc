import {
  Camera,
  Line,
  makeScene2D,
  Rect,
  Txt,
  Node,
  Layout,
} from "@motion-canvas/2d";
import {
  all,
  createRef,
  createRefArray,
  createSignal,
  delay,
  easeInCubic,
  easeInOutCubic,
  easeOutCubic,
  fadeTransition,
  linear,
  range,
  sequence,
  waitFor,
  waitUntil,
} from "@motion-canvas/core";
import { Bright, MonoWhite, PoppinsWhite, Theme } from "../../styles";

//-winloss-outcomes.json
import winlose from "../../../../dicedata/output/boxcars-100k/boxcars-100k-winloss-outcomes.json";

import { FadeIn } from "../../utils/FadeIn";
import { FadeOut } from "../../utils/FadeOut";

export default makeScene2D(function* (view) {
  view.fill(Theme.BG);
  const title = createRef<Txt>();

  const resultLayouts = createRefArray<Layout>();
  const itemNodes = createRefArray<Node>();

  const noneSignal = createSignal(0);
  const oneSignal = createSignal(0);
  const winSignal = createSignal(0);

  view.add(
    <>
      <Txt
        ref={title}
        {...PoppinsWhite}
        text={"HOW DID THE PLAYERS DO?"}
        fontWeight={800}
        fontSize={60}
        opacity={0}
      />

      {/* NO HITS */}
      <Layout
        ref={resultLayouts}
        layout
        direction={"column"}
        gap={10}
      >
        <Node
          ref={itemNodes}
          opacity={0}
        >
          <Txt
            {...MonoWhite}
            text={() =>
              `${noneSignal().toLocaleString("en-US", {
                maximumFractionDigits: 0,
              })}`
            }
            fontSize={120}
            fill={"#c33c54"}
          ></Txt>
        </Node>
        <Node
          ref={itemNodes}
          opacity={0}
        >
          <Txt
            {...MonoWhite}
            width={500}
            text={"players never threw a 12"}
            textWrap={"wrap"}
          />
        </Node>
        <Node
          ref={itemNodes}
          opacity={0}
        >
          <Txt
            {...MonoWhite}
            text={() =>
              `${((noneSignal() / 100000) * 100).toLocaleString("en-US", {
                maximumFractionDigits: 2,
                minimumFractionDigits: 2,
              })}%`
            }
            fill={"#fffd98"}
          />
        </Node>
      </Layout>

      {/* ONE HIT */}
      <Layout
        ref={resultLayouts}
        layout
        direction={"column"}
        gap={10}
      >
        <Node
          ref={itemNodes}
          opacity={0}
        >
          <Txt
            {...MonoWhite}
            text={() =>
              `${oneSignal().toLocaleString("en-US", {
                maximumFractionDigits: 0,
              })}`
            }
            fontSize={120}
            fill={"#fe7e53"}
          ></Txt>
        </Node>
        <Node
          ref={itemNodes}
          opacity={0}
        >
          <Txt
            {...MonoWhite}
            width={500}
            text={"players threw a 12 at least once"}
            textWrap={"wrap"}
          />
        </Node>
        <Node
          ref={itemNodes}
          opacity={0}
        >
          <Txt
            {...MonoWhite}
            text={() =>
              `${((oneSignal() / 100000) * 100).toLocaleString("en-US", {
                maximumFractionDigits: 2,
                minimumFractionDigits: 2,
              })}%`
            }
            fill={"#fffd98"}
          />
        </Node>
      </Layout>

      {/* WINNERS */}
      <Layout
        ref={resultLayouts}
        layout
        direction={"column"}
        gap={10}
      >
        <Node
          ref={itemNodes}
          opacity={0}
        >
          <Txt
            {...MonoWhite}
            text={() =>
              `${winSignal().toLocaleString("en-US", {
                maximumFractionDigits: 0,
              })}`
            }
            fontSize={120}
            fill={"#7dcfb6"}
          ></Txt>
        </Node>
        <Node
          ref={itemNodes}
          opacity={0}
        >
          <Txt
            {...MonoWhite}
            width={500}
            text={"players hit 12 twice in a row"}
            textWrap={"wrap"}
          />
        </Node>
        <Node
          ref={itemNodes}
          opacity={0}
        >
          <Txt
            {...MonoWhite}
            text={() =>
              `${((winSignal() / 100000) * 100).toLocaleString("en-US", {
                maximumFractionDigits: 2,
                minimumFractionDigits: 2,
              })}%`
            }
            fill={"#fffd98"}
          />
        </Node>
      </Layout>
    </>
  );

  yield* waitFor(1);
  yield* FadeIn(title, 0.6, easeOutCubic, [0, 100]);
  yield* waitFor(1);
  yield* title().y(-400, 1, easeInOutCubic);

  yield* waitUntil("none");

  yield* waitFor(3);
  yield sequence(
    0.2,
    FadeIn(itemNodes[0], 0.6, easeOutCubic, [50, 0]),
    FadeIn(itemNodes[1], 0.6, easeOutCubic, [50, 0]),
    delay(1.2, FadeIn(itemNodes[2], 0.6, easeOutCubic, [50, 0]))
  );
  yield* noneSignal(32392, 2, easeOutCubic);

  yield* waitFor(3);
  yield* waitUntil("onehit");
  yield* resultLayouts[0].x(-600, 1, easeInOutCubic);
  yield sequence(
    0.2,
    FadeIn(itemNodes[3], 0.6, easeOutCubic, [50, 0]),
    FadeIn(itemNodes[4], 0.6, easeOutCubic, [50, 0]),
    delay(1.2, FadeIn(itemNodes[5], 0.6, easeOutCubic, [50, 0]))
  );
  yield* oneSignal(63112, 2, easeOutCubic);

  yield* waitFor(3);
  yield* waitUntil("winners");
  resultLayouts[2].x(600);
  yield sequence(
    0.2,
    FadeIn(itemNodes[6], 0.6, easeOutCubic, [50, 0]),
    FadeIn(itemNodes[7], 0.6, easeOutCubic, [50, 0]),
    delay(1.2, FadeIn(itemNodes[8], 0.6, easeOutCubic, [50, 0]))
  );
  yield* winSignal(3007, 2, easeOutCubic);

  yield* waitFor(3);
  yield* waitUntil("next-level");
  yield* all(
    resultLayouts[0].opacity(0.3, 1, linear),
    resultLayouts[2].opacity(0.3, 1, linear)
  );

  const hitTitles = createRefArray<Txt>();
  const hitNumbers = createRefArray<Txt>();
  const hitPercents = createRefArray<Txt>();
  const hitNodes = createRefArray<Node>();

  view.add(
    <Layout
      layout
      width={"80%"}
      direction={"row"}
      y={350}
      justifyContent={"space-between"}
    >
      {range(7).map((index) => (
        <Layout
          direction={"column"}
          gap={20}
          scale={0.8}
        >
          <Node
            ref={hitNodes}
            opacity={0}
          >
            <Txt
              ref={hitTitles}
              {...MonoWhite}
              text={"2 HITS"}
              textAlign={"center"}
              fontWeight={700}
              fill={Bright.BLUE}
            />

            <Txt
              ref={hitNumbers}
              {...MonoWhite}
              textAlign={"right"}
              text={"19,079"}
              fontSize={40}
            />
            <Txt
              ref={hitPercents}
              {...MonoWhite}
              textAlign={"right"}
              text={"19.1%"}
              fontSize={40}
              fill={"#fffd98"}
            />
          </Node>
        </Layout>
      ))}
    </Layout>
  );

  hitTitles[0].text("1 Hit");
  hitTitles[1].text("2 Hits");
  hitTitles[2].text("3 Hits");
  hitTitles[3].text("4 Hits");
  hitTitles[4].text("5 Hits");
  hitTitles[5].text("6 Hits");
  hitTitles[6].text("7 Hits");

  hitNumbers[0].text("37,032");
  hitNumbers[1].text("19,524");
  hitNumbers[2].text("6,307");
  hitNumbers[3].text("1,489");
  hitNumbers[4].text("218");
  hitNumbers[5].text("30");
  hitNumbers[6].text("1");

  hitPercents[0].text("37.0%");
  hitPercents[1].text("21.4%");
  hitPercents[2].text("7.1%");
  hitPercents[3].text("1.7%");
  hitPercents[4].text("0.3%");
  hitPercents[5].text("0.0%");
  hitPercents[6].text("0.0%");

  yield* sequence(
    2,
    ...hitNodes.map((node) => node.opacity(1, 1, easeInCubic))
  );

  yield* waitFor(3);

  yield* waitUntil("end");
});
