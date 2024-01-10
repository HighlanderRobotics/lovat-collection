import { createContext } from "react";
import { getTournamentsCached } from "./lovatAPI/getTournaments";
import { getTeamScoutersCached } from "./lovatAPI/getTeamScouters";
import { LocalCache } from "./localCache";

export type ServiceValues = {
    tournaments: LocalCache<Tournament[]> | null;
    teamScouters: LocalCache<Scouter[]> | null;
}

export const ServicesContext = createContext<ServiceValues>({
    tournaments: null,
    teamScouters: null,
});

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
]
