import {
  Gradient,
  Layout,
  Line,
  makeScene2D,
  Rect,
  RectProps,
  Txt,
  TxtProps,
  Node,
} from "@motion-canvas/2d";
import {
  createRef,
  Direction,
  easeOutCubic,
  linear,
  makeRef,
  makeRefs,
  range,
  sequence,
  slideTransition,
  Vector2,
  waitFor,
  waitUntil,
} from "@motion-canvas/core";
import {
  Bright,
  Grays,
  LightBlueGradient,
  PoppinsBlack,
  PoppinsWhite,
  purpleGradient,
  silverGradient,
  Theme,
} from "../../styles";
import { FadeIn } from "../../utils/FadeIn";

const finishedNumberGradient = new Gradient({
  type: "linear",

  from: [-160, 0],
  to: [160, 0],
  stops: [
    { offset: 0, color: "#252525" },
    { offset: 0.2, color: "#000000" },
    { offset: 0.8, color: "#000000" },
    { offset: 1, color: "#252525" },
  ],
});

const finishedGradient = new Gradient({
  type: "linear",

  from: [-600, 0],
  to: [600, 0],
  stops: [
    { offset: 0, color: "#252525" },
    { offset: 0.2, color: "#000000" },
    { offset: 0.8, color: "#000000" },
    { offset: 1, color: "#252525" },
  ],
});

const activeNumberGradient = new Gradient({
  type: "linear",

  from: [-160, 0],
  to: [160, 0],
  stops: [
    { offset: 0, color: "#701a75" },
    { offset: 0.2, color: "#4a044e" },
    { offset: 0.8, color: "#4a044e" },
    { offset: 1, color: "#701a75" },
  ],
});

const activeGradient = new Gradient({
  type: "linear",

  from: [-600, 0],
  to: [600, 0],
  stops: [
    { offset: 0, color: "#701a75" },
    { offset: 0.2, color: "#4a044e" },
    { offset: 0.8, color: "#4a044e" },
    { offset: 1, color: "#701a75" },
  ],
});

const upcomingNumberGradient = new Gradient({
  type: "linear",

  from: [-160, 0],
  to: [160, 0],
  stops: [
    { offset: 0, color: "#1e3a8a" },
    { offset: 0.2, color: "#172554" },
    { offset: 0.8, color: "#172554" },
    { offset: 1, color: "#1e3a8a" },
  ],
});

const upcomingGradient = new Gradient({
  type: "linear",

  from: [-600, 0],
  to: [600, 0],
  stops: [
    { offset: 0, color: "#1e3a8a" },
    { offset: 0.2, color: "#172554" },
    { offset: 0.8, color: "#172554" },
    { offset: 1, color: "#1e3a8a" },
  ],
});

export default makeScene2D(function* (view) {
  view.fill(Theme.BG);

  yield* slideTransition(Direction.Right);

  const container = createRef<Layout>();
  view.add(
    <Layout
      ref={container}
      direction={"column"}
      justifyContent={"center"}
      alignItems={"center"}
      width={"80%"}
      height={"90%"}
      gap={50}
      padding={100}
      layout
    ></Layout>
  );

  yield* waitFor(1);

  // ADD THE TABLE
  const toc = makeRefs<typeof TableOfContents>();

  // Create the data table and pass in the references
  container().add(
    <TableOfContents
      refs={toc}
      numberRectProps={{
        fill: upcomingNumberGradient,
        lineWidth: 3,
        stroke: Grays.GRAY3,
      }}
      numberTxtProps={{ ...PoppinsWhite }}
      titleRectProps={{
        fill: upcomingGradient,
        lineWidth: 3,
        stroke: Grays.GRAY3,
      }}
      titleTxtProps={{ ...PoppinsWhite }}
    ></TableOfContents>
  );

  // const agenda = createRef<Txt>();
  // view.add(
  //   <Txt
  //     ref={agenda}
  //     text={"AGENDA"}
  //     rotation={-90}
  //     {...PoppinsWhite}
  //     fontSize={300}
  //     fontWeight={900}
  //     fill={Grays.GRAY2}
  //     letterSpacing={25}
  //     x={-1400}
  //   ></Txt>
  // );

  // Highlight the average separately
  // toc.headerRects[0].fill(finishedGradient);
  // toc.headerRects[1].fill(finishedGradient);
  // toc.rowRects[2].fill(activeGradient);
  // toc.numberTxts[2].fill(Grays.WHITE);
  // toc.titleTxts[2].fill("red");
  // toc.headerTxts[2].fill(Grays.BLACK);
  // toc.headerRects[3].fill(upcomingGradient);
  // toc.headerRects[4].fill(upcomingGradient);
  // toc.headerRects[5].fill(upcomingGradient);
  // toc.headerRects[6].fill(upcomingGradient);
  // toc.headerRects[7].fill(upcomingGradient);

  // COMPLETED ITEMS
  toc.numberRects[0].fill(finishedNumberGradient);
  toc.numberTxts[0].fill(Grays.GRAY3);
  toc.titleRects[0].fill(finishedGradient);
  toc.titleTxts[0].fill(Grays.GRAY3);

  toc.numberRects[1].fill(finishedNumberGradient);
  toc.numberTxts[1].fill(Grays.GRAY3);
  toc.titleRects[1].fill(finishedGradient);
  toc.titleTxts[1].fill(Grays.GRAY3);

  // ACTIVE ITEMS

  toc.numberRects[2].fill(activeNumberGradient);
  toc.titleRects[2].fill(activeGradient);

  //UPCOMING ITEMS

  // Show the data table
  yield* sequence(0.1, ...toc.rowContainers.map((pct) => pct.opacity(1, 0.6)));

  yield* waitFor(10);
  yield* waitUntil("end");
});

