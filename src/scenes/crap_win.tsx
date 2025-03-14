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
      extensionLength={100}
      // TODO: how can I style the value props?
    />
  );

  yield* winconditions().update([
    { throw: "2", winloss: 10 },
    { throw: "3", winloss: 10 },
    { throw: "4E", winloss: -2010 },
    { throw: "4H", winloss: -1010 },
    { throw: "5", winloss: 0 },
    { throw: "6E", winloss: 0 },
    { throw: "6H", winloss: 0 },
    { throw: "7", winloss: 2010 },
    { throw: "8E", winloss: 0 },
    { throw: "8H", winloss: 0 },
    { throw: "9", winloss: -1510 },
    { throw: "10E", winloss: 0 },
    { throw: "10H", winloss: 0 },
    { throw: "11", winloss: -10 },
    { throw: "12", winloss: 0 },
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
    { throw: "2", winloss: 10 },
    { throw: "3", winloss: 10 },
    { throw: "4E", winloss: 0 },
    { throw: "4H", winloss: 0 },
    { throw: "5", winloss: 0 },
    { throw: "6E", winloss: -49 },
    { throw: "6H", winloss: 149 },
    { throw: "7", winloss: -10 },
    { throw: "8E", winloss: 0 },
    { throw: "8H", winloss: 0 },
    { throw: "9", winloss: 0 },
    { throw: "10E", winloss: 0 },
    { throw: "10H", winloss: 0 },
    { throw: "11", winloss: -10 },
    { throw: "12", winloss: 0 },
  ]);

  yield* waitFor(1);
});
