import { GamePhase, ReportState } from "./ReportState";
import { MatchEventPosition } from "./MatchEventPosition";
import { create } from "zustand";
import { v4 } from "uuid";
import { DriverAbility, driverAbilityDescriptions } from "./DriverAbility";
import { MatchEvent } from "./MatchEvent";
import { MatchType } from "../models/match";
import { ScoutReportEvent } from "./ScoutReport";
import { RobotRole } from "./RobotRole";
import { FieldTraversal } from "./FieldTraversal";
import { Accuracy, accuracyDescriptions } from "./Accuracy";
import { AutoClimb } from "./AutoClimb";
import { IntakeType } from "./IntakeType";
import { FeederType } from "./FeederType";
import { Beached } from "./Beached";
import {
  DefenseEffectiveness,
  defenseEffectivenessDescriptions,
} from "./DefenseEffectiveness";
import { ScoresWhileMoving } from "./ScoresWhileMoving";
import { EndgameClimb } from "./EndgameClimb";
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

  hasEventOfType: (...types: MatchEventType[]) => {
    const reportState = get();
    return reportState.events.some((event) => types.includes(event.type));
  },

  hasEndgameClimbEvent: () => {
    const reportState = get();
    if (!reportState.startTimestamp) return false;

    const autoEndTime = reportState.startTimestamp.getTime() + 18 * 1000;
    return reportState.events.some(
      (event) =>
        event.type === MatchEventType.Climb && event.timestamp >= autoEndTime,
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
      // Map RobotRole enum to string
      const robotRoleToString = (
        role: RobotRole,
      ): "CYCLING" | "SCORING" | "FEEDING" | "DEFENDING" | "IMMOBILE" => {
        switch (role) {
          case RobotRole.Cycling:
            return "CYCLING";
          case RobotRole.Scoring:
            return "SCORING";
          case RobotRole.Feeding:
            return "FEEDING";
          case RobotRole.Defending:
            return "DEFENDING";
          case RobotRole.Immobile:
            return "IMMOBILE";
        }
      };

      // Map FieldTraversal enum to mobility string
      const fieldTraversalToString = (
        traversal: FieldTraversal,
      ): "TRENCH" | "BUMP" | "BOTH" | "NONE" => {
        switch (traversal) {
          case FieldTraversal.Trench:
            return "TRENCH";
          case FieldTraversal.Bump:
            return "BUMP";
          case FieldTraversal.Both:
            return "BOTH";
          case FieldTraversal.None:
            return "NONE";
        }
      };

      // Map AutoClimb enum to string
      const autoClimbToString = (
        climb: AutoClimb,
      ): "NOT_ATTEMPTED" | "FAILED" | "SUCCEEDED" => {
        switch (climb) {
          case AutoClimb.NotAttempted:
            return "NOT_ATTEMPTED";
          case AutoClimb.Failed:
            return "FAILED";
          case AutoClimb.Succeeded:
            return "SUCCEEDED";
        }
      };

      // Map IntakeType enum to string
      const intakeTypeToString = (
        intakeType: IntakeType,
      ): "GROUND" | "OUTPOST" | "BOTH" | "NEITHER" => {
        switch (intakeType) {
          case IntakeType.Ground:
            return "GROUND";
          case IntakeType.Outpost:
            return "OUTPOST";
          case IntakeType.Both:
            return "BOTH";
          case IntakeType.Neither:
            return "NEITHER";
        }
      };

      // Map FeederType enum to string
      const feederTypeToString = (
        feederType: FeederType,
      ): "CONTINUOUS" | "STOP_TO_SHOOT" | "DUMP" => {
        switch (feederType) {
          case FeederType.Continuous:
            return "CONTINUOUS";
          case FeederType.StopToShoot:
            return "STOP_TO_SHOOT";
          case FeederType.Dump:
            return "DUMP";
        }
      };

      // Map Beached enum to string
      const beachedToString = (
        beached: Beached,
      ): "ON_FUEL" | "ON_BUMP" | "BOTH" | "NEITHER" => {
        switch (beached) {
          case Beached.OnFuel:
            return "ON_FUEL";
          case Beached.OnBump:
            return "ON_BUMP";
          case Beached.Both:
            return "BOTH";
          case Beached.Neither:
            return "NEITHER";
        }
      };

      // Map EndgameClimb enum to string
      const endgameClimbToString = (
        climb: EndgameClimb,
      ): "NOT_ATTEMPTED" | "FAILED" | "L1" | "L2" | "L3" => {
        switch (climb) {
          case EndgameClimb.NotAttempted:
            return "NOT_ATTEMPTED";
          case EndgameClimb.Failed:
            return "FAILED";
          case EndgameClimb.L1:
            return "L1";
          case EndgameClimb.L2:
            return "L2";
          case EndgameClimb.L3:
            return "L3";
        }
      };

      // Map MatchType to string
      const matchTypeToString = (
        matchType: MatchType,
      ): "QUALIFICATION" | "ELIMINATION" => {
        switch (matchType) {
          case MatchType.Qualifier:
            return "QUALIFICATION";
          case MatchType.Elimination:
            return "ELIMINATION";
        }
      };

      return {
        uuid: reportState.uuid,
        tournamentKey: reportState.meta.matchIdentity.tournamentKey,
        matchType: matchTypeToString(reportState.meta.matchIdentity.matchType),
        matchNumber: reportState.meta.matchIdentity.matchNumber,
        startTime: reportState.startTimestamp?.getTime() ?? 0,
        notes: reportState.notes,
        robotBrokeDescription: reportState.robotBrokeDescription,
        robotRoles: reportState.robotRole.map(robotRoleToString),
        mobility: fieldTraversalToString(reportState.fieldTraversal),
        disrupts: get().hasEventOfType(MatchEventType.Disrupt),
        accuracy: accuracyDescriptions.find(
          (desc) => desc.accuracy === reportState.accuracy,
        )!.num,
        autoClimb: autoClimbToString(reportState.autoClimb),
        intakeType: intakeTypeToString(reportState.intakeType),
        feederTypes: reportState.feederType.map(feederTypeToString),
        beached: beachedToString(reportState.beached),
        defenseEffectiveness: defenseEffectivenessDescriptions.find(
          (desc) => desc.effectiveness === reportState.defenseEffectiveness,
        )!.num,
        scoresWhileMoving:
          reportState.scoresWhileMoving === ScoresWhileMoving.Yes,
        endgameClimb: endgameClimbToString(reportState.climbResult),
        driverAbility: driverAbilityDescriptions.find(
          (desc) => desc.ability === reportState.driverAbility,
        )!.numericalRating,
        scouterUuid: reportState.meta.scouterUUID,
        teamNumber: reportState.meta.teamNumber,
        events: [
          ...(reportState.startTimestamp
            ? [
                [
                  0,
                  MatchEventType.StartMatch,
                  reportState.startPosition ?? MatchEventPosition.None,
                ] satisfies ScoutReportEvent,
              ]
            : []),
          ...reportState.events.map((event) => {
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
              ] satisfies ScoutReportEvent;
            }
            return baseEvent;
          }),
        ],
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
