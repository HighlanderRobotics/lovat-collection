import { GamePhase, ReportState, RobotRole } from "./ReportState";
import { MatchEventType } from "./MatchEventType";
import {
  PieceContainerContents,
  MatchEventPosition,
  groundPiecePositions,
} from "./MatchEventPosition";
import { create } from "zustand";
import { v4 } from "uuid";
import {
  AlgaePickUp,
  algaePickUpDescriptions,
  CoralPickUp,
  coralPickUpDescriptions,
} from "./PickUp";
import { BargeResult, bargeResultDescriptions } from "./BargeResult";
import { DriverAbility, driverAbilityDescriptions } from "./DriverAbility";
import { MatchEvent } from "./MatchEvent";
import { matchTypes } from "../models/match";
import { ScoutReportEvent } from "./ScoutReport";
import { AllianceColor } from "../models/AllianceColor";

function mapPosition(position: MatchEventPosition, color: AllianceColor) {
  if (color === AllianceColor.Red) return position;

  const map: Partial<Record<MatchEventPosition, MatchEventPosition>> = {
    [MatchEventPosition.StartBlueProcessor]:
      MatchEventPosition.StartRedProcessor,
    [MatchEventPosition.StartBlueNet]: MatchEventPosition.StartRedNet,
    [MatchEventPosition.StartRedProcessor]:
      MatchEventPosition.StartBlueProcessor,
    [MatchEventPosition.StartRedNet]: MatchEventPosition.StartBlueNet,

    [MatchEventPosition.GroundPieceBlueBarge]:
      MatchEventPosition.GroundPieceRedBarge,
    [MatchEventPosition.GroundPieceRedBarge]:
      MatchEventPosition.GroundPieceBlueBarge,

    [MatchEventPosition.CoralStationBlueBarge]:
      MatchEventPosition.CoralStationRedBarge,
    [MatchEventPosition.CoralStationRedBarge]:
      MatchEventPosition.CoralStationBlueBarge,

    [MatchEventPosition.LevelOneB]: MatchEventPosition.LevelOneA,
    [MatchEventPosition.LevelOneA]: MatchEventPosition.LevelOneB,
    [MatchEventPosition.LevelTwoB]: MatchEventPosition.LevelTwoA,
    [MatchEventPosition.LevelTwoA]: MatchEventPosition.LevelTwoB,
    [MatchEventPosition.LevelThreeB]: MatchEventPosition.LevelThreeA,
    [MatchEventPosition.LevelThreeA]: MatchEventPosition.LevelThreeB,
    [MatchEventPosition.LevelFourB]: MatchEventPosition.LevelFourA,
    [MatchEventPosition.LevelFourA]: MatchEventPosition.LevelFourB,
  };

  if (position in map) return map[position];
  return position;
}

