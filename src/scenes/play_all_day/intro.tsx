import {
  Camera,
  Img,
  Layout,
  makeScene2D,
  Node,
  Rect,
  Txt,
} from "@motion-canvas/2d";
import {
  all,
  createRef,
  createSignal,
  Direction,
  easeInBack,
  easeInCubic,
  easeInElastic,
  easeInOutCubic,
  easeOutBack,
  easeOutBounce,
  easeOutCubic,
  easeOutElastic,
  easeOutExpo,
  sequence,
  waitFor,
  waitUntil,
} from "@motion-canvas/core";
import { CrapsTable } from "../../components/craps/CrapsTable";

import { FadeIn } from "../../utils/FadeIn";

import { c } from "../../components/craps/CrapsTableCoords";
import { Bright, Grays, MonoWhite, PoppinsWhite, Theme } from "../../styles";
import { RollText } from "../../utils/RollText";
import { FadeOut } from "../../utils/FadeOut";

import moneyImg from "../../../assets/svgrepo/banking-exchange-svgrepo-com.svg";
import timeImg from "../../../assets/svgrepo/time-stopwatch-svgrepo-com.svg";
import chipImg from "../../../assets/svgrepo/gambler-casino-svgrepo-com.svg";
import champImg from "../../../assets/svgrepo/celebration-ice-cubes-svgrepo-com.svg";
import glassImg from "../../../assets/svgrepo/alcoholic-party-svgrepo-com.svg";
import hotelImg from "../../../assets/svgrepo/hotel-signal-hotel-svgrepo-com.svg";
import cruiseImg from "../../../assets/svgrepo/cruise-ship-svgrepo-com.svg";

const LabelFont = {
  ...PoppinsWhite,
  fontWeight: 600,
  fontSize: 140,
  fill: Bright.GREEN,
};

const NumberFont = {
  ...MonoWhite,
  fontWeight: 600,
  fontSize: 80,
};

export default makeScene2D(function* (view) {
  view.fill(Theme.BG);
  view.opacity(1);

  const container = createRef<Layout>();
  const text = createRef<Txt>();

  const money = createRef<Img>();
  const time = createRef<Img>();
  const chip = createRef<Img>();
  const champ = createRef<Img>();
  const glass = createRef<Img>();
  const hotel = createRef<Img>();
  const cruise = createRef<Img>();

  view.add(
    <Layout ref={container}>
      <Txt
        ref={text}
        {...LabelFont}
      />
      <Img
        ref={money}
        src={moneyImg}
        scale={2.5}
        opacity={0}
      />
      <Img
        ref={time}
        src={timeImg}
        scale={0.5}
        opacity={0}
      />
      <Img
        ref={chip}
        src={chipImg}
        scale={0.5}
        opacity={0}
      />
      <Img
        ref={champ}
        src={champImg}
        scale={1}
        opacity={0}
      />
      <Img
        ref={glass}
        src={glassImg}
        scale={1}
        opacity={0}
      />
      <Img
        ref={hotel}
        src={hotelImg}
        scale={4.5}
        opacity={0}
      />
      <Img
        ref={cruise}
        src={cruiseImg}
        scale={1}
        opacity={0}
      />
    </Layout>
  );

  yield* waitUntil("THIS");
  text().text("THIS");
  yield waitFor(0.05);

  yield* waitUntil("IS");
  text().text("IS");
  yield waitFor(0.05);

  yield* waitUntil("THE");
  text().text("THE");
  yield waitFor(0.05);

  yield* waitUntil("SAFEST");
  text().text("SAFEST");
  yield waitFor(0.05);

  yield* waitUntil("WAY");
  text().text("WAY");
  yield waitFor(0.05);

  yield* waitUntil("TO");
  text().text("TO");
  yield waitFor(0.05);

  yield* waitUntil("PLAY");
  text().text("PLAY");
  yield waitFor(0.05);

  yield* waitUntil("CRAPS");
  text().text("CRAPS");
  yield waitFor(0.05);

  yield* waitUntil("fadeout");
  yield* FadeOut(text, 0.6, easeInOutCubic, [0, -100]);

  yield* waitUntil("money");
  yield* FadeIn(money, 0.6, easeOutCubic, [0, 50]);
  yield* waitFor(0.5);
  yield* FadeOut(money, 0.6, easeInBack, [0, -50]);

  yield* waitUntil("time");
  yield* FadeIn(time, 0.6, easeOutCubic, [0, 50]);
  yield* waitFor(0.5);
  yield* FadeOut(time, 0.4, easeInBack, [0, -50]);

  yield* waitUntil("comps");
  // yield* FadeIn(chip, 0.4, easeOutElastic, [0, 50]);
  // yield* FadeOut(chip, 0.4, easeInBack, [0, -50]);

  yield* FadeIn(champ, 0.4, easeOutCubic, [0, 100]);
  yield* FadeOut(champ, 0.4, easeInCubic);

  yield* FadeIn(glass, 0.4, easeOutCubic, [0, 100]);
  yield* FadeOut(glass, 0.4, easeInCubic);

  yield* FadeIn(hotel, 0.4, easeOutCubic, [0, 100]);
  yield* FadeOut(hotel, 0.4, easeInCubic);

  yield* FadeIn(cruise, 0.4, easeOutCubic, [0, 100]);
  yield* FadeOut(cruise, 0.4, easeInCubic);

  yield* waitUntil("BUT-2");
  text().text("BUT");
  text().fill(Bright.RED);
  yield* FadeIn(text, 0.4, easeOutCubic, [0, -100]);
  yield waitFor(1);

  yield* waitUntil("HOW-2");
  text().text("HOW");
  yield waitFor(1);

  yield* waitUntil("SAFE-2");
  text().text("SAFE");
  yield waitFor(1);

  yield* waitUntil("IS-2");
  text().text("IS");
  yield waitFor(1);

  yield* waitUntil("IT-2");
  text().text("IT");
  yield waitFor(1);

  yield* waitUntil("REALLY-2");
  text().text("REALLY");
  yield waitFor(1.5);
  yield* FadeOut(text, 1);

  // END
  yield* waitFor(5);
  yield* waitUntil("end");
});
