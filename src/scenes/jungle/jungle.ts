import { makeProject } from "@motion-canvas/core";
import "../../global.css";

// import audio from "../../../audio/DD - Skill66 Baseline00108000.flac"

import intro from "./intro?scene";

import strategyTitle from "../titles/strategyTitle?scene";
import strategy from "./strategy?scene";

import simulationTitle from "../titles/simulationTitle?scene";
import simulationRun from "./simulationRun?scene";
import houseEdge from "./houseEdge?scene";

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
    strategyTitle,
    strategy,
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
