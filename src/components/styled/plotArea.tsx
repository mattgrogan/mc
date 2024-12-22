import { Node, Layout, Rect, RectProps } from "@motion-canvas/2d";
import { makeRef } from "@motion-canvas/core";

export function PlotArea({
  refs,
  props = {},
}: {
  refs: { container: Node; rect: Rect; layout: Layout };
  props?: RectProps;
}) {
  return (
    <Node
      ref={makeRef(refs, "container")}
      opacity={0}
    >
      <Rect
        ref={makeRef(refs, "rect")}
        width={"100%"}
        // height={"50%"}
        grow={1}
        //   fill={plotAreaFill}
        //   stroke={Grays.GRAY1}
        lineWidth={3}
        layout
        {...props}
      >
        <Layout
          ref={makeRef(refs, "layout")}
          layout={false}
        ></Layout>
      </Rect>
    </Node>
  );
}
