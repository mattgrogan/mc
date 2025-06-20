// Strategy Configuration
export const name = "DP + 1x Odds + 6/8";
export const sessions = "100,000";
export const shooters_per_session = "10";
export const table_min = "$15";
export const table_max = "$1,000";

// Data Configuration
export const SIM_NAME = "dp1x68";
export const RUN_NAME = "100k";
export const PLAYER_NAME = "PLYR";

// Import all data files for this simulation (must use literal paths)

// overall_stats.v1.json
import overallStatsImport from "../../../../dicedata/output/dp1x68-100k/json/overall_stats.v1.json";
import outcomesHandImport from "../../../../dicedata/output/dp1x68-100k/json/outcomes_by_hand.v1.json";
import outcomesSessionImport from "../../../../dicedata/output/dp1x68-100k/json/outcomes_by_session.v1.json";

// Export player-specific data
export const OVERALL_DATA = overallStatsImport[PLAYER_NAME];
export const BYHAND_DATA = outcomesHandImport[PLAYER_NAME];
export const BYSESSION_DATA = outcomesSessionImport[PLAYER_NAME];
