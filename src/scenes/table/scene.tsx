import { makeScene2D, Rect } from "@motion-canvas/2d";
import { createRef, waitFor } from "@motion-canvas/core";
import { Table } from "../../components/table";
// import datac from "../../../data/cover4-100k-overall_stats.json"
import datac from "../../../../dicedata/output/cover4-100k/cover4-100k-overall_stats.json";

const alias: Record<string, string> = {
  SHOOTER_ROLL: "Throw",
  N: "Shooters",
  PCT_SURVIVAL: "% Survival",
  MOST_LOST: "Min",
  MEDIAN_WINLOSS: "Median",
  AVG_WINLOSS: "Avg",
  MOST_WON: "Max",
  // "N_GR_ZERO": "# > 0",
  PCT_GR_ZERO: "% Up",
  PCT_COMBINED: "% Combined",
};
// const cover4press = d.slice(0, 40);

const data: Record<string, Array<string | number>> = Object.keys(
  alias
).reduce((acc: Record<string, Array<string | number>>, x: string) => {
  acc[x] = [];
  return acc;
}, {});

const cover4press = datac["ROLLS_TO_PROFIT"]["Cover4Press"].slice(0, 40);
cover4press.forEach((row: Record<string, string | number>) => {
  Object.keys(row).forEach(key => {
    if (!data[key]) return;
   
    data[key].push(row[key])  
  })
});

export default makeScene2D(function* (view) {
  const rect = createRef<Rect>();
  const tabled = createRef<Table>();
  view.add(
    <Table
      ref={tabled}
      data={data}
      // headerCellProps={{ padding: 5, paddingTop: 15, paddingBottom: 10 }}
      headerTxtProps={{ fontSize: 25 }}
      CellTxtProps={{ fontSize: 25 }}
      height={800}
      // width={600}
      y={0}
      numberFormat={[
        { columns: ["MEDIAN_WINLOSS", "MOST_WON", "AVG_WINLOSS"], forceSign: true },
        { columns: ["AVG_WINLOSS", "PCT_COMBINED"], decimals: 2 },
        { columns: ["PCT_COMBINED"], decimals: 1 },
        { columns: ["PCT_COMBINED", "PCT_GR_ZERO", "PCT_SURVIVAL"], usePercentage: true },
        { columns: ["PCT_COMBINED", "PCT_SURVIVAL"], zeroText: "< 0.1%"}
      ]}
      titleAlias={alias}
      headerGrouping={[
        // { range: "1 - 5", title: "Just because" },
        // { range: "0 - 8", title: "Cold Table: Roll To Profit" },
        { range: "3 - 6", title: "Bankroll After Roll" },
      ]}

    />
  );

  tabled().addHeaderGrouping();

  yield* tabled().scrollToRow("end", 3);

  yield* waitFor(1);

  yield* tabled().scrollToRow(7, 1);

  yield* waitFor(1);

  yield* tabled().highlightRow(6, { fill: "yellow" });

  yield* waitFor(1);

  yield* tabled().scrollToRow(20, 1);

  yield* waitFor(1);

  yield* tabled().scrollToRow(2, 1);

  yield* waitFor(1);

  yield* tabled().scrollToRow(10, 1);

  yield* waitFor(1);

  yield* tabled().highlightCell(7, 6, { fill: "green", opacity: 0.6 });

  yield* tabled().removeHighlighters();

  yield* waitFor(1);
});
