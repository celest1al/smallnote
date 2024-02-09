import { z } from "zod";

export const NewNoteSchema = z.object({
  title: z
    .string({ required_error: "Note title is required" })
    .min(1, "Note title is required"),
});
