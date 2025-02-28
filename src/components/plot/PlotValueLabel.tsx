import {
  makeRef,
  PossibleVector2,
  Reference,
  Vector2,
} from "@motion-canvas/core";
import { Plot, PlotSpace } from "./plot";
import {
  Layout,
  RectProps,
  TxtProps,
  Node,
  Rect,
  Txt,
  NodeProps,
} from "@motion-canvas/2d";

const DEFAULT_OFFSET_X = 0;
const DEFAULT_OFFSET_Y = 0;
const DEFAULT_FONT_WEIGHT = 600;
const DEFAULT_RADIUS = 20;
const DEFAULT_SHADOW_PROPS = {
  shadowOffset: new Vector2([2, 2]),
  shadowColor: "black",
  shadowBlur: 10,
};

/**
 * Represents a small table with a label and its value.
 *
 * To create refs:
 *   const refs = makeRefs<typeof createValueLabel>;
 */
export interface ValueLabelProps {
  /**
   * References to access interior nodes.
   */
  refs: { container: Node; layout: Layout };

  /**
   * The plot to draw on.
   */
  plot: Reference<Plot>;

  /**
   * Where to draw the plot, in coordinate space.
   */
  target: PossibleVector2;

  /**
   * Offset from the target in plot (motion-canvas) space.
   */
  offsetX?: number;

  /**
   * Offset from the target in plot (motion-canvas) space.
   */
  offsetY?: number;

  /**
   * Properties for the main layout Rect object.
   */
  mainRectProps?: RectProps;

  /**
   * Properties for the main layout Rect object.
   */
  mainNodeProps?: NodeProps;

  /**
   * Properties for the label Rect object.
   */
  labelRectProps?: RectProps;

  /**
   * Properties for the label Txt object.
   */
  labelTxtProps?: TxtProps;

  /**
   * Properties for the value Rect object.
   */
  valueRectProps?: RectProps;

  /**
   * Properties for the value Txt object.
   */
  valueTxtProps?: TxtProps;
}

/**
 * Draw a Value Label object on the plot and position it
 * in coordinate space.
 */
export function createValueLabel(props: ValueLabelProps) {
  // Set default values in props
  props = {
    offsetX: DEFAULT_OFFSET_X,
    offsetY: DEFAULT_OFFSET_Y,
    ...props,
  };

  const valueLabel = (
    <Node
      ref={makeRef(props.refs, "container")}
      {...props.mainNodeProps}
    >
      <Rect
        ref={makeRef(props.refs, "layout")}
        layout
        direction={"column"}
        radius={DEFAULT_RADIUS}
        {...DEFAULT_SHADOW_PROPS}
        clip
        {...props.mainRectProps}
      >
        <Rect
          height={"50%"}
          justifyContent={"center"}
          alignItems={"center"}
          {...props.labelRectProps}
        >
          <Txt
            fontWeight={DEFAULT_FONT_WEIGHT}
            {...props.labelTxtProps}
          ></Txt>
        </Rect>
        <Rect
          height={"50%"}
          justifyContent={"center"}
          alignItems={"center"}
          {...props.valueRectProps}
        >
          <Txt
            fontWeight={DEFAULT_FONT_WEIGHT}
            {...props.valueTxtProps}
          ></Txt>
        </Rect>
      </Rect>
    </Node>
  );

  // Position the element on the plot
  props.refs.layout.position(() =>
    props
      .plot()
      .c2p(props.target, PlotSpace.LOCAL)
      .addX(props.offsetX)
      .addY(props.offsetY)
  );

  // Add to plot and return
  props.plot().add(valueLabel);

  return valueLabel;
}
