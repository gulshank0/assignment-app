import { PrismaClient } from "@prisma/client";

const config = {
  client: {
    url: process.env.DATABASE_URL,
  },
};

export default config;
