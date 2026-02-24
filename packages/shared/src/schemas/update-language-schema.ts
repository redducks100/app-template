import { z } from "zod";

export const updateLanguageSchema = z.object({
  locale: z.enum(["en", "ro"]),
});
