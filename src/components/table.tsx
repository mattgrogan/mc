import { Layout, Rect, Txt, Node, RectProps, TxtProps, Line, signal, initial } from "@motion-canvas/2d";
import { all, BBox, chain, createRef, createRefArray, makeRef, range, sequence, SimpleSignal, ThreadGenerator, Vector2 } from "@motion-canvas/core";
import { NumberFormat, NumberFormatter } from "./styled/findQuantiles";


interface TableComponent {
  column: Rect
  header: Layout
  contentColumn: Layout
  rows: Rect[]
  numberFormatterConfig?: NumberFormat
}

type Range = `${number} - ${number}`;
type Group = { range: Range, title: string };

export interface TabledProps extends RectProps {
  data: Record<string, Array<string | number>>
  headerCellProps?: RectProps
  headerTxtProps?: TxtProps
  CellProps?: RectProps
  CellTxtProps?: TxtProps
  titleAlias?: Record<string, string>
  headerGrouping?: Group[]
  numberFormat?: TableNumberFormat | TableNumberFormat[]
}

interface TableNumberFormat extends NumberFormat {
  columns?: Array<string>
}

export class Table extends Rect {

  public readonly components: TableComponent[] = [];
  public readonly container: Node;
  public readonly table: Rect;
  public highlighters: Node[] = [];
  private headerGrouping: Group[] = [];


  @initial(0)
  @signal()
  public declare readonly displacementY: SimpleSignal<number, this>

  @initial(0)
  @signal()
  public declare readonly displacementX: SimpleSignal<number, this>

  protected defaultHeaderCellProps: RectProps = {
    fill: "#fff",
    padding: 10,
    layout: true,
    justifyContent: "end"
  }

  protected readonly defaultCellProps: RectProps = {
    padding: 10,
    layout: true,
    justifyContent: "end"
  }

  protected defaultHeaderTxtProps: TxtProps = {
    fontSize: 20,
    wrap: "wrap"
  }

  protected readonly defaultCellTxtProps: TxtProps = {
    fontSize: 20,
    wrap: "wrap"
  }

  protected defaultHighlighterRect(hightligherProps?: RectProps): Rect {
    const highlighter = createRef<Rect>();
    const props = {
      offsetX: -1,
      opacity: .4,
      fill: "blue",
      ...(hightligherProps || {}),
      width: 0,
      layout: false
    }
    this.add(
      <Rect ref={highlighter} {...props} />
    );

    this.highlighters.push(highlighter());
    return highlighter();
  }

  public constructor({ data, numberFormat, headerCellProps, headerTxtProps, CellProps, CellTxtProps, headerGrouping, titleAlias = {}, ...others }: TabledProps) {
    super({
      layout: true,
      clip: true,
      stroke: "#000",
      lineWidth: 2,
      ...others
    });

    this.headerGrouping = headerGrouping;

    const columnNumberConfigs = this.setupFormatterConfig(numberFormat);
    this.defaultHeaderCellProps = { ...this.defaultHeaderCellProps, ...headerCellProps };
    this.defaultHeaderTxtProps = { ...this.defaultHeaderTxtProps, ...headerTxtProps };

    Object.keys(data).forEach((x, i) => {
      this.components[i] = { rows: [], column: null, contentColumn: null, header: null, numberFormatterConfig: columnNumberConfigs[x] }
    });

    this.add(
      <Node ref={makeRef(this, "container")} x={this.displacementX}>
        <Rect layout direction={"column"}>
          <Rect ref={makeRef(this, "table")} layout>
            {
              Object.entries(data).map(([key, values], i) => {
                const formatter = new NumberFormatter(this.components[i].numberFormatterConfig)
                return (
                  <>
                    <Rect
                      layout
                      direction={"column"}
                      ref={makeRef(this.components[i], "column")}
                    >
                      <Layout direction={"column"} ref={makeRef(this.components[i], "header")} zIndex={1}>
                        {
                          headerGrouping && headerGrouping.map((t, w) => (
                            <Rect {...this.defaultHeaderCellProps}>
                              {/* Random chracter to create space for grouping text */}
                              <Txt {...this.defaultHeaderTxtProps} opacity={0}>F</Txt>  
                            </Rect>
                          ))
                        }
                        <Rect  {...this.defaultHeaderCellProps}>
                          <Txt {...this.defaultHeaderTxtProps}>{titleAlias[key] || key}</Txt>
                        </Rect>
                      </Layout>


                      <Layout ref={makeRef(this.components[i], "contentColumn")} layout direction={"column"}>
                        <Node y={() => this.displacementY()}>
                          {
                            values.map((val, j) => (
                              <Rect ref={makeRef(this.components[i].rows, j)} {...{ ...this.defaultCellProps, ...CellProps }}>
                                <Txt {...{ ...this.defaultCellTxtProps, ...CellTxtProps }}>{ this.isNumber(val.toString()) ? formatter.format(Number(val)) : val.toString()}</Txt>
                              </Rect>
                            ))
                          }
                        </Node>
                      </Layout>
                    </Rect>
                  </>
                )
              })
            }
          </Rect>
        </Rect>
      </Node>
    );

    this.table.add(
      <>
        {
          range(this.components.length - 1).map(i => (
            <Line
              points={() => [
                [this.components[i].column.topRight().x, (this.table.height() / 2) * -1],
                [this.components[i].column.bottomRight().x, (this.table.height() / 2)]
              ]}
              lineWidth={this.lineWidth()}
              stroke={"#000"}
              zIndex={2}
              layout={false}
            />
          ))
        }
      </>
    );
  }

