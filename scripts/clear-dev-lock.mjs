/**
 * Removes a stale Next.js dev-server lock left behind by a crashed/force-quit
 * dev process. Runs automatically before `npm run dev` (as `predev`).
 *
 * It only deletes the lock when the process that created it is no longer
 * running, so a genuinely active dev server is never disturbed.
 */
import { existsSync, readFileSync, rmSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(fileURLToPath(import.meta.url)).replace(/\/scripts$/, "");
const lockPath = join(root, ".next", "dev", "lock");

if (!existsSync(lockPath)) {
  process.exit(0);
}

function isProcessAlive(pid) {
  if (!pid || Number.isNaN(pid)) return false;
  try {
    process.kill(pid, 0);
    return true;
  } catch (err) {
    // ESRCH = no such process; EPERM = exists but not ours (treat as alive).
    return err.code === "EPERM";
  }
}

let pid;
try {
  const raw = readFileSync(lockPath, "utf8").trim();
  pid = Number(raw.match(/\d+/)?.[0]);
} catch {
  pid = undefined;
}

if (!isProcessAlive(pid)) {
  try {
    rmSync(lockPath, { force: true });
    console.info("Removed stale Next dev lock.");
  } catch {
    // ignore — next dev will surface any real issue
  }
}
