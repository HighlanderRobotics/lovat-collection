import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { getTournaments } from "../lovatAPI/getTournaments";

export const useTournamentKey = create(
  persist<{
    key: string | null;
    setKey: (key: string | null) => void;
  }>(
    (set) => ({
      key: null,
      setKey: (key: string | null) => set({ key }),
    }),
    {
      name: "zustand-tournament",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export const getTournament = async (key: string) => {
  const tournaments = await getTournaments();

  return tournaments.find((t) => t.key === key) ?? null;
};
