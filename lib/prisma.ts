import { PrismaNeonHttp } from "@prisma/adapter-neon";
import { neonConfig } from "@neondatabase/serverless";
import { env } from "./env";
import { PrismaClient } from "@/generated/prisma/client";

const globalForPrisma = global as unknown as {
  prisma: PrismaClient;
};

let connectionString = env.DATABASE_URL;

if (env.NODE_ENV === "development") {
  connectionString = "postgres://postgres:postgres@db.localtest.me:5432/makerhub";
  neonConfig.fetchEndpoint = (host) => {
    const [protocol, port] =
      host === "db.localtest.me" ? ["http", 4444] : ["https", 443];
    return `${protocol}://${host}:${port}/sql`;
  };
}

const adapter = new PrismaNeonHttp(connectionString, {});

const prisma = globalForPrisma.prisma || new PrismaClient({ adapter });

if (env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;
