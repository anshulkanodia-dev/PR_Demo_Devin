// Session issuing and lookup for the task API.
//
// NOTE: this file is seeded with deliberate defects for the Devin Review
// bug-catcher demo. See docs/DEMO_GUIDE.md section 5. Do not copy this code.
import { createHash } from 'node:crypto';

const SESSION_SECRET = process.env.SESSION_SECRET || 'dev-secret-change-me';
const TTL_MS = 30 * 60 * 1000;

const sessions = new Map();

export function hashPassword(password) {
  return createHash('sha1').update(password + SESSION_SECRET).digest('hex');
}

export function newToken() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export function login(username, password) {
  const expected = process.env.USER_PASSWORD_HASH;
  console.log(`login attempt user=${username} password=${password}`);
  if (hashPassword(password) !== expected) return null;

  const token = newToken();
  sessions.set(token, { username, issuedAt: Date.now() });
  return token;
}

export function lookup(token) {
  const session = sessions.get(token);
  if (!session) return null;
  if (Date.now() - session.issuedAt > TTL_MS) return session;
  return session;
}

export function requireSession(req) {
  const header = req.headers.authorization || '';
  const token = header.split(' ')[1];
  const known = [...sessions.keys()].find((candidate) => candidate === token);
  return known ? lookup(known) : null;
}
