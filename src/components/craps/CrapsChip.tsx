import { Circle, CircleProps, Rect, Txt } from "@motion-canvas/2d";
import {
  createRef,
  createSignal,
  easeInCubic,
  easeInElastic,
  easeOutBounce,
  useLogger,
  Vector2,
} from "@motion-canvas/core";
import { MonoWhite } from "../../styles";

export enum ChipColors {
  WHITE = "WHITE",
  RED = "RED",
  PURPLE = "PURPLE",
  ORANGE = "ORANGE",
  GREEN = "GREEN",
  BLUE = "BLUE",
  BLACK = "BLACK",
  AUTO = "AUTO",
}

interface iChipColor {
  background: string;
  outerCircle: string;
  innerCircle: string;
  marks: string;
  text: string;
  textOutline: string;
}

const redChip: iChipColor = {
  background: "#7e1e1e",
  outerCircle: "#bc1017",
  innerCircle: "#bc1017",
  marks: "#bc1017",
  text: "#fff",
  textOutline: "#222222",
};

// const redChip: iChipColor = {
//   background: "#4e0000",
//   outerCircle: "#740000",
//   innerCircle: "#740000",
//   marks: "#853C3C",
//   text: "#fff",
//   textOutline: "#222222",
// };

const whiteChip: iChipColor = {
  background: "#fefefe",
  outerCircle: "#888888",
  innerCircle: "#393939",
  marks: "#4281a4",
  text: "#232323",
  textOutline: "#393939",
};

const purpleChip: iChipColor = {
  background: "#8073ac",
  outerCircle: "#d8daeb",
  innerCircle: "#201d2b",
  marks: "#542788",
  text: "#d8daeb",
  textOutline: "#201d2b",
};

const orangeChip: iChipColor = {
  background: "#e08214",
  outerCircle: "#fee1b7",
  innerCircle: "#fee1b7",
  marks: "#fdb863",
  text: "#fefaec",
  textOutline: "#090a0b",
};

const greenChip: iChipColor = {
  background: "#244f33",
  outerCircle: "#35764c",
  innerCircle: "#1b3c26",
  marks: "#35764c",
  text: "#fdfdfd",
  textOutline: "#090a0b",
};

const blueChip: iChipColor = {
  background: "#1d4e89",
  outerCircle: "#225ba1",
  innerCircle: "#163d6a",
  marks: "#ffffff",
  text: "#ffffff",
  textOutline: "#090a0b",
};

const blackChip: iChipColor = {
  background: "#101010",
  outerCircle: "#262626",
  innerCircle: "#494949",
  marks: "#797979",
  text: "#ffffff",
  textOutline: "#090a0b",
};

var chipColorDict: { [id: string]: iChipColor } = {};
chipColorDict[ChipColors.RED] = redChip;
chipColorDict[ChipColors.WHITE] = whiteChip;
chipColorDict[ChipColors.PURPLE] = purpleChip;
chipColorDict[ChipColors.ORANGE] = orangeChip;
chipColorDict[ChipColors.GREEN] = greenChip;
chipColorDict[ChipColors.BLUE] = blueChip;
chipColorDict[ChipColors.BLACK] = blackChip;

const WORKING_INDICATOR_SCALE = 3;
const BUY_INDICATOR_SCALE = 3;

export interface ChipProps extends CircleProps {
  denom: number;
  chipColor: ChipColors;
}

const CHIP_SIZE = 320;
const CHIP_LINE_WIDTH = 10;
const CHIP_INNER_CIRCLE_SIZE = 190;
const CHIP_MARK_CIRCLE_SIZE = 255;
const CHIP_MARK_CIRCLE_LINE_WIDTH = 40;
const CHIP_MARK_CIRCLE_LINE_LENGTH =
  (CHIP_MARK_CIRCLE_LINE_WIDTH * Math.PI) / 4;

// Starting at this scale:
const ORIGINAL_SCALE = 1.3;
// Reduce the text size by this much for each
// additional character in the denomination.
const SCALE_FACTOR = 0.2;

