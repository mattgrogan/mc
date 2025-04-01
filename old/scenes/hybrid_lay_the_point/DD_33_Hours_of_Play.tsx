import { makeScene2D, Layout, Node, Rect, Txt } from "@motion-canvas/2d";
import {
  waitFor,
  createRef,
  waitUntil,
  makeRefs,
  easeOutCubic,
  range,
  createRefArray,
} from "@motion-canvas/core";
import {
  gameFlowGradient,
  Grays,
  PoppinsBlack,
  PoppinsWhite,
  silverGradient,
  Theme,
} from "../../styles";
import * as params from "./DD_00_Params";
import { TitleBox } from "../../components/styled/titleBox";
import {
  commaFormmatter,
  getQuantileData,
} from "../../components/styled/findQuantiles";
import { FadeIn } from "../../utils/FadeIn";

const QUANTILES_ID = "SESSION_ROLL_BY_SESSION";
const fontSize = 60;
const occTitleFontSize = 50;
const occFontSize = 30;

const headerRectProps = { fill: gameFlowGradient, stroke: Grays.GRAY1 };
const valueRectProps = { fill: "#c5c5c5", stroke: Grays.GRAY1 };
const headerTxtProps = { ...PoppinsWhite, fontSize: 55 };
const valueTxtProps = { ...PoppinsBlack, padding: 30 };

