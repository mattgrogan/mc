import { sound } from "@motion-canvas/core";
import DDNullAudioPlayer from "./null_audio_player";

import chimeAudio from "../../../assets/sfx/chime_012.mp3";
const chime = sound(chimeAudio);

import wooshAudio from "../../../assets/sfx/woosh_fast_01.mp3";
const woosh = sound(wooshAudio);

export default class DDAudioPlayer extends DDNullAudioPlayer {
  public chime() {
    chime.play();
  }
  public woosh() {
    woosh.play();
  }
}
