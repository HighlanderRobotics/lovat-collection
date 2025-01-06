import { ScoutReportMeta } from "../models/ScoutReportMeta";
import { DriverAbility } from "./DriverAbility";
import { MatchEvent } from "./MatchEvent";
import { GroundPieceContents, MatchEventPosition, StartingPosition } from "./MatchEventPosition";
import { MatchEventType } from "./MatchEventType";
import { AlgaePickUp, CoralPickUp } from "./PickUp";
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
  groundNotes: [GroundPieceContents, GroundPieceContents, GroundPieceContents]
  gamePhase: GamePhase;
  robotRole: RobotRole;
  driverAbility: DriverAbility;
  cageResult: CageResult;
  coralPickUp: CoralPickUp;
  algaePickUp: AlgaePickUp;
  notes: string;

  scoutMatch: (meta: ScoutReportMeta) => void;
  initializeMatchTimestamp: () => void;

  setStartPosition: (value: StartingPosition) => void;
  setStartPiece: (value: boolean) => void;
  setGamePhase: (value: GamePhase) => void;
  setRobotRole: (value: RobotRole) => void;
  setDriverAbility: (value: DriverAbility) => void;
  setCageResult: (value: CageResult) => void;
  setCoralPickUp: (value: CoralPickUp) => void;
  setAlgaePickUp: (value: AlgaePickUp) => void;
  setNotes: (value: string) => void;

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
