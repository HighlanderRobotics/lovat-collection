import { atomWithStorage } from "jotai/utils";
import { ScoutReport } from "../collection/ScoutReport";
import { storage } from "./jotaiStorage";
import { useAtom } from "jotai";
import { ScoutReportMeta } from "../models/ScoutReportMeta";

export type HistoryEntry = {
    scoutReport: ScoutReport;
    meta: ScoutReportMeta;
    uploaded: boolean;
}

export const historyAtom = atomWithStorage<HistoryEntry[]>("history", [], storage);

export const useUpsertMatchToHistory = () => {
    const [history, setHistory] = useAtom(historyAtom);
    return (scoutReport: ScoutReport, uploaded: boolean, meta: ScoutReportMeta) => {
        if (history.some((entry) => entry.scoutReport.uuid === scoutReport.uuid)) {
            const newHistory = history.filter((entry) => entry.scoutReport.uuid !== scoutReport.uuid);
            setHistory([{ scoutReport, uploaded, meta }, ...newHistory]);
            return;
        }

        setHistory([{ scoutReport, uploaded, meta }, ...history]);
    };
}

export const useSetMatchUploaded = () => {
    const [history, setHistory] = useAtom(historyAtom);
    return (uuid: string) => {
        setHistory(history.map((entry) => {
            if (entry.scoutReport.uuid === uuid) {
                return { ...entry, uploaded: true };
            }
            return entry;
        }));
    };
}
