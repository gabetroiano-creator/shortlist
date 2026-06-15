// Zero-dep tests for the list-health engine. Run: node --test
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { classifyAdmissionChance, gradeList } from './listHealth.mjs';

test('ultra-selective school is a reach for everyone, even high scorers', () => {
  const r = classifyAdmissionChance({
    admitRate: 4, studentSat: 1580, satP25: 1500, satP75: 1570,
  });
  assert.equal(r.tier, 'reach');
  assert.equal(r.basis, 'scores + selectivity');
});

test('strong scores at a moderately selective school lift the projection', () => {
  const r = classifyAdmissionChance({
    admitRate: 40, studentSat: 1500, satP25: 1300, satP75: 1450,
  });
  assert.ok(r.projected > 40, 'high scorer should beat the base admit rate');
  assert.ok(['target', 'likely'].includes(r.tier));
});

test('test-optional school (no range) falls back to selectivity only', () => {
  const r = classifyAdmissionChance({ admitRate: 55, studentSat: 1400 });
  assert.equal(r.basis, 'selectivity only');
  assert.equal(r.projected, 55);
  assert.equal(r.tier, 'likely');
});

test('no student scores => selectivity only, no crash', () => {
  const r = classifyAdmissionChance({ admitRate: 80 });
  assert.equal(r.basis, 'selectivity only');
  assert.equal(r.tier, 'safety');
});

test('missing admit rate => unknown, never a fake number', () => {
  const r = classifyAdmissionChance({ studentSat: 1400 });
  assert.equal(r.tier, 'unknown');
  assert.equal(r.projected, null);
  assert.equal(r.projectedLabel, '—');
});

test('projected label is always an estimate (~), never bare precision', () => {
  const r = classifyAdmissionChance({ admitRate: 35 });
  assert.match(r.projectedLabel, /^~\d+%$/);
});

test('all-reaches list is not balanced and warns about a safety', () => {
  const g = gradeList([{ tier: 'reach' }, { tier: 'reach' }, { tier: 'reach' }]);
  assert.equal(g.balanced, false);
  assert.match(g.verdict, /safety/i);
});

test('a balanced list reads as balanced', () => {
  const g = gradeList([
    { tier: 'reach' }, { tier: 'target' }, { tier: 'likely' }, { tier: 'safety' },
  ]);
  assert.equal(g.balanced, true);
  assert.match(g.verdict, /balanced/i);
});

test('top-heavy list (mostly reaches, one safety) flags top-heavy', () => {
  const g = gradeList([
    { tier: 'reach' }, { tier: 'reach' }, { tier: 'reach' },
    { tier: 'reach' }, { tier: 'target' }, { tier: 'safety' },
  ]);
  assert.equal(g.balanced, false);
  assert.match(g.verdict, /top-heavy/i);
});

test('empty list asks the student to add schools', () => {
  const g = gradeList([]);
  assert.equal(g.balanced, false);
  assert.match(g.verdict, /add/i);
});

test('counts ignore unknown-tier schools but keep total', () => {
  const g = gradeList([{ tier: 'safety' }, { tier: 'unknown' }]);
  assert.equal(g.counts.safety, 1);
  assert.equal(g.total, 2);
});
