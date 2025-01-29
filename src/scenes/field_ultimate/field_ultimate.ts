import { makeProject } from "@motion-canvas/core";
import "../../global.css";

import summary from "./summary?scene"
import DD_20_Simulation from "./DD_20_Simulation?scene";
import win_conditions from "./win_conditions?scene";

// Double Field
import DD_40_House_Double_Double from "./DD_40_House_Double_Double?scene";
import DD_60_Outcomes_Double_Double from "./DD_60_Outcomes_Double_Double?scene";
import DD_61_Won_Lost_Double_Double from "./DD_61_Won_Lost_Double_Double?scene";

// Triple Field
import DD_40_House_Double_Triple from "./DD_40_House_Double_Triple?scene";
import DD_60_Outcomes_Double_Triple from "./DD_60_Outcomes_Double_Triple?scene";
import DD_61_Won_Lost_Double_Triple from "./DD_61_Won_Lost_Double_Triple?scene";

// Mythical Field
import DD_40_House_Triple_Triple from "./DD_40_House_Triple_Triple?scene";
import DD_60_Outcomes_Triple_Triple from "./DD_60_Outcomes_Triple_Triple?scene";
import DD_61_Won_Lost_Triple_Triple from "./DD_61_Won_Lost_Triple_Triple?scene";

import endCard from "./endCard?scene";

export default makeProject({
  scenes: [
    win_conditions,
    DD_20_Simulation,
    DD_40_House_Double_Double,
  DD_60_Outcomes_Double_Double,
  DD_61_Won_Lost_Double_Double,
  
  DD_40_House_Double_Triple,
  DD_60_Outcomes_Double_Triple,
  DD_61_Won_Lost_Double_Triple,

  DD_40_House_Triple_Triple,
  DD_60_Outcomes_Triple_Triple,
  DD_61_Won_Lost_Triple_Triple,
  summary,
  endCard
  ],
});
