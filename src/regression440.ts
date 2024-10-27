import { makeProject } from "@motion-canvas/core";
import "./global.css";

import simulationScreen from "./scenes/regression440/simulation?scene";
import win_lose_push_sh from "./scenes/regression440/win_lose_push_sh?scene";
import win_lose_push_sess from "./scenes/regression440/win_lose_push_sess?scene";
import amount_won_lost from "./scenes/regression440/amount_won_lost?scene";
import bankroll from "./scenes/regression440/bankroll?scene";

export default makeProject({
  scenes: [
    simulationScreen,
    win_lose_push_sh,
    win_lose_push_sess,
    amount_won_lost,
    bankroll,
  ],
});
