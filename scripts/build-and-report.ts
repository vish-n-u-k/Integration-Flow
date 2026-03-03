import { execSync } from "child_process";

const REPO = "vish-n-u-k/Integration-Flow";
const TOKEN = process.env.GITHUB_TOKEN;

if (!TOKEN) {
  console.error("[build] GITHUB_TOKEN environment variable is required.");
  process.exit(1);
}

async function createIssue(title: string, body: string): Promise<void> {
  console.log(`[build] Creating issue: "${title}"`);

  const res = await fetch(`https://api.github.com/repos/${REPO}/issues`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      Accept: "application/vnd.github+json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ title, body }),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error(`[build] Failed to create issue (${res.status}): ${err}`);
    return;
  }

  const data = await res.json();
  console.log(`[build] Created: ${data.html_url}`);
}

async function main() {
  console.log("[build] Running next build...");

  try {
    execSync("npx next build", {
      encoding: "utf-8",
      stdio: ["ignore", "pipe", "pipe"],
    });
    console.log("[build] Build succeeded! No issues to report.");
  } catch (err: any) {
    const output = (err.stdout ?? "") + "\n" + (err.stderr ?? "");
    const lines = output.trim().split("\n").filter(Boolean);

    const firstError = lines.find((l: string) => l.includes("Error") || l.includes("error")) ?? lines[0] ?? "Unknown error";
    const title = `Build failure: ${firstError.slice(0, 100)}`;
    const body = `The project failed to build (\`next build\`).\n\n**Error output:**\n\`\`\`\n${output.trim().slice(0, 3000)}\n\`\`\`\n\nPlease fix the build error.`;

    console.log(`[build] Build failed. Creating GitHub issue...`);
    await createIssue(title, body);
  }
}

main();
