import test from 'node:test';
import assert from 'node:assert/strict';
import {
  AuthConfigError,
  authDisabled,
  currentSecret,
  parseHeader,
  requireAuth,
  verifyToken,
} from '../src/auth/token.js';

function withEnv(vars, run) {
  const previous = {};
  for (const [key, value] of Object.entries(vars)) {
    previous[key] = process.env[key];
    if (value === undefined) delete process.env[key];
    else process.env[key] = value;
  }
  try {
    run();
  } finally {
    for (const [key, value] of Object.entries(previous)) {
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
  }
}

test('parseHeader extracts a bearer token and rejects anything else', () => {
  assert.equal(parseHeader('Bearer abc123'), 'abc123');
  assert.equal(parseHeader('bearer abc123'), 'abc123');
  assert.equal(parseHeader('Basic abc123'), null);
  assert.equal(parseHeader('Bearer'), null);
  assert.equal(parseHeader('Bearer a b'), null);
  assert.equal(parseHeader(''), null);
  assert.equal(parseHeader(undefined), null);
});

test('currentSecret reads API_SECRET and refuses to fall back', () => {
  withEnv({ API_SECRET: 'configured' }, () => {
    assert.equal(currentSecret(), 'configured');
  });
  withEnv({ API_SECRET: undefined }, () => {
    assert.throws(() => currentSecret(), AuthConfigError);
  });
  withEnv({ API_SECRET: '' }, () => {
    assert.throws(() => currentSecret(), AuthConfigError);
  });
});

test('verifyToken accepts only the configured secret', () => {
  withEnv({ API_SECRET: 'unit-test-secret' }, () => {
    assert.deepEqual(verifyToken('Bearer unit-test-secret'), { ok: true, subject: 'api' });
    assert.deepEqual(verifyToken('Bearer nope'), { ok: false });
    assert.deepEqual(verifyToken('Bearer unit-test-secret-longer'), { ok: false });
    assert.deepEqual(verifyToken('malformed'), { ok: false });
    assert.deepEqual(verifyToken(undefined), { ok: false });
  });
});

test('authDisabled only honours an exact opt-out', () => {
  withEnv({ AUTH_DISABLED: '1' }, () => assert.equal(authDisabled(), true));
  withEnv({ AUTH_DISABLED: 'true' }, () => assert.equal(authDisabled(), false));
  withEnv({ AUTH_DISABLED: undefined }, () => assert.equal(authDisabled(), false));
});

test('requireAuth is closed by default and opens only with the escape hatch', () => {
  const request = (authorization) => ({ headers: { authorization } });

  withEnv({ AUTH_DISABLED: undefined, API_SECRET: 'unit-test-secret' }, () => {
    assert.equal(requireAuth(request('Bearer unit-test-secret')).ok, true);
    assert.equal(requireAuth(request('Bearer nope')).ok, false);
    assert.equal(requireAuth(request(undefined)).ok, false);
  });

  withEnv({ AUTH_DISABLED: '1', API_SECRET: undefined }, () => {
    assert.deepEqual(requireAuth(request(undefined)), { ok: true, subject: 'anonymous' });
  });
});
