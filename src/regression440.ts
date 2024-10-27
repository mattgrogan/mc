import { makeProject } from "@motion-canvas/core";
import "./global.css";

import intro from "./scenes/regression440/intro?scene";
import strategy from "./scenes/titles/strategy?scene";
import simulation from "./scenes/titles/simulation?scene";
import simulationScreen from "./scenes/regression440/simulation?scene";
import win_lose_push_sh from "./scenes/regression440/win_lose_push_sh?scene";
import win_lose_push_sess from "./scenes/regression440/win_lose_push_sess?scene";
import amount_won_lost from "./scenes/regression440/amount_won_lost?scene";
import bankroll from "./scenes/regression440/bankroll?scene";
import report_card_title from "./scenes/titles/report_card_title?scene";
import report_card from "./scenes/regression440/report_card?scene";

export default makeProject({
  scenes: [
    intro,
    strategy,
    simulation,
    simulationScreen,
    win_lose_push_sh,
    win_lose_push_sess,
    amount_won_lost,
    bankroll,
    report_card_title,
    report_card,
  ],
});
