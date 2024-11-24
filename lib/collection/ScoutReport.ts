/**
 * [time (seconds), event/action enum, position enum]
 */

export type ScoutReportEvent = [number, number, number];

export type ScoutReport = {
    uuid: string;
    tournamentKey: string;
    matchType: number;
    matchNumber: number;
    startTime: number;
    teamNumber: number;
    notes: string;
    robotRole: number;
    stage: number;
    // highNote: number;
    pickUp: number;
    driverAbility: number;
    scouterUuid: string;
    events: ScoutReportEvent[];
};
