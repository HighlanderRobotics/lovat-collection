import { ScoutReportMeta } from "../models/ScoutReportMeta";
import { DriverAbility } from "./DriverAbility";
import { MatchEvent } from "./MatchEvent";
import {
  PieceContainerContents,
  MatchEventPosition,
  startingPositions,
} from "./MatchEventPosition";
import { MatchEventType } from "./MatchEventType";
import { AlgaePickUp, CoralPickUp } from "./PickUp";
import { ScoutReport } from "./ScoutReport";
import { BargeResult } from "./BargeResult";

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

export type StartingPosition =
  (typeof startingPositions)[keyof typeof startingPositions];

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
  robotBrokeDescription: string | null;
  bargeResult: BargeResult;
  coralPickUp: CoralPickUp;
  algaePickUp: AlgaePickUp;
  knocksAlgae: number;
  traversesUnderCage: number;
  notes: string;

  scoutMatch: (meta: ScoutReportMeta) => void;
  restartMatch: () => void;
  initializeMatchTimestamp: () => void;

  setStartPosition: (value: StartingPosition) => void;
  setStartPiece: (value: boolean) => void;
  setGamePhase: (value: GamePhase) => void;
  setRobotRole: (value: RobotRole) => void;
  setDriverAbility: (value: DriverAbility) => void;
  setRobotBrokeDescription: (value: string | null) => void;
  setBargeResult: (value: BargeResult) => void;
  setCoralPickUp: (value: CoralPickUp) => void;
  setAlgaePickUp: (value: AlgaePickUp) => void;
  setKnocksAlgae: (value: number) => void;
  setTraversesUnderCage: (value: number) => void;
  setNotes: (value: string) => void;

  getHasExited: () => boolean;
  getHasCoral: () => boolean;
  getHasAlgae: () => boolean;
  getRemainingGroundPieces: () => Record<
    MatchEventPosition,
    PieceContainerContents
  >;

  addEvent: (event: {
    type: MatchEventType;
    position?: MatchEventPosition;
  }) => void;
  undoEvent: () => void;

  exportScoutReport: () => ScoutReport | null;
  reset: () => void;
};
