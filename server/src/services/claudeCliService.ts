import { execFile } from "child_process";
import type { ExecFileException } from "child_process";
import { ApiError } from "../utils/ApiError";

const CLI_TIMEOUT_MS = 45_000;

const PROMPT_INSTRUCTION =
  "Summarize this client interaction in 2-3 sentences, then suggest one concrete " +
  "follow-up task. Respond in plain text, no markdown formatting.\n\n";

export interface InteractionSummary {
  summary: string;
}

export function summarizeInteraction(rawText: string): Promise<InteractionSummary> {
  const prompt = PROMPT_INSTRUCTION + rawText;

  return new Promise((resolve, reject) => {
    // The npm-installed `claude` CLI resolves to a .cmd shim on Windows, and execFile
    // can't spawn a .cmd file directly (EINVAL) without shell:true. The prompt is still
    // sent via stdin below, never interpolated into the command string, so this doesn't
    // reopen the shell-injection risk that keeping rawText out of argv/the shell avoids.
    const child = execFile(
      "claude",
      ["-p"],
      {
        timeout: CLI_TIMEOUT_MS,
        maxBuffer: 10 * 1024 * 1024,
        shell: process.platform === "win32",
      },
      (error: ExecFileException | null, stdout, stderr) => {
        if (error) {
          if (error.code === "ENOENT") {
            reject(ApiError.badGateway("The claude CLI is not installed or not on PATH."));
            return;
          }
          if (error.killed || error.signal === "SIGTERM") {
            reject(ApiError.badGateway("The claude CLI timed out while generating a summary."));
            return;
          }
          reject(ApiError.badGateway(`The claude CLI failed: ${stderr.trim() || error.message}`));
          return;
        }

        const summary = stdout.trim();
        if (!summary) {
          reject(ApiError.badGateway("The claude CLI returned an empty response."));
          return;
        }
        resolve({ summary });
      }
    );

    child.stdin?.write(prompt);
    child.stdin?.end();
  });
}
