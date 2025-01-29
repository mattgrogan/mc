import {
  Gradient,
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
  Direction,
  easeInOutCubic,
  easeOutBounce,
  easeOutCubic,
  easeOutExpo,
  makeRefs,
  range,
  sequence,
  slideTransition,
  useLogger,
  waitFor,
  waitUntil,
} from "@motion-canvas/core";
import { Bright, Grays, PoppinsBlack, PoppinsWhite, shooterGradient, Theme } from "../../styles";
import { FadeIn } from "../../utils/FadeIn";

import * as params from "./DD_00_Params_Triple_Triple";

import { Plot } from "../../components/plot/plot";
import { commaFormmatter } from "../../components/styled/findQuantiles";
import { TitleBox } from "../../components/styled/titleBox";
import { audioPlayer } from "./DD_00_Params_Triple_Triple";

const LIGHT_COLOR = "#831414"
const DARK_COLOR = "#6a1010"
const ARROW_COLOR = "#00bcd4"

let titleGradient = shooterGradient

export default makeScene2D(function* (view) {
  view.fill(Theme.BG);

  audioPlayer.woosh();
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

  const plotTitle = makeRefs<typeof TitleBox>();
  container().add(
    <TitleBox
      refs={plotTitle}
      fontSize={100}
      nodeOpacity={0}
      rectProps={{ fill: titleGradient, stroke: Grays.GRAY1 }}
      headerProps={{ ...PoppinsWhite }}
      subheadProps={{ ...PoppinsWhite }}
    >
      HOUSE TAKE AND EDGE
    </TitleBox>
  );
  plotTitle.subhead.text(params.name);

  const parameterTable = createRef<Layout>();
  const rowNodes = createRefArray<Node>();
  const rowRects = createRefArray<Rect>();
  const rowTitles = createRefArray<Txt>();
  const rowValues = createRefArray<Txt>();

  let z = -100;
  container().add(
    <Layout
      ref={parameterTable}
      direction={"column"}
      width={"60%"}
      height={"100%"}
      // y={view.height() * 0.1}
      // x={view.width() / -4}
      // gap={20}
      layout
      opacity={1}
    >
      <Node
        ref={rowNodes}
        opacity={0}
      ></Node>
      {range(5).map(() => (
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
                // text={"SESSIONS"}
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
                fontSize={90}
                fontWeight={600}
              ></Txt>
            </Rect>
          </Rect>
        </Node>
      ))}
    </Layout>
  );

  rowTitles[0].text("TOTAL BET");
  rowTitles[1].text("TOTAL WON");
  rowTitles[2].text("TOTAL LOST");
  rowTitles[3].text("HOUSE TAKE");
  rowTitles[4].text("HOUSE EDGE");

  // Find the correct data from the json file
  rowValues[0].text(commaFormmatter(params.casinostats[0].TOTAL_BET));
  rowValues[1].text(commaFormmatter(params.casinostats[0].TOTAL_WON));
  rowValues[2].text(commaFormmatter(params.casinostats[0].TOTAL_LOST * -1));
  rowValues[3].text(commaFormmatter(params.casinostats[0].HOUSE_TAKE * -1));
  rowValues[4].text(
    commaFormmatter(params.casinostats[0].HOUSE_EDGE * -100, 3) + "%"
  );
  // rowValues[2].text(sim.table_min);
  // rowValues[3].text(sim.table_max);

 

  yield* waitFor(1);
  //yield* FadeIn(parameterTable, 1, easeOutCubic, [0, 100]);

  // Plot is only added after all the layout has been completed.
  

  // START DRAWING THE COMPONENTS HERE

  // Draw the title
  yield* FadeIn(plotTitle.headerContainer, 0, easeOutCubic, [100, 0]);
  yield* FadeIn(plotTitle.subheadContainer, 0, easeOutCubic, [100, 0]);
  yield* FadeIn(plotTitle.container, 0.6, easeOutCubic, [100, 0]);

  yield* waitFor(1);
  // Show the table
  yield* sequence(
    0.4,
    ...rowNodes.map((r) => FadeIn(r, 1, easeOutCubic, [0, 50]))
  );

  yield* waitFor(1);
  yield* waitUntil("show-arrow");

  const arrow = new Icon({
    icon: "mdi:arrow-left-bold",
    scale: 20,
    color: ARROW_COLOR,
    offsetX: -1,
    layout: false,
    opacity: 0,
  });

  arrow.position(rowRects[0].right().addY(160));
  container().add(arrow);
  // Total Bet
  yield* FadeIn(arrow, 1, easeOutBounce, [100, 0]);
  yield* waitFor(2);
  // Total Won
  yield* arrow.position(rowRects[1].right().addY(160), 1, easeInOutCubic);
  yield* waitFor(2);
  // Total Lost
  yield* arrow.position(rowRects[2].right().addY(160), 1, easeInOutCubic);
  yield* waitFor(3);
  // House Take
  yield* arrow.position(rowRects[3].right().addY(160), 1, easeInOutCubic);
  yield* waitFor(2);
  // House Edge
  yield* arrow.position(rowRects[4].right().addY(160), 1, easeInOutCubic);

  yield* waitFor(2);
  yield* arrow.opacity(0, 0.6);
  arrow.remove();
  ////////////////////////////////////////////////////////////

 

    

  yield* waitFor(1);
  yield* waitUntil("end");
});

function* addPointer(plot: Plot, edge: number, label: string) {
  const OPACITY_ON_SECS = 0.7;
  const OPACITY_DELAY_SECS = 0.7;
  const OPACITY_OFF_SECS = 0.7;

  const lineProps = {
    lineWidth: 20,
    stroke: Grays.BLACK,
    // fill: Grays.GRAY2,
    startOffset: 30,
    endOffset: 20,
    //lineDash: [20, 5],
    start: 1,
    startArrow: true,
    arrowSize: 30,
    opacity: 0.6,
  };

  const edgeLabelProps: TxtProps = {
    //...MonoWhite,
    ...PoppinsWhite,
    fill: Grays.BLACK,
    fontWeight: 600,
    fontSize: 60,
    opacity: 0,
    offset: [-1, 0],
  };

  const line = plot.hLine([10, edge], lineProps);
  const text = plot.text([10, edge], {
    ...edgeLabelProps,
    text: label,
  });
  yield line.start(0, 0.6, easeInOutCubic);
  yield text
    .opacity(1, OPACITY_ON_SECS)
    .wait(OPACITY_DELAY_SECS)
    .to(0, OPACITY_OFF_SECS);
}
