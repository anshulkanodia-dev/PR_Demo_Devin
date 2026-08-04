import test from 'node:test';
import assert from 'node:assert/strict';
import { parseHeader, verifyToken } from '../src/auth/token.js';

test('parseHeader extracts a bearer token', () => {
  assert.equal(parseHeader('Bearer abc123'), 'abc123');
  assert.equal(parseHeader('Basic abc123'), null);
  assert.equal(parseHeader(''), null);
});

test('verifyToken accepts the configured secret', () => {
  const previous = process.env.API_SECRET;
  process.env.API_SECRET = 'unit-test-secret';
  try {
    assert.equal(verifyToken('Bearer unit-test-secret').ok, true);
    assert.equal(verifyToken('Bearer nope').ok, false);
  } finally {
    if (previous === undefined) delete process.env.API_SECRET;
    else process.env.API_SECRET = previous;
  }
});
