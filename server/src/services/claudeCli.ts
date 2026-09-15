import { execFile } from "child_process";
import type { ExecFileException } from "child_process";

const DEFAULT_TIMEOUT_MS = 45_000;

export class ClaudeCliError extends Error {
  code?: string;
  timedOut: boolean;

  constructor(message: string, options: { code?: string; timedOut?: boolean } = {}) {
    super(message);
    this.name = "ClaudeCliError";
    this.code = options.code;
    this.timedOut = Boolean(options.timedOut);
  }
}

// Low-level runner shared by every feature that talks to the local `claude` CLI
// (claude -p, non-interactive mode). Resolves with trimmed stdout, or rejects
// with a ClaudeCliError describing why (not installed, timed out, non-zero exit).
export function runClaudeCli(prompt: string, timeoutMs: number = DEFAULT_TIMEOUT_MS): Promise<string> {
  return new Promise((resolve, reject) => {
    // The npm-installed `claude` CLI resolves to a .cmd shim on Windows, and execFile
    // can't spawn a .cmd file directly (EINVAL) without shell:true. The prompt is still
    // sent via stdin below, never interpolated into the command string, so this doesn't
    // reopen the shell-injection risk that keeping user input out of argv/the shell avoids.
    const child = execFile(
      "claude",
      ["-p"],
      {
        timeout: timeoutMs,
        maxBuffer: 10 * 1024 * 1024,
        shell: process.platform === "win32",
      },
      (error: ExecFileException | null, stdout, stderr) => {
        if (error) {
          if (error.code === "ENOENT") {
            reject(new ClaudeCliError("The claude CLI is not installed or not on PATH.", { code: "ENOENT" }));
            return;
          }
          if (error.killed || error.signal === "SIGTERM") {
            reject(new ClaudeCliError("The claude CLI timed out.", { timedOut: true }));
            return;
          }
          reject(new ClaudeCliError(`The claude CLI failed: ${stderr.trim() || error.message}`));
          return;
        }

        const output = stdout.trim();
        if (!output) {
          reject(new ClaudeCliError("The claude CLI returned an empty response."));
          return;
        }
        resolve(output);
      }
    );

    child.stdin?.write(prompt);
    child.stdin?.end();
  });
}
