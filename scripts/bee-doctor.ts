/**
 * bee-doctor: checks that the Bee CLI is installed, authenticated, and reachable
 * from this machine, and prints the exact commands used for LUG-101.
 *
 * Usage: pnpm bee:doctor
 *
 * Prints nothing from any conversation. Safe to paste into BUILD-LOG.md.
 */
import { spawnSync } from "node:child_process";

type Check = { name: string; args: string[]; hint: string; failIf?: RegExp };

const checks: Check[] = [
  {
    name: "installed",
    args: ["version"],
    hint: "Install with: npm install -g @beeai/cli",
  },
  {
    name: "authenticated",
    args: ["status"],
    failIf: /not logged in/i,
    hint: "Log in with: bee login  (needs Developer Mode: tap the version number five times in the Bee app's Settings)",
  },
  {
    name: "reachable",
    args: ["ping", "--count", "1"],
    hint: "Check network; the CLI talks to Bee's API over HTTPS.",
  },
];

function run(args: string[]): { ok: boolean; out: string } {
  const res = spawnSync("bee", args, { encoding: "utf8", timeout: 20_000 });
  if (res.error) return { ok: false, out: String(res.error.message) };
  const out = `${res.stdout ?? ""}${res.stderr ?? ""}`.trim();
  return { ok: res.status === 0, out };
}

let failed = 0;
console.log("bee-doctor");
for (const c of checks) {
  const res = run(c.args);
  const out = res.out;
  const ok = res.ok && !(c.failIf && c.failIf.test(out));
  console.log(`\n[${ok ? "ok" : "fail"}] ${c.name}: bee ${c.args.join(" ")}`);
  if (out) console.log(out.split("\n").map((l) => `    ${l}`).join("\n"));
  if (!ok) {
    failed += 1;
    console.log(`    hint: ${c.hint}`);
  }
}

console.log(`
Next, for LUG-101 (run each in its own terminal, then have one real conversation):
  bee stream --json --types new-utterance,new-conversation,update-conversation
  bee sync --only conversations --recent-days 1 --output ./data/bee-sync
Redact every line that is not the wearer's before pasting into BUILD-LOG.md (INV-1).
`);

process.exit(failed === 0 ? 0 : 1);
