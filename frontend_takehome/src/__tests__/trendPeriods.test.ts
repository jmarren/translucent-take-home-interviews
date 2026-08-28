import { currentPeriodRange, hasPreviousPeriod, previousPeriodRange, buildPopBuckets } from "../trends/trendPeriods";
import { Denial } from "../types";

const REFERENCE = new Date("2025-06-15T00:00:00");

function toStr(d: Date): string {
  return d.toISOString().slice(0, 10);
}

describe("hasPreviousPeriod", () => {
  it("is false only for 'all'", () => {
    expect(hasPreviousPeriod("all")).toBe(false);
    expect(hasPreviousPeriod("last-30")).toBe(true);
    expect(hasPreviousPeriod("this-month")).toBe(true);
    expect(hasPreviousPeriod("this-quarter")).toBe(true);
    expect(hasPreviousPeriod("this-year")).toBe(true);
  });
});

describe("currentPeriodRange / previousPeriodRange", () => {
  it("returns null for 'all' on both", () => {
    expect(currentPeriodRange("all", REFERENCE)).toBeNull();
    expect(previousPeriodRange("all", REFERENCE)).toBeNull();
  });

  it("computes last-30 as the preceding 30-day window immediately before the current one", () => {
    const current = currentPeriodRange("last-30", REFERENCE)!;
    const previous = previousPeriodRange("last-30", REFERENCE)!;
    expect(toStr(current.start)).toBe("2025-05-17");
    expect(toStr(current.end)).toBe("2025-06-15");
    expect(toStr(previous.end)).toBe("2025-05-16");
    expect(toStr(previous.start)).toBe("2025-04-17");
  });

  it("computes this-month's previous as all of last month", () => {
    const previous = previousPeriodRange("this-month", REFERENCE)!;
    expect(toStr(previous.start)).toBe("2025-05-01");
    expect(toStr(previous.end)).toBe("2025-05-31");
  });

  it("computes this-quarter's previous as all of last quarter", () => {
    // June 2025 is in Q2 (Apr-Jun); previous quarter is Q1 (Jan-Mar).
    const previous = previousPeriodRange("this-quarter", REFERENCE)!;
    expect(toStr(previous.start)).toBe("2025-01-01");
    expect(toStr(previous.end)).toBe("2025-03-31");
  });

  it("computes this-year's previous as all of last calendar year", () => {
    const previous = previousPeriodRange("this-year", REFERENCE)!;
    expect(toStr(previous.start)).toBe("2024-01-01");
    expect(toStr(previous.end)).toBe("2024-12-31");
  });
});

describe("buildPopBuckets", () => {
  function denial(date: string, department: string, amount: number): Denial {
    return { id: `${date}-${department}`, department, amount, reason: "Coding error", date, payer: "Medicare" };
  }

  it("returns null when the period has no previous window", () => {
    const data = [denial("2025-01-01", "Cardiology", 100)];
    expect(buildPopBuckets(data, "all", REFERENCE, "month", (d) => d.department, "amount")).toBeNull();
  });

  it("splits current vs previous period totals and indexes buckets by relative position", () => {
    const data = [
      denial("2025-04-10", "Cardiology", 100), // current quarter (Q2: Apr-Jun)
      denial("2025-05-10", "Cardiology", 200), // current quarter
      denial("2025-02-10", "Cardiology", 50), // previous quarter (Q1: Jan-Mar)
    ];

    const result = buildPopBuckets(data, "this-quarter", REFERENCE, "month", (d) => d.department, "amount")!;
    expect(result).not.toBeNull();

    const currentTotal = result.currentBuckets.reduce(
      (sum, b) => sum + (b.totalsBySeries.get("Cardiology") ?? 0),
      0
    );
    const previousTotal = result.previousBuckets.reduce(
      (sum, b) => sum + (b.totalsBySeries.get("Cardiology") ?? 0),
      0
    );

    expect(currentTotal).toBe(300);
    expect(previousTotal).toBe(50);
    expect(result.currentBuckets[0].position).toBe(0);
    expect(result.currentBuckets[0].positionLabel).toBe("Month 1");
  });
});
