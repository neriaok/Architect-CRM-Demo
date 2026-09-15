import { Request, Response } from "express";
import { Contact, IContact } from "../models/Contact";
import { Project } from "../models/Project";
import { asyncHandler } from "../middleware/asyncHandler";
import { ApiResponse } from "../types/ApiResponse";
import { ApiError } from "../utils/ApiError";

interface ContactInfo {
  email?: string;
  phone?: string;
  address?: string;
}

interface CreateContactBody {
  name: string;
  role: string;
  contactInfo?: ContactInfo;
}

export const createContact = asyncHandler(async (req: Request, res: Response) => {
  const { name, role, contactInfo } = req.body as CreateContactBody;

  if (!name || typeof name !== "string") {
    throw ApiError.badRequest("name is required");
  }
  if (!role || typeof role !== "string") {
    throw ApiError.badRequest("role is required");
  }

  const project = await Project.findById(req.params.id);
  if (!project) {
    throw ApiError.notFound("Project not found");
  }

  const contact = await Contact.create({ name, role, contactInfo, projectId: project._id });
  const body: ApiResponse<IContact> = { success: true, data: contact };
  res.status(201).json(body);
});

export const listContacts = asyncHandler(async (req: Request, res: Response) => {
  const project = await Project.findById(req.params.id);
  if (!project) {
    throw ApiError.notFound("Project not found");
  }

  const contacts = await Contact.find({ projectId: project._id }).sort({ createdAt: 1 });
  const body: ApiResponse<IContact[]> = { success: true, data: contacts };
  res.json(body);
});
