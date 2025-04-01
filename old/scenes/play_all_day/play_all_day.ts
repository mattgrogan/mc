import { makeProject } from "@motion-canvas/core";
import "../../global.css";

//import audio from "../audio/DD - 440 Inside Regression - 10_00108000.flac";
import audio from "../../../audio/DD - PLAY ALL DAY - 25_00108000.flac";

import intro from "./intro?scene";
import strategy from "../titles/strategy?scene";
import strat_descr from "./strat_descr?scene";
import simulationTitle from "../titles/simulation?scene";
import simulation from "./simulation?scene";
import win_lose_push_sess from "./win_lose_push_sess?scene";
import win_lose_push_sh from "./win_lose_push_sh?scene";
import amount_won_lost from "./amount_won_lost?scene";
import shooter_amount_won_lost from "./shooter_amount_won_lost?scene";
import bankroll from "./bankroll?scene";
import report_card_title from "../titles/report_card_title?scene";
import report_card from "./report_card?scene";

export default makeProject({
  scenes: [
    intro,
    strategy,
    strat_descr,
    simulationTitle,
    simulation,
    win_lose_push_sh,
    shooter_amount_won_lost,
    win_lose_push_sess,
    amount_won_lost,
    bankroll,
    report_card_title,
    report_card,
  ],
  audio: audio,
});
