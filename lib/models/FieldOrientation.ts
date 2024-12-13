import { atomWithStorage } from "jotai/utils";
import { storage } from "../storage/jotaiStorage";

export enum FieldOrientation {
  Auspicious, // Blue on the left, red on the right
  Sinister, // Red on the left, blue on the right
}

export const fieldOrientationAtom = atomWithStorage<FieldOrientation>(
  "fieldOrientation",
  FieldOrientation.Auspicious,
  storage,
);
