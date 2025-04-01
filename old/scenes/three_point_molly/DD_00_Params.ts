// import * as params from "./DD_00_Params";

export const name = "THREE POINT MOLLY WITH MAX ODDS";
export const sessions = "100,000";
export const shooters_per_session = "10";
export const table_min = "$15";
export const table_max = "$5,000";

//-sessions-shooters-rolls.json
import simstatsImport from "../../../../dicedata/output/three_point_molly-100k/three_point_molly-100k-sessions-shooters-rolls.json";
export const simstats = simstatsImport;

//-rolls_by_session.json
import rollsBySessionImport from "../../../../dicedata/output/three_point_molly-100k/three_point_molly-100k-rolls_by_session.json";
export const rollsBySession = rollsBySessionImport;

//-rolls_by_shooter.json
import rollsByShooterImport from "../../../../dicedata/output/three_point_molly-100k/three_point_molly-100k-rolls_by_shooter.json";
export const rollsByShooter = rollsByShooterImport;

//-quantiles.json
import quantilesImport from "../../../../dicedata/output/three_point_molly-100k/three_point_molly-100k-quantiles.json";
export const quantiles = quantilesImport;

// -worst_bankroll.json
import worstBankrollImport from "../../../../dicedata/output/three_point_molly-100k/three_point_molly-100k-worst_bankroll.json";
export const worstBankroll = worstBankrollImport;

//-shooter_winloss_histogram.json
import shooterHistImport from "../../../../dicedata/output/three_point_molly-100k/three_point_molly-100k-shooter_winloss_histogram.json";
export const shooterHist = shooterHistImport;

//-session_hist.json
import sessionHistImport from "../../../../dicedata/output/three_point_molly-100k/three_point_molly-100k-session_hist.json";
export const sessionHist = sessionHistImport;

//-amount-wonlost-quantiles.json
import amountWonLostQuantilesImport from "../../../../dicedata/output/three_point_molly-100k/three_point_molly-100k-amount-wonlost-quantiles.json";
export const amountWonLostQuantiles = amountWonLostQuantilesImport;

//-out_of_hand.json
import out_of_handImport from "../../../../dicedata/output/three_point_molly-100k/three_point_molly-100k-out_of_hand.json";
export const out_of_hand = out_of_handImport;

// -winloss-outcomes.json
import winloseImport from "../../../../dicedata/output/three_point_molly-100k/three_point_molly-100k-winloss-outcomes.json";
export const winlose = winloseImport;

//-casinostats.json
import casinostatsImport from "../../../../dicedata/output/three_point_molly-100k/three_point_molly-100k-casinostats.json";
export const casinostats = casinostatsImport;
