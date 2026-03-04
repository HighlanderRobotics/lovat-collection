import { ScoutReport, ScoutReportEvent } from "../collection/ScoutReport";
import { MatchEventType } from "../collection/MatchEventType";
import Constants from "expo-constants";

const currentAppVersion = Constants.expoConfig?.version;

function compareVersions(a: string, b: string): number {
  const partsA = a.split(".").map(Number);
  const partsB = b.split(".").map(Number);
  for (let i = 0; i < Math.max(partsA.length, partsB.length); i++) {
    const numA = partsA[i] ?? 0;
    const numB = partsB[i] ?? 0;
    if (numA !== numB) return numA - numB;
  }
  return 0;
}

const startToStopEventType: Partial<Record<MatchEventType, MatchEventType>> = {
  [MatchEventType.StartScoring]: MatchEventType.StopScoring,
  [MatchEventType.StartFeeding]: MatchEventType.StopFeeding,
};

function migrateOrphanedStartEvents(
  events: ScoutReportEvent[],
): ScoutReportEvent[] {
  const result: ScoutReportEvent[] = [];

  for (let i = events.length - 1; i >= 0; i--) {
    const [time, eventType, position] = events[i];
    const stopType = startToStopEventType[eventType as MatchEventType];

    if (stopType !== undefined) {
      const next = result[0];
      if (!next || next[1] !== stopType) {
        result.unshift([time + 0.001, stopType, position, 1]);
      }
    }
    result.unshift(events[i]);
  }

  return result;
}

type ScoutReportMigration = {
  version: string;
  migrate: (scoutReport: ScoutReport) => ScoutReport;
};

const scoutReportMigrations: ScoutReportMigration[] = [
  {
    version: "26.0.3",
    migrate: (scoutReport) => ({
      ...scoutReport,
      events: migrateOrphanedStartEvents(scoutReport.events),
    }),
  },
];

export function migrateScoutReport(scoutReport: ScoutReport): ScoutReport {
  let migrated = scoutReport;

  for (const migration of scoutReportMigrations) {
    if (
      migrated.appVersion === undefined ||
      compareVersions(migrated.appVersion, migration.version) < 0
    ) {
      migrated = migration.migrate(migrated);
    }
  }

  if (migrated.appVersion !== currentAppVersion) {
    migrated = { ...migrated, appVersion: currentAppVersion };
  }

  return migrated;
}
