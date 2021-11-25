/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import prisma from "lib/prisma";

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

export async function findUserProfile(userId: number) {
  return await prisma.profile.findFirst({
    where: {
      userId,
    },
    include: { avatar: true },
  });
}
