import { sound } from "@motion-canvas/core";
import chimeAudio from "../../../assets/sfx/chime_012.mp3";
const chime = sound(chimeAudio);

export default class DDAudioPlayer {
  public chime() {
    chime.play();
  }
}
