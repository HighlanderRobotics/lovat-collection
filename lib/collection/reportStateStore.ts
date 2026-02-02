import { GamePhase, ReportState } from "./ReportState";
import { MatchEventPosition } from "./MatchEventPosition";
import { create } from "zustand";
import { v4 } from "uuid";
import { DriverAbility, driverAbilityDescriptions } from "./DriverAbility";
import { MatchEvent } from "./MatchEvent";
import { matchTypes } from "../models/match";
import { ScoutReportEvent } from "./ScoutReport";
import { RobotRole, robotRoleDescriptions } from "./RobotRole";
import { FieldTraversal, fieldTraversalDescriptions } from "./FieldTraversal";
import { Accuracy, accuracyDescriptions } from "./Accuracy";
import { AutoClimb, autoClimbDescriptions } from "./AutoClimb";
import { IntakeType, intakeTypeDescriptions } from "./IntakeType";
import { FeederType, feederTypeDescriptions } from "./FeederType";
import { Beached, beachedDescriptions } from "./Beached";
import {
  DefenseEffectiveness,
  defenseEffectivenessDescriptions,
} from "./DefenseEffectiveness";
import {
  ScoresWhileMoving,
  scoresWhileMovingDescriptions,
} from "./ScoresWhileMoving";
import { EndgameClimb, endgameClimbDescriptions } from "./EndgameClimb";
import { MatchEventType } from "./MatchEventType";

const initialState = {
  events: [],
  gamePhase: GamePhase.Auto,
  robotRole: [] as RobotRole[],
  robotBrokeDescription: null as string | null,
  fieldTraversal: FieldTraversal.None,
  disrupts: false,
  accuracy: Accuracy.LessThan50,
  autoClimb: AutoClimb.NotAttempted,
  intakeType: IntakeType.Neither,
  feederType: [] as FeederType[],
  beached: Beached.Neither,
  defenseEffectiveness: DefenseEffectiveness.Average,
  scoresWhileMoving: ScoresWhileMoving.No,
  climbResult: EndgameClimb.NotAttempted,
  driverAbility: DriverAbility.Average,
  notes: "",
};

export const useReportStateStore = create<ReportState>((set, get) => ({
  ...initialState,

  scoutMatch: (meta) =>
    set(() => ({
      ...initialState,
      meta: meta!,
      startPosition: undefined,
      uuid: v4(),
    })),
  restartMatch: () =>
    set(() => ({
      ...initialState,
      startTimestamp: undefined,
    })),
  initializeMatchTimestamp: () => {
    set(() => ({ startTimestamp: new Date() }));
  },

  setStartPosition: (value) => set({ startPosition: value }),
  setGamePhase: (value) => set({ gamePhase: value }),
  setRobotRole: (value) => set({ robotRole: value }),
  setRobotBrokeDescription: (value) => set({ robotBrokeDescription: value }),
  setFieldTraversal: (value) => set({ fieldTraversal: value }),
  setAccuracy: (value) => set({ accuracy: value }),
  setAutoClimb: (value) => set({ autoClimb: value }),
  setIntakeType: (value) => set({ intakeType: value }),
  setFeederType: (value) => set({ feederType: value }),
  setBeached: (value) => set({ beached: value }),
  setDefenseEffectiveness: (value) => set({ defenseEffectiveness: value }),
  setScoresWhileMoving: (value) => set({ scoresWhileMoving: value }),
  setClimbResult: (value) => set({ climbResult: value }),
  setDriverAbility: (value) => set({ driverAbility: value }),
  setNotes: (value) => set({ notes: value }),

  isClimbing: () => {
    const reportState = get();
    return reportState.events.some(
      (item) => item.type === MatchEventType.Climb,
    );
  },

  stopClimbing: () => {
    const reportState = get();
    if (reportState.events) {
      set({
        events: reportState.events.filter(
          (item) => item.type !== MatchEventType.Climb,
        ),
      });
    }
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
            quantity: event.quantity,
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
        robotBrokeDescription: reportState.robotBrokeDescription,
        robotRole: reportState.robotRole.map(
          (role) =>
            robotRoleDescriptions.find((desc) => desc.role === role)!.num,
        ),
        fieldTraversal: fieldTraversalDescriptions.find(
          (desc) => desc.traversal === reportState.fieldTraversal,
        )!.num,
        disrupts:
          reportState.events.filter((e) => e.type === MatchEventType.Disrupt)
            .length > 0
            ? 1
            : 0,
        accuracy: accuracyDescriptions.find(
          (desc) => desc.accuracy === reportState.accuracy,
        )!.num,
        autoClimb: autoClimbDescriptions.find(
          (desc) => desc.climb === reportState.autoClimb,
        )!.num,
        intakeType: intakeTypeDescriptions.find(
          (desc) => desc.intakeType === reportState.intakeType,
        )!.num,
        feederType: reportState.feederType.map(
          (type) =>
            feederTypeDescriptions.find((desc) => desc.feederType === type)!
              .num,
        ),
        beached: beachedDescriptions.find(
          (desc) => desc.beached === reportState.beached,
        )!.num,
        defenseEffectiveness: defenseEffectivenessDescriptions.find(
          (desc) => desc.effectiveness === reportState.defenseEffectiveness,
        )!.num,
        scoresWhileMoving: scoresWhileMovingDescriptions.find(
          (desc) => desc.scoresWhileMoving === reportState.scoresWhileMoving,
        )!.num,
        climbResult: endgameClimbDescriptions.find(
          (desc) => desc.climb === reportState.climbResult,
        )!.num,
        driverAbility: driverAbilityDescriptions.find(
          (desc) => desc.ability === reportState.driverAbility,
        )!.numericalRating,
        scouterUuid: reportState.meta.scouterUUID,
        teamNumber: reportState.meta.teamNumber,
        events: reportState.events.map((event) => {
          const baseEvent: ScoutReportEvent = [
            (event.timestamp - reportState.startTimestamp!.getTime()) / 1000,
            event.type,
            event.position,
          ];
          if (event.quantity !== undefined) {
            return [
              baseEvent[0],
              baseEvent[1],
              baseEvent[2],
              event.quantity,
            ] as ScoutReportEvent;
          }
          return baseEvent;
        }),
      };
    }
    return null;
  },
  reset: () =>
    set({
      uuid: undefined,
      meta: undefined,
      startTimestamp: undefined,
      startPosition: undefined,
      ...initialState,
    }),
}));
