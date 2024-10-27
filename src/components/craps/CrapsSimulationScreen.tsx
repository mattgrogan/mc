import {
  Camera,
  Circle,
  computed,
  Icon,
  Img,
  Layout,
  LayoutProps,
  Rect,
  Txt,
} from "@motion-canvas/2d";
import {
  all,
  BBox,
  createRef,
  createRefArray,
  createSignal,
  easeInOutBounce,
  easeInOutCubic,
  easeInOutQuad,
  easeInOutQuint,
  easeOutBounce,
  easeOutCubic,
  linear,
  Origin,
  PossibleVector2,
  SignalValue,
  SimpleSignal,
  TimingFunction,
  unwrap,
  Vector2,
} from "@motion-canvas/core";
import {
  Bright,
  Darkest,
  Grays,
  ITCBenguiatNormal,
  MonoWhite,
  Theme,
} from "../../styles";

import logoSvg from "../../../assets/Logo/dicedata_logo.svg";
import { dollarFormatter } from "../../styles";

export interface SimulationScreenProps extends LayoutProps {}

export class SimulationScreen extends Layout {
  public declare readonly pctComplete: SimpleSignal<number, this>;
  public resultRows = createRefArray<Rect>();
  public paramsRows = createRefArray<Rect>();
  public resultsTable = createRef<Layout>();

  // Options
  public paddingRight: number = 100;

  // Simulation Parameters
  public name: string;
  public options: string;
  public sessions: number;
  public shooters: string;
  public tableMin: string;
  public tableMax: string;

  // Simulation Results
  public totalThrows: number;
  public totalBet: number;
  public totalWon: number;
  public totalLost: number;

