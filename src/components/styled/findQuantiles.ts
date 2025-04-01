const default_formatter = (n: number) => {
  return n.toFixed(0);
};

export const plusCommaFormmatter = (n: number, decimals: number = 0) => {
  /**
   * Add a leading plus to positive numbers
   * and comma separator.
   */

  let nFormatted = n.toLocaleString("en-US", {
    maximumFractionDigits: decimals,
    minimumFractionDigits: decimals,
  });

  if (n > 0) {
    nFormatted = "+" + nFormatted;
  }
  return nFormatted;
};

export const commaFormmatter = (n: number, decimals: number = 0) => {
  /**
   * Format with comma separator.
   */

  let nFormatted = n.toLocaleString("en-US", {
    maximumFractionDigits: decimals,
  });
  return nFormatted;
};

export function getQuantileData(
  id: string,
  source: any,
  formatter: (n: number) => string = default_formatter
) {
  /**
   * Return the min/max, 5th/95, 25th/75th and median from the source.
   */

  const data = [
    { label: "MIN", value: formatter(getQuantile(id, source, 0)) },
    { label: "5TH", value: formatter(getQuantile(id, source, 0.05)) },
    { label: "25TH", value: formatter(getQuantile(id, source, 0.25)) },
    { label: "MEDIAN", value: formatter(getQuantile(id, source, 0.5)) },
    { label: "75TH", value: formatter(getQuantile(id, source, 0.75)) },
    { label: "95TH", value: formatter(getQuantile(id, source, 0.95)) },
    { label: "MAX", value: formatter(getQuantile(id, source, 1)) },
  ];
  return data;
}

export function getQuantile(id: string, source: any, quantile: number): number {
  return source.find(
    (stat: any) => stat.ID === id && stat.QUANTILE === quantile
  ).VALUE;
}
