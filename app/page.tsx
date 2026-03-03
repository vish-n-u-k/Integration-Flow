export default function Home() {
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", padding: "2rem", maxWidth: "600px" }}>
      <h1>GitHub Webhooks</h1>
      <p>Webhook endpoint is active at <code>/api/webhook</code></p>
      <p>
        When a new GitHub issue is created, this service spawns Claude Code CLI
        to analyze and attempt to solve it.
      </p>
    </div>
  );
}
