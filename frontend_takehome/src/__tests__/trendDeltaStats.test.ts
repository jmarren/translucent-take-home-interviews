import { computeDeltaStats } from "../trendDeltaStats";

describe("computeDeltaStats", () => {
  it("computes the headline total and percent change across all series", () => {
    const current = new Map([["Cardiology", 150], ["Neurology", 50]]);
    const previous = new Map([["Cardiology", 100], ["Neurology", 100]]);

    const stats = computeDeltaStats(current, previous, ["Cardiology", "Neurology"]);

    expect(stats.headline.current).toBe(200);
    expect(stats.headline.previous).toBe(200);
    expect(stats.headline.pctChange).toBe(0);
  });

  it("ranks top movers by absolute dollar change, not percent change", () => {
    // Neurology moves +200% but only $100; Cardiology moves +20% but $2,000 -- dollar
    // magnitude should win.
    const current = new Map([["Cardiology", 12000], ["Neurology", 150]]);
    const previous = new Map([["Cardiology", 10000], ["Neurology", 50]]);

    const stats = computeDeltaStats(current, previous, ["Cardiology", "Neurology"]);

    expect(stats.topMovers[0].name).toBe("Cardiology");
    expect(stats.topMovers[0].delta).toBe(2000);
  });

  it("caps top movers at 3 regardless of how many series are given", () => {
    const names = ["A", "B", "C", "D", "E", "F", "G", "H"];
    const current = new Map(names.map((n, i) => [n, (i + 1) * 100]));
    const previous = new Map(names.map((n) => [n, 0]));

    const stats = computeDeltaStats(current, previous, names);

    expect(stats.topMovers).toHaveLength(3);
  });

  it("treats a previous value of 0 as no percent change when current is also 0", () => {
    const current = new Map([["A", 0]]);
    const previous = new Map([["A", 0]]);

    const stats = computeDeltaStats(current, previous, ["A"]);

    expect(stats.topMovers[0].pctChange).toBe(0);
  });
});
