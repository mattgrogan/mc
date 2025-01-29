import { Gradient, Layout, makeScene2D, Txt } from "@motion-canvas/2d";
import { Bright, Darker, gameFlowDark, gameFlowGradient, grayGradient, Grays,  PoppinsBlack, PoppinsWhite, sessionGradient, shooterGradient, silverGradient, Theme } from "../../styles";
import { all, Color, createRef, easeOutCubic, linear, makeRefs, sequence, waitFor, waitUntil } from "@motion-canvas/core";
import { DataTable } from "../../components/styled/dataTable";
import { TitleBox } from "../../components/styled/titleBox";
import { FadeIn } from "../../utils/FadeIn";
import { getQuantileData, plusCommaFormmatter } from "../../components/styled/findQuantiles";

import * as DoubleDoubleParams from "./DD_00_Params_Double_Double";
import * as DoubleTripleParams from "./DD_00_Params_Double_Triple";
import * as TripleTripleParams from "./DD_00_Params_Triple_Triple";
import { CircumscribeRect } from "../../utils/Circumscribe";

const QUANTILES_ID = "PLYR_CWONLOST_BY_SESSION";


export const greenLight = "#37474f";
export const greenDark = "#263238";
export const greenGradient = new Gradient({
  from: [0, -300],
  to: [0, 100],
  stops: [
    { offset: 0, color: greenLight },
    { offset: 1, color: greenDark },
  ],
});

const DOUBLE_DOUBLE_AVG_WONLOST = DoubleDoubleParams.amountWonLostQuantiles.find(
  (stat) => stat.STAT == "MEAN_WONLOST"
).BY_SESSION;

const DOUBLE_TRIPLE_AVG_WONLOST = DoubleTripleParams.amountWonLostQuantiles.find(
  (stat) => stat.STAT == "MEAN_WONLOST"
).BY_SESSION;

const TRIPLE_TRIPLE_AVG_WONLOST = TripleTripleParams.amountWonLostQuantiles.find(
  (stat) => stat.STAT == "MEAN_WONLOST"
).BY_SESSION;

