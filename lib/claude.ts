import { execFile } from "child_process";

export function runClaude(issueTitle: string, issueBody: string): void {
  const prompt = `GitHub Issue: ${issueTitle}\n\n${issueBody}`;

  console.log(`[claude] Starting Claude for issue: "${issueTitle}"`);

  const child = execFile("claude", ["-p", prompt], { maxBuffer: 10 * 1024 * 1024 }, (error, stdout, stderr) => {
    if (error) {
      console.error(`[claude] Process error:`, error.message);
    }
    console.log(`[claude] Process exited with code ${error?.code ?? 0}`);
    if (stdout) {
      console.log(`[claude] Output:\n${stdout}`);
    }
    if (stderr) {
      console.error(`[claude] Stderr:\n${stderr}`);
    }
  });

  child.on("error", (err) => {
    console.error(`[claude] Failed to start process:`, err.message);
  });
}
