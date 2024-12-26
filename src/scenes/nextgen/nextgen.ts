import { makeProject } from "@motion-canvas/core";
import "../../global.css";

import tableOfContents from "./tableOfContents?scene";

import DD_20_Simulation from "./DD_20_Simulation?scene";

import DD_30_Dice_Throws from "./DD_30_Dice_Throws?scene";
import DD_31_Dice_Rolls_Per_Session from "./DD_31_Dice_Rolls_Per_Session?scene";
import DD_32_Dice_Rolls_Per_Shooter from "./DD_32_Dice_Rolls_Per_Shooter?scene";

import DD_50_Outcomes_Per_Shooter from "./DD_50_Outcomes_Per_Shooter?scene";
import DD_51_Won_Lost_Per_Shooter from "./DD_51_Won_Lost_Per_Shooter?scene";

import DD_60_Outcomes_Per_Session from "./DD_60_Outcomes_Per_Session?scene";
import DD_61_Won_Lost_Per_Session from "./DD_61_Won_Lost_Per_Session?scene";

import DD_70_Bankroll_Survival from "./DD_70_Bankroll_Survival?scene";

export default makeProject({
  scenes: [
    tableOfContents,

    DD_20_Simulation,

    DD_30_Dice_Throws,
    DD_31_Dice_Rolls_Per_Session,
    DD_32_Dice_Rolls_Per_Shooter,

    DD_50_Outcomes_Per_Shooter,
    DD_51_Won_Lost_Per_Shooter,

    DD_60_Outcomes_Per_Session,
    DD_61_Won_Lost_Per_Session,

    DD_70_Bankroll_Survival,
  ],
});
