import Anthropic from "@anthropic-ai/sdk";
import { config } from "../config";
import { ApiError } from "../utils/ApiError";

const CLAUDE_MODEL = "claude-opus-5";

const client = new Anthropic({ apiKey: config.anthropicApiKey });

export interface InteractionSummary {
  summary: string;
  suggestedFollowUp: string;
}

const SUMMARIZE_TOOL: Anthropic.Tool = {
  name: "record_interaction_summary",
  description:
    "Records a concise summary of a client interaction (call or meeting) for an architecture firm's CRM, plus one suggested follow-up task for the architect.",
  input_schema: {
    type: "object",
    properties: {
      summary: {
        type: "string",
        description: "A 2-3 sentence summary of what was discussed in the interaction.",
      },
      suggestedFollowUp: {
        type: "string",
        description: "One concrete, actionable follow-up task for the architect to do next.",
      },
    },
    required: ["summary", "suggestedFollowUp"],
  },
};

export async function summarizeInteraction(rawText: string): Promise<InteractionSummary> {
  if (!config.anthropicApiKey) {
    throw ApiError.internal(
      "AI service is not configured. Set ANTHROPIC_API_KEY in the server .env file."
    );
  }

  let response;
  try {
    response = await client.messages.create({
      model: CLAUDE_MODEL,
      max_tokens: 1024,
      system:
        "You are an assistant for an architecture firm's CRM. Given free-text notes from a call or meeting with a client, summarize them and suggest a follow-up task.",
      messages: [{ role: "user", content: rawText }],
      tools: [SUMMARIZE_TOOL],
      tool_choice: { type: "tool", name: SUMMARIZE_TOOL.name },
    });
  } catch (err) {
    if (err instanceof Anthropic.RateLimitError) {
      throw ApiError.tooManyRequests("AI service is rate-limited, please try again shortly.");
    }
    if (err instanceof Anthropic.AuthenticationError) {
      throw ApiError.internal("AI service is not configured correctly.");
    }
    if (err instanceof Anthropic.APIError) {
      throw ApiError.internal("AI service failed to generate a summary.");
    }
    throw err;
  }

  const toolUse = response.content.find(
    (block): block is Anthropic.ToolUseBlock => block.type === "tool_use"
  );
  if (!toolUse) {
    throw ApiError.internal("AI service did not return a structured summary.");
  }

  const { summary, suggestedFollowUp } = toolUse.input as InteractionSummary;
  return { summary, suggestedFollowUp };
}
