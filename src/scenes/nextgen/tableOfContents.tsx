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

const finishedGradient = new Gradient({
  type: "linear",

  from: [-500, -500],
  to: [300, 300],
  stops: [
    { offset: 0, color: "#252525" },
    { offset: 0.4, color: "#000000" },
  ],
});

const activeGradient = new Gradient({
  type: "linear",

  from: [-500, -500],
  to: [300, 300],
  stops: [
    { offset: 0, color: "#f7fcb9" },
    { offset: 0.4, color: "#fffd98" },
  ],
});

const upcomingGradient = new Gradient({
  type: "linear",

  from: [-500, -500],
  to: [300, 300],
  stops: [
    { offset: 0, color: "#e2e8f0" },
    { offset: 0.4, color: "#cbd5e1" },
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
      headerRectProps={{ fill: LightBlueGradient, stroke: Grays.GRAY2 }}
      valueRectProps={{ fill: silverGradient, stroke: Grays.GRAY1 }}
      headerTxtProps={{ ...PoppinsBlack }}
      valueTxtProps={{ ...PoppinsBlack }}
    ></TableOfContents>
  );

  const agenda = createRef<Txt>();
  view.add(
    <Txt
      ref={agenda}
      text={"AGENDA"}
      rotation={-90}
      {...PoppinsWhite}
      fontSize={300}
      fontWeight={900}
      fill={Grays.GRAY2}
      letterSpacing={25}
      x={-1400}
    ></Txt>
  );

  // Highlight the average separately
  toc.headerRects[0].fill(finishedGradient);
  toc.headerRects[1].fill(finishedGradient);
  toc.headerRects[2].fill(activeGradient);
  toc.headerTxts[2].fill(Grays.BLACK);
  toc.headerRects[3].fill(upcomingGradient);
  toc.headerRects[4].fill(upcomingGradient);
  toc.headerRects[5].fill(upcomingGradient);
  toc.headerRects[6].fill(upcomingGradient);
  toc.headerRects[7].fill(upcomingGradient);

  // Show the data table
  yield* sequence(0.1, ...toc.columns.map((pct) => pct.opacity(1, 0.6)));

  yield* waitFor(10);
  yield* waitUntil("end");
});

export function TableOfContents({
  refs,
  headerRectProps = {},
  headerTxtProps = {},
  valueRectProps = {},
  valueTxtProps = {},
  fontSize = 65,
}: {
  refs: {
    container: Node;
    columns: Node[];
    headerRects: Rect[];
    headerTxts: Txt[];
    valueRects: Rect[];
    valueTxts: Txt[];
  };
  headerRectProps?: RectProps;
  headerTxtProps?: TxtProps;
  valueRectProps?: RectProps;
  valueTxtProps?: TxtProps;
  fontSize?: number;
}) {
  // Initialize the arrays
  refs.columns = [];
  refs.headerRects = [];
  refs.headerTxts = [];
  refs.valueRects = [];
  refs.valueTxts = [];

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
        width={"25%"}
        height={"100%"}
        direction={"column"}
        gap={0}
        justifyContent={"stretch"}
        layout
      >
        {range(entries.length).map((index) => (
          <Node
            ref={makeRef(refs.columns, index)}
            opacity={0}
          >
            <Rect
              ref={makeRef(refs.headerRects, index)}
              direction={"row"}
              grow={1}
              basis={0}
              gap={0}
              justifyContent={"space-evenly"}
              lineWidth={3}
              // alignContent={"stretch"}
              // height={"100%"}
              // basis={2}
              {...headerRectProps}
            >
              <Rect
                // height={"100%"}
                // width={"20%"}
                justifyContent={"center"}
                alignItems={"center"}
                lineWidth={3}
                grow={1}
                basis={0}
              >
                <Txt
                  ref={makeRef(refs.headerTxts, index)}
                  //   {...PoppinsWhite}
                  fontSize={fontSize * 2}
                  fontWeight={600}
                  text={(index + 1).toFixed(0)}
                  textAlign={"center"}
                  textWrap
                  {...headerTxtProps}
                ></Txt>
              </Rect>
              <Rect
                // ref={makeRef(refs.headerRects, index)}
                // height={"100%"}
                // width={"80%"}
                justifyContent={"center"}
                alignItems={"center"}
                lineWidth={3}
                grow={3}
                basis={0}
                // {...headerRectProps}
                padding={50}
                // paddingLeft={120}
              >
                <Txt
                  ref={makeRef(refs.headerTxts, index)}
                  //   {...PoppinsWhite}
                  fontSize={fontSize}
                  fontWeight={600}
                  text={entries[index]}
                  textAlign={"left"}
                  textWrap
                  {...headerTxtProps}
                ></Txt>
              </Rect>
            </Rect>
          </Node>
        ))}
      </Layout>
    </Node>
  );
}
