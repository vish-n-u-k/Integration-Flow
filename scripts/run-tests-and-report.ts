import { execSync } from "child_process";

const REPO = "vish-n-u-k/Integration-Flow";
const TOKEN = process.env.GITHUB_TOKEN;

if (!TOKEN) {
  console.error("[report] GITHUB_TOKEN environment variable is required.");
  process.exit(1);
}

interface TestResult {
  assertionResults: { fullName: string; status: string; failureMessages: string[] }[];
}

interface VitestOutput {
  testResults: TestResult[];
}

async function createIssue(title: string, body: string): Promise<void> {
  console.log(`[report] Creating issue: "${title}"`);

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
    console.error(`[report] Failed to create issue (${res.status}): ${err}`);
    return;
  }

  const data = await res.json();
  console.log(`[report] Created: ${data.html_url}`);
}

async function main() {
  console.log("[report] Running vitest...");

  let jsonOutput: string;
  try {
    jsonOutput = execSync("npx vitest run --reporter=json", {
      encoding: "utf-8",
      stdio: ["ignore", "pipe", "pipe"],
    });
  } catch (err: any) {
    // Vitest exits with code 1 when tests fail — that's expected
    jsonOutput = err.stdout ?? "";
  }

  if (!jsonOutput) {
    console.error("[report] No output from vitest");
    process.exit(1);
  }

  let results: VitestOutput;
  try {
    results = JSON.parse(jsonOutput);
  } catch {
    console.error("[report] Failed to parse vitest JSON output");
    console.error(jsonOutput.slice(0, 500));
    process.exit(1);
  }

  const failures: { name: string; message: string }[] = [];

  for (const testResult of results.testResults) {
    for (const assertion of testResult.assertionResults) {
      if (assertion.status === "failed") {
        failures.push({
          name: assertion.fullName,
          message: assertion.failureMessages.join("\n"),
        });
      }
    }
  }

  if (failures.length === 0) {
    console.log("[report] All tests passed! No issues to create.");
    return;
  }

  console.log(`[report] ${failures.length} test(s) failed. Creating GitHub issues...`);

  for (const failure of failures) {
    const title = `Test failure: ${failure.name}`;
    const body = `A test is failing and needs to be fixed.\n\n**Test:** ${failure.name}\n\n**Error:**\n\`\`\`\n${failure.message}\n\`\`\`\n\nPlease fix the code so this test passes.`;
    await createIssue(title, body);
  }

  console.log("\n[report] Done! GitHub issues created for all failures.");
}

main();
