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
  setDisrupts: (value) => set({ disrupts: value }),
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
          (role) => robotRoleDescriptions[role].num,
        ),
        fieldTraversal:
          fieldTraversalDescriptions[reportState.fieldTraversal].num,
        disrupts: reportState.disrupts ? 1 : 0,
        accuracy: accuracyDescriptions[reportState.accuracy].num,
        autoClimb: autoClimbDescriptions[reportState.autoClimb].num,
        intakeType: intakeTypeDescriptions[reportState.intakeType].num,
        feederType: reportState.feederType.map(
          (type) => feederTypeDescriptions[type].num,
        ),
        beached: beachedDescriptions[reportState.beached].num,
        defenseEffectiveness:
          defenseEffectivenessDescriptions[reportState.defenseEffectiveness]
            .num,
        scoresWhileMoving:
          scoresWhileMovingDescriptions[reportState.scoresWhileMoving].num,
        climbResult: endgameClimbDescriptions[reportState.climbResult].num,
        driverAbility:
          driverAbilityDescriptions[reportState.driverAbility].numericalRating,
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
