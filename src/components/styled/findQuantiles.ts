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
    minimumFractionDigits: decimals,
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

export interface NumberFormat {
  scaleBy?: number
  decimals?: number
  zeroText?: string

  useSeperator?: string
  suffixing?: boolean | [string, string, string, string]
  forceSign?: boolean

  usePercentage?: boolean
  includeSpace?: boolean
  placement?: "right" | "left"
}


export class NumberFormatter {
  private readonly decimalFormatter: Intl.NumberFormat;
  constructor(private config: NumberFormat = {}) {
  }

  public setDecimal(val: number): NumberFormatter {
    this.config.decimals = val;
    return this;
  }

  public setScaleBy(val: number): NumberFormatter {
    this.config.scaleBy = val;
    return this;
  }

  public setSeperator(sepearator: string) {
    this.config.useSeperator = sepearator;
    return this;
  }

  public setSuffixing(val: boolean | [string, string, string, string]) {
    this.config.suffixing = val;
    return this;
  }

  public setForceSign(val: boolean) {
    this.config.forceSign = val;
    return this;
  }

  public setUsePercentage(val: boolean) {
    this.config.usePercentage = val;
    return this;
  }

  public setZeroText(val: string) {
    this.config.zeroText = val;
    return this;
  }

  public setIncludeSpace(val: boolean) {
    this.config.includeSpace = val;
    return this;
  }

  public setPlacement(val: "left" | "right") {
    this.config.placement = val;
    return this;
  }


  private formatter(): Intl.NumberFormat {
    const decimal = this.config.decimals;
    if (this.config.suffixing) return new Intl.NumberFormat("en-US", { maximumFractionDigits: decimal, notation: 'compact', compactDisplay: 'short' });
    if (this.config.usePercentage) return new Intl.NumberFormat('en-US', { style: 'percent', maximumFractionDigits: decimal });

    return new Intl.NumberFormat("en-US", { maximumFractionDigits: this.config.decimals })
  }

  public format(val: number): string {
    if (!val && this.config.zeroText) return this.config.zeroText;

    let scaledValue = val;
    if (this.config.scaleBy) scaledValue = val * this.config.scaleBy;

    let formattedString = this.formatter().format(scaledValue);
    if (this.config.useSeperator) formattedString = formattedString.replaceAll(",", this.config.useSeperator);

    if (this.config.suffixing && Array.isArray(this.config.suffixing)) {
      const defaultSuffix = ["K", "M", "B", "T"];
      const suffix = defaultSuffix.find(x => formattedString.indexOf(x) >= 0);
      if (suffix) {
        formattedString = formattedString.replace(suffix, this.config.suffixing[defaultSuffix.indexOf(suffix)]);
      }      
    }

    if(this.config.forceSign && formattedString[0] !== "-" && val) {
      formattedString = "+" + formattedString;
    }

    if (!this.config.usePercentage || (this.config.usePercentage && formattedString[formattedString.length -1] !== "%")) return formattedString;

    const substr = formattedString.slice(0, -1);

    const placement = this.config.placement || "right";

    if (this.config.includeSpace && placement === "right") return substr + " %";

    if (this.config.includeSpace && placement === "left") return "% " + substr;
    if (placement === "left") return "%" + substr;
    if (placement === "right") return substr + "%";

    return formattedString
  }
}
