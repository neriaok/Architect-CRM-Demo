import { Request, Response } from "express";
import { Interaction, IInteraction } from "../models/Interaction";
import { Project } from "../models/Project";
import { asyncHandler } from "../middleware/asyncHandler";
import { ApiResponse } from "../types/ApiResponse";
import { ApiError } from "../utils/ApiError";
import { summarizeInteraction } from "../services/anthropicService";

interface CreateInteractionBody {
  rawText: string;
}

export const createInteraction = asyncHandler(async (req: Request, res: Response) => {
  const { rawText } = req.body as CreateInteractionBody;

  if (!rawText || typeof rawText !== "string" || !rawText.trim()) {
    throw ApiError.badRequest("rawText is required");
  }

  const project = await Project.findById(req.params.id);
  if (!project) {
    throw ApiError.notFound("Project not found");
  }

  const { summary, suggestedFollowUp } = await summarizeInteraction(rawText);

  const interaction = await Interaction.create({
    projectId: project._id,
    rawText,
    summary,
    suggestedFollowUp,
  });

  const body: ApiResponse<IInteraction> = { success: true, data: interaction };
  res.status(201).json(body);
});

export const listInteractions = asyncHandler(async (req: Request, res: Response) => {
  const project = await Project.findById(req.params.id);
  if (!project) {
    throw ApiError.notFound("Project not found");
  }

  const interactions = await Interaction.find({ projectId: project._id }).sort({ date: -1 });
  const body: ApiResponse<IInteraction[]> = { success: true, data: interactions };
  res.json(body);
});
