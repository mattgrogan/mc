import { Icon, Layout, Line, makeScene2D, Rect } from "@motion-canvas/2d";
import {
  blueGradient,
  Bright,
  Darker,
  Darkest,
  grayGradient,
  Grays,
  greenGradient,
  PoppinsBlack,
  PoppinsWhite,
  purpleGradient,
  redGradient,
  sessionGradient,
  silverGradient,
  Theme,
} from "../../styles";
import {
  createRef,
  createRefArray,
  easeInOutCubic,
  makeRefs,
  sequence,
  waitFor,
  waitUntil,
} from "@motion-canvas/core";
import { DataTable } from "../../components/styled/dataTable";

export default makeScene2D(function* (view) {
  // view.fill(Theme.BG);

  yield* waitFor(1);

  // Create a table for the dice rolls
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

  const tableData = [
    { label: "2", value: "LOSE" },
    { label: "3", value: "LOSE" },
    { label: "4", value: "-" },
    { label: "5", value: "-" },
    { label: "6", value: "-" },
    { label: "7", value: "WIN" },
    { label: "8", value: "-" },
    { label: "9", value: "-" },
    { label: "10", value: "-" },
    { label: "11", value: "WIN" },
    { label: "12", value: "LOSE" },
  ];

  // ADD THE TABLE
  const dataTable = makeRefs<typeof DataTable>();
  container().add(
    <DataTable
      refs={dataTable}
      data={tableData}
      headerRectProps={{ fill: grayGradient, stroke: Grays.GRAY1 }}
      valueRectProps={{ fill: silverGradient, stroke: Grays.GRAY1 }}
      headerTxtProps={{ ...PoppinsWhite, fontSize: 90 }}
      valueTxtProps={{ ...PoppinsWhite }}
      fontSize={70}
    ></DataTable>
  );

  dataTable.valueRects[0].fill(grayGradient);
  dataTable.valueRects[1].fill(grayGradient);
  dataTable.valueRects[2].fill(grayGradient);
  dataTable.valueRects[3].fill(grayGradient);
  dataTable.valueRects[4].fill(grayGradient);
  dataTable.valueRects[5].fill(greenGradient);
  dataTable.valueRects[6].fill(grayGradient);
  dataTable.valueRects[7].fill(grayGradient);
  dataTable.valueRects[8].fill(grayGradient);
  dataTable.valueRects[9].fill(greenGradient);
  dataTable.valueRects[10].fill(grayGradient);

  //dataTable.columns.map((pct) => pct.opacity(1))
  dataTable.valueRects.map((pct) => pct.opacity(0));

  // Show the data table
  yield* sequence(0.1, ...dataTable.columns.map((pct) => pct.opacity(1, 0.6)));

  yield* waitFor(0.2);
  // yield* waitUntil("show-winners")
  // Show the winners
  const winValueRects = [
    dataTable.valueRects[0],
    dataTable.valueRects[1],
    dataTable.valueRects[2],
    dataTable.valueRects[3],
    dataTable.valueRects[4],
    dataTable.valueRects[5],
    dataTable.valueRects[6],
    dataTable.valueRects[7],
    dataTable.valueRects[8],
    dataTable.valueRects[9],
    dataTable.valueRects[10],
  ];
  yield* sequence(0.1, ...winValueRects.map((pct) => pct.opacity(1, 0.6)));

  yield* waitFor(0.5);
  // yield* waitUntil("show-losers")

  // Show the losers
  // const loseValueRects = [
  // ]
  // yield* sequence(0.1, ...loseValueRects.map((pct) => pct.opacity(1, 0.6)));

  // Show dice
  // yield* waitUntil("show-dice")

  // Move table down a bit
  yield* dataTable.container.position(
    dataTable.container.position().addY(500),
    1,
    easeInOutCubic
  );

  const diceContainer = createRef<Layout>();
  const dicePairs = createRefArray<Layout>();
  view.add(
    <Layout
      layout
      alignItems={"end"}
      gap={50}
      y={-100}
    >
      {/* 2 */}
      <Layout direction="row">
        <Layout
          direction="row"
          gap={10}
          ref={dicePairs}
        >
          <Icon
            icon={"game-icons:dice-six-faces-one"}
            color={Bright.WHITE}
            scale={1}
            size={100}
          />
          <Icon
            icon={"game-icons:dice-six-faces-one"}
            color={Bright.WHITE}
            scale={1}
            size={100}
          />
        </Layout>
      </Layout>
      {/* 3 */}
      <Layout
        direction={"column"}
        gap={20}
      >
        <Layout
          direction="row"
          gap={10}
          ref={dicePairs}
        >
          <Icon
            icon={"game-icons:dice-six-faces-one"}
            color={Bright.WHITE}
            scale={1}
            size={100}
          />
          <Icon
            icon={"game-icons:dice-six-faces-two"}
            color={Bright.WHITE}
            scale={1}
            size={100}
          />
        </Layout>
        <Layout
          direction="row"
          gap={10}
          ref={dicePairs}
        >
          <Icon
            icon={"game-icons:dice-six-faces-two"}
            color={Bright.WHITE}
            scale={1}
            size={100}
          />
          <Icon
            icon={"game-icons:dice-six-faces-one"}
            color={Bright.WHITE}
            scale={1}
            size={100}
          />
        </Layout>
      </Layout>
      {/* 4 */}
      <Layout
        direction={"column"}
        gap={20}
      >
        <Layout
          direction="row"
          gap={10}
          ref={dicePairs}
        >
          <Icon
            icon={"game-icons:dice-six-faces-one"}
            color={Bright.WHITE}
            scale={1}
            size={100}
          />
          <Icon
            icon={"game-icons:dice-six-faces-three"}
            color={Bright.WHITE}
            scale={1}
            size={100}
          />
        </Layout>
        <Layout
          direction="row"
          gap={10}
          ref={dicePairs}
        >
          <Icon
            icon={"game-icons:dice-six-faces-three"}
            color={Bright.WHITE}
            scale={1}
            size={100}
          />
          <Icon
            icon={"game-icons:dice-six-faces-one"}
            color={Bright.WHITE}
            scale={1}
            size={100}
          />
        </Layout>
        <Layout
          direction="row"
          gap={10}
          ref={dicePairs}
        >
          <Icon
            icon={"game-icons:dice-six-faces-two"}
            color={Bright.WHITE}
            scale={1}
            size={100}
          />
          <Icon
            icon={"game-icons:dice-six-faces-two"}
            color={Bright.WHITE}
            scale={1}
            size={100}
          />
        </Layout>
      </Layout>
      {/* 5 */}
      <Layout
        direction={"column"}
        gap={20}
      >
        <Layout
          direction="row"
          gap={10}
          ref={dicePairs}
        >
          <Icon
            icon={"game-icons:dice-six-faces-one"}
            color={Bright.WHITE}
            scale={1}
            size={100}
          />
          <Icon
            icon={"game-icons:dice-six-faces-four"}
            color={Bright.WHITE}
            scale={1}
            size={100}
          />
        </Layout>
        <Layout
          direction="row"
          gap={10}
          ref={dicePairs}
        >
          <Icon
            icon={"game-icons:dice-six-faces-four"}
            color={Bright.WHITE}
            scale={1}
            size={100}
          />
          <Icon
            icon={"game-icons:dice-six-faces-one"}
            color={Bright.WHITE}
            scale={1}
            size={100}
          />
        </Layout>
        <Layout
          direction="row"
          gap={10}
          ref={dicePairs}
        >
          <Icon
            icon={"game-icons:dice-six-faces-two"}
            color={Bright.WHITE}
            scale={1}
            size={100}
          />
          <Icon
            icon={"game-icons:dice-six-faces-three"}
            color={Bright.WHITE}
            scale={1}
            size={100}
          />
        </Layout>
        <Layout
          direction="row"
          gap={10}
          ref={dicePairs}
        >
          <Icon
            icon={"game-icons:dice-six-faces-three"}
            color={Bright.WHITE}
            scale={1}
            size={100}
          />
          <Icon
            icon={"game-icons:dice-six-faces-two"}
            color={Bright.WHITE}
            scale={1}
            size={100}
          />
        </Layout>
      </Layout>
      {/* 6 */}
      <Layout
        direction={"column"}
        gap={20}
      >
        <Layout
          direction="row"
          gap={10}
          ref={dicePairs}
        >
          <Icon
            icon={"game-icons:dice-six-faces-one"}
            color={Bright.WHITE}
            scale={1}
            size={100}
          />
          <Icon
            icon={"game-icons:dice-six-faces-five"}
            color={Bright.WHITE}
            scale={1}
            size={100}
          />
        </Layout>
        <Layout
          direction="row"
          gap={10}
          ref={dicePairs}
        >
          <Icon
            icon={"game-icons:dice-six-faces-five"}
            color={Bright.WHITE}
            scale={1}
            size={100}
          />
          <Icon
            icon={"game-icons:dice-six-faces-one"}
            color={Bright.WHITE}
            scale={1}
            size={100}
          />
        </Layout>
        <Layout
          direction="row"
          gap={10}
          ref={dicePairs}
        >
          <Icon
            icon={"game-icons:dice-six-faces-two"}
            color={Bright.WHITE}
            scale={1}
            size={100}
          />
          <Icon
            icon={"game-icons:dice-six-faces-four"}
            color={Bright.WHITE}
            scale={1}
            size={100}
          />
        </Layout>
        <Layout
          direction="row"
          gap={10}
          ref={dicePairs}
        >
          <Icon
            icon={"game-icons:dice-six-faces-four"}
            color={Bright.WHITE}
            scale={1}
            size={100}
          />
          <Icon
            icon={"game-icons:dice-six-faces-two"}
            color={Bright.WHITE}
            scale={1}
            size={100}
          />
        </Layout>
        <Layout
          direction="row"
          gap={10}
          ref={dicePairs}
        >
          <Icon
            icon={"game-icons:dice-six-faces-three"}
            color={Bright.WHITE}
            scale={1}
            size={100}
          />
          <Icon
            icon={"game-icons:dice-six-faces-three"}
            color={Bright.WHITE}
            scale={1}
            size={100}
          />
        </Layout>
      </Layout>
      {/* 7 */}
      <Layout
        direction={"column"}
        gap={20}
      >
        <Layout
          direction="row"
          gap={10}
          ref={dicePairs}
        >
          <Icon
            icon={"game-icons:dice-six-faces-one"}
            color={Bright.WHITE}
            scale={1}
            size={100}
          />
          <Icon
            icon={"game-icons:dice-six-faces-six"}
            color={Bright.WHITE}
            scale={1}
            size={100}
          />
        </Layout>
        <Layout
          direction="row"
          gap={10}
          ref={dicePairs}
        >
          <Icon
            icon={"game-icons:dice-six-faces-six"}
            color={Bright.WHITE}
            scale={1}
            size={100}
          />
          <Icon
            icon={"game-icons:dice-six-faces-one"}
            color={Bright.WHITE}
            scale={1}
            size={100}
          />
        </Layout>
        <Layout
          direction="row"
          gap={10}
          ref={dicePairs}
        >
          <Icon
            icon={"game-icons:dice-six-faces-two"}
            color={Bright.WHITE}
            scale={1}
            size={100}
          />
          <Icon
            icon={"game-icons:dice-six-faces-five"}
            color={Bright.WHITE}
            scale={1}
            size={100}
          />
        </Layout>
        <Layout
          direction="row"
          gap={10}
          ref={dicePairs}
        >
          <Icon
            icon={"game-icons:dice-six-faces-five"}
            color={Bright.WHITE}
            scale={1}
            size={100}
          />
          <Icon
            icon={"game-icons:dice-six-faces-two"}
            color={Bright.WHITE}
            scale={1}
            size={100}
          />
        </Layout>
        <Layout
          direction="row"
          gap={10}
          ref={dicePairs}
        >
          <Icon
            icon={"game-icons:dice-six-faces-three"}
            color={Bright.WHITE}
            scale={1}
            size={100}
          />
          <Icon
            icon={"game-icons:dice-six-faces-four"}
            color={Bright.WHITE}
            scale={1}
            size={100}
          />
        </Layout>
        <Layout
          direction="row"
          gap={10}
          ref={dicePairs}
        >
          <Icon
            icon={"game-icons:dice-six-faces-four"}
            color={Bright.WHITE}
            scale={1}
            size={100}
          />
          <Icon
            icon={"game-icons:dice-six-faces-three"}
            color={Bright.WHITE}
            scale={1}
            size={100}
          />
        </Layout>
      </Layout>
      {/* 8 */}
      <Layout
        direction={"column"}
        gap={20}
      >
        <Layout
          direction="row"
          gap={10}
          ref={dicePairs}
        >
          <Icon
            icon={"game-icons:dice-six-faces-two"}
            color={Bright.WHITE}
            scale={1}
            size={100}
          />
          <Icon
            icon={"game-icons:dice-six-faces-six"}
            color={Bright.WHITE}
            scale={1}
            size={100}
          />
        </Layout>
        <Layout
          direction="row"
          gap={10}
          ref={dicePairs}
        >
          <Icon
            icon={"game-icons:dice-six-faces-two"}
            color={Bright.WHITE}
            scale={1}
            size={100}
          />
          <Icon
            icon={"game-icons:dice-six-faces-six"}
            color={Bright.WHITE}
            scale={1}
            size={100}
          />
        </Layout>
        <Layout
          direction="row"
          gap={10}
          ref={dicePairs}
        >
          <Icon
            icon={"game-icons:dice-six-faces-three"}
            color={Bright.WHITE}
            scale={1}
            size={100}
          />
          <Icon
            icon={"game-icons:dice-six-faces-five"}
            color={Bright.WHITE}
            scale={1}
            size={100}
          />
        </Layout>
        <Layout
          direction="row"
          gap={10}
          ref={dicePairs}
        >
          <Icon
            icon={"game-icons:dice-six-faces-five"}
            color={Bright.WHITE}
            scale={1}
            size={100}
          />
          <Icon
            icon={"game-icons:dice-six-faces-three"}
            color={Bright.WHITE}
            scale={1}
            size={100}
          />
        </Layout>
        <Layout
          direction="row"
          gap={10}
          ref={dicePairs}
        >
          <Icon
            icon={"game-icons:dice-six-faces-four"}
            color={Bright.WHITE}
            scale={1}
            size={100}
          />
          <Icon
            icon={"game-icons:dice-six-faces-four"}
            color={Bright.WHITE}
            scale={1}
            size={100}
          />
        </Layout>
      </Layout>
      {/* 9 */}
      <Layout
        direction={"column"}
        gap={20}
      >
        <Layout
          direction="row"
          gap={10}
          ref={dicePairs}
        >
          <Icon
            icon={"game-icons:dice-six-faces-three"}
            color={Bright.WHITE}
            scale={1}
            size={100}
          />
          <Icon
            icon={"game-icons:dice-six-faces-six"}
            color={Bright.WHITE}
            scale={1}
            size={100}
          />
        </Layout>
        <Layout
          direction="row"
          gap={10}
          ref={dicePairs}
        >
          <Icon
            icon={"game-icons:dice-six-faces-six"}
            color={Bright.WHITE}
            scale={1}
            size={100}
          />
          <Icon
            icon={"game-icons:dice-six-faces-three"}
            color={Bright.WHITE}
            scale={1}
            size={100}
          />
        </Layout>
        <Layout
          direction="row"
          gap={10}
          ref={dicePairs}
        >
          <Icon
            icon={"game-icons:dice-six-faces-four"}
            color={Bright.WHITE}
            scale={1}
            size={100}
          />
          <Icon
            icon={"game-icons:dice-six-faces-five"}
            color={Bright.WHITE}
            scale={1}
            size={100}
          />
        </Layout>
        <Layout
          direction="row"
          gap={10}
          ref={dicePairs}
        >
          <Icon
            icon={"game-icons:dice-six-faces-five"}
            color={Bright.WHITE}
            scale={1}
            size={100}
          />
          <Icon
            icon={"game-icons:dice-six-faces-four"}
            color={Bright.WHITE}
            scale={1}
            size={100}
          />
        </Layout>
      </Layout>
      {/* 10 */}
      <Layout
        direction={"column"}
        gap={20}
      >
        <Layout
          direction="row"
          gap={10}
          ref={dicePairs}
        >
          <Icon
            icon={"game-icons:dice-six-faces-four"}
            color={Bright.WHITE}
            scale={1}
            size={100}
          />
          <Icon
            icon={"game-icons:dice-six-faces-six"}
            color={Bright.WHITE}
            scale={1}
            size={100}
          />
        </Layout>
        <Layout
          direction="row"
          gap={10}
          ref={dicePairs}
        >
          <Icon
            icon={"game-icons:dice-six-faces-six"}
            color={Bright.WHITE}
            scale={1}
            size={100}
          />
          <Icon
            icon={"game-icons:dice-six-faces-four"}
            color={Bright.WHITE}
            scale={1}
            size={100}
          />
        </Layout>
        <Layout
          direction="row"
          gap={10}
          ref={dicePairs}
        >
          <Icon
            icon={"game-icons:dice-six-faces-five"}
            color={Bright.WHITE}
            scale={1}
            size={100}
          />
          <Icon
            icon={"game-icons:dice-six-faces-five"}
            color={Bright.WHITE}
            scale={1}
            size={100}
          />
        </Layout>
      </Layout>
      {/* 11 */}
      <Layout
        direction={"column"}
        gap={20}
      >
        <Layout
          direction="row"
          gap={10}
          ref={dicePairs}
        >
          <Icon
            icon={"game-icons:dice-six-faces-five"}
            color={Bright.WHITE}
            scale={1}
            size={100}
          />
          <Icon
            icon={"game-icons:dice-six-faces-six"}
            color={Bright.WHITE}
            scale={1}
            size={100}
          />
        </Layout>
        <Layout
          direction="row"
          gap={10}
          ref={dicePairs}
        >
          <Icon
            icon={"game-icons:dice-six-faces-six"}
            color={Bright.WHITE}
            scale={1}
            size={100}
          />
          <Icon
            icon={"game-icons:dice-six-faces-five"}
            color={Bright.WHITE}
            scale={1}
            size={100}
          />
        </Layout>
      </Layout>
      {/* 12 */}
      <Layout direction="row">
        <Layout
          direction="row"
          gap={10}
          ref={dicePairs}
        >
          <Icon
            icon={"game-icons:dice-six-faces-six"}
            color={Bright.WHITE}
            scale={1}
            size={100}
          />
          <Icon
            icon={"game-icons:dice-six-faces-six"}
            color={Bright.WHITE}
            scale={1}
            size={100}
          />
        </Layout>
      </Layout>
    </Layout>
  );

  dicePairs.map((i) => i.opacity(0));

  yield* sequence(0.05, ...dicePairs.map((d) => d.opacity(1, 0.5)));

  // Draw a box around the 20 ways to lose
  const loseBox = createRef<Line>();
  view.add(
    <Line
      ref={loseBox}
      // fill={"#7c0d28"}
      closed
      points={[
        [-900, -140],
        [-650, -140],
        [-650, 300],
        [-900, 300],
      ]}
      stroke={"#bd2227"}
      lineWidth={10}
      zIndex={-100}
      radius={20}
      end={0}
    ></Line>
  );

  const winBox1 = createRef<Line>();
  view.add(
    <Line
      ref={winBox1}
      // fill={"#0b431e"}
      closed
      points={[
        [-130, -500],
        [130, -500],
        [130, 300],
        [-130, 300],
      ]}
      stroke={"#3b8f50"}
      lineWidth={10}
      zIndex={-100}
      radius={20}
      end={0}
    ></Line>
  );

  const winBox2 = createRef<Line>();
  view.add(
    <Line
      ref={winBox2}
      // fill={"#0b431e"}
      closed
      points={[
        [915, 0],
        [1175, 0],
        [1175, 300],
        [915, 300],
      ]}
      stroke={"#3b8f50"}
      lineWidth={10}
      zIndex={-100}
      radius={20}
      end={0}
    ></Line>
  );

  // Animate the boxes
  yield* waitFor(0.5);
  yield* sequence(
    0.3,
    winBox1().end(1, 2, easeInOutCubic),
    winBox2().end(1, 2, easeInOutCubic)
  );

  yield winBox1().fill("#0b431e60", 1);
  yield* winBox2().fill("#0b431e60", 1);
  // yield* waitUntil("draw-lose-boxes")

  //   yield* waitFor(1);
  //   yield* loseBox().end(1, 2, easeInOutCubic);
  //   yield* loseBox().fill("#7c0d2860", 1);

  // yield* waitUntil("draw-win-boxes")

  yield* waitFor(2);
  // yield* waitUntil("end")
});
