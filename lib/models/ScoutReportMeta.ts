import { AllianceColor } from "./AllianceColor";
import { matchIdentitySchema } from "./match";
import { z } from "zod";

export const scoutReportMetaSchema = z.object({
  scouterUUID: z.string(),
  matchIdentity: matchIdentitySchema,
  teamNumber: z.number(),
  allianceColor: z.nativeEnum(AllianceColor),
});

export type ScoutReportMeta = z.infer<typeof scoutReportMetaSchema>;
