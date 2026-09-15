import { Request, Response } from "express";
import { asyncHandler } from "../middleware/asyncHandler";
import { ApiResponse } from "../types/ApiResponse";
import { ApiError } from "../utils/ApiError";
import { askAssistant, AssistantAnswer } from "../services/assistantService";

interface AskAssistantBody {
  question: string;
}

export const ask = asyncHandler(async (req: Request, res: Response) => {
  const { question } = req.body as AskAssistantBody;

  if (!question || typeof question !== "string" || !question.trim()) {
    throw ApiError.badRequest("question is required");
  }

  const result = await askAssistant(question.trim());
  const body: ApiResponse<AssistantAnswer> = { success: true, data: result };
  res.json(body);
});
