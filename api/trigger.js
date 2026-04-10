export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { text } = req.body || {};
  if (!text) return res.status(400).json({ error: "text is required" });

  const token = process.env.GITHUB_TOKEN;
  if (!token) return res.status(500).json({ error: "GITHUB_TOKEN not configured on server" });

  const owner = "saisravan909";
  const repo = "Invisible-Mentors";
  const filePath = "docs/demo-snippet.md";

  let sha;
  try {
    const getResp = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`,
      { headers: { Authorization: `token ${token}`, "User-Agent": "im-demo" } }
    );
    if (getResp.ok) {
      const data = await getResp.json();
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
        committer: { name: "Sai Sravan Cherukuri", email: "saisravan@gmail.com" },
        ...(sha ? { sha } : {}),
      }),
    }
  );

  if (!putResp.ok) {
    const err = await putResp.text();
    return res.status(500).json({ error: err });
  }

  const data = await putResp.json();
  return res.json({
    commitSha: data.commit.sha,
    commitUrl: data.commit.html_url,
  });
}
