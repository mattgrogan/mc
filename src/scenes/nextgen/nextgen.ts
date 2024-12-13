import { makeProject } from "@motion-canvas/core";
import "../../global.css";

import dd_40_simulation from "./DD_40_Simulation?scene";
import dd_50_game_throws from "./DD_50_Game_Throws?scene";

export default makeProject({
  scenes: [dd_40_simulation, dd_50_game_throws],
});
