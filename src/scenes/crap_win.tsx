import { makeScene2D } from "@motion-canvas/2d";
import { createRef, waitFor, chain } from "@motion-canvas/core";
import { CrapsWinConditions } from "../components/craps/CrapsWinCondition";


export default makeScene2D(function* (view) {
  const crap = createRef<CrapsWinConditions>();
  view.add(<CrapsWinConditions ref={crap} y={75} tableProps={{ height: 900, width: 200 }} />);

  yield* crap().update([
    { throw: "8H", winloss: -60 },
    { throw: "5", winloss: 50 },
    { throw: "6E", winloss: 90 },
  ])

  yield* crap().valueColumnWidth(120, 1)

  yield* chain(
    crap().labelCellTxtAt(5 + 3).fontSize(50, 1).back(1),
    crap().valueCellTxtAt(5 + 3).fontSize(50, 1).back(1),
    crap().hardValueCellTxtAt(5 + 3).fontSize(50, 1).back(1)
  )

  yield* chain(
    crap().labelCellRectAt(5 + 3).rotation(10, 1).back(1),
    crap().valueCellRectAt(5 + 3).rotation(10, 1).back(1),
    crap().hardValueCellRectAt(5 + 3).rotation(10, 1).back(1)
  )

  yield* chain(
    crap().highlight(4, 4),
    crap().highlight(4, 4, { fill: "blue", opacity: .2 }),
    crap().highlight(4, 4, { fill: "green", opacity: .3 }),
  );

  yield* chain(
    crap().highlight(2, 4),
    crap().highlight(2, 4, { fill: "blue", opacity: 1 }),
    crap().highlight(2, 4, { fill: "green", opacity: 1 }),
  );



  yield* crap().update([
    { throw: "2H", winloss: -50 },
    { throw: "2E", winloss: -60 },
    { throw: "5", winloss: 40 },
    { throw: "6E", winloss: -90 },
    { throw: "6H", winloss: -90 }
  ])

  yield* waitFor(1);
}); 