export const useReportStateStore = create<ReportState>((set, get) => ({
  events: [],
  startPiece: true,
  gamePhase: GamePhase.Auto,
  robotRole: RobotRole.Offense,
  driverAbility: DriverAbility.Average,
  bargeResult: BargeResult.NotAttempted,
  coralPickUp: CoralPickUp.None,
  algaePickUp: AlgaePickUp.None,
  knocksAlgae: 0,
  traversesUnderCage: 0,
  notes: "",

  scoutMatch: (meta) =>
    set(() => ({
      meta: meta!,
      events: [],
      startPiece: true,
      startPosition: undefined,
      gamePhase: GamePhase.Auto,
      robotRole: RobotRole.Offense,
      driverAbility: DriverAbility.Average,
      bargeResult: BargeResult.NotAttempted,
      coralPickUp: CoralPickUp.None,
      algaePickUp: AlgaePickUp.None,
      knocksAlgae: 0,
      traversesUnderCage: 0,
      notes: "",
      uuid: v4(),
    })),
  restartMatch: () =>
    set(() => ({
      events: [],
      startTimestamp: undefined,
      gamePhase: GamePhase.Auto,
      robotRole: RobotRole.Offense,
      driverAbility: DriverAbility.Average,
      bargeResult: BargeResult.NotAttempted,
      coralPickUp: CoralPickUp.None,
      algaePickUp: AlgaePickUp.None,
      knocksAlgae: 0,
      traversesUnderCage: 0,
      notes: "",
    })),
  initializeMatchTimestamp: () => {
    set(() => ({ startTimestamp: new Date() }));
  },

  setStartPosition: (value) => set({ startPosition: value }),
  setStartPiece: (value) => set({ startPiece: value }),
  setGamePhase: (value) => set({ gamePhase: value }),
  setRobotRole: (value) => set({ robotRole: value }),
  setDriverAbility: (value) => set({ driverAbility: value }),
  setBargeResult: (value) => set({ bargeResult: value }),
  setCoralPickUp: (value) => set({ coralPickUp: value }),
  setAlgaePickUp: (value) => set({ algaePickUp: value }),
  setKnocksAlgae: (value) => set({ knocksAlgae: value }),
  setTraversesUnderCage: (value) => set({ traversesUnderCage: value }),
  setNotes: (value) => set({ notes: value }),

  getHasExited: () => {
    const reportState = get();
    return reportState.events.some(
      (event) => event.type === MatchEventType.AutoLeave,
    );
  },
  getHasCoral: () => {
    const reportState = get();
    let flag = reportState.startPiece;
    reportState.events.forEach((item) => {
      if (item.type === MatchEventType.PickupCoral) {
        flag = true;
      } else if (
        item.type === MatchEventType.DropCoral ||
        item.type === MatchEventType.ScoreCoral
      ) {
        flag = false;
      }
    });
    return flag;
  },
  getHasAlgae: () => {
    const reportState = get();
    let flag = false;
    reportState.events.forEach((item) => {
      if (item.type === MatchEventType.PickupAlgae) {
        flag = true;
      } else if (
        item.type === MatchEventType.DropAlgae ||
        item.type === MatchEventType.ScoreNet ||
        item.type === MatchEventType.FailNet ||
        item.type === MatchEventType.ScoreProcessor ||
        item.type === MatchEventType.FeedAlgae
      ) {
        flag = false;
      }
    });
    return flag;
  },
  getRemainingGroundPieces: () => {
    const reportState = get();
    let res = Object.values(groundPiecePositions).reduce(
      (acc, curr) => ({
        ...acc,
        [curr]: {
          coral: true,
          algae: true,
        },
      }),
      {} as Record<MatchEventPosition, PieceContainerContents>,
    );

    reportState.events.forEach((item) => {
      if (item.position in groundPiecePositions) {
        if (item.type === MatchEventType.PickupCoral) {
          res = {
            ...res,
            [item.position]: {
              ...res[item.position],
              coral: false,
            },
          };
        }
        if (item.type === MatchEventType.PickupAlgae) {
          res = {
            ...res,
            [item.position]: {
              ...res[item.position],
              algae: false,
            },
          };
        }
      }
    });

    return res;
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
        barge: bargeResultDescriptions[reportState.bargeResult].num,
        coralPickUp: coralPickUpDescriptions[reportState.coralPickUp].num,
        algaePickUp: algaePickUpDescriptions[reportState.algaePickUp].num,
        knocksAlgae: reportState.knocksAlgae,
        traversesUnderCage: reportState.traversesUnderCage,
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
                  mapPosition(
                    reportState.startPosition!,
                    reportState.meta!.allianceColor,
                  )!,
                ] satisfies ScoutReportEvent,
              ]
            : []),
          ...(reportState.startPosition
            ? [
                [
                  0,
                  MatchEventType.StartPosition,
                  mapPosition(
                    reportState.startPosition!,
                    reportState.meta!.allianceColor,
                  )!,
                ] satisfies ScoutReportEvent,
              ]
            : []),
          ...reportState.events.map(
            (event) =>
              [
                (event.timestamp - reportState.startTimestamp!.getTime()) /
                  1000,
                event.type,
                mapPosition(event.position!, reportState.meta!.allianceColor)!,
              ] satisfies ScoutReportEvent,
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
      startPiece: true,
      startTimestamp: undefined,
      startPosition: undefined,
      gamePhase: GamePhase.Auto,
      robotRole: RobotRole.Offense,
      driverAbility: DriverAbility.Average,
      bargeResult: BargeResult.NotAttempted,
      coralPickUp: CoralPickUp.None,
      algaePickUp: AlgaePickUp.None,
      knocksAlgae: 0,
      traversesUnderCage: 0,
      notes: "",
    }),
}));
