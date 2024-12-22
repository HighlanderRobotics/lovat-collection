import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getTeamScouters } from '../lovatAPI/getTeamScouters';
import { storage } from './zustandStorage';
import { Scouter } from '../models/scouter';

type TeamScoutersStore = {
    scouters: Scouter[],
    fetchScouters: () => Promise<void>,
}

export const useTeamScoutersStore = create(
    persist<TeamScoutersStore>(
        (set, get) => ({
            scouters: [],
            fetchScouters: async () => set({scouters: await getTeamScouters()})
        }),
        {
            storage: storage,
            name: "teamScouters"
        }
    )
)