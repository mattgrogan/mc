import { Img, Layout, LayoutProps } from "@motion-canvas/2d";

import chip5Png from "../../../assets/Chips/Chip_0005.png";
import chip15Png from "../../../assets/Chips/Chip_0015.png";
import chip16Png from "../../../assets/Chips/Chip_0016.png";
import chip18Png from "../../../assets/Chips/Chip_0018.png";
import chip21Png from "../../../assets/Chips/Chip_0021.png";
import chip24Png from "../../../assets/Chips/Chip_0024.png";
import chip25Png from "../../../assets/Chips/Chip_0025.png";
import chip30Png from "../../../assets/Chips/Chip_0030.png";
import chip50Png from "../../../assets/Chips/Chip_0050.png";
import chip60Png from "../../../assets/Chips/Chip_0060.png";
import chip95Png from "../../../assets/Chips/Chip_0095.png";
import chip100Png from "../../../assets/Chips/Chip_0100.png";
import chip120Png from "../../../assets/Chips/Chip_0120.png";
import chip140Png from "../../../assets/Chips/Chip_0140.png";
import chip200Png from "../../../assets/Chips/Chip_0200.png";
import chip500Png from "../../../assets/Chips/Chip_0500.png";
import chip600Png from "../../../assets/Chips/Chip_0600.png";
import chip750Png from "../../../assets/Chips/Chip_0750.png";
import chip1000Png from "../../../assets/Chips/Chip_1000.png";
import { useLogger } from "@motion-canvas/core";
//import { NumberFont } from "./Styles";

const chipPngs: { [denom: number]: string } = {
  5: chip5Png,
  15: chip15Png,
  16: chip16Png,
  18: chip18Png,
  21: chip21Png,
  24: chip24Png,
  25: chip25Png,
  30: chip30Png,
  50: chip50Png,
  60: chip60Png,
  95: chip95Png,
  100: chip100Png,
  120: chip120Png,
  140: chip140Png,
  200: chip200Png,
  500: chip500Png,
  600: chip600Png,
  750: chip750Png,
  1000: chip1000Png,
};

const WORKING_INDICATOR_SCALE = 0.8;

export interface ChipProps extends LayoutProps {
  denom: number;
}

export class CrapsChip extends Layout {
  //public isWorking = createSignal(true);
  //private readonly workingIndicator = createRef<Rect>();

  public constructor(props?: ChipProps) {
    super({
      opacity: 0,
      ...props,
    });

    if (props.denom in chipPngs === false) {
      const logger = useLogger();
      logger.error("CrapsChip " + props.denom.toString() + " does not exist.");
    }

    const chipPng = chipPngs[props.denom];

    this.add(
      <Img
        src={chipPng}
        scale={0.6}
        opacity={1}
        shadowColor={"black"}
        shadowBlur={5}
        shadowOffsetX={5}
        shadowOffsetY={5}
      ></Img>
    );

    //   this.add(
    //     <Rect
    //       ref={this.workingIndicator}
    //       fill={"black"}
    //       width={80}
    //       height={40}
    //       x={0}
    //       y={40}
    //       radius={10}
    //       stroke={"white"}
    //       lineWidth={2}
    //       opacity={0.8}
    //       scale={0}
    //     >
    //       <Txt
    //         text={() => (this.isWorking() ? "ON" : "OFF")}
    //         {...NumberFont}
    //         fontSize={30}
    //       />
    //     </Rect>
    //   );
  }

  // public *showWorking(dur: number) {
  //   yield* this.workingIndicator().scale(
  //     WORKING_INDICATOR_SCALE,
  //     dur,
  //     easeOutBounce
  //   );
  // }
  // public *hideWorking(dur: number) {
  //   yield* this.workingIndicator().scale(0, dur, easeInElastic);
  // }
}
