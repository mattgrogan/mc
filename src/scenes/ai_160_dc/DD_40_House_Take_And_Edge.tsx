import {
  Camera,
  Icon,
  Layout,
  makeScene2D,
  Node,
  Rect,
  Txt,
  TxtProps,
} from "@motion-canvas/2d";
import {
  createRef,
  createRefArray,
  createSignal,
  easeInOutCubic,
  easeOutBounce,
  easeOutCubic,
  range,
  waitFor,
  waitUntil,
} from "@motion-canvas/core";
import { Grays, PoppinsWhite } from "../../styles";
import { FadeIn } from "../../utils/FadeIn";

import { name, data } from "./DD_00_Params";

import {
  commaFormmatter,
  plusCommaFormmatter,
} from "../../components/styled/findQuantiles";
import { tw_colors } from "../../tw_colors";

const DATA = data.OVERALL_STATS.AI160DC;
const TITLE = name + "\nHouse Metrics";

// Time to animate each row
const ROW_FADE_IN_SECS = 0.6;

const TITLE_TXT_PROPS: TxtProps = {
  ...PoppinsWhite,
  fontSize: 100,
  fontWeight: 600,
  fill: tw_colors.zinc[100],
};
const TITLE_RECT_PROPS: TxtProps = {
  fill: tw_colors.rose[950],
};

