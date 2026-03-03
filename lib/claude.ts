import { spawn } from "child_process";

export function runClaude(issueTitle: string, issueBody: string): void {
  const prompt = `You are working in this repository. A GitHub issue was opened:

Title: ${issueTitle}
Body: ${issueBody}

Read the relevant code and fix this issue by editing files directly.`;

  console.log(`[claude] Starting Claude for issue: "${issueTitle}"`);

  const child = spawn("claude", ["-p", "--dangerously-skip-permissions"], {
    cwd: process.cwd(),
    stdio: ["pipe", "pipe", "pipe"],
    shell: true,
  });

  child.stdin.write(prompt);
  child.stdin.end();

  child.stdout.on("data", (data: Buffer) => {
    console.log(`[claude] ${data.toString().trim()}`);
  });

  child.stderr.on("data", (data: Buffer) => {
    console.error(`[claude:err] ${data.toString().trim()}`);
  });

  child.on("close", (code) => {
    console.log(`[claude] Process exited with code ${code}`);
  });

  child.on("error", (err) => {
    console.error(`[claude] Failed to start process:`, err.message);
  });
}
