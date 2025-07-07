// This object processes a craps simulation file
// and generates the animations.

import { all, delay, Reference, sequence, waitFor } from "@motion-canvas/core";
import { CrapsScoreBug } from "./CrapsScoreBug";
import { CrapsTable } from "./CrapsTable";
import { c } from "./CrapsTableCoords";
import { CrapsWinConditions } from "./CrapsWinConditions";

// import diceRollSfx from "../../../assets/sfx/dice_roll.mp3";
// import chime_012 from "../../../assets/sfx/chime_012.mp3";
// import chime_018 from "../../../assets/sfx/chime_018.mp3";
// import error_01 from "../../../assets/sfx/error_01.wav";
// const diceRoll = sound(diceRollSfx);
// const popup = sound(chime_012).gain(-15);
// const win = sound(chime_018).gain(-15);
// const sevenOut = sound(error_01).gain(-15);

// Only show the working indicator on these bet types
const WORKING_INDICATOR_BETS = [
  "BUY4",
  "PLACE4",
  "PLACE5",
  "PLACE6",
  "PLACE8",
  "PLACE9",
  "PLACE10",
  "BUY10",
  "COME4ODDS",
  "COME5ODDS",
  "COME6ODDS",
  "COME8ODDS",
  "COME9ODDS",
  "COME10ODDS",
];

export class CrapsProcessor {
  private declare table: Reference<CrapsTable>;
  private declare scoreBug: Reference<CrapsScoreBug>;
  private declare winConds: Reference<CrapsWinConditions>;
  public declare forceWorkingIndicator: boolean;

  public constructor(
    table: Reference<CrapsTable>,
    scoreBug: Reference<CrapsScoreBug>,
    winConds: Reference<CrapsWinConditions>
  ) {
    this.table = table;
    this.scoreBug = scoreBug;
    this.winConds = winConds;
    this.forceWorkingIndicator = false;
  }

  public *round(data: any) {
    if (data.SHOOTER_ROLL == 1) {
      // popup.play();
      yield this.scoreBug().newShooter();
    }

    yield* all(
      this.scoreBug().updateRoll(data.SHOOTER_ROLL == 1),
      this.scoreBug().updateBankroll(data.NET_BR_START),
      this.scoreBug().updateExposure(data.NET_SHBR_START)
    );

    yield* this.scoreBug().updateLabel("PLACE BETS");

    // Take any bets down
    const downBets = [];
    for (const bet of data.BETSDOWN) {
      downBets.push(this.table().bets().removeBet(bet.bet));
    }
    yield* sequence(0.2, ...downBets);

    // Place new bets
    const newBets = [];
    for (const betType of data.NEWBETS) {
      const isBuy = betType.bet == "BUY4" || betType.bet == "BUY10";
      const isLay =
        betType.bet == "LAY4" ||
        betType.bet == "LAY5" ||
        betType.bet == "LAY6" ||
        betType.bet == "LAY8" ||
        betType.bet == "LAY9" ||
        betType.bet == "LAY10";
      newBets.push(
        this.table()
          .bets()
          .makeBet(betType.amount, betType.bet, false, isBuy, isLay)
      );
    }
    yield* sequence(0.3, ...newBets);

    // Update working indicator if it does not match the puck
    for (const bet of data.BETS) {
      // Only for place bets - need to keep WORKING_INDICATOR_BETS updated
      if (WORKING_INDICATOR_BETS.includes(bet.bet)) {
        if (data.POINT_STATUS != bet.working || this.forceWorkingIndicator) {
          yield* this.table()
            .bets()
            .chip(bet.bet)
            .setWorking(bet.working == "On");
          yield this.table().bets().chip(bet.bet).showWorking(0.6);
        } else {
          yield this.table().bets().chip(bet.bet).hideWorking(0.6);
        }
      }
    }

    // Update scorebug after bets down and placed
    yield* all(
      this.scoreBug().updateBankroll(data.NET_BR_UPDATED),
      this.scoreBug().updateBets(data.BETS_TOTAL),
      this.scoreBug().updateExposure(data.NET_SHBR_UPDATED),
      this.winConds().update(data.WIN_CONDITIONS)
    );

    yield* waitFor(0.6);

    // Throw the dice
    yield* this.scoreBug().updateLabel("DICE ARE OUT");
    // diceRoll.play();
    yield* this.table().dice().throw(data.D1, data.D2);
    yield this.winConds().highlight(data.D1, data.D2);
    // yield* this.scoreBug().updateLabel("THROW IS " + data.THROW);

    yield* waitFor(0.6);

    if (data.IS_SEVEN_OUT) {
      // sevenOut.play();
      yield delay(0.4, this.scoreBug().sevenOut());
    }

    if (data.IS_POINT_SET) {
      // popup.play();
      yield delay(0.4, this.scoreBug().pointSet(data.POINTS_SET));
    }

    if (data.IS_POINT_HIT) {
      // popup.play();
      yield delay(0.4, this.scoreBug().pointHit());
    }

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
    for (const bet of data.LOST) {
      lostBets.push(this.table().bets().loseBet(bet.bet));
    }
    yield* sequence(0.2, ...lostBets);

    // RETURN
    for (const pushedBet of data.RETURNED) {
      yield* this.table().bets().removeBet(pushedBet.bet);
    }

    // PAY
    const wonBets = [];

    for (const bet of data.WON) {
      const continues = bet.continues.toString() === "true";
      wonBets.push(this.table().bets().winBet(bet.won, bet.bet, !continues));
      // win.play(0.4);
    }
    yield* sequence(0.2, ...wonBets);

    // PUSH
    for (const pushedBet of data.PUSHED) {
      yield* this.table().bets().removeBet(pushedBet.bet);
    }

    // MOVE
    for (const movedBet of data.MOVED) {
      yield* this.table().bets().moveBet(movedBet.bet, movedBet.to);
    }

    // Update the scorebug fields
    yield* all(
      this.scoreBug().updateBankroll(data.NET_BR_END),
      this.scoreBug().updateBets(data.BETSREMAINING_TOTAL),
      this.scoreBug().updateExposure(data.NET_SHBR_END)
    );

    // Hide the dice
    yield this.table().dice().removeDice();

    if (data.WONLOST > 0) {
      yield* this.scoreBug().updateLabel(
        "PLAYER WINS " + data.WONLOST.toString()
      );
    }
    if (data.WONLOST < 0) {
      yield* this.scoreBug().updateLabel(
        "PLAYER LOSES " + data.WONLOST.toString()
      );
    }

    yield* waitFor(1);
  }
}
