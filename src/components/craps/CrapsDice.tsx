import { Img, ImgProps, Layout, LayoutProps, signal } from "@motion-canvas/2d";
import {
  all,
  easeInOutCubic,
  easeOutExpo,
  linear,
  sequence,
  SignalValue,
  SimpleSignal,
  TimingFunction,
  useRandom,
  Vector2,
  waitFor,
} from "@motion-canvas/core";

import d1Png from "../../../assets/Dice/Die_White_0001.png";
import d2Png from "../../../assets/Dice/Die_White_0002.png";
import d3Png from "../../../assets/Dice/Die_White_0003.png";
import d4Png from "../../../assets/Dice/Die_White_0004.png";
import d5Png from "../../../assets/Dice/Die_White_0005.png";
import d6Png from "../../../assets/Dice/Die_White_0006.png";

const dieProps = {
  scale: 0.1,
  opacity: 0,
  shadowColor: "black",
  shadowBlur: 5,
  shadowOffsetX: 5,
  shadowOffsetY: 5,
};

const D1 = (props: ImgProps) => (
  <Img
    src={d1Png}
    {...dieProps}
  />
);

const D2 = (props: ImgProps) => (
  <Img
    src={d2Png}
    {...dieProps}
  />
);

const D3 = (props: ImgProps) => (
  <Img
    src={d3Png}
    {...dieProps}
  />
);

const D4 = (props: ImgProps) => (
  <Img
    src={d4Png}
    {...dieProps}
  />
);

const D5 = (props: ImgProps) => (
  <Img
    src={d5Png}
    {...dieProps}
  />
);

const D6 = (props: ImgProps) => (
  <Img
    src={d6Png}
    {...dieProps}
  />
);

function getDie(die: number) {
  switch (die) {
    case 1: {
      return <D1 />;
      break;
    }
    case 2: {
      return <D2 />;
      break;
    }
    case 3: {
      return <D3 />;
      break;
    }
    case 4: {
      return <D4 />;
      break;
    }
    case 5: {
      return <D5 />;
      break;
    }
    case 6: {
      return <D6 />;
      break;
    }
  }
}

export interface CrapsDiceProps extends LayoutProps {
  startPosition: SignalValue<Vector2>;
  bounceTopLeft: SignalValue<Vector2>;
  bounceBottomRight: SignalValue<Vector2>;
  landTopLeft: SignalValue<Vector2>;
  landBottomRight: SignalValue<Vector2>;
  restPosition: SignalValue<Vector2>;
}

function getRandomDiePosition(a: Vector2, b: Vector2) {
  const random = useRandom();
  const x = random.nextInt(a.x, b.x);
  const y = random.nextInt(a.y, b.y);
  return new Vector2(x, y);
}

export class CrapsDice extends Layout {
  @signal()
  public declare readonly startPosition: SimpleSignal<Vector2, this>;
  @signal()
  public declare readonly bounceTopLeft: SimpleSignal<Vector2, this>;
  @signal()
  public declare readonly bounceBottomRight: SimpleSignal<Vector2, this>;
  @signal()
  public declare readonly landTopLeft: SimpleSignal<Vector2, this>;
  @signal()
  public declare readonly landBottomRight: SimpleSignal<Vector2, this>;
  @signal()
  public declare readonly restPosition: SimpleSignal<Vector2, this>;

  private d1 = (<D1 />);
  private d2 = (<D1 />);

  public constructor(props?: CrapsDiceProps) {
    super({ ...props });
  }

  public *throw(d1: number, d2: number) {
    this.d1 = getDie(d1);
    this.d2 = getDie(d2);

    this.d1.position(this.startPosition);
    this.d2.position(this.startPosition);

    this.add(this.d1);
    this.add(this.d2);

    // Calculate random bounce and land positions
    const d1Bounce = getRandomDiePosition(
      this.bounceTopLeft(),
      this.bounceBottomRight()
    );
    const d2Bounce = getRandomDiePosition(
      this.bounceTopLeft(),
      this.bounceBottomRight()
    );
    const d1Land = getRandomDiePosition(
      this.landTopLeft(),
      this.landBottomRight()
    );

    const d2Land = getRandomDiePosition(
      this.landTopLeft(),
      this.landBottomRight()
    );

    yield* sequence(
      0.1,
      all(
        this.d1.opacity(1, 0.2, easeOutExpo),
        this.d1.position(d1Bounce, 0.3, linear).to(d1Land, 0.2, easeOutExpo),
        this.d1.rotation(360, 0.5, easeOutExpo)
      ),
      all(
        this.d2.opacity(1, 0.2, easeOutExpo),
        this.d2.position(d2Bounce, 0.3, linear).to(d2Land, 0.2, easeOutExpo),
        this.d2.rotation(360, 0.5, easeOutExpo)
      )
    );
    yield* waitFor(0.5);
    yield* all(
      this.d1.position(this.restPosition(), 0.6, easeInOutCubic),
      this.d2.position(this.restPosition().addX(100), 0.6, easeInOutCubic)
    );

    this.d1.opacity(1);
  }

  public *removeDice(dur: number = 1, ease: TimingFunction = linear) {
    yield* all(this.d1.opacity(0, dur, ease), this.d2.opacity(0, dur, ease));
    this.d1.remove();
    this.d2.remove();
  }
}
