import {
  Circle,
  Gradient,
  Icon,
  Layout,
  Line,
  makeScene2D,
  Txt,
} from "@motion-canvas/2d";
import {
  all,
  createRef,
  createSignal,
  delay,
  easeInOutCubic,
  useLogger,
  Vector2,
  waitFor,
} from "@motion-canvas/core";
import { NumberLine } from "./NumberLine";
import {
  Bright,
  grayGradient,
  MonoWhite,
  PoppinsWhite,
  Theme,
} from "../../styles";

export const bgGradient = new Gradient({
  type: "linear",

  from: [0, -2160 / 2],
  to: [0, 2160 / 2],
  //fromRadius: 0,
  //toRadius: 2200,
  stops: [
    { offset: 0, color: "#23967f" },
    { offset: 0.5, color: "red" },
    { offset: 0.5, color: "blue" },
    { offset: 1, color: "#d7d9ce" },
  ],
});

function makeLabel(label: string) {
  return (
    <Layout rotation={-90}>
      <Icon
        //icon={"material-symbols:arrow-back-2"}
        //icon={"ph:map-pin-simple-line-fill"}
        icon={"emojione:money-with-wings"}
        scale={8}
        offsetX={0}
        offsetY={0.68}
        color={Bright.RED}
      ></Icon>

      {/* <Circle
        width={30}
        height={30}
        fill={Bright.YELLOW}
        offsetX={2}
      /> */}
      <Txt
        offsetX={-1}
        position={[500, 500]}
        {...MonoWhite}
        text={label}
        rotation={90}
      ></Txt>
    </Layout>
  );
}

export default makeScene2D(function* (view) {
  // Create your animations here

  view.fill("#2c2c2c");
  const nl = createRef<NumberLine>();

  view.add(
    <NumberLine
      ref={nl}
      minNumber={1.25}
      maxNumber={1.75}
      tickStep={0.5}
      length={2800}
      //rotation={90}
      position={[-1400, 700]}
      numberLineProps={{
        lineWidth: 5,
        stroke: "white",
      }}
      tickMarkProps={{
        lineWidth: 5,
        stroke: "white",
        length: 50,
      }}
      tickLabelProps={{
        fill: "white",
        fontSize: 60,
        fontWeight: 600,
        lineToLabelPadding: 50,
        decimalNumbers: 2,
        //rotation: -90,
        //offsetX: 1,
        suffix: "%",
      }}
    />
  );

  yield* nl().drawFromCenter(1, easeInOutCubic);

  nl().updateTicks(0, 4, 0.25);
  //yield* nl().rescale(0, 4, 0.25, 4);
  yield* waitFor(1);

  const g0 = createSignal(-110);
  const g1 = createSignal(-110);
  const g2 = createSignal(-110);
  const g3 = createSignal(-110);

  // const oddsLabel = makeLabel("ODDS (0.00%)");
  // oddsLabel.x(nl().n2p(0));
  // oddsLabel.y(g0);
  // nl().add(oddsLabel);

  // const dpLabel = makeLabel("DP / DC (1.36%)");
  // dpLabel.x(nl().n2p(1.36));
  // dpLabel.y(g0);
  // nl().add(dpLabel);

  const passlineLabel = makeLabel("PASS / COME (1.41%)");
  passlineLabel.x(nl().n2p(1.42));
  passlineLabel.y(g1);
  nl().add(passlineLabel);

  const passMarker = (
    <Circle
      width={50}
      height={50}
      fill={Bright.YELLOW}
      x={nl().n2p(1.52)}
      y={-100}
    />
  );
  nl().add(passMarker);

  const passLabel = (
    <Txt
      position={[500, -1500]}
      text="Passline"
      {...PoppinsWhite}
    />
  );
  nl().add(passLabel);

  const line = (
    <Line
      lineWidth={8}
      stroke={"#666"}
      // startArrow
      // endArrow
      startOffset={20}
      endOffset={20}
      radius={80}
      points={[
        () => passMarker.position(),
        () => passMarker.position().addX(-500),
        () => passLabel.position().addX(500),
        () => passLabel.position(),
      ]}
    />
  );
  nl().add(line);

  // const place68Label = makeLabel("PLACE 6/8 (1.52%)");
  // place68Label.x(nl().n2p(1.52));
  // place68Label.y(g2);
  // nl().add(place68Label);

  // const lay410 = makeLabel("LAY 4/10 (1.67%)");
  // lay410.x(nl().n2p(1.67));
  // lay410.y(g3);
  // nl().add(lay410);

  // const lay59 = makeLabel("LAY 5/9 (2.00%)");
  // lay59.x(nl().n2p(2.0));
  // lay59.y(g0);
  // nl().add(lay59);

  // const lay68 = makeLabel("LAY 6/8 (2.27%)");
  // lay59.x(nl().n2p(2.0));
  // lay59.y(g1);
  // nl().add(lay59);

  // const field = makeLabel("Field 3X (2.78%)");
  // field.x(nl().n2p(2.0));
  // field.y(g2);
  // nl().add(field);

  yield* waitFor(1);

  yield* all(
    nl().rescale(0, 18, 2, 4),
    g1(-700, 4),
    g2(-1400, 4),
    g3(-2000, 4)
  );

  yield* waitFor(1);

  //yield* nl().rescale(0, 20, 5, 4);
  // yield* nl().maxNumber(50, 1);
  // yield* waitFor(1);
  // yield* nl().tickStep(20, 1);
  // yield* nl().minNumber(-50, 1);

  // TODO: Test rotation

  yield* waitFor(10);

  // const point = (
  //   <Circle
  //     size={50}
  //     fill={"red"}
  //   />
  // );
  // view.add(point);
});
