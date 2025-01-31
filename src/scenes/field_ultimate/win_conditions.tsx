import { Icon, Layout, Line, makeScene2D, Rect } from "@motion-canvas/2d";
import { blueGradient, Bright, Darker, Darkest, grayGradient, Grays, greenGradient, PoppinsBlack, PoppinsWhite, purpleGradient, redGradient, sessionGradient, silverGradient, Theme } from "../../styles";
import { createRef, createRefArray, easeInOutCubic, makeRefs, sequence, waitFor, waitUntil } from "@motion-canvas/core";
import { DataTable } from "../../components/styled/dataTable";

export default makeScene2D(function* (view) {
    view.fill(Theme.BG);

    yield* waitFor(2)

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
        { label: "2", value: "WIN" },
        { label: "3", value: "WIN" },
        { label: "4", value: "WIN" },
        { label: "5", value: "LOSE" },
        { label: "6", value: "LOSE" },
        { label: "7", value: "LOSE" },
        { label: "8", value: "LOSE" },
        { label: "9", value: "WIN" },
        { label: "10", value: "WIN" },
        { label: "11", value: "WIN" },
        { label: "12", value: "WIN" },
    ]

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

    dataTable.valueRects[0].fill(greenGradient)
    dataTable.valueRects[1].fill(greenGradient)
    dataTable.valueRects[2].fill(greenGradient)
    dataTable.valueRects[3].fill(redGradient)
    dataTable.valueRects[4].fill(redGradient)
    dataTable.valueRects[5].fill(redGradient)
    dataTable.valueRects[6].fill(redGradient)
    dataTable.valueRects[7].fill(greenGradient)
    dataTable.valueRects[8].fill(greenGradient)
    dataTable.valueRects[9].fill(greenGradient)
    dataTable.valueRects[10].fill(greenGradient)

    //dataTable.columns.map((pct) => pct.opacity(1))
    dataTable.valueRects.map((pct) => pct.opacity(0))


    // Show the data table
    yield* sequence(0.1, ...dataTable.columns.map((pct) => pct.opacity(1, 0.6)));

    yield* waitFor(1)
    // yield* waitUntil("show-winners")
    // Show the winners
    const winValueRects = [
        dataTable.valueRects[0],
        dataTable.valueRects[1],
        dataTable.valueRects[2],
        dataTable.valueRects[7],
        dataTable.valueRects[8],
        dataTable.valueRects[9],
        dataTable.valueRects[10]
    ]
    yield* sequence(0.1, ...winValueRects.map((pct) => pct.opacity(1, 0.6)));

    yield* waitFor(1)
    // yield* waitUntil("show-losers")

    // Show the losers
    const loseValueRects = [
        dataTable.valueRects[3],
        dataTable.valueRects[4],
        dataTable.valueRects[5],
        dataTable.valueRects[6],
    ]
    yield* sequence(0.1, ...loseValueRects.map((pct) => pct.opacity(1, 0.6)));

    // Show dice
    yield* waitFor(1)
    // yield* waitUntil("show-dice")

    // Move table down a bit
    yield* dataTable.container.position(dataTable.container.position().addY(500), 1, easeInOutCubic)

    const diceContainer = createRef<Layout>()
    const dicePairs = createRefArray<Layout>()
    view.add(
        <Layout layout alignItems={"end"} gap={50} y={-100}>
            {/* 2 */}
            <Layout direction="row">
                <Layout direction="row" gap={10} ref={dicePairs}>
                    <Icon icon={"game-icons:dice-six-faces-one"} color={Bright.WHITE} scale={1} size={100} />
                    <Icon icon={"game-icons:dice-six-faces-one"} color={Bright.WHITE} scale={1} size={100} />
                </Layout>
            </Layout>
            {/* 3 */}
            <Layout direction={"column"} gap={20}>
                <Layout direction="row" gap={10} ref={dicePairs}>
                    <Icon icon={"game-icons:dice-six-faces-one"} color={Bright.WHITE} scale={1} size={100} />
                    <Icon icon={"game-icons:dice-six-faces-two"} color={Bright.WHITE} scale={1} size={100} />
                </Layout>
                <Layout direction="row" gap={10} ref={dicePairs}>
                    <Icon icon={"game-icons:dice-six-faces-two"} color={Bright.WHITE} scale={1} size={100} />
                    <Icon icon={"game-icons:dice-six-faces-one"} color={Bright.WHITE} scale={1} size={100} />
                </Layout>
            </Layout>
            {/* 4 */}
            <Layout direction={"column"} gap={20}>
                <Layout direction="row" gap={10} ref={dicePairs}>
                    <Icon icon={"game-icons:dice-six-faces-one"} color={Bright.WHITE} scale={1} size={100} />
                    <Icon icon={"game-icons:dice-six-faces-three"} color={Bright.WHITE} scale={1} size={100} />
                </Layout>
                <Layout direction="row" gap={10} ref={dicePairs}>
                    <Icon icon={"game-icons:dice-six-faces-three"} color={Bright.WHITE} scale={1} size={100} />
                    <Icon icon={"game-icons:dice-six-faces-one"} color={Bright.WHITE} scale={1} size={100} />
                </Layout>
                <Layout direction="row" gap={10} ref={dicePairs}>
                    <Icon icon={"game-icons:dice-six-faces-two"} color={Bright.WHITE} scale={1} size={100} />
                    <Icon icon={"game-icons:dice-six-faces-two"} color={Bright.WHITE} scale={1} size={100} />
                </Layout>
            </Layout>
            {/* 5 */}
            <Layout direction={"column"} gap={20}>
                <Layout direction="row" gap={10} ref={dicePairs}>
                    <Icon icon={"game-icons:dice-six-faces-one"} color={Bright.WHITE} scale={1} size={100} />
                    <Icon icon={"game-icons:dice-six-faces-four"} color={Bright.WHITE} scale={1} size={100} />
                </Layout>
                <Layout direction="row" gap={10} ref={dicePairs}>
                    <Icon icon={"game-icons:dice-six-faces-four"} color={Bright.WHITE} scale={1} size={100} />
                    <Icon icon={"game-icons:dice-six-faces-one"} color={Bright.WHITE} scale={1} size={100} />
                </Layout>
                <Layout direction="row" gap={10} ref={dicePairs}>
                    <Icon icon={"game-icons:dice-six-faces-two"} color={Bright.WHITE} scale={1} size={100} />
                    <Icon icon={"game-icons:dice-six-faces-three"} color={Bright.WHITE} scale={1} size={100} />
                </Layout>
                <Layout direction="row" gap={10} ref={dicePairs}>
                    <Icon icon={"game-icons:dice-six-faces-three"} color={Bright.WHITE} scale={1} size={100} />
                    <Icon icon={"game-icons:dice-six-faces-two"} color={Bright.WHITE} scale={1} size={100} />
                </Layout>
            </Layout>
            {/* 6 */}
            <Layout direction={"column"} gap={20}>
                <Layout direction="row" gap={10} ref={dicePairs}>
                    <Icon icon={"game-icons:dice-six-faces-one"} color={Bright.WHITE} scale={1} size={100} />
                    <Icon icon={"game-icons:dice-six-faces-five"} color={Bright.WHITE} scale={1} size={100} />
                </Layout>
                <Layout direction="row" gap={10} ref={dicePairs}>
                    <Icon icon={"game-icons:dice-six-faces-five"} color={Bright.WHITE} scale={1} size={100} />
                    <Icon icon={"game-icons:dice-six-faces-one"} color={Bright.WHITE} scale={1} size={100} />
                </Layout>
                <Layout direction="row" gap={10} ref={dicePairs}>
                    <Icon icon={"game-icons:dice-six-faces-two"} color={Bright.WHITE} scale={1} size={100} />
                    <Icon icon={"game-icons:dice-six-faces-four"} color={Bright.WHITE} scale={1} size={100} />
                </Layout>
                <Layout direction="row" gap={10} ref={dicePairs}>
                    <Icon icon={"game-icons:dice-six-faces-four"} color={Bright.WHITE} scale={1} size={100} />
                    <Icon icon={"game-icons:dice-six-faces-two"} color={Bright.WHITE} scale={1} size={100} />
                </Layout>
                <Layout direction="row" gap={10} ref={dicePairs}>
                    <Icon icon={"game-icons:dice-six-faces-three"} color={Bright.WHITE} scale={1} size={100} />
                    <Icon icon={"game-icons:dice-six-faces-three"} color={Bright.WHITE} scale={1} size={100} />
                </Layout>
            </Layout>
            {/* 7 */}
            <Layout direction={"column"} gap={20}>
                <Layout direction="row" gap={10} ref={dicePairs}>
                    <Icon icon={"game-icons:dice-six-faces-one"} color={Bright.WHITE} scale={1} size={100} />
                    <Icon icon={"game-icons:dice-six-faces-six"} color={Bright.WHITE} scale={1} size={100} />
                </Layout>
                <Layout direction="row" gap={10} ref={dicePairs}>
                    <Icon icon={"game-icons:dice-six-faces-six"} color={Bright.WHITE} scale={1} size={100} />
                    <Icon icon={"game-icons:dice-six-faces-one"} color={Bright.WHITE} scale={1} size={100} />
                </Layout>
                <Layout direction="row" gap={10} ref={dicePairs}>
                    <Icon icon={"game-icons:dice-six-faces-two"} color={Bright.WHITE} scale={1} size={100} />
                    <Icon icon={"game-icons:dice-six-faces-five"} color={Bright.WHITE} scale={1} size={100} />
                </Layout>
                <Layout direction="row" gap={10} ref={dicePairs}>
                    <Icon icon={"game-icons:dice-six-faces-five"} color={Bright.WHITE} scale={1} size={100} />
                    <Icon icon={"game-icons:dice-six-faces-two"} color={Bright.WHITE} scale={1} size={100} />
                </Layout>
                <Layout direction="row" gap={10} ref={dicePairs}>
                    <Icon icon={"game-icons:dice-six-faces-three"} color={Bright.WHITE} scale={1} size={100} />
                    <Icon icon={"game-icons:dice-six-faces-four"} color={Bright.WHITE} scale={1} size={100} />
                </Layout>
                <Layout direction="row" gap={10} ref={dicePairs}>
                    <Icon icon={"game-icons:dice-six-faces-four"} color={Bright.WHITE} scale={1} size={100} />
                    <Icon icon={"game-icons:dice-six-faces-three"} color={Bright.WHITE} scale={1} size={100} />
                </Layout>
            </Layout>
            {/* 8 */}
            <Layout direction={"column"} gap={20}>
                <Layout direction="row" gap={10} ref={dicePairs}>
                    <Icon icon={"game-icons:dice-six-faces-two"} color={Bright.WHITE} scale={1} size={100} />
                    <Icon icon={"game-icons:dice-six-faces-six"} color={Bright.WHITE} scale={1} size={100} />
                </Layout>
                <Layout direction="row" gap={10} ref={dicePairs}>
                    <Icon icon={"game-icons:dice-six-faces-two"} color={Bright.WHITE} scale={1} size={100} />
                    <Icon icon={"game-icons:dice-six-faces-six"} color={Bright.WHITE} scale={1} size={100} />
                </Layout>
                <Layout direction="row" gap={10} ref={dicePairs}>
                    <Icon icon={"game-icons:dice-six-faces-three"} color={Bright.WHITE} scale={1} size={100} />
                    <Icon icon={"game-icons:dice-six-faces-five"} color={Bright.WHITE} scale={1} size={100} />
                </Layout>
                <Layout direction="row" gap={10} ref={dicePairs}>
                    <Icon icon={"game-icons:dice-six-faces-five"} color={Bright.WHITE} scale={1} size={100} />
                    <Icon icon={"game-icons:dice-six-faces-three"} color={Bright.WHITE} scale={1} size={100} />
                </Layout>
                <Layout direction="row" gap={10} ref={dicePairs}>
                    <Icon icon={"game-icons:dice-six-faces-four"} color={Bright.WHITE} scale={1} size={100} />
                    <Icon icon={"game-icons:dice-six-faces-four"} color={Bright.WHITE} scale={1} size={100} />
                </Layout>
            </Layout>
            {/* 9 */}
            <Layout direction={"column"} gap={20}>
                <Layout direction="row" gap={10} ref={dicePairs}>
                    <Icon icon={"game-icons:dice-six-faces-three"} color={Bright.WHITE} scale={1} size={100} />
                    <Icon icon={"game-icons:dice-six-faces-six"} color={Bright.WHITE} scale={1} size={100} />
                </Layout>
                <Layout direction="row" gap={10} ref={dicePairs}>
                    <Icon icon={"game-icons:dice-six-faces-six"} color={Bright.WHITE} scale={1} size={100} />
                    <Icon icon={"game-icons:dice-six-faces-three"} color={Bright.WHITE} scale={1} size={100} />
                </Layout>
                <Layout direction="row" gap={10} ref={dicePairs}>
                    <Icon icon={"game-icons:dice-six-faces-four"} color={Bright.WHITE} scale={1} size={100} />
                    <Icon icon={"game-icons:dice-six-faces-five"} color={Bright.WHITE} scale={1} size={100} />
                </Layout>
                <Layout direction="row" gap={10} ref={dicePairs}>
                    <Icon icon={"game-icons:dice-six-faces-five"} color={Bright.WHITE} scale={1} size={100} />
                    <Icon icon={"game-icons:dice-six-faces-four"} color={Bright.WHITE} scale={1} size={100} />
                </Layout>
            </Layout>
            {/* 10 */}
            <Layout direction={"column"} gap={20}>
                <Layout direction="row" gap={10} ref={dicePairs}>
                    <Icon icon={"game-icons:dice-six-faces-four"} color={Bright.WHITE} scale={1} size={100} />
                    <Icon icon={"game-icons:dice-six-faces-six"} color={Bright.WHITE} scale={1} size={100} />
                </Layout>
                <Layout direction="row" gap={10} ref={dicePairs}>
                    <Icon icon={"game-icons:dice-six-faces-six"} color={Bright.WHITE} scale={1} size={100} />
                    <Icon icon={"game-icons:dice-six-faces-four"} color={Bright.WHITE} scale={1} size={100} />
                </Layout>
                <Layout direction="row" gap={10} ref={dicePairs}>
                    <Icon icon={"game-icons:dice-six-faces-five"} color={Bright.WHITE} scale={1} size={100} />
                    <Icon icon={"game-icons:dice-six-faces-five"} color={Bright.WHITE} scale={1} size={100} />
                </Layout>
            </Layout>
            {/* 11 */}
            <Layout direction={"column"} gap={20}>
                <Layout direction="row" gap={10} ref={dicePairs}>
                    <Icon icon={"game-icons:dice-six-faces-five"} color={Bright.WHITE} scale={1} size={100} />
                    <Icon icon={"game-icons:dice-six-faces-six"} color={Bright.WHITE} scale={1} size={100} />
                </Layout>
                <Layout direction="row" gap={10} ref={dicePairs}>
                    <Icon icon={"game-icons:dice-six-faces-six"} color={Bright.WHITE} scale={1} size={100} />
                    <Icon icon={"game-icons:dice-six-faces-five"} color={Bright.WHITE} scale={1} size={100} />
                </Layout>
            </Layout>
            {/* 12 */}
            <Layout direction="row">
                <Layout direction="row" gap={10} ref={dicePairs}>
                    <Icon icon={"game-icons:dice-six-faces-six"} color={Bright.WHITE} scale={1} size={100} />
                    <Icon icon={"game-icons:dice-six-faces-six"} color={Bright.WHITE} scale={1} size={100} />
                </Layout>
            </Layout>
        </Layout>
    )

    dicePairs.map(i => i.opacity(0))

    yield* sequence(0.1, ...dicePairs.map(d => d.opacity(1, 0.5)))

    // Draw a box around the 20 ways to lose
    const loseBox = createRef<Line>()
    view.add(
        <Line ref={loseBox}
            // fill={"#7c0d28"}
            closed
            points={[[-640, -550], [380, -550], [380, 300], [-640, 300]]}
            stroke={"#bd2227"}
            lineWidth={10}
            zIndex={-100}
            radius={20}
            end={0}
            >

        </Line>
    )
    
    const winBox1 = createRef<Line>()
    view.add(
        <Line ref={winBox1}
        // fill={"#0b431e"}
        closed
        points={[[-1430, -200], [-660, -200], [-660, 300], [-1430, 300]]}
        stroke={"#3b8f50"}
        lineWidth={10}
        zIndex={-100}
        radius={20}
        end={0}
        >
        </Line>
    )
    
    const winBox2 = createRef<Line>()
    view.add(
        <Line ref={winBox2}
        // fill={"#0b431e"}
        closed
        points={[[400, -300], [1430, -300], [1430, 300], [400, 300]]}
        stroke={"#3b8f50"}
        lineWidth={10}
        zIndex={-100}
        radius={20}
        end={0}
        >
        </Line>
    )

    // Animate the boxes
    yield* waitFor(1)
    // yield* waitUntil("draw-lose-boxes")
    yield* loseBox().end(1, 2, easeInOutCubic)
    yield* loseBox().fill("#7c0d2860", 1)

    yield* waitFor(1)
    // yield* waitUntil("draw-win-boxes")

    yield* sequence(0.3, winBox1().end(1, 2, easeInOutCubic) , winBox2().end(1, 2, easeInOutCubic))
    
    yield winBox1().fill("#0b431e60", 1)
    yield* winBox2().fill("#0b431e60", 1)









    yield* waitFor(2)
    // yield* waitUntil("end")
})