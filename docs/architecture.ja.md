# アーキテクチャ

[English](architecture.md)

## 目的

`turbowarp-http-server-react` は、TurboWarpで書いたHTTP/HTML生成ロジックからReact componentを直接実行するのではなく、React islandを埋め込むための中間記述を作るパッケージです。

教育的には、ブロックプログラミングからReactプログラミングへ段階的に移行する橋渡しを狙います。実用面では、MUIなどの成熟したReact componentを使いながら、ページ構成やprops指定の一部をブロックで扱えるようにします。

## 役割分担

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

TurboWarp側は宣言的な接続面を担当します。React component、hooks、effects、状態更新、MUI theme、CSS、bundle分割はTypeScript/Vite側に置きます。

## island descriptor

descriptorは次の形のJSONです。

```json
{
  "kind": "react-island",
  "version": 1,
  "component": "Counter",
  "mountId": "counter-root",
  "props": {"initialCount": 0}
}
```

`component` はregistryに登録されたReact component名です。`mountId` はHTML内のmount先IDです。`props` はJSON objectに限定します。

## HTML断片

`reactIslandHtml` ブロックは、次のようなHTML断片を返します。

```html
<div id="counter-root" data-tw-react-island="Counter">
  <script type="application/json" data-tw-react-props>{"initialCount":0}</script>
</div>
```

この断片を `turbowarp-html` でページに組み込み、ブラウザ側bundleが `data-tw-react-island` を探してhydrateします。MVPではhydrate scriptそのものはこのパッケージに含めません。

## component registry

`registerComponent` ブロックは、component名とブラウザmodule specifierを登録します。

```json
[
  {"component": "Counter", "module": "/assets/react-islands.js"}
]
```

このregistryは、後続のCLIやVite pluginが「どのcomponentをどのbundleからhydrateするか」を決めるための入力になります。

## Vite dev/build連携

想定する開発体験は次の通りです。

- TurboWarpでHTML構造とReact island配置を書く。
- VS CodeでReact componentとhooksを書く。
- Vite dev serverがReact側bundleを提供する。
- `turbowarp-http-server` のHTMLレスポンスにViteの開発用scriptまたはbuild済みassetを組み込む。

このリポジトリのMVPは、Vite pluginやdev server proxyまでは実装しません。ただし、descriptorとregistryの形を固定することで、後続パッケージがその上にbuild連携を実装できるようにします。

## 限界

- TurboWarpブロックからhooks本体は生成しません。
- propsはJSON objectだけです。関数やイベントhandlerはcomponent側で定義します。
- React/MUIはpeer application側の依存です。この拡張bundleには同梱しません。
- SSR、streaming、partial hydration最適化はMVP外です。
- island descriptorを信頼境界として扱い、HTML生成時は属性とJSON scriptをエスケープします。
