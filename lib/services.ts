import { createContext } from "react";
import { getLocalTournaments, getTournamentsCached } from "./lovatAPI/getTournaments";
import { getLocalTeamScouters, getTeamScoutersCached } from "./lovatAPI/getTeamScouters";
import { LocalCache } from "./localCache";
import { ScouterSchedule, getCurrentScouterScheduleCached, getLocalScouterSchedule } from "./storage/scouterSchedules";
import { atom } from "jotai";
import { getTournament } from "./storage/getTournament";

export type ServiceValues = {
    tournaments: LocalCache<Tournament[]> | null;
    teamScouters: LocalCache<Scouter[]> | null;
    scouterSchedule: LocalCache<ScouterSchedule> | null;
}

export const ServicesContext = createContext<ServiceValues>({
    tournaments: null,
    teamScouters: null,
    scouterSchedule: null,
});

export const LoadServicesContext = createContext<() => Promise<void>>(async () => {});

export const servicesLoadingAtom = atom(false);

type Service<T> = {
    id: keyof ServiceValues;
    localizedDescription: string;
    get: () => Promise<LocalCache<T>>;
    getLocal: () => Promise<LocalCache<T> | null>;
}

export const services: Service<any>[] = [
    {
        id: "tournaments",
        localizedDescription: "Tournaments",
        get: getTournamentsCached,
        getLocal: getLocalTournaments,
    },
    {
        id: "teamScouters",
        localizedDescription: "Scouters",
        get: getTeamScoutersCached,
        getLocal: getLocalTeamScouters,
    },
    {
        id: "scouterSchedule",
        localizedDescription: "Scouter Schedule",
        get: getCurrentScouterScheduleCached,
        getLocal: async () => {
            const tournamentKey = (await getTournament())?.key
            if (!tournamentKey) return null;

            return getLocalScouterSchedule(tournamentKey);
        },
    }
]
