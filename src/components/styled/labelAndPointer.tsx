import {
  Node,
  Layout,
  Line,
  TxtProps,
  RectProps,
  LineProps,
} from "@motion-canvas/2d";
import {
  Direction,
  easeInBack,
  easeInCubic,
  easeOutBack,
  makeRefs,
  PossibleVector2,
  Reference,
} from "@motion-canvas/core";
import { createValueLabel } from "../plot/PlotValueLabel";
import { Plot } from "../plot/plot";
import {
  Grays,
  PoppinsBlack,
  PoppinsWhite,
  sessionDark,
  sessionGradient,
  silverGradient,
} from "../../styles";
import { createLayoutToCoordLine } from "../plot/LayoutToCoordLine";

const DEFAULT_LABEL_RECT_PROPS = {
  fill: sessionGradient,
  stroke: Grays.GRAY1,
  padding: 30,
};

const DEFAULT_LABEL_TXT_PROPS = {
  ...PoppinsWhite,
  fontSize: 70,
};

const DEFAULT_VALUE_RECT_PROPS = { fill: silverGradient, stroke: Grays.GRAY1 };

const DEFAULT_VALUE_TXT_PROPS = {
  ...PoppinsBlack,
  fontSize: 80,
  padding: 30,
};

const DEFAULT_MAIN_RECT_PROPS = {
  scale: 0.5,
};

const DEFAULT_LINE_PROPS = {
  lineWidth: 8,
  lineDash: [10, 1],
  stroke: sessionDark,
  radius: 10,
  endArrow: true,
  endOffset: 10,
  end: 0,
  arrowSize: 15,
};

export interface LabelAndPointerProps {
  plot: Reference<Plot>;
  target: PossibleVector2;
  label: string;
  value: string;
  offsetX?: number;
  offsetY?: number;
  sourceElbowOffset?: PossibleVector2;
  targetElbowOffset?: PossibleVector2;
  sourceElbowOffset2?: PossibleVector2;
  direction?: Direction;
  labelRectProps?: RectProps;
  labelTxtProps?: TxtProps;
  valueRectProps?: RectProps;
  valueTxtProps?: TxtProps;
  mainRectProps?: RectProps;
  lineProps?: LineProps;
}

export interface LabelAndPointer {
  refs: { container: Node; layout: Layout };
  valueLabel: Node;
  arrow: Line;
}

export function createLabelAndPointer(
  props: LabelAndPointerProps
): LabelAndPointer {
  // Create the references to access subsets
  const refs = makeRefs<typeof createValueLabel>();

  // Set up defaults
  const labelTxtProps = {
    ...DEFAULT_LABEL_TXT_PROPS,
    ...props.labelTxtProps,
    text: props.label,
  };

  const labelRectProps = {
    ...DEFAULT_LABEL_RECT_PROPS,
    ...props.labelRectProps,
  };

  const valueRectProps = {
    ...DEFAULT_VALUE_RECT_PROPS,
    ...props.valueRectProps,
  };

  const valueTxtProps = {
    ...DEFAULT_VALUE_TXT_PROPS,
    ...props.valueTxtProps,
    text: props.value,
  };

  const mainRectProps = {
    ...DEFAULT_MAIN_RECT_PROPS,
    ...props.mainRectProps,
  };

  const lineProps = {
    ...DEFAULT_LINE_PROPS,
    ...props.lineProps,
  };
  const valueLabel = createValueLabel({
    refs: refs,
    plot: props.plot,
    target: props.target,
    offsetY: props.offsetY,
    offsetX: props.offsetX,
    mainNodeProps: { opacity: 0 },
    mainRectProps: mainRectProps,
    labelRectProps: labelRectProps,
    labelTxtProps: labelTxtProps,
    valueRectProps: valueRectProps,
    valueTxtProps: valueTxtProps,
  });

  let source = refs.layout.top;
  if (props.direction == Direction.Bottom) {
    source = refs.layout.bottom;
  }
  if (props.direction == Direction.Left) {
    source = refs.layout.left;
  }
  if (props.direction == Direction.Right) {
    source = refs.layout.right;
  }

  const arrow = createLayoutToCoordLine({
    plot: props.plot,
    target: props.target,
    source: source(),
    sourceElbowOffset: props.sourceElbowOffset,
    targetElbowOffset: props.targetElbowOffset,
    sourceElbowOffset2: props.sourceElbowOffset2,
    lineProps: lineProps,
  });
  return { refs: refs, valueLabel: valueLabel, arrow: arrow };
}

export function* eraseLabelAndPointer(
  node: LabelAndPointer,
  secs: number = 0.6
) {
  yield* node.arrow.end(0, secs, easeInCubic);
  yield* node.refs.layout.scale(0, secs, easeInBack);
}
