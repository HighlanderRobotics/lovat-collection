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

// String enum values for the spec
export const MatchTypeString = z.enum(["QUALIFICATION", "ELIMINATION"]);
export const MobilityString = z.enum(["TRENCH", "BUMP", "BOTH", "NONE"]);
export const RobotRoleString = z.enum([
  "CYCLING",
  "SCORING",
  "FEEDING",
  "DEFENDING",
  "IMMOBILE",
]);
export const AutoClimbString = z.enum(["NOT_ATTEMPTED", "FAILED", "SUCCEEDED"]);
export const IntakeTypeString = z.enum([
  "GROUND",
  "OUTPOST",
  "BOTH",
  "NEITHER",
]);
export const FeederTypeString = z.enum(["CONTINUOUS", "STOP_TO_SHOOT", "DUMP"]);
export const BeachedString = z.enum(["ON_FUEL", "ON_BUMP", "BOTH", "NEITHER"]);
export const EndgameClimbString = z.enum([
  "NOT_ATTEMPTED",
  "FAILED",
  "L1",
  "L2",
  "L3",
]);

export const scoutReportSchema = z.object({
  uuid: z.string(),
  tournamentKey: z.string(),
  matchType: MatchTypeString,
  matchNumber: z.number(),
  startTime: z.number(),
  teamNumber: z.number(),
  notes: z.string(),
  robotBrokeDescription: z.string().nullable(),
  robotRoles: z.array(RobotRoleString),
  mobility: MobilityString,
  disrupts: z.boolean(),
  accuracy: z.number().or(z.null()),
  autoClimb: AutoClimbString,
  intakeType: IntakeTypeString,
  feederTypes: z.array(FeederTypeString),
  beached: BeachedString,
  defenseEffectiveness: z.number(),
  scoresWhileMoving: z.boolean(),
  endgameClimb: EndgameClimbString,
  driverAbility: z.number(),
  scouterUuid: z.string(),
  events: z.array(scoutReportEventSchema),
});

export type ScoutReport = z.infer<typeof scoutReportSchema>;
