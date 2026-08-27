# Architecture

[日本語](architecture.ja.md)

## Goal

`turbowarp-http-server-react` describes React islands from TurboWarp blocks. It does not execute React inside TurboWarp. The output is a stable descriptor and HTML fragment that `turbowarp-html`, `turbowarp-http-server`, and a later Vite build step can consume.

## Responsibilities

```text
TurboWarp blocks
  -> component name / mount id / JSON props
  -> React island descriptor
  -> HTML fragment
  -> turbowarp-html
  -> turbowarp-http-server response

React component source
  -> hooks and logic in TypeScript
  -> Vite dev/build
  -> browser bundle
  -> hydrate island
```

Blocks cover declarative placement and serializable props. React components, hooks, effects, state updates, MUI themes, CSS, and code splitting stay in TypeScript and Vite.

## Island descriptor

```json
{
  "kind": "react-island",
  "version": 1,
  "component": "Counter",
  "mountId": "counter-root",
  "props": {"initialCount": 0}
}
```

The MVP fixes this shape so future CLI and Vite integrations can consume it without depending on TurboWarp runtime internals.

## Limits

- The package does not bundle React, React DOM, MUI, or user components.
- Blocks do not generate hook bodies.
- Props are JSON objects only.
- Hydration script generation, dev server proxying, CSS loading, SSR, and streaming are outside the MVP.
