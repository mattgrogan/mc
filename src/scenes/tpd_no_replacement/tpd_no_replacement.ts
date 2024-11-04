import { makeProject } from "@motion-canvas/core";
import "../../global.css";

import strategyTitle from "../titles/strategyTitle?scene";

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
    strategyTitle,
    simulationTitle,
    simulationRun,
    shooterWinLosePush,
    shooterWonLostHistogram,
    sessionWinLosePush,
    sessionWonLostHistogram,
    bankroll,
    reportCardTitle,
    reportCard,
    endCard,
  ],
});
