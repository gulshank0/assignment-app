import { Response, NextFunction } from "express";
import { z } from "zod";
import { AuthenticatedRequest } from "../types/index.js";
import * as appService from "../services/application.service.js";

// ─── Validation Schemas ───────────────────────────────────────────────────────

const statuses = [
  "APPLIED",
  "INTERVIEW",
  "OFFER",
  "REJECTED",
  "WITHDRAWN",
] as const;

export const createApplicationSchema = z.object({
  company: z.string().min(1, "Company is required").trim(),
  position: z.string().min(1, "Position is required").trim(),
  status: z.enum(statuses).optional(),
  location: z.string().trim().optional(),
  salary: z.string().trim().optional(),
  url: z.string().url("Invalid URL").optional().or(z.literal("")),
  notes: z.string().trim().optional(),
});

export const updateApplicationSchema = createApplicationSchema.partial();

// ─── Controllers ──────────────────────────────────────────────────────────────

export async function createApplication(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const app = await appService.createApplication(req.user!.id, req.body);
    res.status(201).json(app);
  } catch (err) {
    next(err);
  }
}

export async function listApplications(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const { status, search } = req.query as {
      status?: string;
      search?: string;
    };
    const apps = await appService.listApplications(req.user!.id, {
      status: status as any,
      search,
    });
    res.json(apps);
  } catch (err) {
    next(err);
  }
}

export async function getApplication(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const app = await appService.getApplicationById(
      req.params.id as string,
      req.user!.id,
    );
    res.json(app);
  } catch (err) {
    next(err);
  }
}

export async function updateApplication(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const app = await appService.updateApplication(
      req.params.id as string,
      req.user!.id,
      req.body,
    );
    res.json(app);
  } catch (err) {
    next(err);
  }
}

export async function deleteApplication(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    await appService.deleteApplication(req.params.id as string, req.user!.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}
