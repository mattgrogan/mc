import {
  Node,
  Txt,
  Layout,
  Rect,
  RectProps,
  TxtProps,
} from "@motion-canvas/2d";
import { debug, makeRef, range } from "@motion-canvas/core";

export function ComparisonDataTable({
  refs,
  data,
  keys,
  cols,
  headers,
  formatter,
  headerRectProps = {},
  headerTxtProps = {},
  valueRectProps = {},
  valueTxtProps = {},
  fontSize = 120,
}: {
  refs: {
    container: Node;
    layout: Layout;
    columns: Node[];
    headerRects: Rect[];
    headerTxts: Txt[];
    valueRects: Rect[];
    valueTxts: Txt[];
  };
  data: any;
  keys: string[];
  cols: string[];
  headers: string[];
  formatter: CallableFunction;
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
        ref={makeRef(refs, "layout")}
        width={"100%"}
        height={"20%"}
        direction={"row"}
        gap={0}
        justifyContent={"space-evenly"}
        layout
      >
        {range(cols.length).map((index) => (
          <Node
            ref={makeRef(refs.columns, index)}
            opacity={0}
          >
            <Layout
              direction={"column"}
              // grow={1}
              height={"100%"}
              // Allow first column to grow
              grow={index == 0 ? 2 : 1}
              basis={index == 0 ? 2 : 1}
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
                  text={headers[index]}
                  {...headerTxtProps}
                ></Txt>
              </Rect>
              {range(keys.length).map((keyIndex) => (
                <Rect
                  ref={makeRef(refs.valueRects, index)}
                  height={"50%"}
                  justifyContent={"center"}
                  alignItems={"center"}
                  lineWidth={3}
                  {...valueRectProps}
                >
                  <Txt
                    ref={makeRef(refs.valueTxts, keyIndex)}
                    //   {...PoppinsBlack}
                    fontSize={fontSize}
                    fontWeight={600}
                    text={() => {
                      debug(keys[keyIndex] + [cols[index]]);
                      return formatter(data[keys[keyIndex]][cols[index]]);
                    }}
                    {...valueTxtProps}
                  ></Txt>
                </Rect>
              ))}
            </Layout>
          </Node>
        ))}
      </Layout>
    </Node>
  );
}
