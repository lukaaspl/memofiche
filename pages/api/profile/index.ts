import { BadRequest, InternalServerError } from "http-errors";
import createApiHandler from "lib/nc";
import prisma from "lib/prisma";
import { findUserProfile } from "repositories/user";
import { authenticated, extractTokenUserId } from "utils/auth";
import { httpErrorSender } from "utils/errors";
import { updateProfileBodySchema } from "utils/validation";

const profileHandler = createApiHandler();

profileHandler.use(authenticated);

// Get user profile
// GET api/profile
profileHandler.get(async (req, res) => {
  const sendError = httpErrorSender(res);
  const userId = extractTokenUserId(req);

  if (!userId) {
    sendError(new InternalServerError());
    return;
  }

  try {
    const profile = await findUserProfile(userId);

    if (!profile) {
      throw new Error();
    }

    res.json(profile);
  } catch {
    sendError(
      new InternalServerError("Couldn't exec find operation on profile entity")
    );
  }
});

// Update user profile
// PUT api/profile
profileHandler.put(async (req, res) => {
  const sendError = httpErrorSender(res);
  const userId = extractTokenUserId(req);
  const parsedBody = updateProfileBodySchema.safeParse(req.body);

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
            firstName: parsedBody.data.firstName,
            lastName: parsedBody.data.lastName,
            website: parsedBody.data.website,
            bio: parsedBody.data.bio,
          },
        },
      },
      select: {
        profile: {
          include: { avatar: true },
        },
      },
    });

    if (!updatedProfile) {
      throw new Error();
    }

    res.json(updatedProfile);
  } catch {
    sendError(
      new InternalServerError("Couldn't exec find operation on profile entity")
    );
  }
});

export default profileHandler;
