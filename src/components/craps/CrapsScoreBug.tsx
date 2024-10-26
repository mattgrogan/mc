import { Layout, Rect, RectProps, Txt } from "@motion-canvas/2d";
import {
  createRef,
  createRefMap,
  Direction,
  easeInOutCubic,
  sequence,
  Vector2,
} from "@motion-canvas/core";
import { RollText } from "../../utils/RollText";
import {
  blueGradient,
  grayGradient,
  Grays,
  MonoWhite,
  PoppinsBlack,
  PoppinsWhite,
  whiteGradientH,
} from "../../styles";

const GAME_ITEM_WIDTH = 200;
const VALUE_HEIGHT_PCT = 0.7;

export interface CrapsScoreBugProps extends RectProps {}

export class CrapsScoreBug extends Rect {
  private readonly fields = createRefMap<Rect>();
  private readonly values = createRefMap<RollText>();
  private readonly player = createRef<Layout>();
  private roll = 0;
  private shooter = 0;
  private shooterRoll = 0;

  public constructor(props?: CrapsScoreBugProps) {
    super({
      width: GAME_ITEM_WIDTH * 3,
      height: 200,
      stroke: Grays.WHITE,
      fill: grayGradient,
      lineWidth: 1,
      paddingTop: 10,
      paddingBottom: 10,
      offset: [-1, -1],
      ...props,
    });

    this.x((this.width() / 2) * -1);
    this.y((this.height() / 2) * -1);

    const topAfterPadding = (this.height() / 2) * -1 + this.padding().top;
    const bottomAfterPadding = this.height() / 2 - this.padding().bottom;

    // ROLL FIELD
    this.add(
      <Rect
        ref={this.fields.roll}
        width={GAME_ITEM_WIDTH}
        height={this.height()}
        stroke={Grays.WHITE}
        lineWidth={1}
        offset={[-1, -1]}
        position={this.position()}
      >
        <Txt
          text="ROLL"
          offsetY={-1}
          position={[0, topAfterPadding]}
          {...PoppinsWhite}
        />
        <RollText
          ref={this.values.roll}
          initialText={"-"}
          offsetY={1}
          width={GAME_ITEM_WIDTH}
          height={this.height() * VALUE_HEIGHT_PCT}
          position={[0, bottomAfterPadding]}
          txtProps={{ ...MonoWhite, fontSize: 90 }}
        />
      </Rect>
    );

    // SHOOTER FIELD
    this.add(
      <Rect
        ref={this.fields.shooter}
        width={GAME_ITEM_WIDTH * 2}
        height={this.height()}
        stroke={Grays.WHITE}
        lineWidth={1}
        offset={[-1, -1]}
        position={this.fields.roll().topRight()}
      >
        <Txt
          text="SHOOTER"
          offsetY={-1}
          position={[0, topAfterPadding]}
          {...PoppinsWhite}
        />
        <RollText
          ref={this.values.shooter}
          initialText={"-"}
          offsetY={1}
          width={GAME_ITEM_WIDTH}
          height={this.height() * VALUE_HEIGHT_PCT}
          position={[(GAME_ITEM_WIDTH / 2) * -1, bottomAfterPadding]}
          txtProps={{ ...MonoWhite, fontSize: 90 }}
        />
        <RollText
          ref={this.values.shooterRoll}
          initialText={"-"}
          offsetY={1}
          width={GAME_ITEM_WIDTH}
          height={this.height() * VALUE_HEIGHT_PCT}
          position={[GAME_ITEM_WIDTH / 2, bottomAfterPadding]}
          txtProps={{ ...MonoWhite, fontSize: 90 }}
        />
      </Rect>
    );

    // LABEL FIELD
    this.add(
      <Rect
        ref={this.fields.label}
        width={GAME_ITEM_WIDTH * 3}
        height={this.height()}
        stroke={Grays.WHITE}
        lineWidth={2}
        offset={[-1, -1]}
        position={this.fields.shooter().topRight}
        clip
      >
        <RollText
          ref={this.values.label}
          initialText={""}
          offsetY={-1}
          width={GAME_ITEM_WIDTH * 3}
          height={this.height() * (1 - VALUE_HEIGHT_PCT)}
          position={[0, (this.height() / 2) * -1]}
          fill={whiteGradientH}
          txtProps={{ ...PoppinsBlack }}
        />
      </Rect>
    );

    // BANKROLL FIELD
    this.add(
      <Rect
        ref={this.fields.bankroll}
        width={GAME_ITEM_WIDTH * 3}
        height={this.height() * VALUE_HEIGHT_PCT}
        offset={[-1, 1]}
        position={this.fields.label().bottomLeft}
        clip
        fill={blueGradient}
      >
        <Layout ref={this.player}>
          <Txt
            text="BANKROLL"
            offsetY={-1}
            position={[
              GAME_ITEM_WIDTH * -1,
              topAfterPadding * VALUE_HEIGHT_PCT,
            ]}
            scale={0.7}
            {...PoppinsWhite}
          />
          <RollText
            ref={this.values.bankroll}
            initialText={"0"}
            offsetY={1}
            width={GAME_ITEM_WIDTH}
            height={this.height() * 0.5}
            position={[GAME_ITEM_WIDTH * -1, bottomAfterPadding - 27]}
            txtProps={{ ...MonoWhite, fontSize: 50 }}
          />

          <Txt
            text="BETS"
            offsetY={-1}
            position={[0, topAfterPadding * VALUE_HEIGHT_PCT]}
            scale={0.7}
            {...PoppinsWhite}
          />
          <RollText
            ref={this.values.bets}
            initialText={"0"}
            offsetY={1}
            width={GAME_ITEM_WIDTH}
            height={this.height() * 0.5}
            position={[0, bottomAfterPadding - 27]}
            txtProps={{ ...MonoWhite, fontSize: 50 }}
          />

          <Txt
            text="SHOOTER"
            offsetY={-1}
            position={[GAME_ITEM_WIDTH, topAfterPadding * VALUE_HEIGHT_PCT]}
            scale={0.7}
            {...PoppinsWhite}
          />
          <RollText
            ref={this.values.exposure}
            initialText={"0"}
            offsetY={1}
            width={GAME_ITEM_WIDTH}
            height={this.height() * 0.5}
            position={[GAME_ITEM_WIDTH, bottomAfterPadding - 27]}
            txtProps={{ ...MonoWhite, fontSize: 50 }}
          />
        </Layout>
      </Rect>
    );

    this.moveOffset(new Vector2(1, 0));
  }

