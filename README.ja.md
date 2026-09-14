# TurboWarp React Islands

[English](README.md)

`turbowarp-http-server` と `turbowarp-html` で作るHTMLレスポンスの一部に、Reactコンポーネントを island として埋め込むためのTurboWarp拡張とTypeScriptヘルパーです。

## 位置づけ

このパッケージでは、Reactをアプリ全体の記述言語ではなく「リッチなGUI部品」として扱います。想定する役割分担は次の通りです。

- TurboWarpブロック: どのReactコンポーネントを、どのmount先に、どのJSON propsで配置するかを宣言する。
- React/MUIなど: 複雑な入力部品、表、ダイアログ、テーマ付きUIなどを実装する。
- TypeScript/VS Code: hooks、effects、validation、API連携、状態更新ロジックを書く。
- `turbowarp-html`: ブロックが生成したHTML断片をHTTPレスポンスに組み込む。
- Vite/CLI: Reactコンポーネントをブラウザでhydrateするためのbundleを作る。

MVPでは、TurboWarp内でReactを実行しきることはしません。まずは「ブロックからReact island埋め込み記述を生成する」範囲に絞ります。

## インストール

```bash
pnpm add --save-exact @kubohiroya/turbowarp-react-islands@0.2.0
```

## できること

- React component名とブラウザmodule specifierをregistryへ登録する。
- TurboWarp reporterブロックからReact islandのJSON mount descriptorを返す。
- `data-tw-react-island` とJSON propsを含む安全なHTML断片を返す。
- `dist/extension-manifest.json` として拡張API契約を決定的に出力する。
- island生成ロジックをTurboWarpに依存しないTypeScript関数としてテストする。

## 要件と注意

- Node.js 22以上
- Corepack経由のpnpm
- TurboWarp
- HTTP/HTML合成に使う `turbowarp-http-server` と `turbowarp-html`
- 実際にhydrateするアプリ側bundleに含まれるReact/React DOM

propsはJSONに限定します。関数、class instance、DOM node、hooksの実体などはブロックから直接渡しません。

## 開発

```bash
corepack enable
pnpm install --frozen-lockfile
pnpm run check
```

継続ビルド:

```bash
pnpm run dev
```

## ブロック

- `register React component [COMPONENT] from [MODULE]`
- `React island [COMPONENT] at [MOUNT_ID] props [PROPS_JSON]`
- `React island HTML [COMPONENT] at [MOUNT_ID] props [PROPS_JSON]`
- `React component registry JSON`

## 重要な動作

```text
TurboWarp block program
  -> React island descriptor / HTML fragment
  -> turbowarp-html
  -> HTTP response

React component source + hooks
  -> Vite
  -> browser module bundle
  -> browser hydrate

TurboWarp extension source
  -> Vite
  -> vite-plugin-turbowarp-extension
  -> dist/turbowarp-react-islands.js
```

React componentやMUI componentは通常のTypeScript/Reactプロジェクトとして書きます。ブロック側は、component名、mount ID、JSON propsといった宣言的な接続面に集中します。

## 限界

- このパッケージ自体はReact、React DOM、MUI、利用者のcomponentをbundleしません。
- hooksの本体をブロックで書くことはMVPの範囲外です。
- hydration順序、code splitting、CSS読み込み、Vite dev server連携はアプリ側build層の責務です。
- server-side renderingはMVPには含めません。

## ライセンス

SPDX-License-Identifier: MPL-2.0
