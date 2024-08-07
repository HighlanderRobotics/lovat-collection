import { atomWithStorage } from "jotai/utils";
import { ScoutReport, scoutReportSchema } from "../collection/ScoutReport";
import { createStorage } from "./jotaiStorage";
import { useAtom } from "jotai";
import {
  ScoutReportMeta,
  scoutReportMetaSchema,
} from "../models/ScoutReportMeta";
import { z } from "zod";

export const historyEntrySchema = z.object({
  scoutReport: scoutReportSchema,
  meta: scoutReportMetaSchema,
  uploaded: z.boolean(),
});

export type HistoryEntry = z.infer<typeof historyEntrySchema>;

export const historyAtom = atomWithStorage<HistoryEntry[]>(
  "history",
  [],
  createStorage(z.array(historyEntrySchema)),
);

export const useUpsertMatchToHistory = () => {
  const [history, setHistory] = useAtom(historyAtom);
  return (
    scoutReport: ScoutReport,
    uploaded: boolean,
    meta: ScoutReportMeta,
  ) => {
    if (history.some((entry) => entry.scoutReport.uuid === scoutReport.uuid)) {
      const newHistory = history.filter(
        (entry) => entry.scoutReport.uuid !== scoutReport.uuid,
      );
      setHistory([{ scoutReport, uploaded, meta }, ...newHistory]);
      return;
    }

    setHistory([{ scoutReport, uploaded, meta }, ...history]);
  };
};

export const useSetMatchUploaded = () => {
  const [history, setHistory] = useAtom(historyAtom);
  return (uuid: string) => {
    setHistory(
      history.map((entry) => {
        if (entry.scoutReport.uuid === uuid) {
          return { ...entry, uploaded: true };
        }
        return entry;
      }),
    );
  };
};

export const useDeleteMatchFromHistory = () => {
  const [history, setHistory] = useAtom(historyAtom);
  return (uuid: string) => {
    setHistory(history.filter((entry) => entry.scoutReport.uuid !== uuid));
  };
};
