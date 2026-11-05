import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

// Check the real Astro output so native attribute forwarding cannot regress.
const html = readFileSync(new URL('../dist/index.html', import.meta.url), 'utf8');
const tags = html.match(/<(?:a|button)\b(?:[^"'<>]|"[^"]*"|'[^']*')*>/g) ?? [];
const example = name => {
  const tag = tags.find(tag => tag.includes(`data-example="${name}"`));
  assert.ok(tag, `Missing playground example: ${name}`);
  return tag;
};

test('buttons preserve native semantics and tabindex', () => {
  assert.match(example('default-button'), /^<button\b/);
  assert.match(example('default-button'), /type="button"/);
  assert.match(example('tabindex-button'), /tabindex="-1"/);
  assert.match(example('link'), /^<a\b/);
  assert.match(example('link'), /href="#content"/);
});

test('disabled links cannot navigate and only receive focus when requested', () => {
  for (const name of ['disabled-link', 'focusable-disabled-link']) {
    assert.doesNotMatch(example(name), /\bhref=/);
    assert.match(example(name), /aria-disabled="true"/);
    assert.doesNotMatch(example(name), /aria-disabled="false"/);
    assert.match(example(name), /role="link"/);
  }
  assert.match(example('disabled-link'), /tabindex="-1"/);
  assert.match(example('focusable-disabled-link'), /tabindex="0"/);
});

test('link rows render one native link with a decorative arrow', () => {
  assert.match(example('link-row'), /^<a\b/);
  assert.match(example('link-row'), /href="#content"/);
  const row = html.split(example('link-row'))[1].split('</a>')[0];
  assert.match(row, /コンポーネント概要/);
  assert.match(row, /<svg[^>]+aria-hidden="true"/);
});

test('CTA and editorial sections connect their accessible names to unique headings', () => {
  for (const id of ['cta-example-heading', 'editorial-example-title', 'editorial-example-intro-heading']) {
    assert.equal(html.split(`id="${id}"`).length - 1, 1, `${id} must be unique`);
  }
  assert.match(html, /<section\b[^>]*aria-labelledby="cta-example-heading"/);
  assert.match(html, /<h2\b[^>]*id="cta-example-heading"/);
  assert.match(html, /aria-labelledby="editorial-example-intro-heading"/);
  assert.match(html, /複数の段落を指定できます。/);
  assert.match(html, /文言・画像・リンクは利用側が渡します。/);
});

test('text-media sections preserve the requested DOM reading order', () => {
  for (const [id, first, second] of [
    ['text-media', 'text-media-content', 'text-media-media'],
    ['media-first', 'text-media-media', 'text-media-content'],
  ]) {
    const section = html.split(`id="${id}"`)[1].split('</section>')[0];
    assert.ok(section.includes(`data-slot="${first}"`));
    assert.ok(section.includes(`data-slot="${second}"`));
    assert.ok(section.indexOf(`data-slot="${first}"`) < section.indexOf(`data-slot="${second}"`));
  }
});

test('card rails render a named list and remain readable without hydration', () => {
  assert.match(html, /<ol\b[^>]*aria-label="サンプルカード一覧"/);
  assert.match(html, /サンプル 8/);
  assert.doesNotMatch(html, /<astro-island\b/);
});
