import {
  Gradient,
  Node,
  Rect,
  RectProps,
  Txt,
  TxtProps,
} from "@motion-canvas/2d";
import { makeRef } from "@motion-canvas/core";

// Reduce the size of the subhead by x%
// Override in subheadProps by setting fontSize.
const SUBHEAD_FONT_REDUCTION = 0.8;

export const blueTitleGradient = new Gradient({
  from: [0, -300],
  to: [0, 100],
  stops: [
    { offset: 0, color: "#2191fb" },
    { offset: 1, color: "#1d4e89" },
  ],
});

export function TitleBox({
  refs,
  fontSize = 120,
  nodeOpacity = 1,
  rectProps = {},
  headerProps = {},
  subheadProps = {},
  children = "",
}: {
  refs: {
    rect: Rect; // The containing Rect (top Layout node)
    container: Node; // Node containing everything
    header: Txt; // Header Txt
    headerContainer: Node; // Node containing the header Txt
    subhead: Txt; // Sub header Txt
    subheadContainer: Node; // Node containing sub header Txt
  };
  rectProps?: RectProps;
  headerProps?: TxtProps;
  subheadProps?: TxtProps;
  nodeOpacity?: number;
  fontSize?: number;
  children?: string;
}) {
  /**
   * Create a nice looking title with bounded Rect.
   * Use the container refs to animate positions.
   */
  return (
    <Node
      ref={makeRef(refs, "container")}
      opacity={nodeOpacity}
    >
      <Rect
        ref={makeRef(refs, "rect")}
        width={"100%"}
        direction={"column"}
        justifyContent={"center"}
        alignItems={"start"}
        padding={30}
        paddingLeft={60}
        lineWidth={3}
        {...rectProps}
        layout
        clip
      >
        <Node
          ref={makeRef(refs, "headerContainer")}
          opacity={nodeOpacity}
        >
          <Txt
            ref={makeRef(refs, "header")}
            // {...PoppinsWhite}
            fontSize={fontSize}
            fontWeight={700}
            {...headerProps}
          >
            {children}
          </Txt>
        </Node>
        <Node
          ref={makeRef(refs, "subheadContainer")}
          opacity={nodeOpacity}
        >
          <Txt
            ref={makeRef(refs, "subhead")}
            // {...PoppinsWhite}
            fontSize={fontSize * SUBHEAD_FONT_REDUCTION}
            fontWeight={400}
            {...subheadProps}
          >
            {children}
          </Txt>
        </Node>
      </Rect>
    </Node>
  );
}
