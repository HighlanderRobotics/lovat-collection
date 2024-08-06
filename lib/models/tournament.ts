import z from "zod";

export const tournamentSchema = z.object({
  key: z.string(),
  name: z.string(),
  location: z.string(),
  date: z.string(),
});

export type Tournament = z.infer<typeof tournamentSchema>;
