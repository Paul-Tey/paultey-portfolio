import { createReadStream, existsSync, statSync } from "node:fs";
import { createServer } from "node:http";
import { extname, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const host = "127.0.0.1";
const port = 4173;
const distDirectory = resolve(fileURLToPath(new URL("../dist", import.meta.url)));
const notFoundPath = resolve(distDirectory, "404.html");
const contentTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".pdf": "application/pdf",
  ".png": "image/png",
  ".svg": "image/svg+xml; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
};

function resolveRequestPath(requestUrl) {
  const pathname = decodeURIComponent(new URL(requestUrl, `http://${host}:${port}`).pathname);
  const relativePath = pathname === "/" ? "index.html" : pathname.replace(/^\/+/, "");
  const filePath = resolve(distDirectory, relativePath);

  if (filePath !== distDirectory && !filePath.startsWith(`${distDirectory}${sep}`)) {
    return null;
  }

  return filePath;
}

function sendFile(request, response, filePath, statusCode) {
  const contentType = contentTypes[extname(filePath).toLowerCase()] ?? "application/octet-stream";
  response.writeHead(statusCode, {
    "Content-Type": contentType,
    "Content-Length": statSync(filePath).size,
    "Cache-Control": "no-store",
  });

  if (request.method === "HEAD") {
    response.end();
    return;
  }

  createReadStream(filePath).pipe(response);
}

const server = createServer((request, response) => {
  if (!request.url || !["GET", "HEAD"].includes(request.method ?? "")) {
    response.writeHead(405, { Allow: "GET, HEAD" });
    response.end();
    return;
  }

  let filePath;

  try {
    filePath = resolveRequestPath(request.url);
  } catch {
    response.writeHead(400);
    response.end();
    return;
  }

  if (filePath && existsSync(filePath) && statSync(filePath).isFile()) {
    sendFile(request, response, filePath, 200);
    return;
  }

  sendFile(request, response, notFoundPath, 404);
});

server.listen(port, host, () => {
  console.log(`Serving the production build at http://${host}:${port}`);
});

function closeServer() {
  server.close(() => process.exit(0));
}

process.on("SIGINT", closeServer);
process.on("SIGTERM", closeServer);
