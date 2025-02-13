import { Rect, RectProps, Txt, signal, initial } from "@motion-canvas/2d";
import { all, chain, DEFAULT, Direction, makeRef, sequence, SignalValue, SimpleSignal, ThreadGenerator, useLogger, waitFor } from "@motion-canvas/core";
import { Bright, grayGradient, Grays, PoppinsWhite } from "../../styles";
import { RollText } from "../../utils/RollText";
import { CircumscribeRect } from "../../utils/Circumscribe";


type ScoreValue = {
  value: number
  hardContainerRect: Rect
  scoreRollText: RollText
}

type HardScoreValue = Omit<ScoreValue, 'hardContainerRect'>

export interface CrapsWinConditionsProps extends RectProps {
  mainTableprops?: RectProps;
  extensionWidth?: SignalValue<number>;
}

export class CrapsWinConditions extends Rect {

  @initial(100)
  @signal()
  public declare readonly extensionWidth: SimpleSignal<number, this>

  private readonly valueScores: Record<string, ScoreValue> =
    Array.from({ length: 11 }, (_, i) => i + 2).reduce<Record<string, ScoreValue>>((v, a) => ({ ...v, [a]: { value: 0, hardContainerRect: null, scoreRollText: null } }), {})


  private readonly hardValueScores: Record<string, HardScoreValue> =
    Array.from({ length: 4 }, (_, i) => 4 + (i * 2)).reduce<Record<string, HardScoreValue>>((v, a) => ({ ...v, [a]: { value: 0, scoreRollText: null } }), {})


  public readonly hardColumnRect: Rect;
  public readonly mainTableRect: Rect;


  public constructor(props?: CrapsWinConditionsProps) {
    const { mainTableprops, ...containerProps } = props
    super({
      ...containerProps,
      layout: true,
      offsetX: -1,
      gap: 3
    });

    this.add(
      <>
        <Rect layout ref={makeRef(this, 'mainTableRect')} {...mainTableprops} zIndex={1}>
          <Rect width={"30%"} height={"100%"} layout direction={"column"}>
            {
              Object.keys(this.valueScores).map((key) => (
                <Rect fill={grayGradient} width={"100%"} grow={1} lineWidth={2} stroke={Grays.GRAY4} justifyContent={"center"} alignItems={"center"}>
                  <Txt text={key} alignSelf={"center"} textAlign={"center"}{...PoppinsWhite} fontSize={25} ></Txt>
                </Rect>
              ))
            }
          </Rect>
          <Rect width={"70%"} height={"100%"} layout direction={"column"}>
            {
              Object.keys(this.valueScores).map((key) => (
                <Rect fill={grayGradient} grow={1} width={"100%"} lineWidth={2} stroke={Grays.GRAY4} justifyContent={"end"} alignItems={"center"} padding={10}>
                  <RollText ref={makeRef(this.valueScores[key], "scoreRollText")} width={100} height={50} initialText={"-"} fill={grayGradient} txtProps={{ ...PoppinsWhite, textAlign: "right", fontSize: 25, fill: this.textFill(this.valueScores[key].value) }} />
                </Rect>
              ))
            }
          </Rect>
        </Rect>

        <Rect ref={makeRef(this, "hardColumnRect")} width={0} height={"100%"} layout direction={"column"} alignItems={"center"} justifyContent={"center"} zIndex={0}>
          {
            Object.keys(this.valueScores).map((key) => (
              <Rect ref={makeRef(this.valueScores[key], "hardContainerRect")} grow={1} width={"100%"} justifyContent={"center"} alignItems={"center"}>
              </Rect>
            ))
          }
        </Rect>

      </>
    )
  }

  private textFill(value: number) {
    if (value > 0) return Bright.GREEN;
    if (value < 0) return Bright.RED;
    return Grays.GRAY2
  }

  private label(value: number): string {
    if (value > 0) return "+" + value.toFixed(0)
    if (value < 0) return value.toFixed(0)
    return "-"
  }

