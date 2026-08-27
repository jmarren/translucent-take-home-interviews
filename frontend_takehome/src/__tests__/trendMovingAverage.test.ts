import { withMovingAverages } from "../trendMovingAverage";
import { MultiSeriesPoint } from "../hooks/useMultiSeriesTrend";

function point(bucketKey: string, cardiology: number): MultiSeriesPoint {
  return { bucketKey, bucketLabel: bucketKey, Cardiology: cardiology };
}

describe("withMovingAverages", () => {
  it("returns points unchanged when the window is off", () => {
    const points = [point("2025-01", 100), point("2025-02", 200)];
    expect(withMovingAverages(points, ["Cardiology"], "off")).toBe(points);
  });

  it("leaves the first (window - 1) points at their raw value", () => {
    const points = [point("2025-01", 100), point("2025-02", 200)];
    const result = withMovingAverages(points, ["Cardiology"], 3);
    expect(result[0].Cardiology).toBe(100);
    expect(result[1].Cardiology).toBe(200);
  });

  it("replaces a series' value with its trailing average once the window is filled", () => {
    const points = [point("2025-01", 100), point("2025-02", 200), point("2025-03", 300)];
    const result = withMovingAverages(points, ["Cardiology"], 3);
    expect(result[2].Cardiology).toBe(200);
  });

  it("slides the window forward for later points", () => {
    const points = [
      point("2025-01", 100),
      point("2025-02", 200),
      point("2025-03", 300),
      point("2025-04", 600),
    ];
    const result = withMovingAverages(points, ["Cardiology"], 3);
    // Window over points 2-4: (200 + 300 + 600) / 3
    expect(result[3].Cardiology).toBeCloseTo(1100 / 3);
  });
});
