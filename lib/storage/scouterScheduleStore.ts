import { create } from "zustand";
import { persist } from "zustand/middleware";
import { storage } from "./zustandStorage";
import {
  getScouterSchedule,
  ScouterSchedule,
} from "../lovatAPI/getScouterSchedule";

type ScouterScheduleStore = {
  schedule: ScouterSchedule | null;
  fetchScouterSchedule: () => Promise<void>;
};

export const useScouterScheduleStore = create(
  persist<ScouterScheduleStore>(
    (set) => ({
      schedule: null,
      fetchScouterSchedule: async () => {
        const schedule = await getScouterSchedule();
        set(() => ({ schedule: schedule }));
      },
    }),
    {
      name: "scouterScheduleStore",
      storage: storage,
    },
  ),
);
