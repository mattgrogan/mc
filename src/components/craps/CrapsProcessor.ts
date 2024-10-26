// This object processes a craps simulation file
// and generates the animations.

import { Reference, sequence, useLogger, waitFor } from "@motion-canvas/core";
import { CrapsScoreBug } from "./CrapsScoreBug";
import { CrapsTable } from "./CrapsTable";
import { c } from "./CrapsTableCoords";

export class CrapsProcessor {
  private declare table: Reference<CrapsTable>;
  private declare scoreBug: Reference<CrapsScoreBug>;
  public constructor(
    table: Reference<CrapsTable>,
    scoreBug: Reference<CrapsScoreBug>
  ) {
    this.table = table;
    this.scoreBug = scoreBug;
  }

  public *round(data: any) {
    const logger = useLogger();

    // Run one round of craps
    yield* this.scoreBug().updateLabel("GET READY!");
    yield* this.scoreBug().updateRoll(data.SHOOTER_ROLL == 1);

    yield* this.scoreBug().updateBankroll(data.PLYR_NET_BR_START);
    yield* this.scoreBug().updateExposure(data.PLYR_NET_SHBR_START);
    yield* waitFor(1);

    yield* this.scoreBug().updateLabel("PLACE BETS");

    // Take any bets down
    const downBets = [];
    for (const bet of data.PLYR_BETSDOWN) {
      downBets.push(this.table().bets().removeBet(bet.bet));
    }
    yield* sequence(0.2, ...downBets);

    // Place new bets
    const newBets = [];
    for (const bet of data.PLYR_NEWBETS) {
      newBets.push(this.table().bets().makeBet(bet.amount, bet.bet));
    }
    yield* sequence(0.2, ...newBets);

    // Update scorebug after bets down and placed
    yield* this.scoreBug().updateBankroll(data.PLYR_NET_BR_UPDATED);
    yield* this.scoreBug().updateBets(data.PLYR_BETS_TOTAL);
    yield* this.scoreBug().updateExposure(data.PLYR_NET_SHBR_UPDATED);

    yield* waitFor(1);

    // Throw the dice
    yield* this.scoreBug().updateLabel("DICE ARE OUT");
    yield* this.table().dice().throw(data.D1, data.D2);
    yield* this.scoreBug().updateLabel("THROW IS " + data.THROW);

    yield* waitFor(1);

    // Move the puck
    if (data.NEW_POINT_STATUS == "On" || data.NEW_POINT_STATUS == "Off") {
      let puckPosition = c.PUCKOFF;
      switch (data.NEW_POINT) {
        case 4: {
          puckPosition = c.PUCK4;
          break;
        }
        case 5: {
          puckPosition = c.PUCK5;
          break;
        }
        case 6: {
          puckPosition = c.PUCK6;
          break;
        }
        case 8: {
          puckPosition = c.PUCK8;
          break;
        }
        case 9: {
          puckPosition = c.PUCK9;
          break;
        }
        case 10: {
          puckPosition = c.PUCK10;
          break;
        }
      }

      yield* this.table().movePuckTo(puckPosition);
    }

    // TAKE
    const lostBets = [];
    for (const bet of data.PLYR_LOST) {
      lostBets.push(this.table().bets().loseBet(bet.bet));
    }
    yield* sequence(0.2, ...lostBets);

    // PAY
    const wonBets = [];

    for (const bet of data.PLYR_WON) {
      logger.debug({ message: "Won Bet", object: bet });
      wonBets.push(this.table().bets().winBet(bet.won, bet.bet, true));
    }
    yield* sequence(0.2, ...wonBets);

    // Update the scorebug fields
    yield* this.scoreBug().updateBankroll(data.PLYR_NET_BR_END);
    yield* this.scoreBug().updateBets(data.PLYR_BETSREMAINING_TOTAL);
    yield* this.scoreBug().updateExposure(data.PLYR_NET_SHBR_END);

    // MOVE
    // TODO: Move any bets that moved.

    // Hide the dice
    yield* this.table().dice().removeDice();

    if (data.PLYR_WONLOST > 0) {
      yield* this.scoreBug().updateLabel(
        "PLAYER WINS " + data.PLYR_WONLOST.toString()
      );
    }
    if (data.PLYR_WONLOST < 0) {
      yield* this.scoreBug().updateLabel(
        "PLAYER LOSES " + data.PLYR_WONLOST.toString()
      );
    }

    yield* waitFor(1);
  }
}
