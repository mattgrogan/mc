import { sound } from "@motion-canvas/core";
import DDNullAudioPlayer from "./null_audio_player";

import chimeAudio from "../../../assets/sfx/chime_012.mp3";
const chime = sound(chimeAudio).gain(-20);;

import wooshAudio from "../../../assets/sfx/woosh_fast_01.mp3";
const woosh = sound(wooshAudio).gain(-20);

import typingAudio from "../../../assets/sfx/typing_01.mp3";
const typing = sound(typingAudio).gain(-20);

import scroll1sAudio from "../../../assets/sfx/scroll_005.mp3";
const scroll1s = sound(scroll1sAudio).gain(-20);

import scroll2sAudio from "../../../assets/sfx/scroll_005_2s.wav";
const scroll2s = sound(scroll2sAudio).gain(-20);

export default class DDAudioPlayer extends DDNullAudioPlayer {
  public chime() {
    chime.play();
  }
  public woosh() {
    woosh.play();
  }
  public typing(secs: number = 1) {
    typing.trim(0, secs).play()
  }
  public scroll_1s() {
    scroll1s.play()
  }
  public scroll_2s() {
    scroll2s.play()
  }
}
