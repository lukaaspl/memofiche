/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import prisma from "lib/prisma";

export async function findUserProfile(userId: number) {
  return await prisma.profile.findFirst({
    where: {
      userId,
    },
    include: { avatar: true },
  });
}
