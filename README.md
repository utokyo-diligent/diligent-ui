# Diligent UI

Astro用の小さなUIパッケージです。動的なUI以外はHTMLとCSSで描画します。

このリポジトリでは、再利用できるUIコンポーネント、デザイントークン、汎用サンプルを管理します。団体の紹介文、活動記録、会員数、ロゴ、写真などは、掲載するサイトのリポジトリで管理します。ナビゲーションやフォントも利用側で設定します。

## 開発と確認

```sh
npm ci
npm run dev    # http://localhost:4322
npm run check
npm run build  # コンポーネントの実行例をビルド
npm test       # ビルド済みHTMLのネイティブ属性・無効状態を検証
```

`playground/src/pages/index.astro` が実行可能な使用例です。ボタンの通常・無効・リンク状態、1枚と複数枚の画像、カルーセルの自動再生を確認できます。

## 別のAstroリポジトリで使う

ローカルで開発する場合は、UI側で `npm ci` を実行し、利用側からUIリポジトリのパスを指定します。

```sh
# 利用するプロジェクトで実行
npm install ../diligent-ui
```

```astro
---
import { PageHeading, ContentSection, FactList, Button } from '@utokyo-diligent/ui';
import '@utokyo-diligent/ui/styles.css';
---
<PageHeading>ページタイトル</PageHeading>
<ContentSection id="overview" title="概要">
  <p>本文をここに書きます。</p>
  <FactList items={[{ label: '開催形式', value: '対面' }]} />
</ContentSection>
<Button href="/contact/" variant="outline">お問い合わせ</Button>
```

利用側のAstro設定には `@tailwindcss/vite` が必要です。Tailwind CSS v4を使います。`styles.css` はプリフライト、Starwindの基礎スタイル、トークン、パッケージ内ソースの検出指定を含むので、グローバルCSSから一度だけ読み込んでください。Tailwind v3・React・Vueでの利用には対応していません。

```js
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
export default defineConfig({ vite: { plugins: [tailwindcss()] } });
```

隣接ディレクトリに依存させずに渡す場合は、UI側で `npm pack` を実行し、生成した `.tgz` を利用側で `npm install /path/to/utokyo-diligent-ui-0.1.0.tgz` します。配布ファイルの一覧は `npm pack --dry-run` で確認できます。

## ソースの配置

公開コンポーネントは `src/components/` に1つずつ置き、`src/index.ts` からエクスポートします。マークアップとその部品のスタイルは同じ Astro ファイルで管理します。Button のバリアントは `button-variants.ts`、カルーセルの操作は `src/behaviors/image-carousel.ts`、操作部のマークアップは `ImageCarouselControls.astro` が担当します。

## 公開コンポーネント

| コンポーネント | 入力・役割 |
| --- | --- |
| `Button` | `variant`・`size`・ネイティブ属性。`href` でリンク。`disabled` で実行・移動を無効化 |
| `TextLink` | テキストリンク。アイコンは `start` または `end` スロット。別タブを開く場合は `target="_blank"` と、必要に応じて `newTabLabel` を指定 |
| `LinkRow` | `href`・`label`・任意の `eyebrow` と `description`。案内や目次を行全体が押せるリンクとして表示 |
| `PageHeading` | スロットを `h1` として描画。ページ上部の余白と区切り線 |
| `SectionHeading` | `id`・`title`。任意のアクションをスロットに配置 |
| `ContentSection` | `id`・`title`。見出しの下に本文を配置 |
| `FactList` | `items: { label, value }[]`。`dl` による情報一覧 |
| `PhotoGallery` | `photos: { image, alt, caption? }[]`。1枚は全幅、複数枚は2列 |
| `ImageCarousel` | `slides: { image, alt, brightness? }[]`・`label`・`autoplay`・`sizes` |

画像はAstroのローカル `ImageMetadata` を渡します。ラスター画像はWebPに最適化し、元画像より大きく生成しません。SVGはそのまま使います。ギャラリーとカルーセルの `sizes` は利用側のコンテナ幅に合わせて指定できます。

カルーセルは5秒ごとに切り替わり、フェード・再生/停止・ドット選択・左右キー・スワイプに対応します。マウスを重ねている間とタブの非表示中は自動再生を一時停止します。キーボードフォーカス・左右キー操作・動きを減らす設定で停止した場合は、再生ボタンで再開できます。1枚の場合とJavaScript無効時は操作部を表示しません。

