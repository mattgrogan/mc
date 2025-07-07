import { makeProject } from "@motion-canvas/core";
import "../../global.css";

// shooters and hands
import DD_20_Outcomes_Per_Shooter from "./DD_20_Outcomes_Per_Shooter?scene";
import DD_21_Won_Lost_Per_Shooter from "./DD_21_Won_Lost_Per_Shooter?scene";

// sessions
import DD_30_Outcomes_Per_Session from "./DD_30_Outcomes_Per_Session?scene";
import DD_31_Won_Lost_Per_Session from "./DD_31_Won_Lost_Per_Session?scene";

// bankroll
import DD_40_Outlay_Per_Shooter from "./DD_40_Outlay_Per_Shooter?scene";
import DD_41_Outlay_Per_Session from "./DD_41_Outlay_Per_Session?scene";
import DD_42_Outlay_by_Hour from "./DD_42_Outlay_by_Hour?scene";
import DD_43_Session_Yield from "./DD_43_Session_Yield?scene";

// bets
import DD_51_Wins_Per_Bet from "./DD_51_Wins_Per_Bet?scene";
import DD_52_Loss_Per_Bet from "./DD_52_Loss_Per_Bet?scene";

// throws
import DD_60_Throws_to_Profit from "./DD_60_Throws_to_Profit?scene";

// house
import DD_70_House_Take_And_Edge from "./DD_70_House_Take_And_Edge?scene";

// digest
import DD_80_Digest from "./DD_80_Digest?scene";
import DD_90_Bot_Battle from "./DD_90_Bot_Battle?scene";

// bot battle

export default makeProject({
  scenes: [
    // shooters and hands
    DD_20_Outcomes_Per_Shooter,
    DD_21_Won_Lost_Per_Shooter,

    // sessions
    DD_30_Outcomes_Per_Session,
    DD_31_Won_Lost_Per_Session,

    // bankroll
    DD_40_Outlay_Per_Shooter,
    DD_41_Outlay_Per_Session,
    DD_42_Outlay_by_Hour,
    DD_43_Session_Yield,

    // bets
    DD_51_Wins_Per_Bet,
    DD_52_Loss_Per_Bet,

    // throws
    // DD_60_Throws_to_Profit,

    // house
    DD_70_House_Take_And_Edge,

    // digest
    DD_80_Digest,

    // bot battle
    DD_90_Bot_Battle,
  ],
});
