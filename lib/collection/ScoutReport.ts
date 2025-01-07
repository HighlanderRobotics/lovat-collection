import { z } from "zod";

export const scoutReportEventSchema = z.tuple([
  z.number(),
  z.number(),
  z.number(),
]);

/**
 * [time (seconds), event/action enum, position enum]
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
  robotRole: z.number(),
  barge: z.number(),
  coralPickUp: z.number(),
  algaePickUp: z.number(),
  knocksAlgae: z.boolean(),
  traversesUnderCage: z.boolean(),
  driverAbility: z.number(),
  scouterUuid: z.string(),
  events: z.array(scoutReportEventSchema),
});

export type ScoutReport = z.infer<typeof scoutReportSchema>;
