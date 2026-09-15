import { Request, Response } from "express";
import { Project, IProject } from "../models/Project";
import { Client } from "../models/Client";
import { PROJECT_STAGES, ProjectStage } from "../models/projectStages";
import { asyncHandler } from "../middleware/asyncHandler";
import { ApiResponse } from "../types/ApiResponse";
import { ApiError } from "../utils/ApiError";

interface CreateProjectBody {
  title: string;
  clientId: string;
  stage?: ProjectStage;
}

interface UpdateProjectBody {
  title?: string;
  clientId?: string;
  stage?: ProjectStage;
}

export const createProject = asyncHandler(async (req: Request, res: Response) => {
  const { title, clientId, stage } = req.body as CreateProjectBody;

  if (!title || typeof title !== "string") {
    throw ApiError.badRequest("title is required");
  }
  if (!clientId || typeof clientId !== "string") {
    throw ApiError.badRequest("clientId is required");
  }
  if (stage !== undefined && !PROJECT_STAGES.includes(stage)) {
    throw ApiError.badRequest(`stage must be one of: ${PROJECT_STAGES.join(", ")}`);
  }

  const client = await Client.findById(clientId);
  if (!client) {
    throw ApiError.badRequest("clientId does not reference an existing client");
  }

  const project = await Project.create({ title, clientId, stage });
  const body: ApiResponse<IProject> = { success: true, data: project };
  res.status(201).json(body);
});

// Lists all projects with their linked client populated in place of clientId.
export const listProjects = asyncHandler(async (_req: Request, res: Response) => {
  const projects = await Project.find().sort({ createdAt: -1 }).populate("clientId");
  const body: ApiResponse<IProject[]> = { success: true, data: projects };
  res.json(body);
});

export const getProject = asyncHandler(async (req: Request, res: Response) => {
  const project = await Project.findById(req.params.id).populate("clientId");
  if (!project) {
    throw ApiError.notFound("Project not found");
  }
  const body: ApiResponse<IProject> = { success: true, data: project };
  res.json(body);
});

export const updateProject = asyncHandler(async (req: Request, res: Response) => {
  const { title, clientId, stage } = req.body as UpdateProjectBody;

  if (title !== undefined && typeof title !== "string") {
    throw ApiError.badRequest("title must be a string");
  }
  if (stage !== undefined && !PROJECT_STAGES.includes(stage)) {
    throw ApiError.badRequest(`stage must be one of: ${PROJECT_STAGES.join(", ")}`);
  }
  if (clientId) {
    const client = await Client.findById(clientId);
    if (!client) {
      throw ApiError.badRequest("clientId does not reference an existing client");
    }
  }

  const project = await Project.findByIdAndUpdate(
    req.params.id,
    { title, clientId, stage },
    { new: true, runValidators: true }
  ).populate("clientId");
  if (!project) {
    throw ApiError.notFound("Project not found");
  }
  const body: ApiResponse<IProject> = { success: true, data: project };
  res.json(body);
});

export const deleteProject = asyncHandler(async (req: Request, res: Response) => {
  const project = await Project.findByIdAndDelete(req.params.id);
  if (!project) {
    throw ApiError.notFound("Project not found");
  }
  const body: ApiResponse<IProject> = { success: true, data: project };
  res.json(body);
});
