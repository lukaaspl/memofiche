import { BadRequest, InternalServerError } from "http-errors";
import createApiHandler from "lib/nc";
import prisma from "lib/prisma";
import { authenticated, extractTokenUserId } from "utils/auth";
import { httpErrorSender } from "utils/errors";
import { z } from "zod";

const profileAvatarHandler = createApiHandler();

profileAvatarHandler.use(authenticated);

const bodySchema = z.object({
  source: z.string().nullable(),
});

// Update user's profile avatar
// PUT api/profile/avatar
profileAvatarHandler.put(async (req, res) => {
  const sendError = httpErrorSender(res);
  const userId = extractTokenUserId(req);
  const parsedBody = bodySchema.safeParse(req.body);

  if (!userId) {
    sendError(new InternalServerError());
    return;
  }

  if (!parsedBody.success) {
    sendError(new BadRequest("Invalid request body"));
    return;
  }

  try {
    const { profile: updatedProfile } = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        profile: {
          update: {
            avatar: {
              update: {
                source: parsedBody.data.source,
              },
            },
          },
        },
      },
      select: {
        profile: {
          select: { avatar: true },
        },
      },
    });

    if (!updatedProfile) {
      throw new Error();
    }

    res.json(updatedProfile.avatar);
  } catch {
    sendError(
      new InternalServerError("Couldn't exec find operation on profile entity")
    );
  }
});

export default profileAvatarHandler;
