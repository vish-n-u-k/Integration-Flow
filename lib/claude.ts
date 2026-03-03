import { spawn } from "child_process";

export function runClaude(issueTitle: string, issueBody: string): void {
  const prompt = `GitHub Issue: ${issueTitle}\n\n${issueBody}\n\nPlease analyze this issue and fix it directly in the codebase. Do not ask the user any questions. Just identify the problem, fix the relevant files, and output what you changed.`;

  console.log(`[claude] Starting Claude for issue: "${issueTitle}"`);

  const child = spawn("claude", ["-p", "--dangerously-skip-permissions"], {
    cwd: process.cwd(),
    stdio: ["pipe", "pipe", "pipe"],
    shell: false,
  });

  child.stdin.write(prompt);
  child.stdin.end();

  child.stdout.on("data", (data: Buffer) => {
    console.log(`[claude] ${data.toString()}`);
  });

  child.stderr.on("data", (data: Buffer) => {
    console.error(`[claude:stderr] ${data.toString()}`);
  });

  child.on("error", (err) => {
    console.error(`[claude] Failed to start process:`, err.message);
  });

  child.on("close", (code) => {
    console.log(`[claude] Process exited with code ${code}`);
  });
}
