import { Gradient, Layout, makeScene2D } from "@motion-canvas/2d";
import {
  createRef,
  createSignal,
  Direction,
  easeInOutCubic,
  easeOutCubic,
  makeRefs,
  slideTransition,
  waitFor,
  waitUntil,
} from "@motion-canvas/core";
import {
  Grays,
  PoppinsBlack,
  PoppinsWhite,
  shooterGradient,
  Theme,
} from "../../styles";
import { FadeIn } from "../../utils/FadeIn";
import * as params from "./DD_00_Params";
import {
  loserGradient,
  // loserIcon,
  OutcomeCard,
  outcomeCardColors,
  // pusherIcon,
  pushGradient,
  winnerGradient,
} from "../../components/styled/outcomeCard";
import { TitleBox } from "../../components/styled/titleBox";

const DATA = params.data.OUTCOMES_BY_SHOOTER.Cover4Press;

const WINNERS = DATA.N_UP;
const PUSHERS = DATA.N_EVEN;
const LOSERS = DATA.N_DOWN;
const TOTAL = DATA.N;
const AVG_WIN_GIVEN_WIN = DATA.AVG_WIN_GIVEN_WIN;
const AVG_LOSS_GIVEN_LOSS = DATA.AVG_LOSS_GIVEN_LOSS;

const plotAreaFill = new Gradient({
  type: "linear",

  from: [0, -200],
  to: [0, 500],
  stops: [
    { offset: 0, color: "#d2d2d2" },
    { offset: 1, color: "#818181" },
  ],
});

export default makeScene2D(function* (view) {
  // view.fill(Theme.BG);

  // yield* slideTransition(Direction.Right);
  yield* waitFor(1);
  const container = createRef<Layout>();
  view.add(
    <Layout
      ref={container}
      direction={"column"}
      justifyContent={"center"}
      alignItems={"center"}
      width={"90%"}
      height={"90%"}
      gap={250}
      padding={100}
      layout
    ></Layout>
  );

  yield* waitFor(1);

  const winCard = makeRefs<typeof OutcomeCard>();
  const loseCard = makeRefs<typeof OutcomeCard>();
  const pushCard = makeRefs<typeof OutcomeCard>();

  const nWinners = createSignal(0);
  const nLosers = createSignal(0);
  const nPushers = createSignal(0);

  const avgWinGivenWin = createSignal(0.0);
  const avgLossGivenLoss = createSignal(0.0);
  const push = createSignal(0);

  container().add(
    <Layout
      width={"90%"}
      height={"90%"}
      direction={"row"}
      gap={100}
      justifyContent={"center"}
    >
      <OutcomeCard
        refs={winCard}
        title={"WINNERS"}
        headerFill={winnerGradient}
        barFill={outcomeCardColors.DARK_GREEN}
        maximum={TOTAL}
        value={nWinners}
        avgValue={avgWinGivenWin}
        icon={"iconoir:priority-up"}
        props={{ fill: plotAreaFill, stroke: Grays.GRAY1 }}
      ></OutcomeCard>
      <OutcomeCard
        refs={loseCard}
        title={"LOSERS"}
        headerFill={loserGradient}
        barFill={outcomeCardColors.DARK_RED}
        maximum={TOTAL}
        value={nLosers}
        avgValue={avgLossGivenLoss}
        icon={"iconoir:priority-down"}
        props={{ fill: plotAreaFill, stroke: Grays.GRAY1 }}
      ></OutcomeCard>
      <OutcomeCard
        title={"PUSHES"}
        refs={pushCard}
        barFill={outcomeCardColors.DARK_PURPLE}
        headerFill={pushGradient}
        maximum={TOTAL}
        value={nPushers}
        avgValue={push}
        icon={"iconoir:priority-medium"}
        props={{ fill: plotAreaFill, stroke: Grays.GRAY1 }}
      ></OutcomeCard>
    </Layout>
  );

  // Draw the boxes
  yield* waitUntil("winners");
  yield* FadeIn(winCard.container, 1, easeOutCubic, [0, 100]);
  yield* nWinners(WINNERS, 2, easeInOutCubic);
  yield* waitFor(0.5);
  yield* avgWinGivenWin(AVG_WIN_GIVEN_WIN, 2, easeInOutCubic);
  yield* waitFor(3);

  yield* waitUntil("losers");
  yield* FadeIn(loseCard.container, 1, easeOutCubic, [0, 100]);
  yield* nLosers(LOSERS, 2, easeInOutCubic);
  yield* waitFor(0.5);
  yield* avgLossGivenLoss(AVG_LOSS_GIVEN_LOSS, 2, easeInOutCubic);
  yield* waitFor(3);

  yield* waitUntil("pushes");
  yield* FadeIn(pushCard.container, 1, easeOutCubic, [0, 100]);
  yield* nPushers(PUSHERS, 2, easeInOutCubic);

  yield* waitFor(2);
  yield* waitUntil("end");
});
