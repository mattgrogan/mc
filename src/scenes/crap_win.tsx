import { makeScene2D } from "@motion-canvas/2d";
import { createRef, waitFor } from "@motion-canvas/core";
import { CrapsWinConditions } from "../components/craps/CrapsWinCondition";


export default makeScene2D(function* (view) {
  const crap = createRef<CrapsWinConditions>();
  view.add(<CrapsWinConditions ref={crap} tableProps={{ height: 600, width: 200 }} />);

  yield* crap().update([
    { throw: "8H", winloss: 60 },
    { throw: "5", winloss: 50},
    { throw: "6E", winloss: 90 },
  ])

  yield* crap().highlight(4, 2);

  yield* crap().update([
    { throw: "2H", winloss: -60 },
    { throw: "5", winloss: 40},
    { throw: "6E", winloss: -90 },
  ])
  
  yield* waitFor(1);
}); 