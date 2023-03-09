import { PrismaClient } from "@prisma/client";
import { hashPassword } from "utils/auth";

const prisma = new PrismaClient();

async function main(): Promise<void> {
  const adminName = "Admin";
  const adminEmail = "admin@memofiche.com";
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword) {
    throw new Error("Admin password hasn't been set");
  }

  const hashedPassword = await hashPassword(adminPassword);

  await prisma.user.upsert({
    where: { email: adminEmail },
    create: {
      email: adminEmail,
      password: hashedPassword,
      name: adminName,
      role: "Admin",
      profile: {
        create: {
          avatar: {
            create: {},
          },
        },
      },
      config: {
        create: {},
      },
    },
    update: {
      password: hashedPassword,
      name: adminName,
      role: "Admin",
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
