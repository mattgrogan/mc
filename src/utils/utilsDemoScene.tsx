import { Circle, Icon, makeScene2D, Txt } from "@motion-canvas/2d";
import {
  createRef,
  Direction,
  easeInCubic,
  easeInElastic,
  easeInOutCubic,
  easeOutBounce,
  easeOutCubic,
  easeOutElastic,
  useLogger,
  waitFor,
} from "@motion-canvas/core";
import { CircumscribeCircle, CircumscribeRect } from "./Circumscribe";
import { FadeOut } from "./FadeOut";
import { FadeIn } from "./FadeIn";
import { RollText } from "./RollText";
import { Spotlight } from "./Spotlight";

export default makeScene2D(function* (view) {
  // Create your animations here

  const text = createRef<Txt>();
  const label = createRef<Txt>();

  view.fill("#333");

  view.add(
    <Txt
      ref={text}
      fill={"white"}
      text={"Motion Canvas Rules!"}
    />
  );

  view.add(
    <Txt
      ref={label}
      fill={"#999"}
      text={""}
      y={300}
    />
  );

  yield* waitFor(1);
  yield* label().text("CircumscribeRect", 1);
  yield* CircumscribeRect(text, "yellow");
  yield* waitFor(1);
  yield* CircumscribeRect(text, "yellow", 2, 15, 1);
  yield* label().text("", 1);

  yield* waitFor(1);
  yield* label().text("CircumscribeCircle", 1);

  const icon = createRef<Icon>();
  view.add(
    <Icon
      ref={icon}
      icon={"noto:1st-place-medal"}
      scale={0}
      y={-200}
    />
  );
  yield* icon().scale(10, 1, easeOutBounce);
  yield* CircumscribeCircle(icon, "yellow", 15, 20);
  yield* icon().scale(0, 1, easeInElastic);
  icon().remove();

  // FADING
  yield* label().text("", 1);
  yield* waitFor(1);
  yield* label().text("FadeIn() and FadeOut()", 1);
  yield* FadeOut(text);

  text().text("Basic Fade In");
  yield* FadeIn(text);
  yield* FadeOut(text);

  text().text("FadeIn/Out with Offset [0, 100]");
  yield* FadeIn(text, 1, easeOutCubic, [0, 100]);
  yield* waitFor(0.6);
  yield* FadeOut(text, 1, easeInCubic, [0, 100]);
  yield* waitFor(0.6);

  text().text("FadeIn/Out with Offset [0, -100]");
  yield* FadeIn(text, 1, easeOutCubic, [0, -100]);
  yield* waitFor(0.6);
  yield* FadeOut(text, 1, easeInCubic, [0, -100]);
  yield* waitFor(0.6);

  text().text("FadeIn/Out with Offset [100, 0]");
  yield* FadeIn(text, 1, easeOutCubic, [100, 0]);
  yield* waitFor(0.6);
  yield* FadeOut(text, 1, easeInCubic, [100, 0]);
  yield* waitFor(0.6);

  text().text("FadeIn/Out with Offset [-100, 0]");
  yield* FadeIn(text, 1, easeOutCubic, [-100, 0]);
  yield* waitFor(0.6);
  yield* FadeOut(text, 1, easeInCubic, [-100, 0]);
  yield* waitFor(0.6);

  text().text("FadeIn with Offset [0, 100] & scale = 2");
  yield* FadeIn(text, 1, easeOutCubic, [0, 100], 2);
  yield* waitFor(0.6);
  yield* FadeOut(text, 0.6);

  text().text("FadeIn with Offset [0, -400] & scale = 2");
  yield* FadeIn(text, 1, easeOutCubic, [0, -400], 2);
  yield* waitFor(0.6);
  yield* FadeOut(text, 0.6);

  text().text("FadeIn with Offset [400, 0] & scale = 2");
  yield* FadeIn(text, 1, easeOutCubic, [400, 0], 2);
  yield* waitFor(0.6);
  yield* FadeOut(text, 0.6);

  text().text("FadeIn with Offset [-400, 0] & scale = 2");
  yield* FadeIn(text, 1, easeOutCubic, [-400, 0], 2);
  yield* waitFor(0.6);
  yield* FadeOut(text, 0.6);

  yield* waitFor(1);
  yield* label().text("I call this RollText", 1);

  yield* waitFor(1);

  const rollText = new RollText({
    initialText: "0",
    width: 200,
    height: 200,
    lineWidth: 2,
    stroke: "#555",
    fill: "#222",
    txtProps: { fontSize: 80, fill: "white" },
  });
  view.add(rollText);

  yield* waitFor(1);
  yield* rollText.next("10");
  yield* waitFor(1);
  yield* rollText.next("20");
  yield* waitFor(1);
  yield* rollText.next("30");
  yield* waitFor(1);
  yield* rollText.next("40");
  yield* waitFor(1);
  yield* label().text("It works from four directions.", 1);
  yield* waitFor(1);
  yield* rollText.next("50", Direction.Left);
  yield* waitFor(1);
  yield* rollText.next("60", Direction.Top);
  yield* waitFor(1);
  yield* rollText.next("70", Direction.Right);
  yield* waitFor(1);
  yield* rollText.next("80", Direction.Bottom);
  yield* waitFor(1);

  yield* label().text("Text looks nice too.", 1);
  yield* waitFor(1);
  yield* rollText.width(1000, 1, easeInOutCubic);
  yield* waitFor(1);
  yield* rollText.next("Wait for it!", Direction.Right);
  yield* waitFor(1);
  yield* rollText.next("MOTION CANVAS!", Direction.Bottom);
  yield* waitFor(1);

  yield* label().text("", 1);
  yield* waitFor(1);
  yield* label().text("Sometimes I need to be in the spotlight", 1);
  yield* waitFor(1);

  const spotlight = new Spotlight();
  view.add(spotlight);
  yield* spotlight.turnOn([0, 0], 300, 1);
  yield* spotlight.moveTo([325, 310], 1, easeInOutCubic);
  yield* waitFor(2);
  yield* spotlight.turnOff();

  yield* label().text("", 1);
  yield* waitFor(1);
  yield* label().text("I hope you found this useful :)", 1);
  yield* waitFor(1);

  yield* waitFor(1);
});
