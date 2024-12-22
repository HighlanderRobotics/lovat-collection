import { create } from "zustand";
import { storage } from "../storage/zustandStorage";
import { persist } from "zustand/middleware";

export enum FieldOrientation {
  Auspicious, // Blue on the left, red on the right
  Sinister, // Red on the left, blue on the right
}

type FieldOrientationStore = {
  value: FieldOrientation;
  setValue: (value: FieldOrientation) => void;
};

export const useFieldOrientationStore = create(
  persist<FieldOrientationStore>(
    (set, get) => ({
      value: FieldOrientation.Auspicious,
      setValue: (value) => set(() => ({ value: value })),
    }),
    {
      name: "fieldOrienetation",
      storage: storage,
    },
  ),
);
