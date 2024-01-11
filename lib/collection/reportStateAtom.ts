import { atom } from "jotai";
import { ReportState } from "./ReportState";

export const reportStateAtom = atom<ReportState | null>(null);