export default makeScene2D(function* (view) {
  view.fill(Theme.BG);

  yield* waitFor(1);
  const container = createRef<Layout>();
  view.add(
    <Layout
      ref={container}
      direction={"column"}
      justifyContent={"space-around"}
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
      rectProps={{ fill: gameFlowGradient, stroke: Grays.GRAY1 }}
      headerProps={{ ...PoppinsWhite }}
      subheadProps={{ ...PoppinsWhite }}
    >
      LENGTH OF PLAY
    </TitleBox>
  );
  plotTitle.subhead.text(params.name);

  // Find the correct data from the json file
  const data = getQuantileData(QUANTILES_ID, params.quantiles);

  //   data.splice(0, 0, {
  //     label: "",
  //     value: "ROLLS",
  //   });

  data.splice(4, 0, {
    label: "AVERAGE",
    value: (params.simstats[0].ROLLS / params.simstats[0].SESSIONS).toFixed(1),
  });

  const emptyTable = {};

  const tableContainer = createRef<Node>();
  const columns = createRefArray<Node>();

  // Create the table
  container().add(
    <Node
      ref={tableContainer}
      opacity={0}
    >
      <Layout
        width={"100%"}
        height={"60%"}
        direction={"row"}
        gap={0}
        justifyContent={"space-evenly"}
        layout
      >
        <Node
          //   ref={columns}
          opacity={1}
        >
          <Layout
            direction={"column"}
            grow={1}
            height={"100%"}
            basis={0}
          >
            <Rect
              //   ref={makeRef(refs.headerRects, index)}
              height={"50%"}
              justifyContent={"center"}
              alignItems={"center"}
              lineWidth={3}
              {...headerRectProps}
            >
              <Txt
                // ref={makeRef(refs.headerTxts, index)}
                //   {...PoppinsWhite}
                fontSize={fontSize}
                fontWeight={600}
                text={"TABLE OCCUPANCY"}
                {...headerTxtProps}
              ></Txt>
            </Rect>

            {/* ROLLS */}
            <Rect
              //   ref={makeRef(refs.valueRects, index)}
              height={"50%"}
              justifyContent={"start"}
              alignItems={"center"}
              lineWidth={3}
              {...valueRectProps}
            >
              <Txt
                // ref={makeRef(refs.valueTxts, index)}
                //   {...PoppinsBlack}
                fontSize={occTitleFontSize}
                fontWeight={600}
                text={"NUMBER OF ROLLS"}
                {...valueTxtProps}
              ></Txt>
            </Rect>
            {/* EMPTY TABLE */}
            <Rect
              //   ref={makeRef(refs.valueRects, index)}
              height={"50%"}
              justifyContent={"start"}
              alignItems={"center"}
              lineWidth={3}
              {...valueRectProps}
            >
              <Txt
                // ref={makeRef(refs.valueTxts, index)}
                //   {...PoppinsBlack}
                fontSize={occTitleFontSize}
                fontWeight={600}
                // text={"EMPTY"}
                {...valueTxtProps}
                direction={"column"}
              >
                EMPTY
                <Txt
                  // ref={makeRef(refs.valueTxts, index)}
                  //   {...PoppinsBlack}
                  fontSize={occFontSize}
                  fontWeight={500}
                  text={"(100 ROLLS / HR)"}
                  {...valueTxtProps}
                ></Txt>
              </Txt>
            </Rect>

            {/* HALF FULL TABLE */}
            <Rect
              //   ref={makeRef(refs.valueRects, index)}
              height={"50%"}
              justifyContent={"start"}
              alignItems={"center"}
              lineWidth={3}
              {...valueRectProps}
            >
              <Txt
                // ref={makeRef(refs.valueTxts, index)}
                //   {...PoppinsBlack}
                fontSize={occTitleFontSize}
                fontWeight={600}
                // text={"EMPTY"}
                {...valueTxtProps}
                direction={"column"}
              >
                HALF-FULL
                <Txt
                  // ref={makeRef(refs.valueTxts, index)}
                  //   {...PoppinsBlack}
                  fontSize={occFontSize}
                  fontWeight={500}
                  text={"(80 ROLLS / HR)"}
                  {...valueTxtProps}
                ></Txt>
              </Txt>
            </Rect>

            {/* FULL TABLE */}
            <Rect
              //   ref={makeRef(refs.valueRects, index)}
              height={"50%"}
              justifyContent={"start"}
              alignItems={"center"}
              lineWidth={3}
              {...valueRectProps}
            >
              <Txt
                // ref={makeRef(refs.valueTxts, index)}
                //   {...PoppinsBlack}
                fontSize={occTitleFontSize}
                fontWeight={600}
                // text={"EMPTY"}
                {...valueTxtProps}
                direction={"column"}
              >
                FULL
                <Txt
                  // ref={makeRef(refs.valueTxts, index)}
                  //   {...PoppinsBlack}
                  fontSize={occFontSize}
                  fontWeight={500}
                  text={"(60 ROLLS / HR)"}
                  {...valueTxtProps}
                ></Txt>
              </Txt>
            </Rect>
          </Layout>
        </Node>
        {range(data.length).map((index) => (
          <Node
            ref={columns}
            opacity={1}
          >
            <Layout
              direction={"column"}
              grow={1}
              height={"100%"}
              basis={0}
            >
              <Rect
                //   ref={makeRef(refs.headerRects, index)}
                height={"50%"}
                justifyContent={"center"}
                alignItems={"center"}
                lineWidth={3}
                {...headerRectProps}
              >
                <Txt
                  // ref={makeRef(refs.headerTxts, index)}
                  //   {...PoppinsWhite}
                  fontSize={fontSize}
                  fontWeight={600}
                  text={data[index].label}
                  {...headerTxtProps}
                ></Txt>
              </Rect>

              {/* ROLLS */}
              <Rect
                //   ref={makeRef(refs.valueRects, index)}
                height={"50%"}
                justifyContent={"center"}
                alignItems={"center"}
                lineWidth={3}
                {...valueRectProps}
              >
                <Txt
                  // ref={makeRef(refs.valueTxts, index)}
                  //   {...PoppinsBlack}
                  fontSize={fontSize + 15}
                  fontWeight={600}
                  text={commaFormmatter(Number(data[index].value))}
                  {...valueTxtProps}
                ></Txt>
              </Rect>

              {/* EMPTY TABLE */}
              <Rect
                //   ref={makeRef(refs.valueRects, index)}
                height={"50%"}
                justifyContent={"center"}
                alignItems={"center"}
                lineWidth={3}
                {...valueRectProps}
              >
                <Txt
                  // ref={makeRef(refs.valueTxts, index)}
                  //   {...PoppinsBlack}
                  fontSize={fontSize}
                  fontWeight={600}
                  text={t(data[index].value, 100)}
                  {...valueTxtProps}
                ></Txt>
              </Rect>

              {/* HALF FULL TABLE */}
              <Rect
                //   ref={makeRef(refs.valueRects, index)}
                height={"50%"}
                justifyContent={"center"}
                alignItems={"center"}
                lineWidth={3}
                {...valueRectProps}
              >
                <Txt
                  // ref={makeRef(refs.valueTxts, index)}
                  //   {...PoppinsBlack}
                  fontSize={fontSize}
                  fontWeight={600}
                  text={t(data[index].value, 80)}
                  {...valueTxtProps}
                ></Txt>
              </Rect>

              {/* FULL TABLE */}
              <Rect
                //   ref={makeRef(refs.valueRects, index)}
                height={"50%"}
                justifyContent={"center"}
                alignItems={"center"}
                lineWidth={3}
                {...valueRectProps}
              >
                <Txt
                  // ref={makeRef(refs.valueTxts, index)}
                  //   {...PoppinsBlack}
                  fontSize={fontSize}
                  fontWeight={600}
                  text={t(data[index].value, 60)}
                  {...valueTxtProps}
                ></Txt>
              </Rect>
            </Layout>
          </Node>
        ))}
      </Layout>
    </Node>
  );
  // START DRAWING THE COMPONENTS HERE

  // Draw the title
  yield* FadeIn(plotTitle.headerContainer, 0, easeOutCubic, [100, 0]);
  yield* FadeIn(plotTitle.subheadContainer, 0, easeOutCubic, [100, 0]);
  yield* FadeIn(plotTitle.container, 0.6, easeOutCubic, [100, 0]);

  yield* FadeIn(tableContainer, 0.6, easeOutCubic, [100, 0]);

  yield* waitFor(10);
  yield* waitUntil("end");
});

function sessionLengthInMins(rolls: number, rollsPerHour: number) {
  const minsPerRoll = 60 / rollsPerHour;
  const sessionLengthMins = rolls * minsPerRoll;
  return sessionLengthMins;
}

function minsAsString(mins: number) {
  const rawQuotient = mins / 60;
  const remainder = rawQuotient % 1;
  const hours = rawQuotient - remainder;
  const minutes = Math.round(mins % 60);
  let str = "";
  if (hours > 0) {
    str += hours + "h ";
  }
  return str + minutes + "m";
}

function t(rolls: string, rollsPerHour: number) {
  return minsAsString(sessionLengthInMins(Number(rolls), rollsPerHour));
}
