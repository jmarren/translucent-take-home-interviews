import { renderHook } from "@testing-library/react";
import { useMultiSeriesTrend } from "../hooks/useMultiSeriesTrend";
import { Denial, DEPARTMENTS } from "../types";

function denial(overrides: Partial<Denial>): Denial {
  return {
    id: "1",
    department: "Cardiology",
    amount: 100,
    reason: "Coding error",
    date: "2025-01-15",
    payer: "Medicare",
    ...overrides,
  };
}

describe("useMultiSeriesTrend", () => {
  it("sums amount per bucket per series", () => {
    const data: Denial[] = [
      denial({ department: "Cardiology", amount: 100, date: "2025-01-05" }),
      denial({ department: "Cardiology", amount: 50, date: "2025-01-20" }),
      denial({ department: "Neurology", amount: 30, date: "2025-01-10" }),
      denial({ department: "Cardiology", amount: 20, date: "2025-02-01" }),
    ];

    const { result } = renderHook(() =>
      useMultiSeriesTrend(data, { granularity: "month", dimension: "department", metric: "amount" })
    );

    expect(result.current.points).toEqual([
      expect.objectContaining({ bucketKey: "2025-01", Cardiology: 150, Neurology: 30 }),
      expect.objectContaining({ bucketKey: "2025-02", Cardiology: 20, Neurology: 0 }),
    ]);
  });

  it("uses the fixed canonical series list, not just values present in the data", () => {
    const data: Denial[] = [denial({ department: "Cardiology" })];

    const { result } = renderHook(() =>
      useMultiSeriesTrend(data, { granularity: "month", dimension: "department", metric: "amount" })
    );

    expect(result.current.seriesNames).toEqual([...DEPARTMENTS]);
    expect(result.current.points[0].Radiology).toBe(0);
  });

  it("sorts points ascending by bucket key", () => {
    const data: Denial[] = [
      denial({ date: "2025-03-01" }),
      denial({ date: "2025-01-01" }),
      denial({ date: "2025-02-01" }),
    ];

    const { result } = renderHook(() =>
      useMultiSeriesTrend(data, { granularity: "month", dimension: "department", metric: "amount" })
    );

    expect(result.current.points.map((p) => p.bucketKey)).toEqual(["2025-01", "2025-02", "2025-03"]);
  });

  it("counts denials instead of summing amount when the metric is 'count'", () => {
    const data: Denial[] = [
      denial({ department: "Cardiology", amount: 100, date: "2025-01-05" }),
      denial({ department: "Cardiology", amount: 9999, date: "2025-01-20" }),
      denial({ department: "Neurology", amount: 30, date: "2025-01-10" }),
    ];

    const { result } = renderHook(() =>
      useMultiSeriesTrend(data, { granularity: "month", dimension: "department", metric: "count" })
    );

    expect(result.current.points).toEqual([
      expect.objectContaining({ bucketKey: "2025-01", Cardiology: 2, Neurology: 1 }),
    ]);
  });
});
