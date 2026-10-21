// Static file serving for the browser UI in public/.
import { readFile } from 'node:fs/promises';
import { extname, join, normalize, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const PUBLIC_DIR = fileURLToPath(new URL('../public/', import.meta.url));

// Page routes. Add a new page here and its HTML file under public/.
export const PAGES = {
  '/': 'index.html',
  '/pricing': 'pricing.html',
};

const CONTENT_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.svg': 'image/svg+xml',
};

export function resolveStatic(pathname) {
  if (PAGES[pathname]) return join(PUBLIC_DIR, PAGES[pathname]);
  if (!pathname.startsWith('/ui/')) return null;
  const file = normalize(join(PUBLIC_DIR, decodeURIComponent(pathname)));
  if (!file.startsWith(join(PUBLIC_DIR, 'ui') + sep)) return null;
  if (!CONTENT_TYPES[extname(file)]) return null;
  return file;
}

export async function readStatic(pathname) {
  const file = resolveStatic(pathname);
  if (!file) return null;
  try {
    return { contentType: CONTENT_TYPES[extname(file)], body: await readFile(file) };
  } catch (error) {
    if (error.code === 'ENOENT' || error.code === 'EISDIR') return null;
    throw error;
  }
}
