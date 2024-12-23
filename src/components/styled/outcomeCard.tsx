import {
  Node,
  Layout,
  Rect,
  RectProps,
  Txt,
  PossibleCanvasStyle,
  Line,
  Gradient,
  Icon,
} from "@motion-canvas/2d";
import { makeRef, SignalValue, SimpleSignal } from "@motion-canvas/core";
import {
  Grays,
  greenGradient,
  MonoWhite,
  PoppinsBlack,
  PoppinsWhite,
  silverGradient,
} from "../../styles";

// Colors are from:
// https://tailwindcss.com/docs/customizing-colors

export enum outcomeCardColors {
  BRIGHT_GREEN = "#15803d",
  DARK_GREEN = "#14532d",
  BRIGHT_RED = "#b91c1c",
  DARK_RED = "#7f1d1d",
  BRIGHT_PURPLE = "#6d28d9",
  DARK_PURPLE = "#4c1d95",
}

export const blackBgGradient = new Gradient({
  type: "linear",

  from: [0, -100],
  to: [0, 100],
  stops: [
    //{ offset: 0, color: "#101010" },
    { offset: 0, color: "#252525" },
    { offset: 1, color: "#000000" },
  ],
});

// export const winnerIcon = new Icon({
//   width: "100%",
//   height: "100%",
//   icon: "iconoir:priority-up",
//   size: 100,
// });

// export const loserIcon = new Icon({
//   width: "100%",
//   height: "100%",
//   icon: "iconoir:priority-down",
//   size: 100,
// });

// export const pusherIcon = new Icon({
//   width: "100%",
//   height: "100%",
//   icon: "iconoir:priority-medium",
//   size: 100,
// });

export const winnerGradient = new Gradient({
  type: "linear",

  from: [0, -100],
  to: [0, 100],
  stops: [
    { offset: 0, color: "#15803d" }, // Tailwind 700
    { offset: 0.6, color: "#14532d" }, // Tailwind 900
  ],
});

export const loserGradient = new Gradient({
  type: "linear",

  from: [0, -100],
  to: [0, 100],
  stops: [
    { offset: 0, color: "#b91c1c" }, // Tailwind 700
    { offset: 0.6, color: "#7f1d1d" }, // Tailwind 900
  ],
});

export const pushGradient = new Gradient({
  type: "linear",

  from: [0, -100],
  to: [0, 100],
  stops: [
    { offset: 0, color: "#6d28d9" }, // Tailwind 700
    { offset: 0.6, color: "#4c1d95" }, // Tailwind 900
  ],
});

export function OutcomeCard({
  refs,
  title,
  barFill,
  maximum,
  value,
  icon,
  headerFill = blackBgGradient,
  props = {},
}: {
  refs: { container: Node; rect: Rect; layout: Layout };
  title: string;
  headerFill?: SignalValue<PossibleCanvasStyle>;
  barFill: SignalValue<PossibleCanvasStyle>;
  maximum: number;
  value: SimpleSignal<number, void>;
  icon: string;
  props?: RectProps;
}) {
  const maximumFormatted = maximum.toLocaleString("en-US", {
    maximumFractionDigits: 0,
  });
  const valueFormatted = () =>
    value().toLocaleString("en-US", {
      maximumFractionDigits: 0,
    });
  const pctFormatted = () =>
    ((value() / maximum) * 100).toLocaleString("en-US", {
      maximumFractionDigits: 1,
      minimumFractionDigits: 1,
    });
  return (
    <Node
      ref={makeRef(refs, "container")}
      opacity={0}
    >
      <Rect
        ref={makeRef(refs, "rect")}
        grow={1}
        basis={0}
        lineWidth={3}
        direction={"column"}
        layout
        {...props}
      >
        <Rect
          direction="row"
          height={"20%"}
          width={"100%"}
          justifyContent={"stretch"}
          lineWidth={3}
          stroke={Grays.GRAY1}
        >
          <Rect
            width={"40%"}
            height={"100%"}
            fill={headerFill}
            padding={30}
            basis={0}
          >
            <Icon
              width={"100%"}
              height={"100%"}
              icon={icon}
              size={100}
            />
          </Rect>
          <Rect
            width={"60%"}
            height={"100%"}
            basis={0}
            grow={1}
            justifyContent={"center"}
            alignContent={"center"}
            alignItems={"center"}
            alignSelf={"center"}
            fill={silverGradient}
          >
            <Txt
              height={"100%"}
              grow={1}
              {...PoppinsBlack}
              fontWeight={800}
              fontSize={120}
              textAlign={"center"}
              alignSelf={"center"}
              justifyContent={"center"}
              alignContent={"center"}
            >
              {title}
            </Txt>
          </Rect>
        </Rect>
        <Rect
          width={"100%"}
          height={"20%"}
          grow={2}
          basis={1}
          justifyContent={"center"}
          alignContent={"center"}
          alignItems={"center"}
        >
          <Layout layout={false}>
            <Line
              points={[
                [-400, 0],
                [400, 0],
              ]}
              stroke={Grays.GRAY2}
              lineWidth={120}
            ></Line>
            <Line
              points={[
                [-400, 0],
                [400, 0],
              ]}
              stroke={barFill}
              lineWidth={120}
              end={() => value() / maximum}
            ></Line>
          </Layout>
        </Rect>
        <Rect
          width={"100%"}
          height={"30%"}
          grow={1}
          basis={0}
          direction={"column"}
          justifyContent={"space-between"}
          padding={70}
          paddingTop={0}
        >
          <Txt
            {...PoppinsBlack}
            fill={Grays.BLACK}
            fontSize={100}
            textAlign={"right"}
            basis={0}
            grow={1}
            text={() => valueFormatted()}
            fontWeight={700}
          ></Txt>

          <Txt
            {...PoppinsBlack}
            fill={Grays.GRAY4}
            fontSize={60}
            textAlign={"right"}
            // alignSelf={"end"}
            grow={1}
            basis={0}
          >
            of {maximumFormatted}
          </Txt>
        </Rect>
        <Rect
          width={"100%"}
          height={"20%"}
          grow={2}
          basis={2}
          justifyContent={"end"}
          alignItems={"baseline"}
          padding={50}
          // paddingTop={150}
          //fill={blackBgGradient}
          fill={"#1f2937"}
        >
          <Txt
            {...MonoWhite}
            fontSize={230}
            // textAlign={"center"}
            fontWeight={600}
            text={() => pctFormatted()}
          ></Txt>
          <Txt
            {...MonoWhite}
            fontSize={100}
            // textAlign={"center"}
          >
            {"%"}
          </Txt>
        </Rect>
      </Rect>
    </Node>
  );
}
