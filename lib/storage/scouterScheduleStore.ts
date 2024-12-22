import AsyncStorage from "@react-native-async-storage/async-storage";
import { get } from "../lovatAPI/lovatAPI";
import { AllianceColor } from "../models/AllianceColor";
import { MatchIdentity, matchTypes } from "../models/match";
import { useTournamentStore } from "./activeTournamentStore";
import { DataSource, LocalCache } from "../localCache";
import { z } from "zod";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { storage } from "./zustandStorage";
import {
  getScouterSchedule,
  ScouterSchedule,
} from "../lovatAPI/getScouterSchedule";

type ScouterScheduleStore = {
  schedule: ScouterSchedule | null;
  getSchedule: (key: string) => Promise<void>;
};

export const useScouterScheduleStore = create(
  persist<ScouterScheduleStore>(
    (set, get) => ({
      schedule: null,
      getSchedule: async (key) => {
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
