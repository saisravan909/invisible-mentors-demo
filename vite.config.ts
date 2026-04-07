import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import type { IncomingMessage, ServerResponse } from "http";

const port = parseInt(process.env.PORT || "3000");

async function triggerCI(text: string) {
  const token = process.env.GITHUB_TOKEN;
  if (!token) throw new Error("GITHUB_TOKEN not set");
  const owner = "saisravan909";
  const repo = "Invisible-Mentors";
  const filePath = "docs/demo-snippet.md";

  let sha: string | undefined;
  try {
    const getResp = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`,
      { headers: { Authorization: `token ${token}`, "User-Agent": "im-demo" } }
    );
    if (getResp.ok) {
      const data = (await getResp.json()) as { sha: string };
      sha = data.sha;
    }
  } catch {}

  const content = Buffer.from(`# Live Demo Snippet\n\n${text}\n`).toString("base64");
  const putResp = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`,
    {
      method: "PUT",
      headers: {
        Authorization: `token ${token}`,
        "Content-Type": "application/json",
        "User-Agent": "im-demo",
      },
      body: JSON.stringify({
        message: "demo: live jargon scan from conference demo",
        content,
        committer: { name: "Invisible Mentors Demo", email: "demo@im.dev" },
        ...(sha ? { sha } : {}),
      }),
    }
  );

  if (!putResp.ok) throw new Error(await putResp.text());
  const data = (await putResp.json()) as { commit: { sha: string; html_url: string } };
  return { commitSha: data.commit.sha, commitUrl: data.commit.html_url };
}

export default defineConfig({
  base: "/",
  plugins: [
    react(),
    tailwindcss(),
    {
      name: "api-middleware",
      configureServer(server) {
        server.middlewares.use(
          async (req: IncomingMessage, res: ServerResponse, next: () => void) => {
            if (req.url !== "/api/trigger" || req.method !== "POST") return next();
            let body = "";
            req.on("data", (chunk: Buffer) => { body += chunk.toString(); });
            req.on("end", async () => {
              try {
                const { text } = JSON.parse(body) as { text: string };
                const result = await triggerCI(text);
                res.writeHead(200, { "Content-Type": "application/json" });
                res.end(JSON.stringify(result));
              } catch (err) {
                res.writeHead(500, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ error: String(err) }));
              }
            });
          }
        );
      },
    },
  ],
  resolve: {
    alias: { "@": path.resolve(import.meta.dirname, "src"), "@assets": path.resolve(import.meta.dirname, "attached_assets") },
  },
  server: {
    port,
    host: "0.0.0.0",
    allowedHosts: true,
  },
});
