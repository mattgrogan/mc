import {
  Circle,
  Gradient,
  Icon,
  Layout,
  makeScene2D,
  Node,
  Rect,
  Txt,
} from "@motion-canvas/2d";
import {
  createRef,
  createRefArray,
  createSignal,
  easeInOutSine,
  easeOutCubic,
  easeOutQuint,
  fadeTransition,
  linear,
  makeRefs,
  range,
  sequence,
  SimpleSignal,
  waitFor,
  waitUntil,
} from "@motion-canvas/core";
import {
  Bright,
  Darker,
  Grays,
  MonoWhite,
  PoppinsWhite,
  Theme,
} from "../../styles";
import { FadeIn } from "../../utils/FadeIn";

import { blueTitleGradient, TitleBox } from "../../components/styled/titleBox";
// import * as params from "./DD_00_Params";

const titleGradient = new Gradient({
  type: "linear",

  from: [0, -200],
  to: [0, 200],
  stops: [
    { offset: 0, color: "#fff" },
    { offset: 1, color: "#c9c9c9" },
  ],
});

export default makeScene2D(function* (view) {
  view.fill(Theme.BG);

  yield* fadeTransition();

  const container = createRef<Layout>();
  view.add(
    <Layout
      ref={container}
      direction={"column"}
      justifyContent={"start"}
      alignItems={"center"}
      width={"100%"}
      height={"100%"}
      gap={50}
      padding={100}
      layout
    ></Layout>
  );

  yield* waitFor(1);

  const plotTitle = makeRefs<typeof TitleBox>();
  container().add(
    <TitleBox
      refs={plotTitle}
      fontSize={100}
      nodeOpacity={0}
      rectProps={{ fill: blueTitleGradient, stroke: Grays.GRAY1 }}
      headerProps={{ ...PoppinsWhite }}
      subheadProps={{ ...PoppinsWhite }}
    >
      RUNNING THE SIMULATIONS
    </TitleBox>
  );
  plotTitle.subhead.text("THREE SCENARIOS");

  yield* FadeIn(plotTitle.headerContainer, 0, easeOutCubic, [100, 0]);
  yield* FadeIn(plotTitle.subheadContainer, 0, easeOutCubic, [100, 0]);
  yield* FadeIn(plotTitle.container, 0.6, easeOutCubic, [100, 0]);

  const parameterTable = createRef<Layout>();
  const rowNodes = createRefArray<Node>();
  const rowRects = createRefArray<Rect>();
  const rowTitles = createRefArray<Txt>();
  const rowValues = createRefArray<Txt>();

  let z = -100;
  view.add(
    <Layout
      ref={parameterTable}
      direction={"column"}
      width={"45%"}
      height={"60%"}
      y={view.height() * 0.05}
      x={view.width() / -4}
      gap={10}
      layout
      opacity={1}
    >
      <Node
        ref={rowNodes}
        opacity={0}
      >
        <Rect
          width={"100%"}
          height={"20%"}
          fill={Darker.BLUE}
          justifyContent={"center"}
          alignItems={"center"}
          stroke={Grays.GRAY2}
          lineWidth={3}
          padding={20}
        >
          <Txt
            {...PoppinsWhite}
            // fill={Darker.BLUE}
            text={"SIMULATION PARAMETERS"}
            fontSize={120}
            fontWeight={600}
          />
        </Rect>
      </Node>
      {range(6).map((index) => (
        <Node
          ref={rowNodes}
          opacity={0}
          zIndex={z--}
        >
          <Rect
            ref={rowRects}
            opacity={1}
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
                ref={rowTitles}
                {...PoppinsWhite}
                fill={Grays.BLACK}
                textWrap
                textAlign={"left"}
                // text={"SESSIONS"}
                fontSize={80}
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
                ref={rowValues}
                {...PoppinsWhite}
                fill={Grays.BLACK}
                // text={"100,000"}
                fontSize={90}
                fontWeight={600}
              ></Txt>
            </Rect>
          </Rect>
        </Node>
      ))}
    </Layout>
  );

  rowTitles[0].text("SESSIONS");
  rowTitles[1].text("ROLLS PER SESSION");
  rowTitles[2].text("BET PER ROLL");
  rowTitles[3].text("> SCENARIO #1");
  rowTitles[4].text("> SCENARIO #2");
  rowTitles[5].text("> SCENARIO #3");

  rowValues[0].text("100,000");
  rowValues[1].text("100");
  rowValues[2].text("$10 FIELD");
  rowValues[3].text("2 & 12 PAY 2X");
  rowValues[4].text("2 PAYS 2X & 12 PAYS 3X");
  rowValues[5].text("2 & 12 PAY 3X");

  rowValues[3].fontSize(70)
  rowValues[4].fontSize(70)
  rowValues[5].fontSize(70)

  yield* waitFor(1);
  //yield* FadeIn(parameterTable, 1, easeOutCubic, [0, 100]);

  //yield* waitFor(1);
  // yield* sequence(
  //   1,
  //   ...rowNodes.map((r) => FadeIn(r, 1, easeOutCubic, [0, 50]))
  // );

  yield* FadeIn(rowNodes[0], 1, easeOutCubic, [0, 50])
  yield* waitFor(0.5)
  
  yield* FadeIn(rowNodes[1], 1, easeOutCubic, [0, 50])
  yield* waitFor(0.5)
  
  yield* FadeIn(rowNodes[2], 1, easeOutCubic, [0, 50])
  yield* waitFor(0.5)
  
  
  yield* FadeIn(rowNodes[3], 1, easeOutCubic, [0, 50])
  yield* waitFor(0.5)
  
  // Show a bracket
  yield* waitUntil("bracket")
  const brace = createRef<Txt>()
  const braceTxtRef = createRef<Txt>()
  const braceTxt = createSignal("")
  view.add(<Txt ref={brace} text={"}"} {...PoppinsWhite} fontSize={400} y={95} opacity={0}/>)
  view.add(<Txt ref={braceTxtRef} text={() => braceTxt()} {...PoppinsWhite} fontSize={120} offsetX={-1} y={95} x={100}/>)
  
  yield* FadeIn(brace, 1, easeOutCubic, [50, 0])
  yield* braceTxt("$1,000 PER SESSION", 1)
  
  
  
  yield* waitUntil("scenarios")
  yield* FadeIn(rowNodes[4], 1, easeOutCubic, [0, 50])
  yield* waitFor(1)

  yield* FadeIn(rowNodes[5], 1, easeOutCubic, [0, 50])
  yield* waitFor(1)

  yield* FadeIn(rowNodes[6], 1, easeOutCubic, [0, 50])
  yield* waitFor(1)

  yield* waitUntil("term")
  yield brace().opacity(0, 0.5)
  yield* braceTxtRef().opacity(0, 0.5)

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

  const template = new Txt({ ...MonoWhite, fontWeight: 600, fontSize: 50 });

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

  // params.audioPlayer.typing(0.5)
  yield* lines[0]("> python runDiceDataEngine.py -i 100000", 0.3, linear);
  yield* waitFor(0.5);
  lineTxts[1].fill(Bright.YELLOW);
  yield* lines[1]("preparing simulation...", 0.05, linear);
  yield* waitFor(0.1);
  yield* lines[2]("  initializing engine", 0.1, linear);
  yield* waitFor(0.1);
  yield* lines[3]("  initializing players", 0.1, linear);
  yield* waitFor(0.4);
  yield* lines[4]("  initializing tables", 0.3, linear);
  yield* waitFor(0.2);
  yield* lines[5]("  initializing rng", 0.1, linear);
  yield* lines[6]("multiprocessing: allocating thread pool...", 0.2, linear);
  yield* waitFor(0.4);
  lineTxts[7].fill(Bright.YELLOW);
  yield* lines[7]("running simulation...", 0.05, linear);
  yield* waitFor(0.2);

  const nComplete = createSignal(0);
  const n = 100000;
  const delaySeconds = 8;

  lineTxts[8].text(
    () =>
      (Math.floor((nComplete() / n) * 1000) / 10).toFixed(1) +
      "%         " +
      Math.max(nComplete() - 1, 0).toFixed(0) +
      " / " +
      n
  );
  yield* waitFor(0.1);
  yield nComplete(n + 1, delaySeconds, easeInOutSine);
  yield* lines[9](
    "██████████████████████████████████████████████",
    delaySeconds,
    easeInOutSine
  );
  yield* waitFor(0.05);
  lineTxts[10].fill(Bright.GREEN);
  yield* lines[10]("simulation complete", 0.1, linear);
  yield* waitFor(0.1);
  yield* lines[11]("calculating statistics...............", 0.4, easeOutQuint);
  yield* waitFor(0.1);
  yield* lines[12]("exporting data", 0.1, easeOutCubic);
  yield* lines[13]("    saving parquet......", 0.1, easeOutQuint);
  yield* waitFor(0.8);
  yield* lines[14]("    saving xlsx..........", 0.2, easeOutQuint);
  yield* waitFor(0.3);
  yield* lines[15]("    saving csv...................", 0.3, easeOutQuint);
  yield* waitFor(0.2);
  yield* lines[16]("    saving json......", 0.1, easeOutQuint);
  yield* waitFor(0.1);
  lineTxts[17].fill(Bright.GREEN);
  yield* lines[17]("simulation run complete.", 0.1, linear);

  yield* waitFor(4);
  yield* waitUntil("end");
});
