import {
  Circle,
  Gradient,
  Icon,
  Layout,
  makeScene2D,
  Rect,
  Txt,
  Node,
} from "@motion-canvas/2d";
import {
  createRef,
  createRefArray,
  createSignal,
  easeInCubic,
  easeInOutQuint,
  easeInOutSine,
  easeOutCubic,
  easeOutQuint,
  linear,
  sequence,
  SimpleSignal,
  useLogger,
  waitFor,
  waitUntil,
} from "@motion-canvas/core";
import {
  Bright,
  Darker,
  Darkest,
  grayGradient,
  Grays,
  MonoWhite,
  PoppinsWhite,
  Theme,
  whiteGradientH,
} from "../../styles";
import { FadeIn } from "../../utils/FadeIn";

import { sim } from "./DD_00_Params";

const titleGradient = new Gradient({
  type: "linear",

  from: [0, -300],
  to: [0, 300],
  stops: [
    { offset: 0, color: "#fff" },
    //{ offset: 1, color: "#000" },
    { offset: 1, color: "#797979" },
  ],
});

export default makeScene2D(function* (view) {
  view.fill(Theme.BG);

  const title = createRef<Rect>();
  const titleLines = createRefArray<Txt>();

  view.add(
    <Rect
      ref={title}
      width={"100%"}
      height={"20%"}
      fill={titleGradient}
      offsetY={-1}
      y={view.height() / -2}
      shadowColor={Darker.BLUE}
      shadowBlur={15}
      shadowOffsetY={10}
      direction={"column"}
      justifyContent={"center"}
      // alignContent={"start"}
      padding={100}
      // gap={0}
      layout
    >
      <Txt
        ref={titleLines}
        {...PoppinsWhite}
        fill={Darker.BLUE}
        text={sim.name}
        fontSize={240}
        fontWeight={600}
        lineHeight={200}
        opacity={0}
      />
      <Txt
        ref={titleLines}
        {...PoppinsWhite}
        fill={Grays.GRAY3}
        fontSize={120}
        fontWeight={600}
        text={"SIMULATION"}
        opacity={0}
      />
    </Rect>
  );

  // suppress the layout for a while and remember the positions
  title()
    .children()
    .forEach((ref) => ref.save());
  title().layout(false);
  title()
    .children()
    .forEach((ref) => ref.restore());

  // Animate the title
  yield FadeIn(titleLines[0], 0.6, easeOutCubic, [80, 0]);
  yield* waitFor(0.4);
  yield* FadeIn(titleLines[1], 0.6, easeOutCubic, [80, 0]);

  const container = createRef<Layout>();
  view.add(
    <Layout
      ref={container}
      direction={"column"}
      width={"45%"}
      height={"60%"}
      y={view.height() * 0.1}
      x={view.width() / -4}
      gap={20}
      layout
      opacity={0}
    ></Layout>
  );

  container().add(
    <Rect
      width={"100%"}
      height={"18%"}
      fill={Darker.BLUE}
      justifyContent={"center"}
      alignItems={"center"}
      stroke={Grays.GRAY3}
      lineWidth={5}
    >
      <Txt
        {...PoppinsWhite}
        // fill={Darker.BLUE}
        text={"SIMULATION PARAMETERS"}
        fontSize={120}
        fontWeight={600}
      />
    </Rect>
  );

  const rows = createRefArray<Rect>();
  const rowNodes = createRefArray<Node>();

  container().add(
    <Node ref={rowNodes}>
      <Rect
        ref={rows}
        opacity={0}
        width={"100%"}
        height={"18%"}
        stroke={Grays.GRAY3}
        lineWidth={5}
      >
        <Rect
          width={"50%"}
          height={"100%"}
          fill={Grays.WHITE}
          justifyContent={"start"}
          alignItems={"center"}
          padding={50}
        >
          <Txt
            {...PoppinsWhite}
            fill={Grays.BLACK}
            text={"SESSIONS"}
            fontSize={90}
            fontWeight={600}
          ></Txt>
        </Rect>
        <Rect
          width={"50%"}
          height={"100%"}
          fill={Grays.GRAY1}
          justifyContent={"center"}
          alignItems={"center"}
          padding={50}
        >
          <Txt
            {...PoppinsWhite}
            fill={Grays.BLACK}
            text={"100,000"}
            fontSize={150}
            fontWeight={600}
          ></Txt>
        </Rect>
      </Rect>
    </Node>
  );

  container().add(
    <Rect
      ref={rows}
      opacity={0}
      width={"100%"}
      height={"18%"}
      stroke={Grays.GRAY3}
      lineWidth={5}
    >
      <Rect
        width={"50%"}
        height={"100%"}
        fill={Grays.WHITE}
        justifyContent={"start"}
        alignItems={"center"}
        padding={50}
      >
        <Txt
          {...PoppinsWhite}
          fill={Grays.BLACK}
          text={"SHOOTERS PER SESSION"}
          textWrap={"wrap"}
          textAlign={"left"}
          fontSize={90}
          fontWeight={600}
        ></Txt>
      </Rect>
      <Rect
        width={"50%"}
        height={"100%"}
        fill={Grays.GRAY1}
        justifyContent={"center"}
        alignItems={"center"}
        padding={50}
      >
        <Txt
          {...PoppinsWhite}
          fill={Grays.BLACK}
          text={"10"}
          fontSize={150}
          fontWeight={600}
        ></Txt>
      </Rect>
    </Rect>
  );

  container().add(
    <Rect
      ref={rows}
      opacity={0}
      width={"100%"}
      height={"18%"}
      stroke={Grays.GRAY3}
      lineWidth={5}
    >
      <Rect
        width={"50%"}
        height={"100%"}
        fill={Grays.WHITE}
        justifyContent={"start"}
        alignItems={"center"}
        padding={50}
      >
        <Txt
          {...PoppinsWhite}
          fill={Grays.BLACK}
          text={"TABLE MINIMUM"}
          textWrap={"wrap"}
          textAlign={"left"}
          fontSize={90}
          fontWeight={600}
        ></Txt>
      </Rect>
      <Rect
        width={"50%"}
        height={"100%"}
        fill={Grays.GRAY1}
        justifyContent={"center"}
        alignItems={"center"}
        padding={50}
      >
        <Txt
          {...PoppinsWhite}
          fill={Grays.BLACK}
          text={"$15"}
          fontSize={150}
          fontWeight={600}
        ></Txt>
      </Rect>
    </Rect>
  );

  container().add(
    <Rect
      ref={rows}
      opacity={0}
      width={"100%"}
      height={"18%"}
      stroke={Grays.GRAY3}
      lineWidth={5}
    >
      <Rect
        width={"50%"}
        height={"100%"}
        fill={Grays.WHITE}
        justifyContent={"start"}
        alignItems={"center"}
        padding={50}
      >
        <Txt
          {...PoppinsWhite}
          fill={Grays.BLACK}
          text={"TABLE MAXIMUM"}
          textWrap={"wrap"}
          textAlign={"left"}
          fontSize={90}
          fontWeight={600}
        ></Txt>
      </Rect>
      <Rect
        width={"50%"}
        height={"100%"}
        fill={Grays.GRAY1}
        justifyContent={"center"}
        alignItems={"center"}
        padding={50}
      >
        <Txt
          {...PoppinsWhite}
          fill={Grays.BLACK}
          text={"$5,000"}
          fontSize={150}
          fontWeight={600}
        ></Txt>
      </Rect>
    </Rect>
  );

  yield* waitFor(1);
  yield* FadeIn(container, 1, easeOutCubic, [0, 100]);

  yield* waitFor(1);
  yield* sequence(1.2, ...rows.map((r) => r.opacity(1, 1, easeInCubic)));
  yield* waitFor(1);

  const term = createRef<Rect>();
  const textTerm = createRef<Layout>();

  view.add(
    <Layout
      ref={term}
      direction={"column"}
      width={"45%"}
      height={"70%"}
      y={view.height() * 0.1}
      x={view.width() / 4}
      gap={20}
      layout
      opacity={0}
    ></Layout>
  );

  term().add(
    <Rect
      width={"100%"}
      height={"100%"}
      fill={Grays.GRAY3}
      justifyContent={"start"}
      alignItems={"center"}
      stroke={Grays.GRAY1}
      lineWidth={5}
      direction={"column"}
      layout
    >
      <Rect
        width={"100%"}
        height={"10%"}
        fill={"#2e2e2e"}
        direction={"row"}
        justifyContent={"space-between"}
        alignItems={"center"}
      >
        <Icon
          icon="material-symbols-light:terminal"
          // scale={10}
          offsetX={-1}
          margin={10}
          width={120}
          // gap={10}
        ></Icon>
        <Txt
          {...MonoWhite}
          text={"DICEDATA SIMULATION ENGINE"}
          fontWeight={400}
          fontSize={65}
        ></Txt>
        <Layout
          width={"18%"}
          padding={50}
          justifyContent={"space-between"}
        >
          <Circle
            size={50}
            fill={Bright.RED}
            stroke={Grays.GRAY1}
            lineWidth={2}
          ></Circle>
          <Circle
            size={50}
            fill={Bright.YELLOW}
            stroke={Grays.GRAY1}
            lineWidth={2}
          ></Circle>
          <Circle
            size={50}
            fill={Bright.GREEN}
            stroke={Grays.GRAY1}
            lineWidth={2}
          ></Circle>
        </Layout>
      </Rect>
      <Rect
        ref={textTerm}
        direction={"column"}
        fill={"#0c0c0c"}
        width={"100%"}
        height={"100%"}
        padding={50}
        gap={10}
        layout
      ></Rect>
    </Rect>
  );

  // const line1 = createSignal("");

  const template: Txt = (
    <Txt
      {...MonoWhite}
      fontWeight={600}
      fontSize={50}
    ></Txt>
  );

  const nLines = 18;
  const lines: SimpleSignal<String, void>[] = [];
  const lineTxts: Txt[] = [];

  for (let i = 0; i < nLines; i++) {
    const line = createSignal("");
    const lineTxt = template.clone();
    lineTxt.text(() => line());
    textTerm().add(lineTxt);
    lines.push(line);
    lineTxts.push(lineTxt);
  }

  lines[0](">");
  yield* FadeIn(term, 1, easeOutCubic, [0, 100]);
  yield* waitFor(1);
  //yield* waitUntil("start-sim");

  yield* lines[0]("> python runDiceDataEngine.py -i 100000", 1, linear);
  yield* waitFor(0.5);
  lineTxts[1].fill(Bright.YELLOW);
  yield* lines[1]("preparing simulation...", 0.2, linear);
  yield* waitFor(0.1);
  yield* lines[2]("  initializing engine", 0.3, linear);
  yield* waitFor(0.1);
  yield* lines[3]("  initializing players", 0.6, linear);
  yield* waitFor(0.4);
  yield* lines[4]("  initializing tables", 0.3, linear);
  yield* waitFor(0.2);
  yield* lines[5]("  initializing rng", 0.2, linear);
  yield* lines[6]("multiprocessing: allocating thread pool...", 0.4, linear);
  yield* waitFor(0.4);
  lineTxts[7].fill(Bright.YELLOW);
  yield* lines[7]("running simulation...", 0.2, linear);
  yield* waitFor(0.2);

  const nComplete = createSignal(0);
  const n = 100000;
  const delaySeconds = 22;

  lineTxts[8].text(
    () =>
      (Math.floor((nComplete() / n) * 1000) / 10).toFixed(1) +
      "%         " +
      Math.max(nComplete() - 1, 0).toFixed(0) +
      " / " +
      n
  );
  yield* waitFor(0.8);
  yield nComplete(n + 1, delaySeconds, easeInOutSine);
  yield* lines[9](
    "██████████████████████████████████████████████",
    delaySeconds,
    easeInOutSine
  );
  yield* waitFor(0.2);
  lineTxts[10].fill(Bright.GREEN);
  yield* lines[10]("simulation complete", 0.2, linear);
  yield* waitFor(0.1);
  yield* lines[11]("calculating statistics...............", 1.4, easeOutQuint);
  yield* waitFor(0.1);
  yield* lines[12]("exporting data", 0.1, easeOutCubic);
  yield* lines[13]("    saving parquet......", 0.2, easeOutQuint);
  yield* waitFor(0.8);
  yield* lines[14]("    saving xlsx..........", 0.4, easeOutQuint);
  yield* waitFor(0.3);
  yield* lines[15]("    saving csv...................", 0.7, easeOutQuint);
  yield* waitFor(0.2);
  yield* lines[16]("    saving json......", 0.3, easeOutQuint);
  yield* waitFor(0.1);
  lineTxts[17].fill(Bright.GREEN);
  yield* lines[17]("simulation run complete.", 0.1, linear);

  yield* waitFor(10);
  yield* waitUntil("end");
});
