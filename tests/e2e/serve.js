// Minimal static server for the browser tests, so they run the same on Windows, macOS and Linux.
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join, normalize } from "node:path";

const TYPES = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".webmanifest": "application/manifest+json", ".png": "image/png", ".woff2": "font/woff2", ".txt": "text/plain" };
const root = process.cwd(), port = +(process.env.PORT || 4173);

createServer(async (req, res) => {
  const path = normalize(decodeURIComponent(new URL(req.url, "http://x").pathname)).replace(/^([/\\])+/, "") || "index.html";
  if (path.startsWith("..")) { res.writeHead(403).end(); return; }
  try {
    const body = await readFile(join(root, path));
    res.writeHead(200, { "Content-Type": TYPES[extname(path)] || "application/octet-stream", "Cache-Control": "no-cache" }).end(body);
  } catch { res.writeHead(404).end("Not found"); }
}).listen(port, () => console.log(`Serving on http://localhost:${port}`));
