import {
  Node,
  Txt,
  Layout,
  Rect,
  RectProps,
  TxtProps,
} from "@motion-canvas/2d";
import { makeRef, range } from "@motion-canvas/core";

export function DataTable({
  refs,
  data,
  headerRectProps = {},
  headerTxtProps = {},
  valueRectProps = {},
  valueTxtProps = {},
  fontSize = 120,
}: {
  refs: {
    container: Node;
    columns: Node[];
    headerRects: Rect[];
    headerTxts: Txt[];
    valueRects: Rect[];
    valueTxts: Txt[];
  };
  data: { label: string; value: string }[];
  headerRectProps?: RectProps;
  headerTxtProps?: TxtProps;
  valueRectProps?: RectProps;
  valueTxtProps?: TxtProps;
  fontSize?: number;
}) {
  // Initialize the arrays
  refs.columns = [];
  refs.headerRects = [];
  refs.headerTxts = [];
  refs.valueRects = [];
  refs.valueTxts = [];

  return (
    <Node ref={makeRef(refs, "container")}>
      <Layout
        width={"100%"}
        height={"20%"}
        direction={"row"}
        gap={0}
        justifyContent={"space-evenly"}
        layout
      >
        {range(data.length).map((index) => (
          <Node
            ref={makeRef(refs.columns, index)}
            opacity={0}
          >
            <Layout
              direction={"column"}
              grow={1}
              height={"100%"}
              basis={0}
            >
              <Rect
                ref={makeRef(refs.headerRects, index)}
                height={"50%"}
                justifyContent={"center"}
                alignItems={"center"}
                lineWidth={3}
                {...headerRectProps}
              >
                <Txt
                  ref={makeRef(refs.headerTxts, index)}
                  //   {...PoppinsWhite}
                  fontSize={fontSize}
                  fontWeight={600}
                  text={data[index].label}
                  {...headerTxtProps}
                ></Txt>
              </Rect>
              <Rect
                ref={makeRef(refs.valueRects, index)}
                height={"50%"}
                justifyContent={"center"}
                alignItems={"center"}
                lineWidth={3}
                {...valueRectProps}
              >
                <Txt
                  ref={makeRef(refs.valueTxts, index)}
                  //   {...PoppinsBlack}
                  fontSize={fontSize}
                  fontWeight={600}
                  text={data[index].value}
                  {...valueTxtProps}
                ></Txt>
              </Rect>
            </Layout>
          </Node>
        ))}
      </Layout>
    </Node>
  );
}
