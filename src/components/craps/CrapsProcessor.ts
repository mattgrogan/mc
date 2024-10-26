// This object processes a craps simulation file
// and generates the animations.

import { Reference, useLogger, waitFor } from "@motion-canvas/core";
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

  public *test(data: any) {
    const logger = useLogger();
    logger.debug({
      message: "Some more advanced logging",
      remarks:
        "Some remarks about this log. Can also contain <b>HTML</b> tags.",
      object: data,
      durationMs: 200,
      stack: new Error("").stack,
    });
    yield* this.table().dice().throw(6, 6);
  }

  public *round(data: any) {
    // Run one round of craps
    yield* this.scoreBug().updateLabel("GET READY!");
    yield* this.scoreBug().updateRoll(data.SHOOTER_ROLL == 1);
    yield* waitFor(1);

    yield* this.scoreBug().updateLabel("PLACE BETS");
    yield* this.scoreBug().updateBankroll(data.PLYR_BANKROLL_START);
    yield* this.scoreBug().updateBets(data.PLYR_BETS_TOTAL);
    yield* this.scoreBug().updateExposure(data.PLYR_SHEXPOSURE);

    yield* waitFor(1);

    yield* this.scoreBug().updateLabel("DICE ARE OUT");
    yield* this.table().dice().throw(data.D1, data.D2);
    yield* this.scoreBug().updateLabel("THROW IS " + data.THROW);

    yield* waitFor(1);

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
    // PAY
    // MOVE

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