export default makeScene2D(function* (view) {
    view.fill(Theme.BG);
    yield* waitFor(2)

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
      rectProps={{ fill: greenGradient, stroke: Grays.GRAY1 }}
      headerProps={{ ...PoppinsWhite }}
      subheadProps={{ ...PoppinsWhite }}
    >
      COMPARING THE THREE SCENARIOS
    </TitleBox>
  );
  plotTitle.subhead.text("");

  //////////////////////
  // DOUBLE DOUBLE
  //////////////////////
  const doubleDoubleDataTable = makeRefs<typeof DataTable>();

  // Find the correct data from the json file
  const doubleDoubleTableData = getQuantileData(
    QUANTILES_ID,
    DoubleDoubleParams.quantiles,
    plusCommaFormmatter
  );
  doubleDoubleTableData[0].label = "MOST LOST";
  doubleDoubleTableData[6].label = "MOST WON";

  doubleDoubleTableData.splice(4, 0, {
    label: "AVERAGE",
    value: DOUBLE_DOUBLE_AVG_WONLOST.toFixed(2),
  });

  // Create the data table and pass in the references
  const doubleDoubleTitle = createRef<Layout>()
  container().add(
    <Layout layout ref={doubleDoubleTitle} opacity={0} direction="row" width={"100%"} justifyContent={"space-between"}>

  <Txt 
    text={DoubleDoubleParams.name}
    {...PoppinsWhite}
    fill={Grays.GRAY2}
    fontWeight={700}
    fontSize={90}
    alignSelf={"start"}
    />
      <Txt 
    text="5.56% HOUSE EDGE"
    {...PoppinsWhite}
    fill={Grays.GRAY2}
    fontWeight={700}
    fontSize={90}
    alignSelf={"end"}
    />
    </Layout>
)
  container().add(
    <DataTable
      refs={doubleDoubleDataTable}
      data={doubleDoubleTableData}
      headerRectProps={{ fill: gameFlowGradient, stroke: Grays.GRAY1 }}
      valueRectProps={{ fill: silverGradient, stroke: Grays.GRAY1 }}
      headerTxtProps={{ ...PoppinsWhite, fontSize: 55 }}
      valueTxtProps={{ ...PoppinsBlack }}
      fontSize={70}
    ></DataTable>
  );

  //////////////////////
  // DOUBLE TRIPLE
  //////////////////////
  const doubleTripleDataTable = makeRefs<typeof DataTable>();

  // Find the correct data from the json file
  const doubleTripleTableData = getQuantileData(
    QUANTILES_ID,
    DoubleTripleParams.quantiles,
    plusCommaFormmatter
  );
  doubleTripleTableData[0].label = "MOST LOST";
  doubleTripleTableData[6].label = "MOST WON";

  doubleTripleTableData.splice(4, 0, {
    label: "AVERAGE",
    value: DOUBLE_TRIPLE_AVG_WONLOST.toFixed(2),
  });

  // Create the data table and pass in the references
  const doubleTripleTitle = createRef<Layout>()
  container().add(
    <Layout layout ref={doubleTripleTitle} opacity={0} direction="row" width={"100%"} justifyContent={"space-between"}>

  <Txt 
    text={DoubleTripleParams.name}
    {...PoppinsWhite}
    fill={Grays.GRAY2}
    fontWeight={700}
    fontSize={90}
    alignSelf={"start"}
    />
    <Txt 
    text="2.78% HOUSE EDGE"
    {...PoppinsWhite}
    fill={Grays.GRAY2}
    fontWeight={700}
    fontSize={90}
    alignSelf={"end"}
    />
    </Layout>
)
  container().add(
    <DataTable
      refs={doubleTripleDataTable}
      data={doubleTripleTableData}
      headerRectProps={{ fill: shooterGradient, stroke: Grays.GRAY1 }}
      valueRectProps={{ fill: silverGradient, stroke: Grays.GRAY1 }}
      headerTxtProps={{ ...PoppinsWhite, fontSize: 55 }}
      valueTxtProps={{ ...PoppinsBlack }}
      fontSize={70}
    ></DataTable>
  );

  //////////////////////
  // TRIPLE TRIPLE
  //////////////////////
  const tripleTripleDataTable = makeRefs<typeof DataTable>();

  // Find the correct data from the json file
  const tripleTripleTableData = getQuantileData(
    QUANTILES_ID,
    TripleTripleParams.quantiles,
    plusCommaFormmatter
  );
  tripleTripleTableData[0].label = "MOST LOST";
  tripleTripleTableData[6].label = "MOST WON";

  tripleTripleTableData.splice(4, 0, {
    label: "AVERAGE",
    value: TRIPLE_TRIPLE_AVG_WONLOST.toFixed(2),
  });

  // Create the data table and pass in the references
  const tripleTripleTitle = createRef<Layout>()
  container().add(
  <Layout layout direction="row" ref={tripleTripleTitle} opacity={0} width={"100%"} justifyContent={"space-between"}>

  <Txt 
    text={TripleTripleParams.name}
    {...PoppinsWhite}
    fill={Grays.GRAY2}
    fontWeight={700}
    fontSize={90}
    alignSelf={"start"}
    />
  <Txt 
    text="0.00% HOUSE EDGE"
    {...PoppinsWhite}
    fill={Grays.GRAY2}
    fontWeight={700}
    fontSize={90}
    alignSelf={"end"}
    />
    </Layout>
)
  container().add(
    <DataTable
      refs={tripleTripleDataTable}
      data={tripleTripleTableData}
      headerRectProps={{ fill: sessionGradient, stroke: Grays.GRAY1 }}
      valueRectProps={{ fill: silverGradient, stroke: Grays.GRAY1 }}
      headerTxtProps={{ ...PoppinsWhite, fontSize: 55 }}
      valueTxtProps={{ ...PoppinsBlack }}
      fontSize={70}
    ></DataTable>
  );

  ////////////////////////////////////////////////////
  // START DRAWING THE COMPONENTS HERE

  // Draw the title
  yield* FadeIn(plotTitle.headerContainer, 0, easeOutCubic, [100, 0]);
  yield* FadeIn(plotTitle.subheadContainer, 0, easeOutCubic, [100, 0]);
  yield* FadeIn(plotTitle.container, 0.6, easeOutCubic, [100, 0]);




    // Show the data tables
    yield* FadeIn(doubleDoubleTitle, 1, easeOutCubic, [0, 50])
    yield* sequence(0.1, ...doubleDoubleDataTable.columns.map((pct) => pct.opacity(0.5, 0.6)));
    yield* FadeIn(doubleTripleTitle, 1, easeOutCubic, [0, 50])
    yield* sequence(0.1, ...doubleTripleDataTable.columns.map((pct) => pct.opacity(0.5, 0.6)));
    yield* FadeIn(tripleTripleTitle, 1, easeOutCubic, [0, 50])
    yield* sequence(0.1, ...tripleTripleDataTable.columns.map((pct) => pct.opacity(0.5, 0.6)));

    // // Highlight median
    // yield CircumscribeRect(doubleDoubleDataTable.valueRects[3], Darker.ORANGE, 0.93, 20, 5)
    // yield CircumscribeRect(doubleTripleDataTable.valueRects[3], Darker.ORANGE, 0.93, 20, 5)
    // yield* CircumscribeRect(tripleTripleDataTable.valueRects[3], Darker.ORANGE, 0.93, 20, 5)
    
    // yield* waitFor(1)
    
    // // Highlight average
    // yield CircumscribeRect(doubleDoubleDataTable.valueRects[4], Darker.ORANGE, 0.93, 20, 5)
    // yield CircumscribeRect(doubleTripleDataTable.valueRects[4], Darker.ORANGE, 0.93, 20, 5)
    // yield* CircumscribeRect(tripleTripleDataTable.valueRects[4], Darker.ORANGE, 0.93, 20, 5)

  // Median
  yield* waitUntil("median")
  yield* doubleDoubleDataTable.columns[3].opacity(1, 0.6);
  yield* doubleTripleDataTable.columns[3].opacity(1, 0.6);
  yield* tripleTripleDataTable.columns[3].opacity(1, 0.6);
  yield* waitFor(1);
  
  // Average
  yield* waitUntil("avg")
  yield doubleDoubleDataTable.columns[3].opacity(0.5, 0.6);
  yield doubleTripleDataTable.columns[3].opacity(0.5, 0.6);
  yield tripleTripleDataTable.columns[3].opacity(0.5, 0.6);

  yield doubleDoubleDataTable.columns[4].opacity(1, 0.6);
  yield doubleTripleDataTable.columns[4].opacity(1, 0.6);
  yield tripleTripleDataTable.columns[4].opacity(1, 0.6);
  yield* waitFor(1);
  
//   // IQR
  yield* waitUntil("iqr")
yield doubleDoubleDataTable.columns[4].opacity(0.5, 0.6);
yield doubleTripleDataTable.columns[4].opacity(0.5, 0.6);
yield tripleTripleDataTable.columns[4].opacity(0.5, 0.6);

yield doubleDoubleDataTable.columns[2].opacity(1, 0.6);
yield doubleTripleDataTable.columns[2].opacity(1, 0.6);
yield tripleTripleDataTable.columns[2].opacity(1, 0.6);
yield doubleDoubleDataTable.columns[5].opacity(1, 0.6);
yield doubleTripleDataTable.columns[5].opacity(1, 0.6);
yield tripleTripleDataTable.columns[5].opacity(1, 0.6);
yield* waitFor(1);
  
  // Middle 90%
  yield* waitUntil("ninety")
  yield doubleDoubleDataTable.columns[2].opacity(0.5, 0.6);
  yield doubleTripleDataTable.columns[2].opacity(0.5, 0.6);
  yield tripleTripleDataTable.columns[2].opacity(0.5, 0.6);
  yield doubleDoubleDataTable.columns[5].opacity(0.5, 0.6);
  yield doubleTripleDataTable.columns[5].opacity(0.5, 0.6);
  yield tripleTripleDataTable.columns[5].opacity(0.5, 0.6);
  
  yield doubleDoubleDataTable.columns[1].opacity(1, 0.6);
  yield doubleTripleDataTable.columns[1].opacity(1, 0.6);
  yield tripleTripleDataTable.columns[1].opacity(1, 0.6);
  yield doubleDoubleDataTable.columns[6].opacity(1, 0.6);
  yield doubleTripleDataTable.columns[6].opacity(1, 0.6);
  yield tripleTripleDataTable.columns[6].opacity(1, 0.6);
  yield* waitFor(1);
    
  
  // Min/Max
  yield* waitUntil("minmax")
  yield doubleDoubleDataTable.columns[1].opacity(0.5, 0.6);
  yield doubleTripleDataTable.columns[1].opacity(0.5, 0.6);
  yield tripleTripleDataTable.columns[1].opacity(0.5, 0.6);
  yield doubleDoubleDataTable.columns[6].opacity(0.5, 0.6);
  yield doubleTripleDataTable.columns[6].opacity(0.5, 0.6);
  yield tripleTripleDataTable.columns[6].opacity(0.5, 0.6);
  
  yield doubleDoubleDataTable.columns[0].opacity(1, 0.6);
  yield doubleTripleDataTable.columns[0].opacity(1, 0.6);
  yield tripleTripleDataTable.columns[0].opacity(1, 0.6);
  yield doubleDoubleDataTable.columns[7].opacity(1, 0.6);
  yield doubleTripleDataTable.columns[7].opacity(1, 0.6);
  yield tripleTripleDataTable.columns[7].opacity(1, 0.6);
  yield* waitFor(1);

  yield* waitUntil("all")
  yield* all( ...doubleDoubleDataTable.columns.map((pct) => pct.opacity(1, 0.6)),
  ...doubleTripleDataTable.columns.map((pct) => pct.opacity(1, 0.6)),
  ...tripleTripleDataTable.columns.map((pct) => pct.opacity(1, 0.6)),
);

    yield* waitFor(2)
    yield* waitUntil("end")
})