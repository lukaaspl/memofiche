declare namespace NodeJS {
  export interface Global {
    prisma: import("@prisma/client").PrismaClient;
  }
}
