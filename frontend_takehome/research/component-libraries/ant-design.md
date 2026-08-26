# Ant Design

**Category:** Batteries-included component library (enterprise/admin-oriented)
**Docs:** https://ant.design/docs/react/introduce

## Why it could fit here

Ant Design is purpose-built for exactly this kind of project — data-dense internal admin dashboards. Its `<Table>` component includes column sorting out of the box, with no paywalled tier at all (unlike MUI's DataGrid, there is no Pro edition of Ant Design). Its `<Select>` and layout Grid system cover the other stated needs directly.

## Adopters

Built and maintained by Ant Group (Alibaba affiliate). Ant Design's own official "Cases" page lists real products built with it, primarily within the Alibaba/Ant ecosystem (e.g. OceanBase Cloud Platform, Alibaba Cloud StreamCompute):
https://ant.design/docs/spec/cases/

This is a first-party source, so it's strong verification for real production use — though most named adopters are internal to Alibaba's own ecosystem rather than independent, external household names.

## Bundle size

The heaviest of the batteries-included options researched. A full, unoptimized import can run around 2MB uncompressed; with tree-shaking via `babel-plugin-import` (or ES module imports + a modern bundler) this comes down substantially — community sources (DEV.to and StudyRaid write-ups, and ant-design/babel-plugin-import GitHub issues) cite roughly 400KB for a handful of components, but note tree-shaking is described as imperfect without extra tooling.

## TypeScript

Full built-in type definitions, well regarded by the community.

## Works alongside Recharts / Apollo Client

No functional conflict — purely a UI component library.

## Setup weight

Moderate. No forced global theme provider is required for basic use, but Ant Design has a strong, opinionated visual language (dense, enterprise-admin aesthetic). Adopting it well in practice tends to mean going all-in on its layout/Grid system rather than mixing a few components into an otherwise unstyled app — less "drop in one component" friendly than MUI or Radix.

## License

MIT, fully free — including the `<Table>` component's sorting feature. There is no separate paid tier for advanced table features, which simplifies the licensing story relative to MUI.