export default makeScene2D(function* (view) {
  yield* waitFor(1);

  // CONTAINER
  const camera = createRef<Camera>();
  const container = createRef<Layout>();
  view.add(
    <Camera ref={camera}>
      <Layout
        ref={container}
        direction={"column"}
        justifyContent={"center"}
        alignItems={"center"}
        width={"100%"}
        height={"100%"}
        gap={50}
        padding={100}
        layout
      ></Layout>
    </Camera>
  );

  yield* waitFor(1);

  // Add the data rows
  const col2 = createRef<Layout>();
  container().add(
    <Layout
      ref={col2}
      height={"100%"}
      width={"50%"}
    ></Layout>
  );

  // https://github.com/motion-canvas/motion-canvas/issues/1057
  camera().scene().position(view.size().div(2));

  const parameterTable = createRef<Layout>();
  const rowNodes = createRefArray<Node>();
  const rowRects = createRefArray<Rect>();
  const rowTitles = createRefArray<Txt>();
  const rowValues = createRefArray<Txt>();

  // const title = createRef<Txt>();
  const titleRefs = createRefArray<Txt>();
  const title = createSignal(TITLE);

  const totalBetSignal = createSignal(0);
  const totalWonSignal = createSignal(0);
  const totalLostSignal = createSignal(0);
  const houseTakeSignal = createSignal(0);
  const houseEdgeSignal = createSignal(0);

  let z = -100;
  col2().add(
    <Layout
      ref={parameterTable}
      direction={"column"}
      width={"100%"}
      height={"100%"}
      y={view.height() * 0.1}
      x={view.width() / -4}
      gap={20}
      layout
      opacity={1}
    >
      <Node
        ref={rowNodes}
        opacity={0}
        zIndex={z--}
      >
        <Rect
          ref={rowRects}
          basis={0}
          grow={1}
          opacity={1}
          width={"100%"}
          height={"18%"}
          stroke={Grays.GRAY3}
          lineWidth={5}
        >
          <Rect
            width={"100%"}
            height={"100%"}
            fill={Grays.GRAY25}
            justifyContent={"center"}
            alignItems={"center"}
            padding={50}
            direction={"column"}
            {...TITLE_RECT_PROPS}
          >
            {() =>
              title()
                .split("\n")
                .map((line) => (
                  <Txt
                    ref={titleRefs}
                    {...PoppinsWhite}
                    {...TITLE_TXT_PROPS}
                    text={line}
                  />
                ))
            }
          </Rect>
        </Rect>
      </Node>
      {range(5).map((index) => (
        <Node
          ref={rowNodes}
          opacity={0}
          zIndex={z--}
        >
          <Rect
            ref={rowRects}
            basis={0}
            grow={1}
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
                fontSize={90}
                fontWeight={400}
              ></Txt>
            </Rect>
            <Rect
              width={"50%"}
              height={"100%"}
              fill={Grays.GRAY1}
              justifyContent={"end"}
              alignItems={"center"}
              padding={50}
            >
              <Txt
                ref={rowValues}
                {...PoppinsWhite}
                fill={Grays.BLACK}
                // text={"100,000"}
                fontFamily={"Azeret Mono"}
                fontSize={80}
                fontWeight={600}
              ></Txt>
            </Rect>
          </Rect>
        </Node>
      ))}
    </Layout>
  );

  // TODO: For whatever reason, I can't get the titleRefs array to work
  // This would be useful for styling the different rows.

  rowTitles[0].text("TOTAL BET");
  rowTitles[1].text("TOTAL WON");
  rowTitles[2].text("TOTAL LOST");
  rowTitles[3].text("HOUSE TAKE");
  rowTitles[4].text("HOUSE EDGE");

  // rowValues[0].text(commaFormmatter(TOTAL_BET));
  rowValues[0].text(() => commaFormmatter(totalBetSignal()));
  rowValues[1].text(() => plusCommaFormmatter(totalWonSignal()));
  rowValues[2].text(() => commaFormmatter(totalLostSignal()));
  rowValues[3].text(() => commaFormmatter(houseTakeSignal()));
  rowValues[4].text(() => commaFormmatter(houseEdgeSignal() * 100, 3) + "%");

  const arrow = new Icon({
    icon: "mdi:arrow-left-bold",
    scale: 20,
    color: tw_colors.rose[700],
    offsetX: -1,
    layout: false,
    opacity: 0,
  });
  col2().add(arrow);
  arrow.position(rowRects[1].right);

  yield* waitFor(1);

  // Title
  yield* FadeIn(rowNodes[0], ROW_FADE_IN_SECS, easeOutCubic, [0, 50]);

  // Total Bet and show arrow
  yield totalBetSignal(DATA.TOTAL_BET, 1, easeOutCubic);
  yield* FadeIn(rowNodes[1], ROW_FADE_IN_SECS, easeOutCubic, [0, 50]);
  yield* FadeIn(arrow, 1, easeOutBounce, [100, 0]);
  yield* waitFor(2);

  // Total Won
  yield totalWonSignal(DATA.TOTAL_WON, 1, easeOutCubic);
  yield arrow.position(rowRects[2].right, 1, easeInOutCubic);
  yield* FadeIn(rowNodes[2], ROW_FADE_IN_SECS, easeOutCubic, [0, 50]);
  yield* waitFor(2);

  // Total Lost
  yield totalLostSignal(DATA.TOTAL_LOST, 1, easeOutCubic);
  yield arrow.position(rowRects[3].right, 1, easeInOutCubic);
  yield* FadeIn(rowNodes[3], ROW_FADE_IN_SECS, easeOutCubic, [0, 50]);
  yield* waitFor(2);

  // House Take
  yield houseTakeSignal(DATA.HOUSE_TAKE, 1, easeOutCubic);
  yield arrow.position(rowRects[4].right, 1, easeInOutCubic);
  yield* FadeIn(rowNodes[4], ROW_FADE_IN_SECS, easeOutCubic, [0, 50]);
  yield* waitFor(2);

  // House Edge
  yield houseEdgeSignal(DATA.HOUSE_EDGE, 1, easeOutCubic);
  yield arrow.position(rowRects[5].right, 1, easeInOutCubic);
  yield* FadeIn(rowNodes[5], ROW_FADE_IN_SECS, easeOutCubic, [0, 50]);
  yield* waitFor(2);

  yield* arrow.opacity(0, 0.6);
  arrow.remove();

  yield* waitFor(10);
  yield* waitUntil("end");
});
