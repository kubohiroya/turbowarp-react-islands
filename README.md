# TurboWarp React Islands

[日本語](README.ja.md)

TurboWarp extension and TypeScript helpers for describing React islands inside
HTML responses produced by `turbowarp-http-server` and `turbowarp-html`.

## Positioning

This package treats React as a rich GUI part, not as the whole programming
surface. The intended split is:

- TurboWarp blocks declare where a component appears and what serializable props it receives.
- React, MUI, and other component libraries implement complex UI controls.
- TypeScript files in an editor such as VS Code hold hooks, effects, validation, and domain logic.
- `turbowarp-html` receives the generated HTML fragment and inserts it into an HTTP response.
- A CLI or Vite build process supplies the browser bundle that hydrates the island later.

The MVP does not run React inside TurboWarp. It creates stable island
descriptors and HTML fragments that a later build step can consume.

## Installation

```bash
pnpm add --save-exact @kubohiroya/turbowarp-react-islands@0.2.0
```

## What it does

- registers component names and browser module specifiers;
- returns JSON mount descriptors from TurboWarp reporter blocks;
- returns safe HTML fragments with `data-tw-react-island` markers and JSON props;
- emits a deterministic `dist/extension-manifest.json` API contract;
- keeps island generation testable as plain TypeScript helpers.

## Requirements and safety

- Node.js 22 or newer;
- pnpm through Corepack;
- TurboWarp;
- `turbowarp-http-server` and `turbowarp-html` for HTTP/HTML composition;
- React and React DOM in the application bundle when hydrating islands.

Generated props are JSON. Functions, class instances, DOM nodes, and live hook
state are intentionally outside the block contract.

## Development

```bash
corepack enable
pnpm install --frozen-lockfile
```

For continuous extension rebuilding:

```bash
pnpm run dev
```

Run the checks:

```bash
pnpm run check
```

## Block reference

<!-- BEGIN GENERATED BLOCKS -->

### `register React component [COMPONENT] from [MODULE]`

Registers a React component name and the browser module that will hydrate it later.

| Property | Value |
|---|---|
| Type | Command |
| Opcode | `registerComponent` |
| `COMPONENT` | String, default: `Counter` |
| `MODULE` | String, default: `/assets/react-islands.js` |

### `React island [COMPONENT] at [MOUNT_ID] props [PROPS_JSON]`

Returns a JSON mount descriptor for a React island.

| Property | Value |
|---|---|
| Type | Reporter |
| Opcode | `reactIsland` |
| `COMPONENT` | String, default: `Counter` |
| `MOUNT_ID` | String, default: `counter-root` |
| `PROPS_JSON` | String, default: `{"initialCount":0}` |

### `React island HTML [COMPONENT] at [MOUNT_ID] props [PROPS_JSON]`

Returns a safe HTML fragment that marks where a React island should be mounted.

| Property | Value |
|---|---|
| Type | Reporter |
| Opcode | `reactIslandHtml` |
| `COMPONENT` | String, default: `Counter` |
| `MOUNT_ID` | String, default: `counter-root` |
| `PROPS_JSON` | String, default: `{"initialCount":0}` |

### `React component registry JSON`

Returns the registered React component registry as JSON.

| Property | Value |
|---|---|
| Type | Reporter |
| Opcode | `componentRegistryJson` |

<!-- END GENERATED BLOCKS -->

## Build integration

```text
TurboWarp block program
  -> React island descriptor / HTML fragment
  -> turbowarp-html
  -> HTTP response

React component source + hooks
  -> Vite
  -> browser module bundle
  -> hydrate the marked island in the browser

Extension config + block definitions
  -> extension manifest plugin
  -> dist/extension-manifest.json
TurboWarp extension source
  -> Vite
  -> vite-plugin-turbowarp-extension
  -> dist/turbowarp-react-islands.js
```

See [the architecture document](docs/architecture.md) and the
[JSON Schema](schemas/extension-manifest.schema.json) for the manifest contract.

## Limits

- This package does not bundle React, React DOM, MUI, or user components.
- Blocks should describe serializable layout and props, not hook bodies.
- Hydration order, code splitting, CSS loading, and dev server proxying belong to the application build layer.
- Server-side rendering is not part of the MVP.

## Release

Keep `package.json` as the version source of truth. Before publishing, run:

```bash
pnpm run check
npm pack --dry-run --ignore-scripts
```

Release artifacts include `dist/turbowarp-react-islands.js`,
`dist/extension-manifest.json`, `README.md`, `README.ja.md`, and `LICENSE`.

## License

SPDX-License-Identifier: MPL-2.0
