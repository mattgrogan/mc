import { makeScene2D } from "@motion-canvas/2d";
import { createRef, waitFor, chain } from "@motion-canvas/core";
import { CrapsWinConditions } from "../components/craps/CrapsWinConditions";
import { CrapsWinConditionsHorizontal } from "../components/craps/CrapWinConditionsHorizontal";

export default makeScene2D(function* (view) {
  const winconditions = createRef<CrapsWinConditions>();
  view.add(
    <CrapsWinConditionsHorizontal
      ref={winconditions}
      y={75}
      tableProps={{ height: 400, width: 3300 }}
      valueRowHeight={200}
      labelProps={{ fontSize: 100, fill: "white" }}
      // TODO: how can I style the value props?
    />
  );

  yield* winconditions().update([
    { throw: "8H", winloss: -60 },
    { throw: "5", winloss: 50 },
    { throw: "6E", winloss: 90 },
  ]);

  // yield* crap().valueColumnWidth(120, 1);

  // yield* chain(
  //   crap()
  //     .labelCellTxtAt(5 + 3)
  //     .fontSize(50, 1)
  //     .back(1),
  //   crap()
  //     .valueCellTxtAt(5 + 3)
  //     .fontSize(50, 1)
  //     .back(1),
  //   crap()
  //     .hardValueCellTxtAt(5 + 3)
  //     .fontSize(50, 1)
  //     .back(1)
  // );

  // yield* chain(
  //   crap()
  //     .labelCellRectAt(5 + 3)
  //     .rotation(10, 1)
  //     .back(1),
  //   crap()
  //     .valueCellRectAt(5 + 3)
  //     .rotation(10, 1)
  //     .back(1),
  //   crap()
  //     .hardValueCellRectAt(5 + 3)
  //     .rotation(10, 1)
  //     .back(1)
  // );

  // yield* chain(
  //   crap().highlight(4, 4),
  //   crap().highlight(4, 4, { fill: "blue", opacity: 0.2 }),
  //   crap().highlight(4, 4, { fill: "green", opacity: 0.3 })
  // );

  // yield* chain(
  //   crap().highlight(2, 4),
  //   crap().highlight(2, 4, { fill: "blue", opacity: 1 }),
  //   crap().highlight(2, 4, { fill: "green", opacity: 1 })
  // );

  // TODO: How to change the speed of the highlight?
  yield* winconditions().highlight(2, 4, { fill: "yellow", opacity: 1 });

  yield* winconditions().update([
    { throw: "2H", winloss: -50 },
    { throw: "2E", winloss: -60 },
    { throw: "5", winloss: 40 },
    { throw: "6E", winloss: -90 },
    { throw: "6H", winloss: -90 },
  ]);

  yield* waitFor(1);
});
