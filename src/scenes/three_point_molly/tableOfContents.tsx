import {
  Gradient,
  Layout,
  makeScene2D,
  Node,
  Rect,
  RectProps,
  Txt,
  TxtProps,
} from "@motion-canvas/2d";
import {
  all,
  createRef,
  Direction,
  makeRef,
  makeRefs,
  range,
  sequence,
  slideTransition,
  waitFor,
  waitUntil,
} from "@motion-canvas/core";
import { Darker, Grays, PoppinsBlack, PoppinsWhite, Theme } from "../../styles";

const OPACITY = 0.2;

const finishedGradient = new Gradient({
  type: "linear",

  from: [-600, 0],
  to: [600, 0],
  stops: [
    { offset: 0, color: "#fafafa" },
    { offset: 0.2, color: "#d4d4d8" },
    { offset: 0.8, color: "#d4d4d8" },
    { offset: 1, color: "#fafafa" },
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

  yield* waitFor(0.2);

  // ADD THE TABLE
  const toc = makeRefs<typeof TableOfContents>();

  // Create the data table and pass in the references
  container().add(
    <TableOfContents
      refs={toc}
      numberRectProps={{
        fill: Darker.BLUE,
        lineWidth: 3,
        stroke: Grays.GRAY3,
      }}
      numberTxtProps={{ ...PoppinsWhite }}
      titleRectProps={{
        fill: finishedGradient,
        lineWidth: 3,
        stroke: Grays.GRAY3,
      }}
      titleTxtProps={{ ...PoppinsBlack }}
    ></TableOfContents>
  );

  // Show the data table
  yield* sequence(0.1, ...toc.rowContainers.map((pct) => pct.opacity(1, 0.6)));

  // Focus on one item
  const activeIndex = 2;

  yield* highlightItem(toc, activeIndex);

  yield* waitFor(1);

  // Do an indicate
  // yield CircumscribeRect(toc.rowContainers[activeIndex], Bright.BLUE, 2, 20, 0);

  yield* waitFor(2);
  yield* waitUntil("end");
});

export function* highlightItem(toc: any, index: number) {
  // Make sure we're on top

  toc.rowRects[index].zIndex(100);

  // Slide the TOC to the left
  yield toc.container.x(-1200, 1);

  // Scale up the current item
  yield toc.rowContainers[index].scale(2, 1);

  // Slide the current item to the right
  yield toc.rowContainers[index].absolutePosition(
    toc.rowContainers[index].absolutePosition().addX(600),
    1
  );

  // Fade out the other items
  const bgNodes = toc.container.findAll(
    (node) => node.zIndex() < 0 && node instanceof Rect
  );
  yield all(...bgNodes.map((bg) => bg.opacity(OPACITY, 1)));
}

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
          <Rect
            ref={makeRef(refs.rowRects, index)}
            direction={"row"}
            grow={1}
            basis={0}
            gap={0}
            justifyContent={"space-evenly"}
            lineWidth={3}
            zIndex={-100}
          >
            <Node
              ref={makeRef(refs.rowContainers, index)}
              opacity={0}
              zIndex={-100}
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
            </Node>
          </Rect>
        ))}
      </Layout>
    </Node>
  );
}
