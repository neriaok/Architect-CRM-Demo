import { Request, Response } from "express";
import { Interaction, IInteraction } from "../models/Interaction";
import { Project } from "../models/Project";
import { asyncHandler } from "../middleware/asyncHandler";
import { ApiResponse } from "../types/ApiResponse";
import { ApiError } from "../utils/ApiError";
import { summarizeInteraction } from "../services/claudeCliService";

interface CreateInteractionBody {
  rawText: string;
  useAi?: boolean;
}

export const createInteraction = asyncHandler(async (req: Request, res: Response) => {
  const { rawText, useAi } = req.body as CreateInteractionBody;

  if (!rawText || typeof rawText !== "string" || !rawText.trim()) {
    throw ApiError.badRequest("rawText is required");
  }

  const project = await Project.findById(req.params.id);
  if (!project) {
    throw ApiError.notFound("Project not found");
  }

  const summary = useAi ? (await summarizeInteraction(rawText)).summary : rawText.trim();

  const interaction = await Interaction.create({
    projectId: project._id,
    rawText,
    summary,
    summarizedByAi: Boolean(useAi),
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

export const deleteInteraction = asyncHandler(async (req: Request, res: Response) => {
  const interaction = await Interaction.findOneAndDelete({
    _id: req.params.interactionId,
    projectId: req.params.id,
  });
  if (!interaction) {
    throw ApiError.notFound("Interaction not found");
  }

  const body: ApiResponse<IInteraction> = { success: true, data: interaction };
  res.json(body);
});
