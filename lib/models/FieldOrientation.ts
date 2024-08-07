import { atomWithStorage } from "jotai/utils";
import { createStorage } from "../storage/jotaiStorage";
import { z } from "zod";

export enum FieldOrientation {
  Auspicious, // Blue on the left, red on the right
  Sinister, // Red on the left, blue on the right
}

export const fieldOrientationAtom = atomWithStorage(
  "fieldOrientation",
  FieldOrientation.Auspicious,
  createStorage(z.nativeEnum(FieldOrientation)),
);
