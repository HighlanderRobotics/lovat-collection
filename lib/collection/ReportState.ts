import { ScoutReportMeta } from "../models/ScoutReportMeta";
import { matchTypes } from "../models/match";
import { DriverAbility, driverAbilityDescriptions } from "./DriverAbility";
import { MatchEvent } from "./MatchEvent";
import { MatchEventPosition, StartingPosition, matchEventPositions } from "./MatchEventPosition";
import { MatchEventType } from "./MatchEventType";
import { PickUp, pickUpDescriptions } from "./PickUp";
import { ScoutReport, ScoutReportEvent } from "./ScoutReport";
import { ChargingResult, chargingResultDescriptions } from "./ChargingResult";

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

export enum GamePiece {
    None,
    Cube,
    Cone
}

export type ReportState = {
    uuid: string
    meta: ScoutReportMeta
    events: MatchEvent[]
    startTimestamp?: Date
    startPosition?: StartingPosition
    startPiece: GamePiece
    gamePhase: GamePhase
    robotRole: RobotRole
    driverAbility: DriverAbility
    autoChargingResult: ChargingResult
    endChargingResult: ChargingResult
    pickUp: PickUp
    notes: string
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
        pickUp: pickUpDescriptions[reportState.pickUp].num,
        driverAbility: driverAbilityDescriptions[reportState.driverAbility].numericalRating,
        scouterUuid: reportState.meta.scouterUUID,
        teamNumber: reportState.meta.teamNumber,
        events: [
            ...(reportState.startPiece !== GamePiece.None ? [
                    [
                        0,
                        reportState.startPiece === GamePiece.Cone ? MatchEventType.PickupCone : MatchEventType.PickupCube,
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
            ...(reportState.autoChargingResult
                ? [
                    [
                        18,
                        Object.values(ChargingResult).indexOf(reportState.autoChargingResult),
                        matchEventPositions[MatchEventPosition.None].num,
                    ] as ScoutReportEvent
                ]
                : []
            ),
            ...(reportState.autoChargingResult
                ? [
                    [
                        ((reportState.events[reportState.events.length-1].timestamp - reportState.startTimestamp!.getTime()) / 1000)+0.1,
                        Object.values(ChargingResult).indexOf(reportState.autoChargingResult),
                        matchEventPositions[MatchEventPosition.None].num,
                    ] as ScoutReportEvent
                ]
                : []
            ),
            ...(reportState.events.map((event) => [
                (event.timestamp - reportState.startTimestamp!.getTime()) / 1000,
                event.type,
                matchEventPositions[event.position].num,
            ] as ScoutReportEvent)),
        ],
    };
}
