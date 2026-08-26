import '@testing-library/jest-dom';

// Recharts' ResponsiveContainer relies on ResizeObserver, which jsdom doesn't implement.
class ResizeObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}
(global as any).ResizeObserver = ResizeObserverStub;
