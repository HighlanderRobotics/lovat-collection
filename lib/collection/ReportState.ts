import { ScoutReportMeta } from "../models/ScoutReportMeta";
import { MatchEvent } from "./MatchEvent";
import { StartingPosition } from "./MatchEventPosition";

export enum GamePhase {
    Auto,
    Teleop,
}

export type ReportState = {
    meta: ScoutReportMeta;
    events: MatchEvent[];
    startTimestamp?: Date;
    startPosition?: StartingPosition;
    startPiece: boolean;
    gamePhase: GamePhase;
};
