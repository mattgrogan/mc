import { makeProject } from "@motion-canvas/core";
import "../../global.css";

// import audio from "../../../audio/DD - 135 Across00108000.flac"
// import DD_TOC_01_Strategy from "../titles/DD_TOC_01_Strategy?scene";
// import DD_TOC_02_Simulation from "../titles/DD_TOC_02_Simulation?scene";
// import DD_TOC_03_Dice_And_Gameflow from "../titles/DD_TOC_03_Dice_And_Gameflow?scene";
// import DD_TOC_04_House_Take_And_Edge from "../titles/DD_TOC_04_House_Take_And_Edge?scene";
// import DD_TOC_05_Won_Lost_By_Shooter from "../titles/DD_TOC_05_Won_Lost_By_Shooter?scene";
// import DD_TOC_06_Won_Lost_By_Session from "../titles/DD_TOC_06_Won_Lost_By_Session?scene";
// import DD_TOC_07_Bankroll_Survival from "../titles/DD_TOC_07_Bankroll_Survival?scene";
// import DD_TOC_08_Strategy_Score from "../titles/DD_TOC_08_Strategy_Score?scene";

import intro from "./intro?scene";
import endCard from "./endCard?scene";

import DD_20_Simulation from "./DD_20_Simulation?scene";

import DD_30_Dice_Throws from "./DD_30_Dice_Throws?scene";
import DD_31_Dice_Rolls_Per_Shooter from "./DD_31_Dice_Rolls_Per_Shooter?scene";
import DD_32_Dice_Rolls_Per_Session from "./DD_32_Dice_Rolls_Per_Session?scene";

import DD_40_House_Take_And_Edge from "./DD_40_House_Take_And_Edge?scene";

import DD_50_Outcomes_Per_Shooter from "./DD_50_Outcomes_Per_Shooter?scene";
import DD_51_Won_Lost_Per_Shooter from "./DD_51_Won_Lost_Per_Shooter?scene";

import DD_60_Outcomes_Per_Session from "./DD_60_Outcomes_Per_Session?scene";
import DD_61_Won_Lost_Per_Session from "./DD_61_Won_Lost_Per_Session?scene";

import DD_70_Bankroll_Survival from "./DD_70_Bankroll_Survival?scene";

export default makeProject({
  scenes: [
    // intro,
    DD_20_Simulation,
    // DD_TOC_01_Strategy,
    // DD_TOC_02_Simulation,

    DD_30_Dice_Throws,
    DD_31_Dice_Rolls_Per_Shooter,
    DD_32_Dice_Rolls_Per_Session,

    // DD_TOC_03_Dice_And_Gameflow,
    DD_40_House_Take_And_Edge,

    // DD_TOC_04_House_Take_And_Edge,
    DD_50_Outcomes_Per_Shooter,
    DD_51_Won_Lost_Per_Shooter,

    // DD_TOC_05_Won_Lost_By_Shooter,
    DD_60_Outcomes_Per_Session,
    DD_61_Won_Lost_Per_Session,

    // DD_TOC_06_Won_Lost_By_Session,
    // DD_TOC_07_Bankroll_Survival,
    // DD_70_Bankroll_Survival,
    // endCard,

    // DD_TOC_08_Strategy_Score,
  ],
  // audio: audio
});
