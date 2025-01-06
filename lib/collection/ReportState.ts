import { ScoutReportMeta } from "../models/ScoutReportMeta";
import { DriverAbility } from "./DriverAbility";
import { MatchEvent } from "./MatchEvent";
import {
  GroundNotePosition,
  MatchEventPosition,
  StartingPosition,
} from "./MatchEventPosition";
import { MatchEventType } from "./MatchEventType";
import { CoralPickUp } from "./PickUp";
import { ScoutReport } from "./ScoutReport";
import { CageResult } from "./CageResult";

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
  cageResult: CageResult;
  pickUp: CoralPickUp;
  notes: string;
  scoutMatch: (meta: ScoutReportMeta) => void;
  initializeMatchTimestamp: () => void;

  setStartPosition: (value: StartingPosition) => void;
  setStartPiece: (value: boolean) => void;
  setGamePhase: (value: GamePhase) => void;
  setRobotRole: (value: RobotRole) => void;
  setDriverAbility: (value: DriverAbility) => void;
  setCageResult: (value: CageResult) => void;
  setPickUp: (value: CoralPickUp) => void;
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
