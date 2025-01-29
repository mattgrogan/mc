import { makeProject } from "@motion-canvas/core";
import "../../global.css";

import audio from "../../../audio/DD - All Day 678_00108000.flac"

import DD_TOC_01 from "../titles/DD_TOC_01?scene";
import DD_TOC_02 from "../titles/DD_TOC_02?scene";
import DD_TOC_03 from "../titles/DD_TOC_03?scene";
import DD_TOC_04 from "../titles/DD_TOC_04?scene";
import DD_TOC_05 from "../titles/DD_TOC_05?scene";
import DD_TOC_06 from "../titles/DD_TOC_06?scene";
import DD_TOC_07 from "../titles/DD_TOC_07?scene";
import DD_TOC_08 from "../titles/DD_TOC_08?scene";

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
    intro,
    DD_20_Simulation,
    // DD_TOC_01,
    DD_TOC_02,

    DD_30_Dice_Throws,
    DD_31_Dice_Rolls_Per_Shooter,
    DD_32_Dice_Rolls_Per_Session,

    DD_TOC_03,
    DD_40_House_Take_And_Edge,

    DD_TOC_04,
    DD_50_Outcomes_Per_Shooter,
    DD_51_Won_Lost_Per_Shooter,

    DD_TOC_05,
    DD_60_Outcomes_Per_Session,
    DD_61_Won_Lost_Per_Session,

    DD_TOC_06,
    DD_70_Bankroll_Survival,
    endCard,
  ],
  // audio: audio
});
