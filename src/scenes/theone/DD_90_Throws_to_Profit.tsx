import { makeScene2D, Rect } from "@motion-canvas/2d";
import { createRef, waitFor } from "@motion-canvas/core";
import { Table } from "../../components/table";
// import datac from "../../../data/cover4-100k-overall_stats.json"
import { PoppinsWhite } from "../../styles";
import { tw_colors } from "../../tw_colors";

// throws_to_profit.v1.json
import dataImport from "../../../../dicedata/output/ken_440_regress-100k-newreport/json/throws_to_profit.v1.json";
const cover4press = dataImport["440Regress"];

const alias: Record<string, string> = {
  SHOOTER_ROLL: "Throw",
  N: "Shooters",
  PCT_SURVIVAL: "% Survival",
  MIN: "Min",
  MEDIAN: "Median",
  AVG: "Avg",
  MAX: "Max",
  // "N_GR_ZERO": "# > 0",
  PCT_GR_ZERO: "% Up",
  PCT_COMBINED: "% Combined",
};
// const cover4press = d.slice(0, 40);

const data: Record<string, Array<string | number>> = Object.keys(alias).reduce(
  (acc: Record<string, Array<string | number>>, x: string) => {
    acc[x] = [];
    return acc;
  },
  {}
);

// const cover4press = datac["ROLLS_TO_PROFIT"]["SonicTheHedgehog"]; //.slice(0, 40);
cover4press.forEach((row: Record<string, string | number>) => {
  Object.keys(row).forEach((key) => {
    if (!data[key]) return;

    data[key].push(row[key]);
  });
});

export default makeScene2D(function* (view) {
  const rect = createRef<Rect>();
  const tabled = createRef<Table>();
  view.add(
    <Table
      ref={tabled}
      data={data}
      headerCellProps={{ fill: tw_colors.slate[900], padding: 25 }}
      headerTxtProps={{ ...PoppinsWhite, fontSize: 45, fontWeight: 700 }}
      CellProps={{
        fill: tw_colors.zinc[800],
        padding: 25,
        paddingTop: 15,
        paddingBottom: 15,
      }}
      CellTxtProps={{ ...PoppinsWhite, fontSize: 45 }}
      height={"85%"}
      width={2169}
      y={0}
      numberFormat={[
        {
          columns: ["MEDIAN", "MIN", "AVG", "MAX"],
          forceSign: true,
        },

        { columns: ["MEDIAN"], decimals: 0 },
        {
          columns: ["PCT_COMBINED", "PCT_GR_ZERO", "PCT_SURVIVAL"],
          decimals: 1,
        },
        { columns: ["AVG"], decimals: 0 },
        {
          columns: ["PCT_COMBINED", "PCT_GR_ZERO", "PCT_SURVIVAL"],
          usePercentage: true,
        },
        { columns: ["PCT_COMBINED", "PCT_SURVIVAL"], zeroText: "< 0.1%" },
      ]}
      titleAlias={alias}
      headerGrouping={[{ range: "3 - 6", title: "Bankroll After Roll" }]}
    />
  );

  tabled().addHeaderGrouping();

  yield* waitFor(3);

  // Highlight First Row
  yield* tabled().highlightRow(6, { fill: tw_colors.yellow[700] });
  yield* waitFor(3);
  yield* tabled().removeHighlighters();
  yield* waitFor(1);

  yield* tabled().highlightRow(10, { fill: tw_colors.yellow[700] });
  yield* waitFor(3);
  yield* tabled().removeHighlighters();

  yield* waitFor(1);
  yield* tabled().scrollToRow(19, 5);
  yield* tabled().highlightRow(19, { fill: tw_colors.yellow[700] });
  // yield* waitFor(3);
  // yield* tabled().removeHighlighters();

  //   yield* waitFor(1);

  // yield* tabled().highlightRow(36, { fill: tw_colors.yellow[700] });

  // yield* waitFor(3);

  // yield* tabled().scrollToRow("end", 8);
  // yield* tabled().highlightRow(89, { fill: tw_colors.yellow[700] });

  //   yield* tabled().highlighCell(7, 6, { fill: "green", opacity: 0.6 });

  yield* waitFor(3);
});