  public addHeaderGrouping() {
    this.table.add(
      <>
        {
          this.headerGrouping?.map((x, i) => {
            const [startCell, endCell] = x.range.split("-").map(x => this.components[Number(x)].header.children()[i] as Rect);
            const box = BBox.fromPoints(
              this.cellPointToTablePoint(startCell.topLeft(), startCell),
              this.cellPointToTablePoint(startCell.bottomLeft(), startCell),
              this.cellPointToTablePoint(endCell.topRight(), endCell),
              this.cellPointToTablePoint(endCell.bottomRight(), endCell),
            );
            return (
              <>
                <Rect {...{ ...this.defaultHeaderCellProps }} zIndex={3} layout={false} width={box.width} height={box.height} offset={[-1, -1]} position={box.topLeft}>
                  <Txt {...{ ...this.defaultHeaderTxtProps }} text={x.title} layout={false} />
                </Rect>

                <Line lineWidth={this.lineWidth()} stroke={"#000"} layout={false} points={[box.topLeft, box.topRight]} zIndex={15} />

                <Line lineWidth={this.lineWidth()} stroke={"#000"} layout={false} points={[box.bottomLeft, box.bottomRight]} zIndex={15} />
              </>
            )
          })
        }
      </>
    )
  }

  private cellPointToTablePoint(point: Vector2, cell: Rect): Vector2 {
    return point.transformAsPoint(cell.parentToWorld()).transformAsPoint(this.table.worldToLocal())
  }

  private setupFormatterConfig(config: TableNumberFormat | TableNumberFormat[] = { columns: [] }): Record<string, Omit<TableNumberFormat, "columns">> {
    let configs: TableNumberFormat[] = Array.isArray(config) ? config : [config];
    const result: Record<string, NumberFormat> = {};
    configs.forEach((config: TableNumberFormat) => {
      const { columns, ...others } = config;
      config.columns.reduce((acc: Record<string, NumberFormat>, val: string) => {
        acc[val] = { ...acc[val], ...others };
        return acc;
      }, result);
    })

    return result;
  }

  private isNumber(n: string) { return /^-?[\d.]+(?:e-?\d+)?$/.test(n); } 

  protected viewportVericalCenter(): number {
    return (this.height() - (this.components[0]?.header.height() || 0)) / 2;
  }


  public * scrollToRow(rowNo: number | "end", duration: number) {
    const component = this.components[0];
    const row = rowNo == "end" ? component?.rows[component?.rows.length - 1] : component?.rows[rowNo - 1];
    if (!component || !row) return;

    const columnTop = component.contentColumn.top().transformAsPoint(component.contentColumn.parentToWorld()).y;
    const rowDistanceFromTop = (row.absolutePosition().y - this.displacementY()) - columnTop;
    const margin = Math.min(0, this.viewportVericalCenter() - rowDistanceFromTop);
    yield* this.displacementY(margin, duration);
  }

  public * highlightRow(rowNo: number, highlighterProp?: RectProps, duration: number = .5, customHighlighter?: (row: Rect, table: Rect) => ThreadGenerator) {
    const row = this.components[0].rows[rowNo - 1];
    if (!row) return;

    if (customHighlighter) {
      yield* customHighlighter(row, this);
      return;
    }
    const highlighers = createRefArray<Rect>()
    this.components.forEach(x => {
      const cell = x.rows[rowNo - 1];
      cell.add(
        <Rect ref={highlighers} layout={false} height={cell.height} width={0} zIndex={-1} offsetX={-1} position={[cell.width() / -2, 0]} />
      )
    })
    this.highlighters.push(...highlighers);
    yield* chain(...highlighers.map(x => all(
      x.width((x.parent() as Rect).width, duration / this.components.length),
      x.fill(highlighterProp?.fill || "blue", duration / this.components.length))
    ));
  }

  public * highlightCell(rowNo: number, columnNo: number, highlighterProp?: RectProps, duration: number = .5, customHighlighter?: (row: Rect) => ThreadGenerator) {
    const cell = this.components[columnNo]?.rows[rowNo - 1];
    if (!cell) return;

    if (customHighlighter) {
      yield* customHighlighter(cell);
      return;
    }

    const highlighter = this.defaultHighlighterRect(highlighterProp);
    highlighter.absolutePosition(cell.left().transformAsPoint(cell.parentToWorld()));
    highlighter.height(cell.height)
    yield* highlighter.width(cell.width, duration)
  }

  public * removeHighlighters(duration: number = .5, sequential: boolean = false) {
    if (sequential) yield* sequence(.5, ...this.highlighters.map(x => x.opacity(0, duration)));
    else yield* all(...this.highlighters.map(x => x.opacity(0, duration)))
    this.highlighters.forEach(x => x.remove())
  }
} 
