import { z } from "zod";

export const scoutReportEventSchema = z.union([
  z.tuple([z.number(), z.number(), z.number()]),
  z.tuple([z.number(), z.number(), z.number(), z.number()]),
]);

/**
 * [time (seconds), event/action enum, position enum, quantity?]
 * 4th field is quantity (e.g., fuel scored/fed), specified in stop events
 */
export type ScoutReportEvent = z.infer<typeof scoutReportEventSchema>;

export const scoutReportSchema = z.object({
  uuid: z.string(),
  tournamentKey: z.string(),
  matchType: z.number(),
  matchNumber: z.number(),
  startTime: z.number(),
  teamNumber: z.number(),
  notes: z.string(),
  robotBrokeDescription: z.string().nullable(),
  robotRole: z.array(z.number()),
  fieldTraversal: z.number(),
  disrupts: z.number(),
  accuracy: z.number(),
  autoClimb: z.number(),
  intakeType: z.number(),
  feederType: z.array(z.number()),
  beached: z.number(),
  defenseEffectiveness: z.number(),
  scoresWhileMoving: z.number(),
  climbResult: z.number(),
  driverAbility: z.number(),
  scouterUuid: z.string(),
  events: z.array(scoutReportEventSchema),
});

export type ScoutReport = z.infer<typeof scoutReportSchema>;
