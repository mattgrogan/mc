import { Gradient } from "@motion-canvas/2d";

export const Bright = {
  WHITE: "#e5ecf4",
  YELLOW: "#fffd98",
  ORANGE: "#f79256",
  BLUE: "#2191fb",
  RED: "#d81e5b",
  GREEN: "#63c69f",
  PURPLE: "#6a51a3",
};

export const Darker = {
  ORANGE: "#da7635",
  BLUE: "#1d4e89",
  RED: "#982649",
  GREEN: "#5b9279",
  PURPLE: "#3f007d",
};

export const Darkest = {
  ORANGE: "#8d4c22",
  GREEN: "#2b4539",
  BLUE: "#0c223c",
  RED: "#4b1224",
};

export const Grays = {
  WHITE: "#fefefe",
  GRAY1: "#e7e7e7",
  GRAY2: "#797979",
  GRAY25: "#696969",
  GRAY3: "#434343",
  GRAY4: "#333333",
  BLACK: "#101010",
};

export const Theme = {
  BG: "#191B1C",
  TITLE: Bright.WHITE,
  ACCENT: Bright.BLUE,
};

export const PoppinsWhite = {
  fontFamily: "Poppins",
  fill: Theme.TITLE,
};

export const PoppinsBlack = {
  fontFamily: "Poppins",
  fill: Grays.BLACK,
};

export const MonoWhite = {
  fontFamily: "Azeret Mono",
  fill: Theme.TITLE,
};

export const ITCBenguiatNormal = {
  fontFamily: "ITC Benguiat",
  fontWeight: 400,
  fontSize: 120,
  fill: Theme.TITLE,
};

export const blueGradient = new Gradient({
  type: "linear",

  from: [0, -100],
  to: [0, 100],
  stops: [
    { offset: 0, color: "#253494" },
    { offset: 0.6, color: "#081d58" },
  ],
});

export const LightBlueGradient = new Gradient({
  type: "linear",

  from: [0, -100],
  to: [0, 100],
  stops: [
    { offset: 0, color: "#2191fb" },
    { offset: 0.6, color: "#1d4e89" },
  ],
});

export const yellowGradient = new Gradient({
  type: "linear",

  from: [0, -100],
  to: [0, 100],
  stops: [
    { offset: 0, color: "#fffd98" },
    { offset: 0.6, color: "#f7fcb9" },
  ],
});

export const greenGradient = new Gradient({
  type: "linear",

  from: [0, -100],
  to: [0, 100],
  stops: [
    { offset: 0, color: "#41ab5d" },
    { offset: 0.6, color: "#00441b" },
  ],
});

export const purpleGradient = new Gradient({
  type: "linear",

  from: [0, -100],
  to: [0, 100],
  stops: [
    { offset: 0, color: "#6a51a3" },
    { offset: 0.6, color: "#3f007d" },
  ],
});

export const redGradient = new Gradient({
  type: "linear",

  from: [0, -100],
  to: [0, 100],
  stops: [
    { offset: 0, color: "#e31a1c" },
    { offset: 0.6, color: "#800026" },
  ],
});

export const grayGradient = new Gradient({
  type: "linear",

  from: [0, -100],
  to: [0, 100],
  stops: [
    //{ offset: 0, color: "#101010" },
    { offset: 0, color: "#252525" },
    { offset: 1, color: "#000000" },
  ],
});

export const silverGradient = new Gradient({
  type: "linear",

  from: [0, -100],
  to: [0, 100],
  stops: [
    { offset: 0, color: "#d2d2d2" },
    { offset: 1, color: "#818181" },
  ],
});

export const whiteGradientH = new Gradient({
  type: "linear",

  from: [-400, 0],
  to: [400, 0],
  stops: [
    { offset: 0, color: "#254e70" },
    { offset: 0.2, color: "#e7e7e7" },
    { offset: 0.8, color: "#e7e7e7" },
    { offset: 1, color: "#254e70" },
  ],
});

// https://stackoverflow.com/questions/149055/how-to-format-numbers-as-currency-strings
export const dollarFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,

  // These options are needed to round to whole numbers if that's what you want.
  //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
  //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
});

export const gameFlowLight = "#303f9f";
export const gameFlowDark = "#1a237e";
export const gameFlowGradient = new Gradient({
  from: [0, -300],
  to: [0, 100],
  stops: [
    { offset: 0, color: gameFlowLight },
    { offset: 1, color: gameFlowDark },
  ],
});

export const sessionLight = "#00796b";
export const sessionDark = "#004d40";
export const sessionGradient = new Gradient({
  from: [0, -300],
  to: [0, 100],
  stops: [
    { offset: 0, color: sessionLight },
    { offset: 1, color: sessionDark },
  ],
});

export const shooterLight = "#0097a7";
export const shooterDark = "#006064";
export const shooterGradient = new Gradient({
  from: [0, -300],
  to: [0, 100],
  stops: [
    { offset: 0, color: shooterLight },
    { offset: 1, color: shooterDark },
  ],
});