export function TableOfContents({
  refs,
  numberRectProps = {},
  numberTxtProps = {},
  titleRectProps = {},
  titleTxtProps = {},
  fontSize = 65,
}: {
  refs: {
    container: Node;
    rowContainers: Node[];
    rowRects: Rect[];
    numberRects: Rect[];
    numberTxts: Txt[];
    titleRects: Txt[];
    titleTxts: Txt[];
  };
  numberRectProps?: RectProps;
  numberTxtProps?: TxtProps;
  titleRectProps?: RectProps;
  titleTxtProps?: TxtProps;
  fontSize?: number;
}) {
  refs.rowContainers = [];
  refs.rowRects = [];
  refs.numberRects = [];
  refs.numberTxts = [];
  refs.titleRects = [];
  refs.titleTxts = [];

  const entries = [
    "STRATEGY",
    "SIMULATION",
    "DICE AND GAME FLOW",
    "HOUSE TAKE AND EDGE",
    "WON/LOST BY SHOOTER",
    "WON/LOST BY SESSION",
    "BANKROLL SURVIVAL",
    "STRATEGY SCORE",
  ];

  return (
    <Node ref={makeRef(refs, "container")}>
      <Layout
        width={"40%"}
        height={"100%"}
        direction={"column"}
        gap={10}
        justifyContent={"stretch"}
        layout
      >
        {range(entries.length).map((index) => (
          <Node
            ref={makeRef(refs.rowContainers, index)}
            opacity={0}
          >
            <Rect
              ref={makeRef(refs.rowRects, index)}
              direction={"row"}
              grow={1}
              basis={0}
              gap={0}
              justifyContent={"space-evenly"}
              lineWidth={3}
            >
              <Rect
                ref={makeRef(refs.numberRects, index)}
                justifyContent={"center"}
                alignItems={"center"}
                lineWidth={3}
                grow={1}
                basis={0}
                {...numberRectProps}
              >
                <Txt
                  ref={makeRef(refs.numberTxts, index)}
                  fontSize={fontSize * 2}
                  fontWeight={600}
                  text={(index + 1).toFixed(0)}
                  textAlign={"center"}
                  textWrap
                  {...numberTxtProps}
                ></Txt>
              </Rect>
              <Rect
                ref={makeRef(refs.titleRects, index)}
                justifyContent={"start"}
                alignItems={"center"}
                lineWidth={3}
                grow={3}
                basis={0}
                padding={50}
                {...titleRectProps}
              >
                <Txt
                  ref={makeRef(refs.titleTxts, index)}
                  //   {...PoppinsWhite}
                  fontSize={fontSize}
                  fontWeight={600}
                  text={entries[index]}
                  textAlign={"left"}
                  textWrap
                  {...titleTxtProps}
                ></Txt>
              </Rect>
            </Rect>
          </Node>
        ))}
      </Layout>
    </Node>
  );
}
