/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { NewUser } from "domains/user";
import prisma from "lib/prisma";
import { hashPassword } from "utils/auth";

export async function createUser(user: NewUser) {
  return prisma.user.create({
    data: {
      email: user.email,
      password: await hashPassword(user.password),
      name: user.name,
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
  });
}

export function findMeUser(userId: number) {
  return prisma.user.findUnique({
    where: { id: userId },
    select: {
      name: true,
      email: true,
      role: true,
      config: {
        select: {
          advancedRatingControls: true,
          darkTheme: true,
        },
      },
    },
  });
}

export function findUserProfile(userId: number) {
  return prisma.profile.findFirst({
    where: {
      userId,
    },
    include: { avatar: true },
  });
}
