import { z } from "zod";

export const scouterSchema = z.object({
  name: z.string(),
  uuid: z.string(),
  sourceTeamNumber: z.number(),
  strikes: z.number(),
  scouterReliability: z.number(),
});

export type Scouter = z.infer<typeof scouterSchema>;
