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
