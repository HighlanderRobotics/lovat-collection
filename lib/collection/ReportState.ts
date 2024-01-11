import { ScoutReportMeta } from "../models/ScoutReportMeta";
import { MatchEvent } from "./MatchEvent";
import { StartingPosition } from "./MatchEventPosition";

export type ReportState = {
    meta: ScoutReportMeta;
    events: MatchEvent[];
    startTimestamp?: Date;
    startPosition?: StartingPosition;
    startPiece: boolean;
};
