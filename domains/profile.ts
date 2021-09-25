import { updateProfileBodySchema } from "utils/validation";
import { z } from "zod";

export type UpdateProfileRequestData = z.input<typeof updateProfileBodySchema>;
