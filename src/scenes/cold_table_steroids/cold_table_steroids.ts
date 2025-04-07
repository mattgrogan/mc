import { makeProject } from "@motion-canvas/core";
import "../../global.css";

import DD_40_House_Take_And_Edge from "./DD_40_House_Take_And_Edge?scene";

import DD_50_Outcomes_Per_Shooter from "./DD_50_Outcomes_Per_Shooter?scene";
import DD_51_Won_Lost_Per_Shooter from "./DD_51_Won_Lost_Per_Shooter?scene";
import DD_52_Outlay_Per_Shooter from "./DD_52_Outlay_Per_Shooter?scene";

import DD_60_Outcomes_Per_Session from "./DD_60_Outcomes_Per_Session?scene";
import DD_61_Won_Lost_Per_Session from "./DD_61_Won_Lost_Per_Session?scene";
import DD_62_Outlay_Per_Session from "./DD_62_Outlay_Per_Session?scene";
import DD_63_Outlay_by_Hour from "./DD_63_Outlay_by_Hour?scene";

export default makeProject({
  scenes: [
    DD_50_Outcomes_Per_Shooter,
    DD_51_Won_Lost_Per_Shooter,
    DD_52_Outlay_Per_Shooter,

    DD_60_Outcomes_Per_Session,
    DD_61_Won_Lost_Per_Session,
    DD_62_Outlay_Per_Session,
    DD_63_Outlay_by_Hour,

    DD_40_House_Take_And_Edge,
  ],
});
