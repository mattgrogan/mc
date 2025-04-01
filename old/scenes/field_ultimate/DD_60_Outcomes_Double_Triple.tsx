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
  sessionGradient,
  Theme,
} from "../../styles";
import { FadeIn } from "../../utils/FadeIn";
import * as params from "./DD_00_Params_Double_Triple";
import {
  loserGradient,
  OutcomeCard,
  outcomeCardColors,
  pushGradient,
  winnerGradient,
} from "../../components/styled/outcomeCard";
import { TitleBox } from "../../components/styled/titleBox";
import { audioPlayer } from "./DD_00_Params_Double_Triple";

const WINNERS = params.winlose.find((stat) => stat.STAT == "N_UP").BY_SESSION;
const PUSHERS = params.winlose.find((stat) => stat.STAT == "N_EVEN").BY_SESSION;
const LOSERS = params.winlose.find((stat) => stat.STAT == "N_DOWN").BY_SESSION;
const TOTAL = params.winlose.find((stat) => stat.STAT == "N").BY_SESSION;

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
  view.fill(Theme.BG);

  params.audioPlayer.woosh();
  yield* slideTransition(Direction.Right);

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

  const plotTitle = makeRefs<typeof TitleBox>();
  container().add(
    <TitleBox
      refs={plotTitle}
      fontSize={100}
      nodeOpacity={0}
      rectProps={{ fill: sessionGradient, stroke: Grays.GRAY1 }}
      headerProps={{ ...PoppinsWhite }}
      subheadProps={{ ...PoppinsWhite }}
    >
      HOW MANY PLAYERS WON OR LOST ANY MONEY?
    </TitleBox>
  );
  plotTitle.subhead.text(params.name);

  const winCard = makeRefs<typeof OutcomeCard>();
  const loseCard = makeRefs<typeof OutcomeCard>();
  const pushCard = makeRefs<typeof OutcomeCard>();

  const nWinners = createSignal(0);
  const nLosers = createSignal(0);
  const nPushers = createSignal(0);

  container().add(
    <Layout
      width={"90%"}
      height={"70%"}
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
        icon={"iconoir:priority-medium"}
        props={{ fill: plotAreaFill, stroke: Grays.GRAY1 }}
      ></OutcomeCard>
    </Layout>
  );

  // Draw the title
  yield* FadeIn(plotTitle.headerContainer, 0, easeOutCubic, [100, 0]);
  yield* FadeIn(plotTitle.subheadContainer, 0, easeOutCubic, [100, 0]);
  yield* FadeIn(plotTitle.container, 0.6, easeOutCubic, [100, 0]);
  yield* waitFor(3);

  // Draw the boxes
  yield* waitUntil("winners");
  yield* FadeIn(winCard.container, 1, easeOutCubic, [0, 100]);
  audioPlayer.scroll_2s()
  yield* nWinners(WINNERS, 2, easeInOutCubic);
  yield* waitFor(3);
  
  yield* waitUntil("losers");
  yield* FadeIn(loseCard.container, 1, easeOutCubic, [0, 100]);
  audioPlayer.scroll_2s()
  yield* nLosers(LOSERS, 2, easeInOutCubic);
  yield* waitFor(3);
  
  yield* waitUntil("pushes");
  yield* FadeIn(pushCard.container, 1, easeOutCubic, [0, 100]);
  audioPlayer.scroll_2s()
  yield* nPushers(PUSHERS, 2, easeInOutCubic);

  yield* waitFor(8);
  yield* waitUntil("end");
});
