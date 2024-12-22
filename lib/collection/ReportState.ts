import { ScoutReportMeta } from "../models/ScoutReportMeta";
import { matchTypes } from "../models/match";
import { DriverAbility, driverAbilityDescriptions } from "./DriverAbility";
import { HighNote, highNoteDescriptions } from "./HighNote";
import { MatchEvent } from "./MatchEvent";
import {
  GroundNotePosition,
  MatchEventPosition,
  StartingPosition,
  matchEventPositions,
} from "./MatchEventPosition";
import { MatchEventType } from "./MatchEventType";
import { PickUp, pickUpDescriptions } from "./PickUp";
import { ScoutReport, ScoutReportEvent } from "./ScoutReport";
import { StageResult, stageResultDescriptions } from "./StageResult";

export enum GamePhase {
  Auto,
  Teleop,
}

export enum RobotRole {
  Offense,
  Defense,
  Feeder,
  Immobile,
}

export type ReportState = {
  uuid?: string;
  meta?: ScoutReportMeta;
  events: MatchEvent[];
  startTimestamp?: Date;
  startPosition?: StartingPosition;
  startPiece: boolean;
  gamePhase: GamePhase;
  robotRole: RobotRole;
  driverAbility: DriverAbility;
  stageResult: StageResult;
  highNote: HighNote;
  pickUp: PickUp;
  notes: string;
  scoutMatch: (meta: ScoutReportMeta) => void;
  initializeMatchTimestamp: () => void;

  setStartPosition: (value: StartingPosition) => void;
  setStartPiece: (value: boolean) => void;
  setGamePhase: (value: GamePhase) => void;
  setRobotRole: (value: RobotRole) => void;
  setDriverAbility: (value: DriverAbility) => void;
  setStageResult: (value: StageResult) => void;
  setHighNote: (value: HighNote) => void;
  setPickUp: (value: PickUp) => void;
  setNotes: (value: string) => void;

  getRemainingGroundNoteLocations: () => GroundNotePosition[] | null;
  getIsAmplified: () => boolean;
  getHasNote: () => boolean;

  addEvent: (event: {
    type: MatchEventType;
    position?: MatchEventPosition;
  }) => void;
  undoEvent: () => void;

  exportScoutReport: () => ScoutReport | null;
  reset: () => void;
};
