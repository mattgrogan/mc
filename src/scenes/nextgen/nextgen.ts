import { makeProject } from "@motion-canvas/core";
import "../../global.css";

import tableOfContents from "./tableOfContents?scene";
import DD_40_Simulation from "./DD_40_Simulation?scene";
import DD_50_Game_Throws from "./DD_50_Game_Throws?scene";

import DD_50_Dice_Throws from "./DD_50_Dice_Throws?scene";
import DD_51_Dice_Rolls_Per_Session from "./DD_51_Dice_Rolls_Per_Session?scene";
import DD_52_Dice_Rolls_Per_Shooter from "./DD_52_Dice_Rolls_Per_Shooter?scene";

import DD_60_Won_Lost_Per_Shooter from "./DD_60_Won_Lost_Per_Shooter?scene";

export default makeProject({
  scenes: [
    tableOfContents,
    DD_40_Simulation,
    DD_50_Game_Throws,
    DD_50_Dice_Throws,
    DD_51_Dice_Rolls_Per_Session,
    DD_52_Dice_Rolls_Per_Shooter,
    DD_60_Won_Lost_Per_Shooter,
  ],
});
