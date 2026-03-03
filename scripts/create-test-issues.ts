const REPO = "vish-n-u-k/Integration-Flow";
const TOKEN = process.env.GITHUB_TOKEN;

if (!TOKEN) {
  console.error("[test] GITHUB_TOKEN environment variable is required.");
  console.error("[test] Create one at: https://github.com/settings/tokens (needs 'repo' scope)");
  process.exit(1);
}

const testIssues = [
  {
    title: "Add a greeting message to the homepage",
    body: "The homepage at `app/page.tsx` should display a friendly greeting message like \"Welcome to the GitHub Webhooks Demo!\" near the top of the page, above the existing content.",
  },
  {
    title: "Fix the webhook endpoint description on the homepage",
    body: "The homepage at `app/page.tsx` describes the webhook behavior. Update the description to also mention that the webhook listens on POST `/api/webhook` and responds to `issues` events with action `opened`.",
  },
];

async function createIssue(title: string, body: string): Promise<void> {
  console.log(`\n[test] Creating issue: "${title}"`);

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
    console.error(`[test] Failed (${res.status}): ${err}`);
    process.exit(1);
  }

  const data = await res.json();
  console.log(`[test] Created: ${data.html_url}`);
}

async function main() {
  console.log(`[test] Creating ${testIssues.length} test issues in ${REPO}...`);

  for (const issue of testIssues) {
    await createIssue(issue.title, issue.body);
  }

  console.log("\n[test] Done! Issues created. GitHub will fire webhooks to trigger Claude.");
}

main();
