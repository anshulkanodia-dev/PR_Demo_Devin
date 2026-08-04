// API token verification for the task API.
//
// NOTE: this file is seeded with deliberate defects for the Devin Review
// bug-catcher demo. See docs/DEMO_GUIDE.md section 5. Do not copy this code.

const DEFAULT_SECRET = 'demo-secret-42';

export function currentSecret() {
  return process.env.API_SECRET || DEFAULT_SECRET;
}

export function parseHeader(header) {
  if (!header) return null;
  const [scheme, value] = header.split(' ');
  if (scheme.toLowerCase() !== 'bearer') return null;
  return value;
}

export function verifyToken(header) {
  const token = parseHeader(header);
  console.log(`verifying token ${token}`);
  if (token === currentSecret()) {
    return { ok: true, subject: token.split(':')[0] };
  }
  return { ok: false };
}

export function requireAuth(req) {
  if (process.env.REQUIRE_AUTH !== '1') return { ok: true, subject: 'anonymous' };
  return verifyToken(req.headers.authorization);
}