  public *updateRoll(newShooter: boolean = false) {
    this.roll++;
    this.shooterRoll++;

    const generators = [];
    generators.push(this.values.roll().next(this.roll.toFixed(0)));
    if (newShooter) {
      this.shooter++;
      generators.push(this.values.shooter().next(this.shooter.toFixed()));
      this.shooterRoll = 1;
    }
    generators.push(
      this.values.shooterRoll().next("R" + this.shooterRoll.toFixed(0))
    );

    yield* sequence(0.2, ...generators);
  }

  public *hideLabel(seconds: number = 0.6) {
    this.values.label().moveOffset(new Vector2(1, -1));
    const distance = this.values.label().width();
    const dest = this.values
      .label()
      .position()
      .addX(distance * -1);
    yield* this.values.label().position(dest, seconds, easeInOutCubic);
  }

  public *showLabel() {
    this.values.label().moveOffset(new Vector2(1, -1));
    const distance = this.values.label().width();
    const dest = this.values
      .label()
      .position()
      .addX(distance * 1);
    yield* this.values.label().position(dest, 1, easeInOutCubic);
  }

  public *hidePlayer(seconds: number = 0.6) {
    const distance = this.fields.bankroll().width();
    const dest = this.player()
      .position()
      .addX(distance * -1);
    yield* this.player().position(dest, seconds, easeInOutCubic);
  }

  public *showPlayer() {
    //this.fields.bankroll().moveOffset(new Vector2(1, -1));
    const distance = this.fields.bankroll().width();
    const dest = this.player()
      .position()
      .addX(distance * 1);
    yield* this.player().position(dest, 1, easeInOutCubic);
  }

  public *updateLabel(text: string, from: Direction = Direction.Right) {
    yield* this.values.label().next(text, from);
  }

  public *updateBankroll(amount: number, from: Direction = Direction.Bottom) {
    const amountStr = amount > 0 ? "+" + amount.toFixed(0) : amount.toFixed(0);
    yield* this.values.bankroll().next(amountStr, from);
  }

  public *updateBets(amount: number, from: Direction = Direction.Bottom) {
    yield* this.values.bets().next(amount.toFixed(0), from);
  }

  public *updateExposure(amount: number, from: Direction = Direction.Bottom) {
    const amountStr = amount > 0 ? "+" + amount.toFixed(0) : amount.toFixed(0);

    yield* this.values.exposure().next(amountStr, from);
  }
  public *hidePlayerStats() {
    // Temporarily hide the stats
    yield* sequence(
      0.1,
      this.values.bankroll().next("-"),
      this.values.bets().next("-"),
      this.values.exposure().next("-")
    );
  }
}
