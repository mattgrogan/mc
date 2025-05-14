import { describe, expect, test } from 'vitest'
import { NumberFormatter } from "./findQuantiles"


describe("Number Formatter", () => {
  test('expect no sign for zero', () => {
    expect(new NumberFormatter().format(0)).toBe("0")
  })

  test('percentage setting', () => {
    expect(new NumberFormatter({ usePercentage: true, includeSpace: true }).format(.80)).toBe("80 %");
    expect(new NumberFormatter({ usePercentage: true, includeSpace: true, placement: "left" }).format(.80)).toBe("% 80");
    expect(new NumberFormatter({ usePercentage: true, placement: "left" }).format(.80)).toBe("%80");
    expect(new NumberFormatter({ usePercentage: true, placement: "right" }).format(.80)).toBe("80%");
    expect(new NumberFormatter({ usePercentage: true }).format(.80)).toBe("80%");
  });

  test('suffixing', () => {
    expect(new NumberFormatter({ suffixing: true }).format(80)).toBe("80");
    expect(new NumberFormatter({ suffixing: true }).format(8000)).toBe("8K");
    expect(new NumberFormatter({ suffixing: true }).format(8000000)).toBe("8M");
    expect(new NumberFormatter({ suffixing: ["k", "m", "b", "t"] }).format(8000000)).toBe("8m");
    expect(new NumberFormatter({ suffixing: ["k", "m", "b", "t"] }).format(8000)).toBe("8k");
  })

  test('sign', () => {
    expect(new NumberFormatter({ forceSign: true }).format(80)).toBe("+80");
    expect(new NumberFormatter({ forceSign: true }).format(-80)).toBe("-80");
    expect(new NumberFormatter({ forceSign: true }).format(1200)).toBe("+1,200");
    expect(new NumberFormatter({ forceSign: true }).format(0)).toBe("0");
  })

  test('zero text', () => {
    expect(new NumberFormatter({ zeroText: "<0.1%" }).format(0)).toBe("<0.1%");
    expect(new NumberFormatter({ zeroText: "<0.1%" }).format(80)).toBe("80");
  })

  test('scaled by', () => {
    expect(new NumberFormatter({ zeroText: "<0.1%", scaleBy: 2 }).format(0)).toBe("<0.1%");
    expect(new NumberFormatter({ zeroText: "<0.1%", scaleBy: 2 }).format(80)).toBe("160");
    expect(new NumberFormatter({ zeroText: "<0.1%", scaleBy: 2, suffixing: true }).format(600)).toBe("1.2K");
  })

  test('Seperator', () => {
    expect(new NumberFormatter({ useSeperator: "-" }).format(1200)).toBe("1-200");
  })
})
