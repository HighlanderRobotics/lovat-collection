import { ScoutReportMeta } from "../models/ScoutReportMeta";
import { matchTypes } from "../models/match";
import { DriverAbility, driverAbilityDescriptions } from "./DriverAbility";
import { HighNote, highNoteDescriptions } from "./HighNote";
import { MatchEvent } from "./MatchEvent";
import { StartingPosition, matchEventPositions } from "./MatchEventPosition";
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
    uuid: string;
    meta: ScoutReportMeta;
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
};

export function exportScoutReport(reportState: ReportState): ScoutReport {
    return {
        uuid: reportState.uuid,
        tournamentKey: reportState.meta.matchIdentity.tournamentKey,
        matchType: matchTypes.find(
            (matchType) =>
                matchType.type === reportState.meta.matchIdentity.matchType
        )!.num,
        matchNumber: reportState.meta.matchIdentity.matchNumber,
        startTime: reportState.startTimestamp?.getTime() ?? 0,
        notes: reportState.notes,
        robotRole: reportState.robotRole,
        stage: stageResultDescriptions[reportState.stageResult].num,
        highNote: highNoteDescriptions[reportState.highNote].num,
        pickUp: pickUpDescriptions[reportState.pickUp].num,
        driverAbility: driverAbilityDescriptions[reportState.driverAbility].numericalRating,
        scouterUuid: reportState.meta.scouterUUID,
        teamNumber: reportState.meta.teamNumber,
        events: [
            ...(reportState.startPiece
                ? [
                      [
                          0,
                          MatchEventType.PickupNote,
                          matchEventPositions[reportState.startPosition!].num,
                      ] as ScoutReportEvent,
                  ]
                : []),
            ...(reportState.startPosition
                ? [
                      [
                          0,
                          MatchEventType.StartingPosition,
                          matchEventPositions[reportState.startPosition].num,
                      ] as ScoutReportEvent,
                  ]
                : []),
            ...(reportState.events.map((event) => [
                (event.timestamp - reportState.startTimestamp!.getTime()) / 1000,
                event.type,
                matchEventPositions[event.position].num,
            ] as ScoutReportEvent)),
        ],
    };
}
