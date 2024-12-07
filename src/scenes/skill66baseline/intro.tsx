import {
  Icon,
  Img,
  Layout,
  Line,
  makeScene2D,
  Rect,
  Txt,
} from "@motion-canvas/2d";
import {
  all,
  createRef,
  easeInElastic,
  easeInOutCubic,
  easeOutCubic,
  easeOutElastic,
  linear,
  sequence,
  waitFor,
  waitUntil,
} from "@motion-canvas/core";

import {
  Bright,
  Grays,
  ITCBenguiatNormal,
  MonoWhite,
  PoppinsWhite,
  Theme,
} from "../../styles";

import { FadeIn } from "../../utils/FadeIn";
import bg from "../../../assets/dark_craps_layout_bg.png";
import { CrapsTable } from "../../components/craps/CrapsTable";
import { CrapsScoreBug } from "../../components/craps/CrapsScoreBug";
import { c } from "../../components/craps/CrapsTableCoords";

export default makeScene2D(function* (view) {
  view.fill("#000");
  view.add(
    <Img
      src={bg}
      opacity={0.3}
    />
  );

  const container = createRef<Layout>();
  const header = createRef<Txt>();
  const title = createRef<Txt>();

  view.add(
    <Layout
      layout
      ref={container}
      direction={"column"}
      gap={0}
    >
      <Txt
        ref={header}
        opacity={0}
        {...PoppinsWhite}
        fill={Grays.GRAY2}
        text={"TODAY'S SIMULATION"}
      />
      <Txt
        ref={title}
        opacity={0}
        {...PoppinsWhite}
        fontWeight={600}
        fontSize={120}
        text={"SKILL 66 BASELINE"}
        alignSelf={"center"}
      />
    </Layout>
  );
  yield* waitFor(1);

  // suppress the layout for a while and remember the positions
  container()
    .children()
    .forEach((ref) => ref.save());
  container().layout(false);
  container()
    .children()
    .forEach((ref) => ref.restore());

  // Fade In
  yield* sequence(
    0.2,
    FadeIn(title, 1, easeOutCubic, [0, 100], 2),
    FadeIn(header, 0.6, easeOutCubic, [-100, 0])
  );

  // Draw lines
  const line1: Line = (
    <Line
      stroke={Grays.GRAY1}
      lineWidth={5}
      points={[
        [-1920 / 2, 0],
        [1920 / 2, 0],
      ]}
      end={0}
    />
  );
  line1.absolutePosition(() => header().absolutePosition().addY(-100));
  const line2 = line1.clone();
  line2.absolutePosition(() => title().absolutePosition().addY(100));
  line2.end(1);
  line2.start(1);

  view.add(line1);
  view.add(line2);

  yield* waitFor(0.6);
  yield* sequence(
    0.1,
    line1.end(1, 0.5),
    line1.start(1, 0.5),
    line2.end(0, 0.5),
    line2.start(0, 0.5)
  );

  yield* waitFor(0.6);

  // Move Up
  yield* container().y(-350, 1, easeInOutCubic);
  yield* container().x(-350, 1, easeInOutCubic);

  const rect = createRef<Rect>();
  const table = createRef<CrapsTable>();
  const bug = createRef<CrapsScoreBug>();
  const icon = createRef<Icon>()

  view.add(
    <Layout
      layout
      y={150}
    >
      <Rect
        ref={rect}
        direction={"column"}
        width={"100%"}
        height={"100%"}
        alignItems={"center"}
        padding={30}
        paddingLeft={100}
        paddingRight={100}
        radius={10}
        gap={10}
        stroke={Grays.GRAY2}
        lineWidth={5}
        end={0}
        clip
      >
        {/* <Txt
          {...PoppinsWhite}
          fontSize={50}
          text={"TWO HITS: THEN LOCK IN PROFITS"}
          opacity={0}
        /> */}
        {/* <Txt
          {...PoppinsWhite}
          fontSize={50}
          text={"BASELINE AND MOVE INTO ANY STRATEGY"}
          opacity={0}
        /> */}
        <Icon
        ref={icon}
          //icon={"fluent-emoji-flat:dollar-banknote"}
          icon={"fluent-emoji-flat:victory-hand-light"}
          scale={0}
          size={[300, 300]}
          opacity={1}
          margin={50}
        ></Icon>
      </Rect>
    </Layout>
  );

  yield* rect().end(1, 1, easeInOutCubic);
  yield* rect().fill(Theme.BG, 1, linear);
  yield* icon().scale(1, 1, easeOutElastic)
  // yield* sequence(
  //   0.2,
  //   ...rect()
  //     .children()
  //     .map((node) => node.opacity(1, 1, linear))
  // );

  yield* waitFor(2);

  // suppress the layout for a while and remember the positions
  rect()
    .children()
    .forEach((ref) => ref.save());
  rect().width(rect().width());
  rect().height(rect().height());
  rect().layout(false);
  rect()
    .children()
    .forEach((ref) => ref.restore());

  yield* waitUntil("table");
  yield* rect().height(0, 1, easeInElastic);
  rect().remove();

  yield* waitFor(1);

  const tableContainer = createRef<Layout>();
  view.add(
    <Layout ref={tableContainer}>
      <CrapsTable
        ref={table}
        opacity={0}
        scale={0.7}
        x={0}
        y={150}
      ></CrapsTable>
    </Layout>
  );
  yield* FadeIn(table(), 1, easeOutCubic, [0, 500]);

  view.add(
    <CrapsScoreBug
      ref={bug}
      opacity={0}
      scale={0.7}
      //position={[640, -370]}
      //y={-370}
      // x={640}
    />
  );
  bug().position([0, 450]);
  yield* sequence(
    0.5,
    FadeIn(bug(), 0.6, easeOutCubic, [0, 100]),
    bug().updateLabel("GOOD LUCK!")
  );

  // THROW A POINT
  yield* waitUntil("set-point");
  yield bug().updateLabel("DICE ARE OUT")
  yield* bug().updateRoll(true);
  yield* table().dice().throw(2, 2);
  yield bug().updateLabel("")
  yield* table().movePuckTo(c.PUCK4);

  yield* waitUntil("place66");
  yield* sequence(
    0.2,
    table().bets().makeBet(15, c.PLACE5, true),
    table().bets().makeBet(18, c.PLACE6, true),
    table().bets().makeBet(18, c.PLACE8, true),
    table().bets().makeBet(15, c.PLACE9, true)
  );
  yield table().dice().removeDice();
  yield* all(
    bug().updateRoll(false),
    bug().updateBets(66),
    bug().updateBankroll(-66),
    bug().updateExposure(-66)
  );
  yield* waitFor(1);

  // ROLL #2
  yield* waitUntil("roll5");
  yield* table().dice().throw(3, 2);
  yield* table().bets().winBet(21, c.PLACE5, false);
  yield* all(bug().updateBankroll(-45), bug().updateExposure(-45));

  yield* waitFor(2);
  yield* waitUntil("place88");
  yield table().bets().removeBet(c.PLACE5);
  yield table().bets().removeBet(c.PLACE6);
  yield table().bets().removeBet(c.PLACE8);
  yield* table().bets().removeBet(c.PLACE9);
  yield* sequence(
    0.2,
    table().bets().makeBet(20, c.PLACE5, true),
    table().bets().makeBet(24, c.PLACE6, true),
    table().bets().makeBet(24, c.PLACE8, true),
    table().bets().makeBet(20, c.PLACE9, true)
  );
  yield table().dice().removeDice();
  yield* all(
    bug().updateRoll(false),
    bug().updateBets(88),
    bug().updateBankroll(-67),
    bug().updateExposure(-67)
  );
  yield* waitFor(1);

  // ROLL #3
  yield* waitUntil("roll6");
  yield* table().dice().throw(3, 3);
  yield* table().bets().winBet(28, c.PLACE5, false);
  yield* all(bug().updateBankroll(-39), bug().updateExposure(-39));

  yield* waitFor(2);
  yield* waitUntil("place44");
  yield table().bets().removeBet(c.PLACE5);
  yield table().bets().removeBet(c.PLACE6);
  yield table().bets().removeBet(c.PLACE8);
  yield* table().bets().removeBet(c.PLACE9);
  yield* all(bug().updateBets(0), bug().updateBankroll(49), bug().updateExposure(49));
  yield* waitFor(1);

  yield* waitFor(1);

  yield* waitFor(3);

  yield* waitUntil("end");
});
