# Chakra UI

**Category:** Batteries-included component library (lighter-weight)
**Docs:** https://chakra-ui.com/docs · v3 rewrite announcement: https://chakra-ui.com/blog/announcing-v3

## Why it could fit here

Chakra is a lighter, more ergonomics-focused alternative to MUI/Ant Design — a well-typed, composable API for building forms and layout (its `<Select>` and layout primitives like `<Stack>`/`<Box>` would cover the filter dropdown and spacing needs cleanly). It has no dedicated data-grid/table product, so it wouldn't solve the "sortable table" need on its own — you'd be building a sortable table yourself on top of its primitives (e.g. pairing it with TanStack Table).

## Adopters

**Could not verify a real, sourced adopter.** Search results surfacing names like OpenAI, Coinbase, Stripe, or Segment traced back only to third-party tech-detection aggregator sites (TheirStack, WebTechSurvey, StackShare) that infer usage from scraped signals — not to any official Chakra UI case-study page or a confirmation from the companies themselves. This is flagged explicitly rather than repeated as fact: **treat any "used by X" claim for Chakra UI as unconfirmed** unless independently verified.

## Bundle size

Roughly 246KB min+gzip cited for the full package (Bundlephobia-derived figure). Component-level tree-shaking with named imports can bring real usage down substantially — community reports describe ~47KB initial JS in optimized setups. Chakra's own maintainers have open GitHub discussions specifically about reducing bundle size (chakra-ui/chakra-ui discussions #5277 and #10263), suggesting this is an acknowledged, ongoing concern rather than a fully solved problem.

## TypeScript

Strong — commonly praised for a clean, well-typed API.

## Works alongside Recharts / Apollo Client

No conflict — UI-layer only.

## Setup weight

Requires wrapping the app in a `<ChakraProvider>` (a light theme-provider setup), but otherwise easy to introduce incrementally into specific parts of an existing app.

## License

MIT, fully free, no paywalled tier of any kind.
