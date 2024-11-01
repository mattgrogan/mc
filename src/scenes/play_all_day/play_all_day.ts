import { makeProject } from "@motion-canvas/core";
import "../../global.css";

//import audio from "../audio/DD - 440 Inside Regression - 10_00108000.flac";

import simulationTitle from "../titles/simulation?scene";
import simulation from "./simulation?scene";
import win_lose_push_sess from "./win_lose_push_sess?scene";
import win_lose_push_sh from "./win_lose_push_sh?scene";
import amount_won_lost from "./amount_won_lost?scene";
import shooter_amount_won_lost from "./shooter_amount_won_lost?scene";
import report_card_title from "../titles/report_card_title?scene";
import report_card from "./report_card?scene";

export default makeProject({
  scenes: [
    simulationTitle,
    simulation,
    win_lose_push_sh,
    shooter_amount_won_lost,
    win_lose_push_sess,
    amount_won_lost,
    report_card_title,
    report_card,
  ],
  //audio: audio,
});