  public constructor(props?: SimulationScreenProps) {
    super({ ...props });
    this.pctComplete = createSignal(0);
    this.totalThrows = 0;
    this.add(
      <Layout position={[430, -300]}>
        <Txt
          {...MonoWhite}
          opacity={() => (this.pctComplete() == 0 ? 0 : 1)}
          width={200}
          text={() => (this.pctComplete() * 100).toFixed(0) + "%"}
          fontSize={50}
          x={-40}
          textAlign={"right"}
        />
        <Circle
          stroke={"#434343"}
          width={200}
          height={200}
          lineWidth={30}
        />

        <Circle
          stroke={Bright.GREEN}
          width={200}
          height={200}
          lineWidth={30}
          rotation={-90}
          end={() => this.pctComplete()}
        />
      </Layout>
    );

    const logo = (
      <Layout
        layout
        position={[-525, -300]}
        direction={"column"}
        alignItems={"center"}
        scale={1.2}
        gap={10}
      >
        <Img
          src={logoSvg}
          opacity={0.8}
        />
        ;
        <Txt
          text={"SIMULATION"}
          {...ITCBenguiatNormal}
          fontSize={50}
          fill={Theme.ACCENT}
        />
      </Layout>
    );
    this.add(logo);

    const paramsTable = (
      <Layout
        layout
        position={[-850, -100]}
        scale={0.8}
        offsetX={-1}
        offsetY={-1}
        width={850}
        direction={"column"}
        gap={0} // Between row gap
      >
        <Rect ref={this.paramsRows}>
          <Rect
            width={"100%"}
            stroke={Grays.GRAY1}
            fill={Darkest.BLUE}
            lineWidth={1}
            justifyContent={"center"}
            padding={20}
          >
            <Txt
              {...MonoWhite}
              fontSize={40}
              text={"SIMULATION PARAMETERS"}
            />
          </Rect>
        </Rect>
        <Rect ref={this.paramsRows}>
          <Rect
            width={"40%"}
            stroke={Grays.GRAY1}
            fill={Grays.GRAY4}
            lineWidth={1}
            justifyContent={"center"}
            padding={20}
          >
            <Txt
              {...MonoWhite}
              fontSize={40}
              text={"NAME"}
            />
          </Rect>
          <Rect
            width={"60%"}
            stroke={Grays.GRAY1}
            lineWidth={1}
            justifyContent={"center"}
            padding={20}
            clip
          >
            <Txt
              {...MonoWhite}
              fontSize={30}
              text={() => this.name}
            />
          </Rect>
        </Rect>
        <Rect ref={this.paramsRows}>
          <Rect
            width={"40%"}
            stroke={Grays.GRAY1}
            fill={Grays.GRAY4}
            lineWidth={1}
            justifyContent={"center"}
            padding={20}
          >
            <Txt
              {...MonoWhite}
              fontSize={40}
              text={"OPTIONS"}
            />
          </Rect>
          <Rect
            width={"60%"}
            stroke={Grays.GRAY1}
            lineWidth={1}
            justifyContent={"center"}
            padding={20}
            clip
          >
            <Txt
              {...MonoWhite}
              fontSize={40}
              text={() => this.options}
            />
          </Rect>
        </Rect>
        <Rect ref={this.paramsRows}>
          <Rect
            width={"40%"}
            stroke={Grays.GRAY1}
            fill={Grays.GRAY4}
            lineWidth={1}
            justifyContent={"center"}
            padding={20}
          >
            <Txt
              {...MonoWhite}
              fontSize={40}
              text={"SESSIONS"}
            />
          </Rect>
          <Rect
            width={"60%"}
            stroke={Grays.GRAY1}
            lineWidth={1}
            justifyContent={"center"}
            padding={20}
            clip
          >
            <Txt
              {...MonoWhite}
              fontSize={40}
              text={() =>
                `${this.sessions.toLocaleString("en-US", {
                  maximumFractionDigits: 0,
                })}`
              }
            />
          </Rect>
        </Rect>
        <Rect ref={this.paramsRows}>
          <Rect
            width={"40%"}
            stroke={Grays.GRAY1}
            fill={Grays.GRAY4}
            lineWidth={1}
            justifyContent={"center"}
            padding={20}
          >
            <Txt
              {...MonoWhite}
              fontSize={40}
              text={"SHOOTERS"}
            />
          </Rect>
          <Rect
            width={"60%"}
            stroke={Grays.GRAY1}
            lineWidth={1}
            justifyContent={"center"}
            padding={20}
            clip
          >
            <Txt
              {...MonoWhite}
              fontSize={40}
              text={() => this.shooters}
            />
          </Rect>
        </Rect>
        <Rect ref={this.paramsRows}>
          <Rect
            width={"40%"}
            stroke={Grays.GRAY1}
            fill={Grays.GRAY4}
            lineWidth={1}
            justifyContent={"center"}
            padding={20}
          >
            <Txt
              {...MonoWhite}
              fontSize={40}
              text={"TABLE MIN"}
            />
          </Rect>
          <Rect
            width={"60%"}
            stroke={Grays.GRAY1}
            lineWidth={1}
            justifyContent={"center"}
            padding={20}
            clip
          >
            <Txt
              {...MonoWhite}
              fontSize={40}
              text={() => this.tableMin}
            />
          </Rect>
        </Rect>
        <Rect ref={this.paramsRows}>
          <Rect
            width={"40%"}
            stroke={Grays.GRAY1}
            fill={Grays.GRAY4}
            lineWidth={1}
            justifyContent={"center"}
            padding={20}
          >
            <Txt
              {...MonoWhite}
              fontSize={40}
              text={"TABLE MAX"}
            />
          </Rect>
          <Rect
            width={"60%"}
            stroke={Grays.GRAY1}
            lineWidth={1}
            justifyContent={"center"}
            padding={20}
            clip
          >
            <Txt
              {...MonoWhite}
              fontSize={40}
              text={() => this.tableMax}
            />
          </Rect>
        </Rect>
      </Layout>
    );

    this.add(paramsTable);

    const resultsTable = (
      <Layout
        ref={this.resultsTable}
        layout
        position={[850, -100]}
        scale={0.8}
        offsetX={1}
        offsetY={-1}
        width={1100}
        direction={"column"}
        gap={0} // Between row gap
      >
        <Rect ref={this.resultRows}>
          <Rect
            width={"100%"}
            stroke={Grays.GRAY1}
            fill={Darkest.GREEN}
            lineWidth={1}
            justifyContent={"center"}
            padding={20}
          >
            <Txt
              {...MonoWhite}
              fontSize={40}
              text={"SIMULATION RESULTS"}
            />
          </Rect>
        </Rect>
        <Rect ref={this.resultRows}>
          <Rect
            width={"50%"}
            stroke={Grays.GRAY1}
            fill={Grays.GRAY4}
            lineWidth={1}
            justifyContent={"center"}
            padding={20}
          >
            <Txt
              {...MonoWhite}
              fontSize={40}
              text={"THROWS"}
            />
          </Rect>
          <Rect
            width={"50%"}
            stroke={Grays.GRAY1}
            lineWidth={1}
            justifyContent={"right"}
            padding={20}
            paddingRight={this.paddingRight}
            clip
          >
            <Txt
              {...MonoWhite}
              fontSize={40}
              text={() =>
                `${(this.pctComplete() * this.totalThrows).toLocaleString(
                  "en-US",
                  { maximumFractionDigits: 0 }
                )}`
              }
            />
          </Rect>
        </Rect>
        <Rect ref={this.resultRows}>
          <Rect
            width={"50%"}
            stroke={Grays.GRAY1}
            fill={Grays.GRAY4}
            lineWidth={1}
            justifyContent={"center"}
            padding={20}
          >
            <Txt
              {...MonoWhite}
              fontSize={40}
              text={"THROWS PER SESSION"}
            />
          </Rect>
          <Rect
            width={"50%"}
            stroke={Grays.GRAY1}
            lineWidth={1}
            justifyContent={"right"}
            padding={20}
            paddingRight={this.paddingRight}
            clip
          >
            <Txt
              {...MonoWhite}
              fontSize={40}
              text={() =>
                (
                  (this.totalThrows / this.sessions) *
                  this.pctComplete()
                ).toFixed(1)
              }
            />
          </Rect>
        </Rect>
        <Rect ref={this.resultRows}>
          <Rect
            width={"50%"}
            stroke={Grays.GRAY1}
            fill={Grays.GRAY4}
            lineWidth={1}
            justifyContent={"center"}
            padding={20}
          >
            <Txt
              {...MonoWhite}
              fontSize={40}
              text={"TOTAL BET"}
            />
          </Rect>
          <Rect
            width={"50%"}
            stroke={Grays.GRAY1}
            lineWidth={1}
            justifyContent={"right"}
            padding={20}
            paddingRight={this.paddingRight}
            clip
          >
            <Txt
              {...MonoWhite}
              fontSize={40}
              text={() =>
                `${dollarFormatter.format(this.totalBet * this.pctComplete())}`
              }
            />
          </Rect>
        </Rect>
        <Rect ref={this.resultRows}>
          <Rect
            width={"50%"}
            stroke={Grays.GRAY1}
            fill={Grays.GRAY4}
            lineWidth={1}
            justifyContent={"center"}
            padding={20}
          >
            <Txt
              {...MonoWhite}
              fontSize={40}
              text={"TOTAL WON"}
            />
          </Rect>
          <Rect
            width={"50%"}
            stroke={Grays.GRAY1}
            lineWidth={1}
            justifyContent={"right"}
            padding={20}
            paddingRight={this.paddingRight}
            clip
          >
            <Txt
              {...MonoWhite}
              fontSize={40}
              text={() =>
                `${dollarFormatter.format(this.totalWon * this.pctComplete())}`
              }
            />
          </Rect>
        </Rect>
        <Rect ref={this.resultRows}>
          <Rect
            width={"50%"}
            stroke={Grays.GRAY1}
            fill={Grays.GRAY4}
            lineWidth={1}
            justifyContent={"center"}
            padding={20}
          >
            <Txt
              {...MonoWhite}
              fontSize={40}
              text={"TOTAL LOST"}
            />
          </Rect>
          <Rect
            width={"50%"}
            stroke={Grays.GRAY1}
            lineWidth={1}
            justifyContent={"right"}
            padding={20}
            paddingRight={this.paddingRight}
            clip
          >
            <Txt
              {...MonoWhite}
              fontSize={40}
              text={() =>
                `${dollarFormatter.format(this.totalLost * this.pctComplete())}`
              }
            />
          </Rect>
        </Rect>
        <Rect ref={this.resultRows}>
          <Rect
            width={"50%"}
            stroke={Grays.GRAY1}
            fill={Grays.GRAY4}
            lineWidth={1}
            justifyContent={"center"}
            padding={20}
          >
            <Txt
              {...MonoWhite}
              fontSize={40}
              text={"HOUSE TAKE"}
            />
          </Rect>
          <Rect
            width={"50%"}
            stroke={Grays.GRAY1}
            lineWidth={1}
            justifyContent={"right"}
            padding={20}
            paddingRight={this.paddingRight}
            clip
          >
            <Txt
              {...MonoWhite}
              fontSize={40}
              text={() =>
                `${dollarFormatter.format(
                  (this.totalLost + this.totalWon) * this.pctComplete()
                )}`
              }
            />
          </Rect>
        </Rect>
        <Rect ref={this.resultRows}>
          <Rect
            width={"50%"}
            stroke={Grays.GRAY1}
            fill={Grays.GRAY4}
            lineWidth={1}
            justifyContent={"center"}
            padding={20}
          >
            <Txt
              {...MonoWhite}
              fontSize={40}
              text={"HOUSE EDGE"}
            />
          </Rect>
          <Rect
            width={"50%"}
            stroke={Grays.GRAY1}
            lineWidth={1}
            justifyContent={"right"}
            padding={20}
            paddingRight={this.paddingRight}
            clip
          >
            <Txt
              {...MonoWhite}
              fontSize={40}
              text={() =>
                (
                  ((this.totalLost + this.totalWon) / this.totalBet) *
                  100 *
                  this.pctComplete() *
                  -1
                ).toFixed(3) + " %"
              }
            />
          </Rect>
        </Rect>
      </Layout>
    );
    this.add(resultsTable);
    // const rt = new DDTable({
    //   ref: this.resultsTable,
    //   layout: true,
    //   position: [850, -100],
    //   scale: 0.8,
    //   offsetX: 1,
    //   offsetY: -1,
    //   width: 1100,
    //   borderStroke: Grays.GRAY1,
    //   titleText: "SIMULATION RESULTS",
    //   titleFill: Darkest.GREEN,
    //   titleFontSize: 40,
    // });

    // this.add(rt);
    // const nref = rt.addRow();
    // nref.opacity(1);
    // nref.x(-150);
    // nref.zIndex(100);
    // nref.scale(2);
    // rt.addRow();
  }

