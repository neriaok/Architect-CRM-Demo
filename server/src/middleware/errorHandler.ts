import { NextFunction, Request, Response } from "express";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../types/ApiResponse";

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (err instanceof ApiError) {
    const body: ApiResponse<never> = { success: false, error: err.message };
    res.status(err.statusCode).json(body);
    return;
  }

  console.error(err);
  const body: ApiResponse<never> = { success: false, error: "Internal server error" };
  res.status(500).json(body);
}
