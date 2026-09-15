import { ApiError } from "../utils/ApiError";
import { isHebrewText } from "../utils/language";
import { ClaudeCliError, runClaudeCli } from "./claudeCli";

function buildPrompt(rawText: string): string {
  const languageInstruction = isHebrewText(rawText) ? "Respond in Hebrew." : "Respond in English.";

  return (
    "Summarize this client interaction in 2-3 sentences, then suggest one concrete " +
    `follow-up task. Respond in plain text, no markdown formatting. ${languageInstruction}\n\n` +
    rawText
  );
}

export interface InteractionSummary {
  summary: string;
}

export async function summarizeInteraction(rawText: string): Promise<InteractionSummary> {
  try {
    const summary = await runClaudeCli(buildPrompt(rawText));
    return { summary };
  } catch (err) {
    if (err instanceof ClaudeCliError) {
      throw ApiError.badGateway(err.message);
    }
    throw err;
  }
}
