import { makeScene2D, Rect } from "@motion-canvas/2d";
import { createRef, waitFor } from "@motion-canvas/core";
import { Table } from "../../components/table";
import datac from "../../../data/cover4-100k-overall_stats.json"


const alias: Record<string, string> = {
  "SHOOTER_ROLL": "Roll",
  "N": "Shooters",
  "PCT_SURVIVAL": "% Survival",
  "MOST_LOST": "Min",
  "MEDIAN_WINLOSS": "Median",
  "AVG_WINLOSS": "Avg",
  "MOST_WON": "Max",
  "N_GR_ZERO": "# > 0",
  "PCT_GR_ZERO": "% Up",
  "PCT_COMBINED": "% Combined",
}
const cover4press = datac["ROLLS_TO_PROFIT"]["Cover4Press"].slice(0, 40);
// const cover4press = d.slice(0, 40);

const data: Record<string, Array<string | number>> = {};


cover4press.forEach(row => {
  Object.keys(row).forEach(key => {
    data[key] ??= [];
    data[key].push(row[key])
  })
})

export default makeScene2D(function* (view) {
  const tabled = createRef<Table>();
  view.add(
    <Table
      ref={tabled}
      data={data}
      // headerCellProps={{ padding: 5, paddingTop: 15, paddingBottom: 10 }}
      headerTxtProps={{ fontSize: 15 }}
      CellTxtProps={{ fontSize: 15 }}
      height={500}
      width={600}
      y={-220}
      titleAlias={alias}
      headerGrouping={[
        { range: "1 - 5", title: "Just because" },
        { range: "0 - 10", title: "Cold Table: Roll To Profit" },
        { range: "3 - 6", title: "Bankroll After Roll" }
      ]}

    />
  )

  tabled().addHeaderGrouping()

  yield* tabled().scrollToRow(7, 1);

  yield* waitFor(1)

  yield* tabled().highlightRow(6, { fill: "yellow" }, 2)
  
  yield* waitFor(1)

  yield* tabled().scrollToRow(20, 1);
 
  yield* waitFor(1)

  yield* tabled().scrollToRow(2, 1);

  yield* waitFor(1)

  yield* tabled().scrollToRow(10, 1);

  yield* waitFor(1)

  yield* tabled().scrollToColumn(9 , 1);

  yield* waitFor(1);

  yield* tabled().scrollToColumn(7 , 1); 

  yield* waitFor(1)

  yield* tabled().highlighCell(4, 6, { fill: "green", opacity: .6 })

  yield* tabled().removeHighlighters();

  yield* waitFor(1)
});
