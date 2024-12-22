import { ScoutReport, scoutReportSchema } from "../collection/ScoutReport";
import { storage } from "./zustandStorage";
import { create } from "zustand";
import {
  ScoutReportMeta,
  scoutReportMetaSchema,
} from "../models/ScoutReportMeta";
import { z } from "zod";
import { persist } from "zustand/middleware";

export const historyEntrySchema = z.object({
  scoutReport: scoutReportSchema,
  meta: scoutReportMetaSchema,
  uploaded: z.boolean(),
});

export type HistoryEntry = z.infer<typeof historyEntrySchema>;

type HistoryStore = {
  history: HistoryEntry[];
  upsertMatch: (
    scoutReport: ScoutReport,
    uploaded: boolean,
    meta: ScoutReportMeta,
  ) => void;
  setMatchUploaded: (uuid: string) => void;
  deleteMatch: (uuid: string) => void;
};

export const useHistoryStore = create(
  persist<HistoryStore>(
    (set, get) => ({
      history: [],

      upsertMatch: (scoutReport, uploaded, meta) => {
        const history = get().history;

        if (
          history.some((entry) => entry.scoutReport.uuid === scoutReport.uuid)
        ) {
          const newHistory = history.filter(
            (entry) => entry.scoutReport.uuid !== scoutReport.uuid,
          );
          set((state) => ({
            history: [{ scoutReport, uploaded, meta }, ...newHistory],
          }));
          return;
        }

        set((state) => ({
          history: [{ scoutReport, uploaded, meta }, ...history],
        }));
      },

      setMatchUploaded: (uuid) => {
        set((state) => ({
          history: state.history.map((entry) => {
            if (entry.scoutReport.uuid === uuid) {
              return { ...entry, uploaded: true } as HistoryEntry;
            }
            return entry as HistoryEntry;
          }),
        }));
      },

      deleteMatch: (uuid) =>
        set((state) => ({
          history: state.history.filter(
            (entry) => entry.scoutReport.uuid !== uuid,
          ),
        })),
    }),
    {
      name: "history",
      storage: storage,
    },
  ),
);
