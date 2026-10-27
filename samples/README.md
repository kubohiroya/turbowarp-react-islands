# React Islandsの最小デモ

- [TurboWarp Editor](https://turbowarp.org/editor?project_url=https%3A%2F%2Fkubohiroya.github.io%2Fturbowarp-react-islands%2Fsamples%2Fdescribe-counter-island.sb3) / [SB3](https://kubohiroya.github.io/turbowarp-react-islands/samples/describe-counter-island.sb3)
- 操作: **Allow**で許可し、緑の旗を押します。
- 期待結果: 3つの確認結果がtrueになります。変数一覧には実際のJSON descriptor・HTML・registry全文も保持します。宣言生成のみのデモでReactの描画やhydrationは行いません。Counterのmoduleパスは登録する文字列であり、このデモでは取得しません。React本体・HTTPホスト・外部bundleは不要です。
- 設定: 追加設定は不要です。

`manifest.json`に配信先・拡張ID・sandbox条件・起動設定・期待値を記録しています。`describe-counter-island/project.json`と自作`backdrop.svg`を編集し、`.nvmrc`指定のNode.jsで再生成してください。生成に追加依存はありません。全文出力はVariablesで表示できます。

```bash
pnpm run samples:build
pnpm run samples:check
pnpm run pages:build
```

生成したSB3もコミットします。Pagesは既存docs・dist・SB3を`_site/`へまとめます。unsandboxed拡張は検証対象JSをSB3へ同梱し、通常の同意画面で許可します。sandbox互換拡張はPagesのJSを参照します。緑の旗で入力から毎回結果を生成します。停止後の再実行も可能です。切戻しはこのPRをrevertしPagesを再配信します。
