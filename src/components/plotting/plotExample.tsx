import {
  Circle,
  Icon,
  Layout,
  Line,
  makeScene2D,
  Txt,
} from "@motion-canvas/2d";
import {
  createRef,
  createSignal,
  useLogger,
  Vector2,
  waitFor,
} from "@motion-canvas/core";
import { NumberLine } from "./NumberLine";
import { MonoWhite, PoppinsWhite } from "../../styles";

export default makeScene2D(function* (view) {
  // Create your animations here

  view.fill("#333");
  const nl = createRef<NumberLine>();

  view.add(
    <NumberLine
      ref={nl}
      minNumber={0}
      maxNumber={0.2}
      tickStep={0.025}
      length={1400}
      position={[-700, 200]}
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
        fontSize: 40,
        lineToLabelPadding: 50,
        decimalNumbers: 3,
      }}
    />
  );

  const oddsLabel = (
    <Layout rotation={-90}>
      <Icon
        icon={"material-symbols:arrow-back-2"}
        scale={5}
        offsetX={1}
      ></Icon>
      <Txt
        offsetX={-1}
        {...MonoWhite}
        text="ODDS (0.00)"
      ></Txt>
    </Layout>
  );
  oddsLabel.x(nl().n2p(0));
  oddsLabel.y(-110);
  nl().add(oddsLabel);

  const passlineLabel = (
    <Layout rotation={-90}>
      <Icon
        icon={"material-symbols:arrow-back-2"}
        scale={5}
        offsetX={1}
      ></Icon>
      <Txt
        offsetX={-1}
        {...MonoWhite}
        text="PASSLINE (0.0141)"
      ></Txt>
    </Layout>
  );
  passlineLabel.x(nl().n2p(0.014));
  passlineLabel.y(-110);
  nl().add(passlineLabel);

  const place68Label = (
    <Layout rotation={-90}>
      <Icon
        icon={"material-symbols:arrow-back-2"}
        scale={5}
        offsetX={1}
      ></Icon>
      <Txt
        offsetX={-1}
        {...MonoWhite}
        text="PLACE 6/8 (0.0152)"
      ></Txt>
    </Layout>
  );
  place68Label.x(nl().n2p(0.015));
  place68Label.y(-110);
  nl().add(place68Label);

  // const point = (
  //   <Circle
  //     size={50}
  //     fill={"red"}
  //   />
  // );
  // //view.add(point);
  // point.x(nl().n2p(0));

  // const logger = useLogger();

  // //nl().addTick(75);
  // nl().addTicks();

  // nl().addTickLabel(75);
  // nl().add(point);

  // // Test movement
  // yield* nl().x(-200, 1);

  // // Test scaling
  // yield* nl().maxNumber(200, 1);
  // yield* waitFor(1);
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
