import { ScoutReportMeta } from "../models/ScoutReportMeta";
import { DriverAbility } from "./DriverAbility";
import { HighNote } from "./HighNote";
import { MatchEvent } from "./MatchEvent";
import {
  GroundNotePosition,
  MatchEventPosition,
  StartingPosition,
} from "./MatchEventPosition";
import { MatchEventType } from "./MatchEventType";
import { PickUp } from "./PickUp";
import { ScoutReport } from "./ScoutReport";
import { StageResult } from "./StageResult";

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
  getHasExited: () => boolean;

  addEvent: (event: {
    type: MatchEventType;
    position?: MatchEventPosition;
  }) => void;
  undoEvent: () => void;

  exportScoutReport: () => ScoutReport | null;
  reset: () => void;
};
