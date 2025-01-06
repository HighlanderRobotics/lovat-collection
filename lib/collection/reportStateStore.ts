import { GamePhase, ReportState, RobotRole } from "./ReportState";
import {
  MatchEventType,
} from "./MatchEventType";
import {
  GroundPieceContents,
  MatchEventPosition,
} from "./MatchEventPosition";
import { create } from "zustand";
import { v4 } from "uuid";
import { AlgaePickUp, CoralPickUp, coralPickUpDescriptions } from "./PickUp";
import { CageResult, cageResultDescriptions } from "./CageResult";
import { DriverAbility, driverAbilityDescriptions } from "./DriverAbility";
import { MatchEvent } from "./MatchEvent";
import { matchTypes } from "../models/match";
import { ScoutReportEvent } from "./ScoutReport";

export const useReportStateStore = create<ReportState>((set, get) => ({
  events: [],
  startPiece: false,
  groundNotes: [GroundPieceContents.Both, GroundPieceContents.Both, GroundPieceContents.Both],
  gamePhase: GamePhase.Auto,
  robotRole: RobotRole.Offense,
  driverAbility: DriverAbility.Average,
  cageResult: CageResult.NotAttempted,
  coralPickUp: CoralPickUp.None,
  algaePickUp: AlgaePickUp.None,
  notes: "",

  scoutMatch: (meta) =>
    set(() => ({
      meta: meta!,
      events: [],
      startPiece: false,
      groundNotes: [GroundPieceContents.Both, GroundPieceContents.Both, GroundPieceContents.Both],
      gamePhase: GamePhase.Auto,
      robotRole: RobotRole.Offense,
      driverAbility: DriverAbility.Average,
      cageResult: CageResult.NotAttempted,
      coralPickUp: CoralPickUp.Ground,
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
  setCoralPickUp: (value) => set({ coralPickUp: value }),
  setAlgaePickUp: (value) => set({ algaePickUp: value }),
  setNotes: (value) => set({ notes: value }),

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
      (event) => event.type === MatchEventType.AutoLeave,
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
        pickUp: coralPickUpDescriptions[reportState.coralPickUp].num,
        driverAbility:
          driverAbilityDescriptions[reportState.driverAbility].numericalRating,
        scouterUuid: reportState.meta.scouterUUID,
        teamNumber: reportState.meta.teamNumber,
        events: [
          ...(reportState.startPiece
            ? [
                [
                  0,
                  MatchEventType.PickupCoral,
                  reportState.startPosition,
                ] as ScoutReportEvent,
              ]
            : []),
          ...(reportState.startPosition
            ? [
                [
                  0,
                  MatchEventType.StartPosition,
                  reportState.startPosition,
                ] as ScoutReportEvent,
              ]
            : []),
          ...reportState.events.map(
            (event) =>
              [
                (event.timestamp - reportState.startTimestamp!.getTime()) /
                  1000,
                event.type,
                event.position,
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
      groundNotes: [GroundPieceContents.Both, GroundPieceContents.Both, GroundPieceContents.Both],
      gamePhase: GamePhase.Auto,
      robotRole: RobotRole.Offense,
      driverAbility: DriverAbility.Average,
      cageResult: CageResult.NotAttempted,
      coralPickUp: CoralPickUp.Ground,
      notes: "",
    }),
}));