独自のマークアップで同じ動作を使う場合は、`@utokyo-diligent/ui/behaviors/image-carousel` の `setupImageCarousel(root)` を各ルートで実行します。戻り値の関数でタイマーとイベントを解除でき、設定済みのルートを再度渡すと同じ解除関数を返します。ルートの `data-autoplay` と、子要素の `data-viewport`、`data-slide`、`data-controls`、`data-dot`、`data-status`、`data-toggle` は ImageCarousel と同じ構造で指定します。切り替えボタンに `data-play-label` と `data-pause-label` を設定すると、操作名を翻訳できます。

色は `--background`・`--foreground`・`--card`・`--muted-foreground`・`--border` などを利用側のCSSで上書きできます。ページ見出しは `--page-heading-leading`・`--page-heading-tracking` で調整できます。各コンポーネントには `data-slot` を付けています。追加のバリエーションは必要になった時点で増やします。

Starwind由来のコードは `src/components/Button.astro`、`src/components/button-variants.ts` と `src/styles/starwind.css`、設定は `starwind.config.json` にあります。出典は [Starwind UI](https://starwind.dev/)（MIT）です。

## Design tokens

Primitive、Semantic、Component-specific の3層を使います。既定値と共通の役割は [tokens.css](src/styles/tokens.css)、コンポーネント固有の既定値は各コンポーネントが参照する CSS のフォールバックで定義します。設計の参考は [LY Corporation の3段階トークン構造](https://techblog.lycorp.co.jp/ko/a-flexible-design-system-using-3-tier-tokens) です。

| 層 | 責務 | 色 | タイポグラフィ |
| --- | --- | --- | --- |
| Primitive | 値を定義する | `--primitive-color-gray-950`（#111111） | `--primitive-font-size-display`（`clamp(32px, 3.4vw, 52px)`） |
| Semantic | 共通の役割に値を割り当てる | `--primary`（`--primitive-color-gray-950`） | `--text-page-title-size`（`--primitive-font-size-display`） |
| Component-specific | コンポーネントの部位・状態・サイズに役割を割り当てる | `--button-primary-background`（既定値は `--primary`） | `--page-heading-size`（既定値は `--text-page-title-size`） |

テーマ全体で色やフォントを変えるときは、テーマのスコープで Semantic トークンを上書きします。特定の部品だけを変えるときは、その要素か親要素で Component-specific トークンを指定します。新しい数値や色コードを追加するときは Primitive に置き、既存の値を先に確認します。

### Component-specific

| コンポーネント | トークンと既定の参照先 |
| --- | --- |
| Button | `--button-<variant>-background`、`--button-<variant>-text-color`、`--button-<variant>-focus-color` はバリアントの色の役割に対応。`--button-<size>-font-size` と `--button-<size>-line-height` は `--text-action-<size>-*`（sm・md・lg）、`--button-font-weight` は `--text-action-weight`（500）。`--button-font-family` は親要素のフォントを継承 |
| PageHeading / SectionHeading | `--page-heading-*` / `--section-heading-*` の size、weight、line-height、letter-spacing が見出しの組版を制御。ページ見出しの従来の `--page-heading-leading` / `--page-heading-tracking` も利用可能 |
| ContentSection / FactList | `--content-section-title-*` は本文内見出し、`--fact-list-size` と `--fact-list-line-height` は本文の設定を参照。`--fact-list-label-color` は補足色 |
| TextLink / PhotoGallery | `--text-link-size` と `--photo-gallery-caption-size` は `--text-note-size`（13px）。リンクの色は継承し、キャプションは補足色 |
| LinkRow | `--link-row-label-size` は本文内見出し、`--link-row-arrow-color` は主要アクション色を参照。`--link-row-padding` で行の余白を調整 |
| ImageCarousel | `--image-carousel-background`、`--image-carousel-control-color`、`--image-carousel-focus-color` は背景・操作・フォーカスの色を参照 |

CSS変数は意味と用途で選び、個々のコンポーネントや利用側から上書きできます。フォントファミリーは利用側が設定します。以下はライトテーマの初期値です。

### Text

| 役割 | トークン | 初期値 | 用途 |
| --- | --- | --- | --- |
| Page title | `--text-page-title-size`, `--text-page-title-weight`, `--text-page-title-leading` | `clamp(32px, 3.4vw, 52px)`, 500, 1.4 | ページの主見出し。767px以下は `clamp(27px, 7vw, 42px)` |
| Section title | `--text-section-title-size`, `--text-section-title-weight`, `--text-section-title-leading`, `--text-section-title-tracking` | `clamp(28px, 3vw, 40px)`, 500, 1.5, -0.035em | 主要セクションの見出し |
| Content title | `--text-content-title-size`, `--text-content-title-weight`, `--text-content-title-leading` | `clamp(22px, 2vw, 28px)`, 500, 1.5 | 本文内のセクション見出し |
| Body | `--text-body-size`, `--text-body-leading` | 15px, 1.8 | 本文・情報一覧 |
| Body font | `--font-body` | sans-serif | 本文のフォント。利用側のCSSで上書き可能 |
| Caption | `--text-caption-size`, `--text-caption-leading` | 12px, 1.5 | 補足・注記 |
| Note | `--text-note-size`, `--text-note-leading` | 13px, 1.7 | 写真の説明など、やや長い補足 |
| Action | `--text-action-<size>-size`, `--text-action-<size>-leading`, `--text-action-weight` | 0.875 / 1 / 1.125rem、各サイズの行間、500 | ボタンなどの操作ラベル |

`PageHeading`、`SectionHeading`、`ContentSection`、`FactList` は対応するトークンを使用します。見た目の役割とHTMLの見出し階層は別です。本文や注記にも必要に応じて `font-size: var(--text-body-size)` のように指定してください。

### Color

| トークン | 初期値 | 用途・組み合わせ |
| --- | --- | --- |
| `--background` / `--foreground` | #ffffff / #111111 | ページ背景と通常の文字 |
| `--card` / `--card-foreground` | #ffffff / #111111 | カードの背景と文字 |
| `--surface-subtle` | #f7f7f7 | 本文をまとめる薄い背景。通常の文字は `--foreground` |
| `--control-foreground` | #111111 | カルーセルの再生・停止アイコンとインジケーター |
| `--primary` / `--primary-foreground` | #111111 / #ffffff | 主要アクションとその文字 |
| `--primary-accent` | #333333 | 主要アクションの強調・ホバー |
| `--secondary` / `--secondary-foreground` | #efefef / #111111 | 補助アクションの背景と文字 |
| `--muted` / `--muted-foreground` | #efefef / #626262 | 控えめな背景・補足文字。補足文字は `--background` 上でも使用 |
| `--accent` / `--accent-foreground` | #eeeeee / #111111 | 強調・ホバー背景とその文字 |
| `--border` | #d8d8d8 | 区切り線と枠線 |
| `--outline` | #111111 | フォーカスのアウトライン |

Starwindが提供するその他の色（`--info`、`--success`、`--warning`、`--error` 等）はStarwindの初期値です。カスタマイズする場合は背景と文字を対にして、使用先のコントラストを確認してください。トークンは色だけを示し、リンクや見出しなどのHTML上の意味を付与するものではありません。

### 利用時の判断と実装例

人とコーディングエージェントの双方が、まず用途に合う既存トークンを選んでください。同じ色値でも役割が異なる場合は別のトークンを使います。新しい値は既存の役割で表せない場合に限って追加し、用途と値をこの表とプレビューに記録します。

- ページ背景には `--background`、その上の通常の文字には `--foreground` を使います。補足文字には `--muted-foreground` を使います。
- 主要アクションのテーマ色は `--primary` と `--primary-foreground` を組み合わせます。主要ボタンだけの色を変える場合は `--button-primary-background` と `--button-primary-text-color` を使います。
- テキストの視覚的な役割と `h1`〜`h6` の文書構造は別に判断します。見出しのレベルはページ内の階層に合わせます。
- トークンを上書きするときは、背景と文字、フォーカス表示のコントラストを実際の組み合わせで確認します。固定色を新しく書く前に既存の役割を確認してください。

```css
.article-summary {
  background: var(--card);
  color: var(--card-foreground);
  border: 1px solid var(--border);
  font-size: var(--text-body-size);
  line-height: var(--text-body-leading);
}
.article-summary small {
  color: var(--muted-foreground);
  font-size: var(--text-caption-size);
  line-height: var(--text-caption-leading);
}
```

トークンの定義元は `src/styles/tokens.css`、プレビューの説明は `playground/src/components/TokenReference.astro` にあります。プレビューの色コードと通常時の文字設定値は定義元から取得します。

## ライセンス

[MIT License](LICENSE)。Starwind UI 由来のコードの著作権表示も同ファイルに記載しています。
