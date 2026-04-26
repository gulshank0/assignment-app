import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import { prisma } from "./prisma/client.js";

const PORT = process.env.PORT || 5000;

async function bootstrap() {
  try {
    // Verify database connection
    await prisma.$connect();
    console.log("Database connected");

    app.listen(PORT, () => {
      console.log(` Server running at http://localhost:${PORT}`);
      console.log(` Environment: ${process.env.NODE_ENV || "development"}`);
    });
  } catch (err) {
    console.error("❌ Failed to start server:", err);
    await prisma.$disconnect();
    process.exit(1);
  }
}

// Graceful shutdown
process.on("SIGINT", async () => {
  console.log("Shutting down gracefully...");
  await prisma.$disconnect();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  await prisma.$disconnect();
  process.exit(0);
});

bootstrap();
