// API token verification for the task API.
import { timingSafeEqual } from 'node:crypto';

export class AuthConfigError extends Error {
  constructor(message) {
    super(message);
    this.name = 'AuthConfigError';
  }
}

export function currentSecret() {
  const secret = process.env.API_SECRET;
  if (!secret) {
    throw new AuthConfigError('API_SECRET must be set to serve authenticated requests');
  }
  return secret;
}

export function parseHeader(header) {
  if (typeof header !== 'string') return null;
  const [scheme, value, ...rest] = header.split(' ');
  if (rest.length > 0) return null;
  if (!value || scheme.toLowerCase() !== 'bearer') return null;
  return value;
}

function equals(a, b) {
  const left = Buffer.from(a, 'utf8');
  const right = Buffer.from(b, 'utf8');
  if (left.length !== right.length) return false;
  return timingSafeEqual(left, right);
}

export function verifyToken(header) {
  const token = parseHeader(header);
  if (!token) return { ok: false };
  if (!equals(token, currentSecret())) return { ok: false };
  return { ok: true, subject: 'api' };
}

// Authentication is on by default. AUTH_DISABLED=1 is an explicit, local-only
// escape hatch for the test suite and the demo CLI.
export function authDisabled() {
  return process.env.AUTH_DISABLED === '1';
}

export function requireAuth(req) {
  if (authDisabled()) return { ok: true, subject: 'anonymous' };
  return verifyToken(req.headers.authorization);
}
