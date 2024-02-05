import { createContext } from "react";
import { getTournamentsCached } from "./lovatAPI/getTournaments";
import { getTeamScoutersCached } from "./lovatAPI/getTeamScouters";
import { LocalCache } from "./localCache";
import { ScouterSchedule, getCurrentScouterScheduleCached } from "./storage/scouterSchedules";

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

type Service<T> = {
    id: keyof ServiceValues;
    localizedDescription: string;
    get: () => Promise<LocalCache<T>>;
}

export const services: Service<any>[] = [
    {
        id: "tournaments",
        localizedDescription: "Tournaments",
        get: getTournamentsCached,
    },
    {
        id: "teamScouters",
        localizedDescription: "Scouters",
        get: getTeamScoutersCached,
    },
    {
        id: "scouterSchedule",
        localizedDescription: "Scouter Schedule",
        get: getCurrentScouterScheduleCached,
    }
]
