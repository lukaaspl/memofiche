import { resetPasswordBodySchema, updateConfigSchema } from "utils/validation";
import { z } from "zod";

export type ManageableConfig = z.infer<typeof updateConfigSchema>;

export type ResetPasswordData = z.infer<typeof resetPasswordBodySchema>;
