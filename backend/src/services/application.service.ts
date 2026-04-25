import { prisma } from "../prisma/client.js";
import { AppError } from "../middleware/error.middleware.js";
import { AppStatus } from "../types/index.js";

// ─── Create ───────────────────────────────────────────────────────────────────

export async function createApplication(
  userId: string,
  data: {
    company: string;
    position: string;
    status?: AppStatus;
    location?: string;
    salary?: string;
    url?: string;
    notes?: string;
  },
) {
  return prisma.jobApplication.create({
    data: { userId, ...data },
  });
}

// ─── List (with filters) ──────────────────────────────────────────────────────

export async function listApplications(
  userId: string,
  filters: { status?: AppStatus; search?: string },
) {
  return prisma.jobApplication.findMany({
    where: {
      userId,
      ...(filters.status && { status: filters.status }),
      ...(filters.search && {
        OR: [
          { company: { contains: filters.search, mode: "insensitive" } },
          { position: { contains: filters.search, mode: "insensitive" } },
        ],
      }),
    },
    orderBy: { appliedAt: "desc" },
  });
}

// ─── Get one ──────────────────────────────────────────────────────────────────

export async function getApplicationById(id: string, userId: string) {
  const app = await prisma.jobApplication.findUnique({ where: { id } });
  if (!app) throw new AppError("Application not found", 404);
  if (app.userId !== userId) throw new AppError("Forbidden", 403);
  return app;
}

// ─── Update ───────────────────────────────────────────────────────────────────

export async function updateApplication(
  id: string,
  userId: string,
  data: Partial<{
    company: string;
    position: string;
    status: AppStatus;
    location: string;
    salary: string;
    url: string;
    notes: string;
  }>,
) {
  await getApplicationById(id, userId); // ownership check
  return prisma.jobApplication.update({ where: { id }, data });
}

// ─── Delete ───────────────────────────────────────────────────────────────────

export async function deleteApplication(id: string, userId: string) {
  await getApplicationById(id, userId); // ownership check
  await prisma.jobApplication.delete({ where: { id } });
}
