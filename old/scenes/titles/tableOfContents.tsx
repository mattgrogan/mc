import {
  Gradient,
  Layout,
  Node,
  Rect,
  RectProps,
  Txt,
  TxtProps,
} from "@motion-canvas/2d";
import { all, makeRef, range, Vector2 } from "@motion-canvas/core";

const OPACITY = 0.2;

export function* highlightItem(toc: any, index: number) {
  // Make sure we're on top

  toc.rowRects[index].zIndex(100);

  // Slide the TOC to the left
  yield toc.container.x(-1200, 1);

  // Scale up the current item
  yield toc.rowContainers[index].scale(2, 1);

  const absoluteCenter = new Vector2(1920, 1080);

  // Slide the current item to the right
  yield toc.rowContainers[index].absolutePosition(absoluteCenter.addX(600), 1);

  // Fade out the other items
  const bgNodes = toc.container.findAll(
    (node: Node) => node.zIndex() < 0 && node instanceof Rect
  );
  yield all(...bgNodes.map((bg: Node) => bg.opacity(OPACITY, 1)));
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
    "DEMONSTRATION",
    // "SIMULATION",
    "DICE AND GAME FLOW",
    "HOUSE TAKE AND EDGE",
    "WON/LOST BY SHOOTER",
    "WON/LOST BY SESSION",
    "BANKROLL SURVIVAL",
    // "STRATEGY SCORE",
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
