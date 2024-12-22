export function getQuantileData(id: string, source: any, decimals: number = 0) {
  /**
   * Return the min/max, 5th/95, 25th/75th and median from the source.
   */

  const data = [
    { label: "MIN", value: getQuantile(id, source, 0).toFixed(0) },
    { label: "5TH", value: getQuantile(id, source, 0.05).toFixed(0) },
    { label: "25TH", value: getQuantile(id, source, 0.25).toFixed(0) },
    { label: "MEDIAN", value: getQuantile(id, source, 0.5).toFixed(0) },
    { label: "75TH", value: getQuantile(id, source, 0.75).toFixed(0) },
    { label: "95TH", value: getQuantile(id, source, 0.95).toFixed(0) },
    { label: "MAX", value: getQuantile(id, source, 1).toFixed(0) },
  ];
  return data;
}

export function getQuantile(id: string, source: any, quantile: number) {
  return source.find(
    (stat: any) => stat.ID === id && stat.QUANTILE === quantile
  ).VALUE;
}
