import { Request, Response } from "express";
import { Client, IClient } from "../models/Client";
import { asyncHandler } from "../middleware/asyncHandler";
import { ApiResponse } from "../types/ApiResponse";
import { ApiError } from "../utils/ApiError";

interface ClientContactInfo {
  email?: string;
  phone?: string;
  address?: string;
}

interface CreateClientBody {
  name: string;
  contactInfo?: ClientContactInfo;
  notes?: string;
}

interface UpdateClientBody {
  name?: string;
  contactInfo?: ClientContactInfo;
  notes?: string;
}

export const createClient = asyncHandler(async (req: Request, res: Response) => {
  const { name, contactInfo, notes } = req.body as CreateClientBody;

  if (!name || typeof name !== "string") {
    throw ApiError.badRequest("name is required");
  }

  const client = await Client.create({ name, contactInfo, notes });
  const body: ApiResponse<IClient> = { success: true, data: client };
  res.status(201).json(body);
});

export const listClients = asyncHandler(async (_req: Request, res: Response) => {
  const clients = await Client.find().sort({ createdAt: -1 });
  const body: ApiResponse<IClient[]> = { success: true, data: clients };
  res.json(body);
});

export const getClient = asyncHandler(async (req: Request, res: Response) => {
  const client = await Client.findById(req.params.id);
  if (!client) {
    throw ApiError.notFound("Client not found");
  }
  const body: ApiResponse<IClient> = { success: true, data: client };
  res.json(body);
});

export const updateClient = asyncHandler(async (req: Request, res: Response) => {
  const { name, contactInfo, notes } = req.body as UpdateClientBody;

  if (name !== undefined && typeof name !== "string") {
    throw ApiError.badRequest("name must be a string");
  }

  const client = await Client.findByIdAndUpdate(
    req.params.id,
    { name, contactInfo, notes },
    { new: true, runValidators: true }
  );
  if (!client) {
    throw ApiError.notFound("Client not found");
  }
  const body: ApiResponse<IClient> = { success: true, data: client };
  res.json(body);
});

export const deleteClient = asyncHandler(async (req: Request, res: Response) => {
  const client = await Client.findByIdAndDelete(req.params.id);
  if (!client) {
    throw ApiError.notFound("Client not found");
  }
  const body: ApiResponse<IClient> = { success: true, data: client };
  res.json(body);
});
