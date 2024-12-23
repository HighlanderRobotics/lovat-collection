import { create } from "zustand";
import { persist } from "zustand/middleware";
import { getTournaments } from "../lovatAPI/getTournaments";
import { Tournament } from "../lovatAPI/getTournaments";
import { storage } from "./zustandStorage";
import { Scouter } from "../models/scouter";

type TournamentsStore = {
  tournaments: Tournament[];
  fetchTournaments: () => Promise<void>;
};

export const useTournamentsStore = create(
  persist<TournamentsStore>(
    (set, get) => ({
      tournaments: [],
      fetchTournaments: async () =>
        set({ tournaments: await getTournaments() }),
    }),
    {
      storage: storage,
      name: "tournamentsListStore",
    },
  ),
);
