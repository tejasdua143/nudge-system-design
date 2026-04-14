#!/usr/bin/env node


const http = require("http");
const fs = require("fs");
const path = require("path");
const url = require("url");

const PORT = 8000;
const DOCS_DIR = path.join(__dirname, "docs");

const MIME_TYPES = {
    ".html": "text/html",
    ".css": "text/css",
    ".js": "application/javascript",
    ".json": "application/json",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".gif": "image/gif",
    ".svg": "image/svg+xml",
    ".ico": "image/x-icon",
    ".woff": "font/woff",
    ".woff2": "font/woff2",
    ".ttf": "font/ttf",
    ".eot": "application/vnd.ms-fontobject",
};

function getMimeType(filePath) {
    const ext = path.extname(filePath).toLowerCase();
    return MIME_TYPES[ext] || "application/octet-stream";
}

function serveFile(filePath, res) {
    fs.readFile(filePath, (err, data) => {
        if (err) {
            res.writeHead(404, { "Content-Type": "text/html" });
            res.end("<h1>404 - File Not Found</h1>");
            return;
        }

        const mimeType = getMimeType(filePath);
        res.writeHead(200, { "Content-Type": mimeType });
        res.end(data);
    });
}

function findFile(requestPath) {
    // Remove leading slash
    let filePath = requestPath.replace(/^\//, "");

    // Default to index.html if path is root or empty
    if (filePath === "" || filePath === "/") {
        filePath = "index.html";
    }

    // If it's a directory, look for index.html
    if (!path.extname(filePath)) {
        const indexPath = path.join(DOCS_DIR, filePath, "index.html");
        if (fs.existsSync(indexPath)) {
            return indexPath;
        }
        // Try adding .html extension
        const htmlPath = path.join(DOCS_DIR, filePath + ".html");
        if (fs.existsSync(htmlPath)) {
            return htmlPath;
        }
    }

    const fullPath = path.join(DOCS_DIR, filePath);

    // Check if file exists
    if (fs.existsSync(fullPath) && fs.statSync(fullPath).isFile()) {
        return fullPath;
    }

    return null;
}

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const requestPath = parsedUrl.pathname;

    console.log(`${req.method} ${requestPath}`);

    const filePath = findFile(requestPath);

    if (filePath) {
        serveFile(filePath, res);
    } else {
        res.writeHead(404, { "Content-Type": "text/html" });
        res.end(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>404 - Not Found</title>
                <style>
                    body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
                    h1 { color: #1e3a8a; }
                </style>
            </head>
            <body>
                <h1>404 - Page Not Found</h1>
                <p>The requested page "${requestPath}" was not found.</p>
                <p><a href="/">Go to Home</a></p>
            </body>
            </html>
        `);
    }
});

server.listen(PORT, () => {
    console.log(`\n🚀 HTML Documentation Server running!`);
    console.log(`📖 Access at: http://localhost:${PORT}`);
    console.log(`📁 Serving from: ${DOCS_DIR}`);
    console.log(`\nPress Ctrl+C to stop the server\n`);
});
