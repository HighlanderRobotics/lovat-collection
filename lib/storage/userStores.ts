import { createGenericPersistantStore, GenericStore } from "./zustandStorage";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { storage } from "./zustandStorage";
import { Scouter } from "../models/scouter";
import { Tournament } from "../models/tournament";

type TeamStore = {
    code: string,
    number: number | null,
    setCode: (value: string) => void,
    setNumber: (value: number) => void,
}

export const useTeamStore = create(
    persist<TeamStore>(
        (set, get) => ({
            code: "",
            number: null,
            setCode: (value) => set({code: value}),
            setNumber: (value) => set({number: value})
        }),
        {
            name: "teamStore",
            storage: storage
        }
    )
)

export const useStartMatchEnabledStore = create<GenericStore<boolean>>((set, get) => ({
  value: false,
  setValue: (value) => set(() => ({ value: value })),
}));
  
export enum FieldOrientation {
  Auspicious, // Blue on the left, red on the right
  Sinister, // Red on the left, blue on the right
}

export const onboardingCompleteStore = createGenericPersistantStore<boolean>("onboardingCompleteStore", false)
export const useScouterStore = createGenericPersistantStore<Scouter | null>("scouterStore", null)
export const useTournamentStore = createGenericPersistantStore<Tournament | null>("activeTournamentStore", null)
export const useTrainingModeStore = createGenericPersistantStore<boolean>("trainingModeStore", false)
export const useQrCodeSizeStore = createGenericPersistantStore<number>("qrCodeSizeStore", 600)
export const useFieldOrientationStore = createGenericPersistantStore<FieldOrientation>("fieldOrienetationStore", FieldOrientation.Auspicious)