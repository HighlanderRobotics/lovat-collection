import { Tournament } from "../models/tournament";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { storage } from "./zustandStorage";

type TournamentStore = {
  value: Tournament | null;
  setValue: (value: Tournament | null) => void;
};

export const useTournamentStore = create(
  persist<TournamentStore>(
    (set, get) => ({
      value: null,
      setValue: (value) => set(() => ({ value: value })),
    }),
    {
      name: "activeTournament",
      storage: storage,
    },
  ),
);
