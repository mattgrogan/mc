import { Vector2 } from "@motion-canvas/core";

export enum c {
  PUCKOFF = "PUCKOFF",
  PUCK4 = "PUCK4",
  PUCK5 = "PUCK5",
  PUCK6 = "PUCK6",
  PUCK8 = "PUCK8",
  PUCK9 = "PUCK9",
  PUCK10 = "PUCK10",

  DICE_START = "DICE_START",
  DICE_BOUNCE_TL = "DICE_BOUNCE_TL",
  DICE_BOUNCE_BR = "DICE_BOUNCE_BR",
  DICE_LAND_TL = "DICE_LAND_TL",
  DICE_LAND_BR = "DICE_LAND_BR",
  DICE_REST = "DICE_REST",
}

const PUCK_Y = -300;

const BOX_4 = -240;
const BOX_5 = -100;
const BOX_6 = 40;
const BOX_8 = 180;
const BOX_9 = 310;
const BOX_10 = 450;

export const tableCoords: { [id: string]: Vector2 } = {
  PUCKOFF: new Vector2(770, -380),
  PUCK4: new Vector2(BOX_4, PUCK_Y),
  PUCK5: new Vector2(BOX_5, PUCK_Y),
  PUCK6: new Vector2(BOX_6, PUCK_Y),
  PUCK8: new Vector2(BOX_8, PUCK_Y),
  PUCK9: new Vector2(BOX_9, PUCK_Y),
  PUCK10: new Vector2(BOX_10, PUCK_Y),

  DICE_START: new Vector2(-1000, -400),
  DICE_BOUNCE_TL: new Vector2(840, -230),
  DICE_BOUNCE_BR: new Vector2(840, 270),
  DICE_LAND_TL: new Vector2(-250, -100),
  DICE_LAND_BR: new Vector2(700, 400),
  DICE_REST: new Vector2(-650, -300),
};
