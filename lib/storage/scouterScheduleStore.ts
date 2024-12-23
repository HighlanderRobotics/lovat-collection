import { create } from "zustand";
import { persist } from "zustand/middleware";
import { storage } from "./zustandStorage";
import {
  getScouterSchedule,
  ScouterSchedule,
} from "../lovatAPI/getScouterSchedule";

type ScouterScheduleStore = {
  schedule: ScouterSchedule | null;
  fetchScouterSchedule: (key: string) => Promise<void>;
};

export const useScouterScheduleStore = create(
  persist<ScouterScheduleStore>(
    (set, get) => ({
      schedule: null,
      fetchScouterSchedule: async (key) => {
        const schedule = await getScouterSchedule(key);
        set(() => ({ schedule: schedule }));
      },
    }),
    {
      name: "scouterScheduleStore",
      storage: storage,
    },
  ),
);
