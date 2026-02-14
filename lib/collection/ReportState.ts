import { ScoutReportMeta } from "../models/ScoutReportMeta";
import { DriverAbility } from "./DriverAbility";
import { MatchEvent } from "./MatchEvent";
import { MatchEventPosition, startingPositions } from "./MatchEventPosition";
import { MatchEventType } from "./MatchEventType";
import { ScoutReport } from "./ScoutReport";
import { RobotRole } from "./RobotRole";
import { FieldTraversal } from "./FieldTraversal";
import { Accuracy } from "./Accuracy";
import { AutoClimb } from "./AutoClimb";
import { IntakeType } from "./IntakeType";
import { FeederType } from "./FeederType";
import { Beached } from "./Beached";
import { DefenseEffectiveness } from "./DefenseEffectiveness";
import { ScoresWhileMoving } from "./ScoresWhileMoving";
import { EndgameClimb } from "./EndgameClimb";

export enum GamePhase {
  Auto,
  Teleop,
  Endgame,
}

export type StartingPosition =
  (typeof startingPositions)[keyof typeof startingPositions];

export type ReportState = {
  uuid?: string;
  meta?: ScoutReportMeta;
  events: MatchEvent[];
  startTimestamp?: Date;
  startPosition?: StartingPosition;
  gamePhase: GamePhase;

  // Post-match fields
  robotRole: RobotRole[];
  robotBrokeDescription: string | null;
  fieldTraversal: FieldTraversal;
  accuracy: Accuracy | null;
  autoClimb: AutoClimb;
  intakeType: IntakeType;
  feederType: FeederType[];
  beached: Beached;
  defenseEffectiveness: DefenseEffectiveness;
  scoresWhileMoving: ScoresWhileMoving;
  climbResult: EndgameClimb;
  driverAbility: DriverAbility;
  notes: string;

  // Actions
  scoutMatch: (meta: ScoutReportMeta) => void;
  restartMatch: () => void;
  initializeMatchTimestamp: () => void;

  setStartPosition: (value: StartingPosition) => void;
  setGamePhase: (value: GamePhase) => void;
  setRobotRole: (value: RobotRole[]) => void;
  setRobotBrokeDescription: (value: string | null) => void;
  setFieldTraversal: (value: FieldTraversal) => void;
  setAccuracy: (value: Accuracy | null) => void;
  setAutoClimb: (value: AutoClimb) => void;
  setIntakeType: (value: IntakeType) => void;
  setFeederType: (value: FeederType[]) => void;
  setBeached: (value: Beached) => void;
  setDefenseEffectiveness: (value: DefenseEffectiveness) => void;
  setScoresWhileMoving: (value: ScoresWhileMoving) => void;
  setClimbResult: (value: EndgameClimb) => void;
  setDriverAbility: (value: DriverAbility) => void;
  setNotes: (value: string) => void;

  stopClimbing: () => void;
  hasEventOfType: (...types: MatchEventType[]) => boolean;
  hasAutoClimbEvent: () => boolean;
  hasEndgameClimbEvent: () => boolean;
  hasOutpostIntakeEvent: () => boolean;
  hasAutoTraversalEvent: () => boolean;
  getAutoTraversalTypes: () => { trench: boolean; bump: boolean };

  addEvent: (event: {
    type: MatchEventType;
    position?: MatchEventPosition;
    quantity?: number;
    timestamp?: number;
  }) => void;
  undoEvent: () => void;

  exportScoutReport: () => ScoutReport | null;
  reset: () => void;
};
