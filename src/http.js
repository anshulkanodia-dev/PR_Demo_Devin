// HTTP transport over the service layer. Top layer of the demo stack.
import { createServer } from 'node:http';
import {
  ValidationError,
  NotFoundError,
  createTask,
  getTask,
  listTasks,
  completeTask,
  retagTask,
  deleteTask,
} from './service.js';
import { renderHtml, searchTasks, paginate, readAttachment } from './export.js';

function send(res, status, payload) {
  const body = JSON.stringify(payload);
  res.writeHead(status, {
    'content-type': 'application/json',
    'content-length': Buffer.byteLength(body),
  });
  res.end(body);
}

async function readJson(req) {
  const chunks = [];
  let size = 0;
  for await (const chunk of req) {
    size += chunk.length;
    if (size > 64 * 1024) throw new ValidationError('request body too large');
    chunks.push(chunk);
  }
  if (chunks.length === 0) return {};
  try {
    return JSON.parse(Buffer.concat(chunks).toString('utf8'));
  } catch {
    throw new ValidationError('body must be valid JSON');
  }
}

function parseId(raw) {
  const id = Number(raw);
  if (!Number.isInteger(id) || id <= 0) throw new ValidationError('invalid task id');
  return id;
}

function parseBoolean(raw) {
  if (raw === null) return undefined;
  if (raw === 'true') return true;
  if (raw === 'false') return false;
  throw new ValidationError('done must be true or false');
}

async function route(req, url) {
  const segments = url.pathname.split('/').filter(Boolean);

  if (segments[0] === 'export' && req.method === 'GET') {
    let tasks = listTasks();
    const q = url.searchParams.get('q');
    if (q) tasks = searchTasks(tasks, q);
    const page = Number(url.searchParams.get('page') ?? 1);
    return { status: 200, html: renderHtml(paginate(tasks, page)) };
  }

  if (segments[0] === 'attachments' && segments.length === 2 && req.method === 'GET') {
    return { status: 200, text: await readAttachment(segments[1]) };
  }

  if (segments[0] !== 'tasks') return null;

  if (segments.length === 1) {
    if (req.method === 'GET') {
      return {
        status: 200,
        body: listTasks({
          owner: url.searchParams.get('owner') ?? undefined,
          done: parseBoolean(url.searchParams.get('done')),
          tag: url.searchParams.get('tag') || undefined,
        }),
      };
    }
    if (req.method === 'POST') {
      const { title, owner, tags } = await readJson(req);
      return { status: 201, body: createTask({ title, owner, tags }) };
    }
    return null;
  }

  const id = parseId(segments[1]);

  if (segments.length === 2) {
    if (req.method === 'GET') return { status: 200, body: getTask(id) };
    if (req.method === 'DELETE') {
      deleteTask(id);
      return { status: 204, body: null };
    }
    return null;
  }

  if (segments.length === 3 && segments[2] === 'complete' && req.method === 'POST') {
    return { status: 200, body: completeTask(id) };
  }

  if (segments.length === 3 && segments[2] === 'tags' && req.method === 'PUT') {
    const { tags } = await readJson(req);
    if (!Array.isArray(tags)) throw new ValidationError('tags must be an array');
    return { status: 200, body: retagTask(id, tags) };
  }

  return null;
}

export function createApp() {
  return createServer(async (req, res) => {
    const url = new URL(req.url, 'http://localhost');
    try {
      const result = await route(req, url);
      if (!result) return send(res, 404, { error: 'not found' });
      if (result.html !== undefined) {
        res.writeHead(200, { 'content-type': 'text/html' });
        return res.end(result.html);
      }
      if (result.text !== undefined) {
        res.writeHead(200, { 'content-type': 'text/plain' });
        return res.end(result.text);
      }
      if (result.status === 204) {
        res.writeHead(204);
        return res.end();
      }
      return send(res, result.status, result.body);
    } catch (error) {
      if (error instanceof ValidationError) return send(res, 400, { error: error.message });
      if (error instanceof NotFoundError) return send(res, 404, { error: error.message });
      // Never leak internals to the client; the stack stays in the server log.
      console.error(error);
      return send(res, 500, { error: 'internal server error' });
    }
  });
}

export function start(port = Number(process.env.PORT ?? 3000)) {
  const server = createApp();
  server.listen(port, () => console.log(`listening on :${port}`));
  return server;
}
