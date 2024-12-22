import { createContext } from "react";
import {
  getLocalTournaments,
  getTournamentsCached,
} from "./lovatAPI/getTournaments";
import {
  getLocalTeamScouters,
  getTeamScoutersCached,
} from "./lovatAPI/getTeamScouters";
import { LocalCache } from "./localCache";
import {
  ScouterSchedule,
  getLocalScouterSchedule,
} from "./storage/scouterScheduleStore";
import { Tournament } from "./models/tournament";
import { Scouter } from "./models/scouter";

export type BareServiceValues = {
  tournaments: Tournament[];
  teamScouters: Scouter[];
  scouterSchedule: ScouterSchedule;
};

export type ServiceValues = {
  [key in keyof BareServiceValues]: LocalCache<BareServiceValues[key]> | null;
};

export const ServicesContext = createContext<ServiceValues>({
  tournaments: null,
  teamScouters: null,
  scouterSchedule: null,
});

export const LoadServicesContext = createContext<() => Promise<void>>(
  async () => {},
);

export const servicesLoadingAtom = atom(false);

type Service<S extends keyof ServiceValues> = {
  id: S;
  localizedDescription: string;
  get: () => Promise<LocalCache<BareServiceValues[S]>>;
  getLocal: () => Promise<ServiceValues[S]>;
};

export const services = [
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
      const tournamentKey = (await getTournament())?.key;
      if (!tournamentKey) return null;

      return getLocalScouterSchedule(tournamentKey);
    },
  },
] satisfies Service<keyof ServiceValues>[];
