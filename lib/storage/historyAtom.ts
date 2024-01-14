import { atomWithStorage } from "jotai/utils";
import { ScoutReport } from "../collection/ScoutReport";
import { storage } from "./jotaiStorage";

export const historyAtom = atomWithStorage<ScoutReport[]>("history", [], storage);
