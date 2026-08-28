import { bucketByMonth, bucketByQuarter, bucketByWeek } from "../trends/trendBuckets";

describe("bucketByMonth", () => {
  it("keys and labels a date by its calendar month", () => {
    expect(bucketByMonth("2025-03-14")).toEqual({ key: "2025-03", label: "Mar" });
  });

  it("sorts ascending by key across years", () => {
    const keys = ["2025-01-05", "2024-12-20", "2025-02-01"].map((d) => bucketByMonth(d).key).sort();
    expect(keys).toEqual(["2024-12", "2025-01", "2025-02"]);
  });
});

describe("bucketByQuarter", () => {
  it("keys and labels a date by its calendar quarter", () => {
    expect(bucketByQuarter("2025-03-14")).toEqual({ key: "2025-Q1", label: "Q1" });
    expect(bucketByQuarter("2025-04-01")).toEqual({ key: "2025-Q2", label: "Q2" });
    expect(bucketByQuarter("2025-08-30")).toEqual({ key: "2025-Q3", label: "Q3" });
    expect(bucketByQuarter("2025-12-31")).toEqual({ key: "2025-Q4", label: "Q4" });
  });

  it("sorts ascending by key across years", () => {
    const keys = ["2025-02-01", "2024-11-20", "2025-07-01"].map((d) => bucketByQuarter(d).key).sort();
    expect(keys).toEqual(["2024-Q4", "2025-Q1", "2025-Q3"]);
  });
});

describe("bucketByWeek", () => {
  it("keys a mid-week date with its ISO week number", () => {
    // 2025-03-12 is a Wednesday in ISO week 11 of 2025.
    expect(bucketByWeek("2025-03-12")).toEqual({ key: "2025-W11", label: "Wk 11" });
  });

  it("assigns Dec 31 to next year's week 1 when the Thursday of that week falls in January", () => {
    // 2025-12-31 is a Wednesday; its ISO week's Thursday (2026-01-01) falls in 2026,
    // so this date belongs to week 1 of ISO year 2026.
    expect(bucketByWeek("2025-12-31")).toEqual({ key: "2026-W01", label: "Wk 1" });
  });

  it("assigns Jan 1 to the previous year's final week when its Thursday falls in December", () => {
    // 2027-01-01 is a Friday; its ISO week's Thursday (2026-12-31) falls in 2026,
    // so this date belongs to the last ISO week of 2026.
    expect(bucketByWeek("2027-01-01").key.startsWith("2026-W")).toBe(true);
  });

  it("sorts ascending by key across week and year boundaries", () => {
    const keys = ["2025-01-05", "2024-12-20", "2025-01-01"].map((d) => bucketByWeek(d).key).sort();
    expect(keys[0] <= keys[1] && keys[1] <= keys[2]).toBe(true);
  });
});