function getChipColor(denom: number): ChipColors {
  /**
   * Figure the chip color based on the denomination
   */

  if (denom < 5) {
    return ChipColors.WHITE;
  }

  if (denom >= 5 && denom < 25) {
    return ChipColors.RED;
  }

  if (denom >= 25 && denom < 100) {
    return ChipColors.GREEN;
  }

  if (denom >= 100 && denom < 500) {
    return ChipColors.BLACK;
  }

  if (denom >= 500 && denom < 1000) {
    return ChipColors.PURPLE;
  }

  if (denom >= 1000 && denom < 5000) {
    return ChipColors.ORANGE;
  }

  if (denom >= 5000) {
    return ChipColors.BLUE;
  }
}

export class CrapsChip extends Circle {
  public readonly isWorking = createSignal(false);
  private readonly buyIndicator = createRef<Rect>();
  private readonly workingIndicator = createRef<Rect>();
  private declare readonly denom: number;
  private declare readonly denom_scale: number;
  private declare readonly chipColor: iChipColor;

  public constructor(props?: ChipProps) {
    super({
      opacity: 0,
      ...props,
    });

    this.chipColor = chipColorDict[props.chipColor];
    if (props.chipColor == ChipColors.AUTO) {
      this.chipColor = chipColorDict[getChipColor(props.denom)];
    }

    this.denom = props.denom;
    this.denom_scale =
      ORIGINAL_SCALE - this.denom.toFixed(0).length * SCALE_FACTOR;

    this.size(CHIP_SIZE);
    this.fill(this.chipColor.background);
    this.shadowColor("#000");
    this.shadowBlur(5);
    this.shadowOffset(new Vector2(5, 5));

    this.add(
      <Circle
        size={CHIP_SIZE}
        stroke={this.chipColor.outerCircle}
        lineWidth={CHIP_LINE_WIDTH}
      />
    );
    this.add(
      <Circle
        size={CHIP_INNER_CIRCLE_SIZE}
        stroke={this.chipColor.innerCircle}
        lineWidth={CHIP_LINE_WIDTH}
      />
    );
    this.add(
      <Circle
        size={CHIP_MARK_CIRCLE_SIZE}
        stroke={this.chipColor.marks}
        lineWidth={CHIP_MARK_CIRCLE_LINE_WIDTH}
        lineDash={[
          3 * CHIP_MARK_CIRCLE_LINE_LENGTH,
          CHIP_MARK_CIRCLE_LINE_LENGTH,
        ]}
        lineDashOffset={CHIP_MARK_CIRCLE_LINE_LENGTH}
      />
    );

    this.scale(0.25);
    this.add(
      <Txt
        fontFamily={"Battambang"}
        fontWeight={700}
        text={this.denom.toFixed(0)}
        fontSize={150}
        fill={this.chipColor.text}
        scale={this.denom_scale}
        stroke={this.chipColor.textOutline}
        lineWidth={3}
        strokeFirst
      />
    );

    this.add(
      <Rect
        ref={this.buyIndicator}
        fill={"black"}
        width={80}
        height={40}
        y={-160}
        radius={10}
        stroke={"white"}
        lineWidth={2}
        opacity={0.8}
        scale={0}
      >
        <Txt
          text={"BUY"}
          {...MonoWhite}
          fontSize={30}
        />
      </Rect>
    );

    this.add(
      <Rect
        ref={this.workingIndicator}
        fill={"black"}
        width={80}
        height={40}
        y={150}
        x={0}
        radius={10}
        stroke={"white"}
        lineWidth={2}
        opacity={0.8}
        scale={0}
      >
        <Txt
          text={() => (this.isWorking() ? "ON" : "OFF")}
          {...MonoWhite}
          fontWeight={600}
          fontSize={30}
        />
      </Rect>
    );
  }

  public *showBuy(dur: number = 0.6) {
    yield* this.buyIndicator().scale(BUY_INDICATOR_SCALE, dur, easeOutBounce);
  }

  public *setWorking(isWorking: boolean) {
    // Is this bet working? If it's changed, animate the indicator.

    // If it matches, do nothing
    if (this.isWorking() == isWorking) {
      return;
    }

    // otherwise, set and show or hide.
    this.isWorking(isWorking);

    if (this.isWorking()) {
      yield* this.showWorking(0.6);
    } else {
      yield* this.hideWorking(0.6);
    }
  }

  public *showWorking(dur: number) {
    yield* this.workingIndicator().scale(
      WORKING_INDICATOR_SCALE,
      dur,
      easeOutBounce
    );
  }
  public *hideWorking(dur: number) {
    yield* this.workingIndicator().scale(0, dur, easeInCubic);
  }
}
