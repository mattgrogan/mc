import { Gradient, Layout, makeScene2D } from "@motion-canvas/2d";
import {
  createRef,
  Direction,
  makeRefs,
  sequence,
  slideTransition,
  waitFor,
  waitUntil,
} from "@motion-canvas/core";
import { Darker, Grays, PoppinsBlack, PoppinsWhite, Theme } from "../../styles";
import { TableOfContents, highlightItem } from "./tableOfContents";

const WAIT_SECS = 2;
const INDEX = 1;

const titleGradient = new Gradient({
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
        fill: titleGradient,
        lineWidth: 3,
        stroke: Grays.GRAY3,
      }}
      titleTxtProps={{ ...PoppinsBlack }}
    ></TableOfContents>
  );

  // Show the data table
  yield* sequence(0.1, ...toc.rowContainers.map((pct) => pct.opacity(1, 0.6)));

  yield* highlightItem(toc, INDEX);

  yield* waitFor(WAIT_SECS);
  yield* waitUntil("end");
});
