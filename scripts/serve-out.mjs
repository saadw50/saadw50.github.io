// Preview the static export locally the way GitHub Pages serves it:
// gzip for text files and Cache-Control: max-age=600.
//   npm run build && npm run preview      -> http://localhost:8766
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { gzipSync } from "node:zlib";
import { extname, join, normalize, resolve } from "node:path";

const ROOT = resolve(process.argv[2] ?? "out");
const PORT = Number(process.argv[3] ?? process.env.PORT ?? 8766);
const MIME = {
  ".html": "text/html; charset=utf-8", ".css": "text/css; charset=utf-8", ".js": "text/javascript; charset=utf-8",
  ".json": "application/json", ".xml": "application/xml", ".txt": "text/plain; charset=utf-8", ".svg": "image/svg+xml",
  ".jpg": "image/jpeg", ".png": "image/png", ".webp": "image/webp", ".ico": "image/x-icon", ".pdf": "application/pdf",
  ".woff2": "font/woff2",
};
const TEXT = new Set([".html", ".css", ".js", ".json", ".xml", ".txt", ".svg"]);

async function resolveFile(urlPath) {
  const clean = normalize(decodeURIComponent(urlPath)).replace(/^([/\\])+/, "");
  const base = join(ROOT, clean);
  if (!base.startsWith(ROOT)) return null;
  for (const f of [base, join(base, "index.html"), base + ".html"]) {
    try { if ((await stat(f)).isFile()) return f; } catch { /* try next */ }
  }
  return null;
}

createServer(async (req, res) => {
  const path = new URL(req.url ?? "/", "http://localhost").pathname;
  let file = await resolveFile(path);
  let status = 200;
  if (!file) { file = join(ROOT, "404.html"); status = 404; }
  try {
    const ext = extname(file).toLowerCase();
    let body = await readFile(file);
    const headers = { "Content-Type": MIME[ext] ?? "application/octet-stream", "Cache-Control": "max-age=600" };
    if (TEXT.has(ext) && /\bgzip\b/.test(req.headers["accept-encoding"] ?? "")) {
      body = gzipSync(body, { level: 9 });
      headers["Content-Encoding"] = "gzip";
      headers["Vary"] = "Accept-Encoding";
    }
    headers["Content-Length"] = body.length;
    res.writeHead(status, headers);
    res.end(req.method === "HEAD" ? undefined : body);
  } catch {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Not found");
  }
}).listen(PORT, "127.0.0.1", () => console.log(`Serving ${ROOT} at http://localhost:${PORT}`));
