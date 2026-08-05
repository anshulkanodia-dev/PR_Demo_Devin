import test from 'node:test';
import assert from 'node:assert/strict';
import { hashPassword, newToken, login } from '../src/auth/session.js';

test('hashPassword is deterministic', () => {
  assert.equal(hashPassword('hunter2'), hashPassword('hunter2'));
});

test('newToken returns a non-empty string', () => {
  assert.ok(newToken().length > 0);
});

test('login rejects a wrong password', () => {
  process.env.USER_PASSWORD_HASH = hashPassword('correct');
  assert.equal(login('ada', 'wrong'), null);
});

test('login issues a token for the right password', () => {
  process.env.USER_PASSWORD_HASH = hashPassword('correct');
  assert.ok(login('ada', 'correct'));
});
