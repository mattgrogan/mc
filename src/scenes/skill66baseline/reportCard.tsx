import { Icon, Img, Layout, makeScene2D, Rect, Txt } from "@motion-canvas/2d";
import {
  all,
  createRef,
  createRefArray,
  createSignal,
  Direction,
  easeInOutCubic,
  easeOutBounce,
  range,
  slideTransition,
  waitFor,
  waitUntil,
} from "@motion-canvas/core";

import logo from "../../../assets/Logo/DiceDataLogo_NoBG.png";
import { Bright, Grays, MonoWhite, Theme } from "../../styles";
import { CircumscribeRect } from "../../utils/Circumscribe";

// Create our number formatter.
// https://stackoverflow.com/questions/149055/how-to-format-numbers-as-currency-strings
const formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,

  // These options are needed to round to whole numbers if that's what you want.
  //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
  //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
});

const TitleFont = {
  fontFamily: "Chakra Petch",
  fontWeight: 600,
  fontSize: 140,
  fill: "#fff",
};

const HeaderFont = {
  fontFamily: "Poppins",
  fontWeight: 300,
  fontSize: 45,
  fill: "#fff",
  textAlign: "center",
};

const FieldFont = {
  ...MonoWhite,
  fontWeight: 400,
  fontSize: 45,
  textWrap: "wrap",
  textAlign: "end",
};

export default makeScene2D(function* (view) {
  view.fill(Theme.BG);
  const title = createRef<Txt>();
  const headers = createRefArray<Txt>();
  const fields = createRefArray<Txt>();
  const arrowX = 500;
  const arrowY = createSignal(-140);
  const arrow = createRef<Icon>();

  view.add(
    <>
      <Img
        src={logo}
        scale={0.7}
        position={[-680, -360]}
      />
      <Layout
        position={[400, -380]}
        direction={"column"}
        layout
      >
        <Txt
          {...TitleFont}
          fill={"#2191fb"}
        >
          REPORT CARD
        </Txt>
        <Txt
          {...TitleFont}
          fontSize={70}
        >
          SKILL 66 BASELINE
        </Txt>
      </Layout>
      <Icon
        ref={arrow}
        icon={"material-symbols:arrow-right-alt-rounded"}
        offsetX={1}
        position={[arrowX + 500, () => arrowY()]}
        scale={10}
        rotation={180}
        color={"#fffd98"}
      />
      <Layout
        layout
        direction={"column"}
        width={"80%"}
        height={700}
        position={[120, 110]}
        gap={0}
        alignContent={"space-evenly"}
        justifyContent={"space-evenly"}
        scale={0.8}
      >
        {range(8).map(() => (
          <Rect
            direction={"row"}
            width={"80%"}
            height={300}
            stroke={Grays.GRAY2}
            lineWidth={2}
            margin={0}
            justifyContent={"center"}
          >
            <Rect
              width={"50%"}
              height={"100%"}
              stroke={Grays.GRAY2}
              lineWidth={2}
              margin={0}
              alignItems={"center"}
              justifyContent={"center"}
              fill={"#434343"}
            >
              <Txt
                {...HeaderFont}
                ref={headers}
                margin={10}
                textAlign={"center"}
                textWrap={"wrap"}
                text={""}
              />
            </Rect>
            <Rect
              width={"50%"}
              height={"100%"}
              stroke={Grays.GRAY2}
              lineWidth={2}
              margin={0}
              alignItems={"center"}
              justifyContent={"center"}
            >
              <Txt
                ref={fields}
                {...FieldFont}
                text={"hello"}
                // text={() => `${formatter.format(value())}`}
              />
            </Rect>
          </Rect>
        ))}
      </Layout>
    </>
  );

  headers[0].text("SESSIONS");
  headers[1].text("SHOOTERS PER SESSION");
  headers[2].text("HOUSE EDGE");
  headers[3].text("WIN RATE");
  headers[4].text("LOSE RATE");
  headers[5].text("50% OUTCOME RANGE");
  headers[6].text("90% OUTCOME RANGE");
  headers[7].text("99% BANKROLL SURVIVAL");

  fields[0].text(
    () =>
      `${(100000).toLocaleString("en-US", {
        maximumFractionDigits: 2,
      })}`
  );
  fields[1].text("10");
  fields[2].text("2.498 %");
  fields[3].text("53.6 %");
  fields[4].text("46.4 %");
  fields[5].text("-$89 to +$143");
  fields[6].text("-$318 to +$260");
  fields[7].text("$483"); //USE R THIS IS THE p01 after group by session

  yield* slideTransition(Direction.Right);

  yield* waitFor(0.5);

  yield* waitUntil("arrow");
  yield* all(arrow().position(() => [arrowX, arrowY()], 1, easeOutBounce));

  yield* waitUntil("shooters");
  yield* arrowY(-60, 0.5, easeInOutCubic);
  yield* waitFor(2);

  yield* waitUntil("house-edge");
  yield* arrowY(0, 1, easeInOutCubic);
  yield* waitFor(2);

  yield* waitUntil("win-rate");
  yield* arrowY(70, 1, easeInOutCubic);
  yield* waitFor(2);

  yield* waitUntil("lose-rate");
  yield* arrowY(140, 1, easeInOutCubic);
  yield* waitFor(2);

  yield* waitUntil("outcome-50");
  yield* arrowY(210, 1, easeInOutCubic);
  yield* waitFor(2);

  yield* waitUntil("highlight-50");
  yield* CircumscribeRect(fields[5], Bright.YELLOW, 1.4, 10, 3);

  yield* waitUntil("outcome-90");
  yield* arrowY(280, 1, easeInOutCubic);
  //yield* waitFor(2);

  yield* waitUntil("highlight-90");
  yield* CircumscribeRect(fields[6], Bright.YELLOW, 1.4, 10, 4);

  yield* waitUntil("Bankroll");
  yield* arrowY(350, 1, easeInOutCubic);
  yield* waitFor(2);

  // yield* waitUntil("house-money");
  // yield* arrowY(350, 1, easeInOutCubic);

  yield* waitUntil("endslide");
});
