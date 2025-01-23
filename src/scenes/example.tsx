import { Circle, makeScene2D, Txt } from "@motion-canvas/2d";
import {
  createRef,
  createSignal,
  useLogger,
  waitFor,
} from "@motion-canvas/core";
import { MonoWhite } from "../styles";
import { ChipColors, CrapsChip } from "../components/craps/CrapsChip";

export default makeScene2D(function* (view) {
  // Create your animations here

  const chip = new CrapsChip({ denom: 99, chipColor: ChipColors.AUTO });
  view.add(chip);
  chip.opacity(1);
  yield* waitFor(1);

  // const circle = createRef<Circle>();

  // const circleSize = 320;
  // const outerCircleLineWidth = 10;
  // const innerCircleSize = 190;
  // const innerCircleLineWidth = 10;
  // const markCircleLineSize = 255;
  // const markCircleLineWidth = 40;

  // const LENGTH = (markCircleLineSize * Math.PI) / 24;

  // const chipValue = createSignal(1);

  // const scaleFactor = 0.2;
  // const origScale = 1.3;

  // view.add(
  //   <Circle
  //     ref={circle}
  //     size={circleSize}
  //     fill={"#820000"}
  //   >
  //     <Circle
  //       size={circleSize}
  //       stroke="#9a0000"
  //       lineWidth={outerCircleLineWidth}
  //     />
  //     <Circle
  //       size={innerCircleSize}
  //       stroke="#9a0000"
  //       lineWidth={innerCircleLineWidth}
  //     />
  //     <Circle
  //       size={markCircleLineSize}
  //       stroke="#fff"
  //       lineWidth={markCircleLineWidth}
  //       lineDash={[3 * LENGTH, LENGTH]}
  //       lineDashOffset={LENGTH}
  //     />
  //     <Txt
  //       fontFamily={"Battambang"}
  //       fontWeight={700}
  //       text={() => chipValue().toFixed(0)}
  //       fontSize={150}
  //       fill={"#fff"}
  //       scale={() => origScale - chipValue().toFixed(0).length * scaleFactor}
  //     />
  //   </Circle>
  // );

  // yield* chipValue(2500, 5);
});
