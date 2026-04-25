import dotenv from "dotenv";
dotenv.config();

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting seed...");

  // Clean existing data
  await prisma.jobApplication.deleteMany();
  await prisma.refreshToken.deleteMany();
  await prisma.user.deleteMany();

  // Create demo users
  const password = await bcrypt.hash("Demo1234!", 12);

  const user1 = await prisma.user.create({
    data: {
      name: "Demo User",
      email: "demo@jobtracker.com",
      password,
    },
  });

  const adminPassword = await bcrypt.hash("Admin1234!", 12);
  await prisma.user.create({
    data: {
      name: "Admin User",
      email: "admin@jobtracker.com",
      password: adminPassword,
      role: "ADMIN",
    },
  });

  // Create sample job applications for demo user
  const applications = [
    {
      company: "Google",
      position: "Senior Software Engineer",
      status: "INTERVIEW" as const,
      location: "Mountain View, CA",
      salary: "$180,000 - $220,000",
      url: "https://careers.google.com",
      notes: "Had first technical interview. Next round scheduled.",
    },
    {
      company: "Stripe",
      position: "Full Stack Engineer",
      status: "APPLIED" as const,
      location: "Remote",
      salary: "$160,000 - $190,000",
      url: "https://stripe.com/jobs",
      notes: "Applied through LinkedIn. Waiting for response.",
    },
    {
      company: "Vercel",
      position: "Frontend Engineer",
      status: "OFFER" as const,
      location: "Remote",
      salary: "$150,000 - $180,000",
      notes: "Received offer! Evaluating.",
    },
    {
      company: "Netflix",
      position: "Backend Engineer",
      status: "REJECTED" as const,
      location: "Los Gatos, CA",
      notes: "Did not pass the system design round.",
    },
    {
      company: "Shopify",
      position: "Software Engineer II",
      status: "APPLIED" as const,
      location: "Remote",
      salary: "$140,000 - $170,000",
      url: "https://shopify.com/careers",
    },
    {
      company: "Figma",
      position: "Product Engineer",
      status: "INTERVIEW" as const,
      location: "San Francisco, CA",
      notes: "Final round interview next week.",
    },
  ];

  for (const app of applications) {
    await prisma.jobApplication.create({
      data: { userId: user1.id, ...app },
    });
  }

  console.log("✅ Seed completed!");
  console.log("📧 Demo login: demo@jobtracker.com / Demo1234!");
  console.log("📧 Admin login: admin@jobtracker.com / Admin1234!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