  public *update(data: { throw: string; winloss: number }[]) {
    yield* this.removeHardRects();
    const generators = [];
    data.sort(throwSortFunc);

    for (let i = 0; i < data.length; i++) {
      const { throw: throwLabel, winloss } = data[i];
      const [_, score, extra] = throwLabel.match(throwTypeRegex) || [];
      if (!score) continue;


      if (!extra || extra === 'E') {
        this.valueScores[score].value = winloss;
        generators.push(this.valueScores[score].scoreRollText.next(this.label(winloss), Direction.Right, { fill: this.textFill(data[i].winloss) }))
      }
      else if (winloss && this.valueScores[score].value !== winloss) {
        this.hardValueScores[score].value = winloss;
        this.addHardScoreRect(score);
        generators.push(...this.hardScoreAddGenerators(score, winloss))
      }
    }

    yield* sequence(0.05, ...generators)
  }

  private addHardScoreRect(score: string) {
    this.valueScores[score].hardContainerRect.add(
      <Rect fill={grayGradient} stroke={Grays.GRAY4} padding={0} offsetX={-1}>
        <RollText ref={makeRef(this.hardValueScores[score], "scoreRollText")} width={0} height={50} initialText={"-"} fill={grayGradient} txtProps={{ ...PoppinsWhite, textAlign: "right", fontSize: 25, fill: this.textFill(this.hardValueScores[score].value) }} ></RollText>
      </Rect>
    )
  }

  private hardScoreAddGenerators(score: string, winloss: number): ThreadGenerator[] {
    const containerRect = this.valueScores[score].hardContainerRect;
    const rollText = this.hardValueScores[score].scoreRollText;
    return [
      all(
        containerRect.fill(grayGradient, .1),
        containerRect.stroke(Grays.GRAY4, .1),
        containerRect.lineWidth(2, .1),
        this.hardColumnRect.width(this.extensionWidth(), .5),
      ),
      all(
        containerRect.width("100%", .1),
      ),
      chain(
        waitFor(.5),
        all(
          rollText.next(this.label(winloss), Direction.Right, { fill: this.textFill(winloss) }),
          rollText.width(this.extensionWidth() - 2, .1),
        )
      ),
    ]
  }

  private *removeHardRects() {
    Object.entries(this.hardValueScores).forEach(([key, val]) => {
      val.scoreRollText?.parent()?.remove();
      val.scoreRollText?.remove();
      val.scoreRollText = null;
      this.valueScores[key].hardContainerRect.width(0);
      this.valueScores[key].hardContainerRect.lineWidth(0);
      (this.valueScores[key].hardContainerRect.parent() as Rect).width(0, .1);
    })
    yield* this.hardColumnRect.width(0, .1)
  }

  public *highlight(d1: number, d2: number) {
    const sum = (d1 + d2).toString();
    const isHard = this.isHard(d1, d2);

    const rollText = isHard ? this.hardValueScores[sum].scoreRollText : this.valueScores[sum].scoreRollText
    const parentColumn = isHard ? this.hardColumnRect : this.mainTableRect
    const scaleContainer = isHard ? rollText.parent().parent() : rollText.parent()

    scaleContainer.zIndex(10);
    parentColumn.zIndex(10);
    yield* scaleContainer.scale(1.2, .5)

    yield* CircumscribeRect(rollText, Bright.YELLOW, 0.95, 10, 1);
    yield* scaleContainer.scale(1, .2);
    scaleContainer.zIndex(DEFAULT);
    parentColumn.zIndex(DEFAULT)
  }

  private isHard(first: number, second: number): boolean {
    const sum = (first + second).toString();
    return (first === second && !!this.hardValueScores[sum]?.scoreRollText)
  }

}

const throwTypeRegex = /^(\d+)([HE]?)$/;

function throwSortFunc(a: { throw: string; winloss: number }, b: { throw: string; winloss: number }) {
  const extraVal: Record<string, number> = { "E": 1, "H": 2 }
  const [_, aDigit, aExtra] = a.throw.match(throwTypeRegex) || Array.from({ length: 3 }, (_) => 0)
  const [__, bDigit, bExtra] = b.throw.match(throwTypeRegex) || Array.from({ length: 3 }, (_) => 0)
  let result = Number(aDigit) - Number(bDigit);
  if (result !== 0) return result;

  return (extraVal[aExtra] || 0) - (extraVal[bExtra] || 0)
}
