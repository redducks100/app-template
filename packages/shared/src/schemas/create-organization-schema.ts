import { z } from "zod";

export const createOrganizationSchema = z.object({
  name: z.string().min(4, { message: "Name is required" }),
  slug: z
    .string()
    .min(4, { message: "Slug is required" })
    .regex(
      new RegExp(/^[a-zA-Z0-9]+(?:-[a-zA-Z0-9]+)*$/),
      "Slug must contain only letters, numbers and underscores",
    ),
});
