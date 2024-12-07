import { makeProject } from "@motion-canvas/core";
import "../../global.css";

import intro from "./intro?scene";
import code_strategy from "./code_strategy?scene";
import houseEdge from "./houseEdge?scene";

// import strategyTitle from "../titles/strategyTitle?scene";
// import strategy from "./strategy_demo?scene";

import simulationTitle from "../titles/simulationTitle?scene";
import simulationRun from "./simulationRun?scene";

import shooterWinLosePush from "./shooterWinLosePush?scene";
import shooterWonLostHistogram from "./shooterWonLostHistogram?scene";

import sessionWinLosePush from "./sessionWinLosePush?scene";
import sessionWonLostHistogram from "./sessionWonLostHistogram?scene";

import bankroll from "./bankroll?scene";

import reportCardTitle from "../titles/reportCardTitle?scene";
import reportCard from "./reportCard?scene";

import endCard from "./endCard?scene";

export default makeProject({
  scenes: [
    intro,
    // code_strategy,
    // strategyTitle,
    // strategy,
    simulationTitle,
    simulationRun,
    houseEdge,
    shooterWinLosePush,
    shooterWonLostHistogram,
    sessionWinLosePush,
    sessionWonLostHistogram,
    bankroll,
    reportCardTitle,
    reportCard,
    endCard,
  ],
  // audio: audio,
});
