# TurboWarp React Islands

<img src="assets/block-icon.svg" alt="" width="48" height="48">

[English](README.md) | 日本語

`turbowarp-http-server` と `turbowarp-html` で作るHTMLレスポンスの一部に、Reactコンポーネントを island として埋め込むためのTurboWarp拡張とTypeScriptヘルパーです。

## 実行できるサンプル

[**TurboWarp Editorでデモを開く**](https://turbowarp.org/editor?project_url=https%3A%2F%2Fkubohiroya.github.io%2Fturbowarp-react-islands%2Fsamples%2Fdescribe-counter-island.sb3) · [SB3をダウンロード](https://kubohiroya.github.io/turbowarp-react-islands/samples/describe-counter-island.sb3)

**Allow**で許可し、緑の旗を押します。
3つの確認結果がtrueになります。変数一覧には実際のJSON descriptor・HTML・registry全文も保持します。宣言生成のみのデモでReactの描画やhydrationは行いません。Counterのmoduleパスは登録する文字列であり、このデモでは取得しません。React本体・HTTPホスト・外部bundleは不要です。



元データと期待結果: [`samples/README.md`](samples/README.md).
`pnpm run samples:build` / `pnpm run samples:check` / `pnpm run pages:build`

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
pnpm add --save-exact @kubohiroya/turbowarp-react-islands@0.5.0
```

## できること

- React component名とブラウザmodule specifierをregistryへ登録する。
- TurboWarp reporterブロックからReact islandのJSON mount descriptorを返す。
- `data-tw-react-island` とJSON propsを含む安全なHTML断片を返す。
- `dist/extension-manifest.json` として拡張API契約を決定的に出力する。
- island生成ロジックをTurboWarpに依存しないTypeScript関数としてテストする。

## 要件と注意

- Node.js 24以上
- Corepack経由のpnpm
- TurboWarp
- HTTP/HTML合成に使う `turbowarp-http-server` と `turbowarp-html`
- 実際にhydrateするアプリ側bundleに含まれるReact/React DOM

propsはJSONに限定します。関数、class instance、DOM node、hooksの実体などはブロックから直接渡しません。

## 開発

```bash
npm install --global corepack@latest
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
