import { GamePhase, ReportState, RobotRole } from "./ReportState";
import {
  MatchEventType,
  gainNoteEvents,
  loseNoteEvents,
} from "./MatchEventType";
import {
  GroundNotePosition,
  MatchEventPosition,
  groundNotePositions,
  matchEventPositions,
} from "./MatchEventPosition";
import { create } from "zustand";
import { v4 } from "uuid";
import { CoralPickUp, coralPickUpDescriptions } from "./PickUp";
import { CageResult, cageResultDescriptions } from "./CageResult";
import { DriverAbility, driverAbilityDescriptions } from "./DriverAbility";
import { MatchEvent } from "./MatchEvent";
import { matchTypes } from "../models/match";
import { ScoutReportEvent } from "./ScoutReport";

export const useReportStateStore = create<ReportState>((set, get) => ({
  events: [],
  startPiece: false,
  gamePhase: GamePhase.Auto,
  robotRole: RobotRole.Offense,
  driverAbility: DriverAbility.Average,
  cageResult: CageResult.NotAttempted,
  pickUp: CoralPickUp.Ground,
  notes: "",

  scoutMatch: (meta) =>
    set(() => ({
      meta: meta!,
      events: [],
      startPiece: false,
      gamePhase: GamePhase.Auto,
      robotRole: RobotRole.Offense,
      driverAbility: DriverAbility.Average,
      cageResult: CageResult.NotAttempted,
      pickUp: CoralPickUp.Ground,
      notes: "",
      uuid: v4(),
    })),
  initializeMatchTimestamp: () => {
    set(() => ({ startTimestamp: new Date() }));
  },

  setStartPosition: (value) => set({ startPosition: value }),
  setStartPiece: (value) => set({ startPiece: value }),
  setGamePhase: (value) => set({ gamePhase: value }),
  setRobotRole: (value) => set({ robotRole: value }),
  setDriverAbility: (value) => set({ driverAbility: value }),
  setCageResult: (value) => set({ cageResult: value }),
  setPickUp: (value) => set({ pickUp: value }),
  setNotes: (value) => set({ notes: value }),

  getRemainingGroundNoteLocations: () => {
    const reportState = get();

    if (!reportState || !reportState.events) {
      return null;
    }

    const remainingGroundPieceLocations: GroundNotePosition[] = Object.keys(
      groundNotePositions,
    ) as GroundNotePosition[];

    for (let i = 0; i < reportState.events.length; i++) {
      const event = reportState.events[i];

      if (
        event.position &&
        remainingGroundPieceLocations.includes(event.position)
      ) {
        remainingGroundPieceLocations.splice(
          remainingGroundPieceLocations.indexOf(event.position),
          1,
        );
      }
    }
    return remainingGroundPieceLocations;
  },
  getIsAmplified: () => {
    const reportState = get();

    if (!reportState || !reportState.events) {
      return false;
    }

    let isAmplified = false;

    for (let i = 0; i < reportState.events.length; i++) {
      const event = reportState.events[i];

      if (event.type === MatchEventType.StartAmplfying) {
        isAmplified = true;
      }

      if (event.type === MatchEventType.StopAmplifying) {
        isAmplified = false;
      }
    }

    return isAmplified;
  },
  getHasNote: () => {
    const reportState = get();
    let hasNote = false;

    if (!reportState || !reportState.events) {
      return false;
    }

    if (reportState.startPiece) {
      hasNote = true;
    }

    for (let i = 0; i < reportState.events.length; i++) {
      const event = reportState.events[i];

      if (loseNoteEvents.includes(event.type)) {
        hasNote = false;
      }

      if (gainNoteEvents.includes(event.type)) {
        hasNote = true;
      }
    }

    return hasNote;
  },
  getHasExited: () => {
    const reportState = get();
    return reportState.events.some(
      (event) => event.type === MatchEventType.LeaveWing,
    );
  },

  addEvent: (event) => {
    const reportState = get();
    if (reportState.events) {
      set({
        events: [
          ...(reportState.events as MatchEvent[]),
          {
            type: event.type,
            position: event.position ?? MatchEventPosition.None,
            timestamp: Date.now(),
          },
        ],
      });
    }
  },
  undoEvent: () => {
    const reportState = get();
    if (reportState.events) {
      set({
        events: reportState.events.slice(0, -1),
      });
    }
  },
  exportScoutReport: () => {
    const reportState = get();
    if (reportState.uuid && reportState.meta) {
      return {
        uuid: reportState.uuid,
        tournamentKey: reportState.meta.matchIdentity.tournamentKey,
        matchType: matchTypes.find(
          (matchType) =>
            reportState.meta !== undefined &&
            matchType.type === reportState.meta.matchIdentity.matchType,
        )!.num,
        matchNumber: reportState.meta.matchIdentity.matchNumber,
        startTime: reportState.startTimestamp?.getTime() ?? 0,
        notes: reportState.notes,
        robotRole: reportState.robotRole,
        cage: cageResultDescriptions[reportState.cageResult].num,
        pickUp: coralPickUpDescriptions[reportState.pickUp].num,
        driverAbility:
          driverAbilityDescriptions[reportState.driverAbility].numericalRating,
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
          ...reportState.events.map(
            (event) =>
              [
                (event.timestamp - reportState.startTimestamp!.getTime()) /
                  1000,
                event.type,
                matchEventPositions[event.position].num,
              ] as ScoutReportEvent,
          ),
        ],
      };
    }
    return null;
  },
  reset: () =>
    set({
      uuid: undefined,
      meta: undefined,
      events: [],
      startPiece: false,
      startTimestamp: undefined,
      startPosition: undefined,
      gamePhase: GamePhase.Auto,
      robotRole: RobotRole.Offense,
      driverAbility: DriverAbility.Average,
      cageResult: CageResult.NotAttempted,
      pickUp: CoralPickUp.Ground,
      notes: "",
    }),
}));