  public *run(dur: number = 10) {
    yield* this.pctComplete(1, dur, easeInOutQuad);
  }

  public *cameraOn(
    cameraNodeOrRef: SignalValue<Camera>,
    where: SignalValue<Layout>,
    dur: number,
    zoom: number = 1,
    offset: PossibleVector2 = Vector2.zero,
    ease: TimingFunction = easeInOutCubic
  ) {
    const camera = unwrap(cameraNodeOrRef);
    const coords = unwrap(where).middle().add(offset);
    yield* all(
      camera.position(coords, dur, ease),
      camera.zoom(zoom, dur, ease)
    );
  }

  public getRowAbsolutePosition(index: number) {
    // Find the right-hand side of the row
    // https://discord.com/channels/1071029581009657896/1071067015881707670/1180721544205438986
    return this.resultRows[index]
      .worldToParent()
      .inverse()
      .transformPoint(this.resultRows[index].right());
  }

  public newArrow(row: number = 1): Icon {
    const rowIndex = row;
    const arrow = (
      <Icon
        icon={"material-symbols:arrow-right-alt-rounded"}
        offsetX={1}
        scale={10}
        rotation={180}
        color={"#fffd98"}
        opacity={1}
      />
    );
    this.add(arrow);
    arrow.absolutePosition(this.getRowAbsolutePosition(rowIndex));
    return arrow;
  }

  public *moveArrowTo(
    arrowNodeOrRef: SignalValue<Icon>,
    row: number,
    dur: number,
    ease: TimingFunction = easeInOutCubic
  ) {
    const arrow = unwrap(arrowNodeOrRef);
    yield* arrow.absolutePosition(this.getRowAbsolutePosition(row), dur, ease);
  }
}
