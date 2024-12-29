// import * as params from "./DD_00_Params";

export const name = "THE STRATEGY NAME";
export const sessions = "100,000";
export const shooters_per_session = "10";
export const table_min = "$15";
export const table_max = "$5,000";

//-sessions-shooters-rolls.json
import simstatsImport from "../../../../dicedata/output/skill66halfpress-100k/skill66halfpress-100k-sessions-shooters-rolls.json";
export const simstats = simstatsImport;

//-rolls_by_session.json
import rollsBySessionImport from "../../../../dicedata/output/pushit-new/pushit-new-rolls_by_session.json";
export const rollsBySession = rollsBySessionImport;

//-rolls_by_shooter.json
import rollsByShooterImport from "../../../../dicedata/output/pushit-new/pushit-new-rolls_by_shooter.json";
export const rollsByShooter = rollsByShooterImport;

//-quantiles.json
import quantilesImport from "../../../../dicedata/output/pushit-new/pushit-new-quantiles.json";
export const quantiles = quantilesImport;

// -worst_bankroll.json
import worstBankrollImport from "../../../../dicedata/output/pushit-new/pushit-new-worst_bankroll.json";
export const worstBankroll = worstBankrollImport;

//-shooter_winloss_histogram.json
import shooterHistImport from "../../../../dicedata/output/pushit-new/pushit-new-shooter_winloss_histogram.json";
export const shooterHist = shooterHistImport;

//-session_hist.json
import sessionHistImport from "../../../../dicedata/output/pushit-new/pushit-new-session_hist.json";
export const sessionHist = sessionHistImport;

//-amount-wonlost-quantiles.json
import amountWonLostQuantilesImport from "../../../../dicedata/output/pushit-new/pushit-new-amount-wonlost-quantiles.json";
export const amountWonLostQuantiles = amountWonLostQuantilesImport;

//-out_of_hand.json
import out_of_handImport from "../../../../dicedata/output/pushit-new/pushit-new-out_of_hand.json";
export const out_of_hand = out_of_handImport;

// -winloss-outcomes.json
import winloseImport from "../../../../dicedata/output/pushit-new/pushit-new-winloss-outcomes.json";
export const winlose = winloseImport;

//-casinostats.json
import casinostatsImport from "../../../../dicedata/output/pushit-new/pushit-new-casinostats.json";
export const casinostats = casinostatsImport;
