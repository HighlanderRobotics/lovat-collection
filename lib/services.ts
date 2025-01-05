import { create } from "zustand";
import { persist } from "zustand/middleware";
import { GenericStore, storage } from "./storage/zustandStorage";
import {
  getScouterSchedule,
  ScouterSchedule,
} from "./lovatAPI/getScouterSchedule";
import { Scouter } from "./models/scouter";
import { getTeamScouters } from "./lovatAPI/getTeamScouters";
import { getTournaments, Tournament } from "./lovatAPI/getTournaments";

export function getServiceLoader() {
  const fetchScouterSchedule =
    useScouterScheduleStore.getInitialState().fetchData;
  const fetchTeamScouters = useTeamScoutersStore.getInitialState().fetchData;
  const fetchTournaments = useTournamentsStore.getInitialState().fetchData;
  const setServicesLoading = useServicesLoadingStore.getInitialState().setValue;
  const setServiceError = useServiceErrorStore.getInitialState().setValue;

  return async () => {
    let error: string | null = null;
    try {
      setServicesLoading(true);
      await fetchTournaments();
      await fetchTeamScouters();
      await fetchScouterSchedule();
    } catch (e) {
      console.error(e);
      error = JSON.stringify(e);
    } finally {
      console.log("Fetch successful");
      setServicesLoading(false);
    }
    setServiceError(error);
  };
}

export const useServicesLoadingStore = create<GenericStore<boolean>>((set) => ({
  value: false,
  setValue: (value) => set({ value: value }),
}));

export const useServiceErrorStore = create<GenericStore<string | null>>(
  (set) => ({
    value: null,
    setValue: (value) => set({ value }),
  }),
);

type ServiceStore<T> = {
  data: T;
  timeStamp: Date | null;
  fetchData: () => Promise<void>;
};

export function createGenericServiceStore<T>(
  fetchFn: () => Promise<T>,
  name: string,
) {
  return create(
    persist<ServiceStore<T | null>>(
      (set) => ({
        data: null,
        timeStamp: null,
        fetchData: async () => {
          const data = await fetchFn();
          const timeStamp = new Date();
          set({
            data: data,
            timeStamp: timeStamp,
          });
        },
      }),
      {
        name: name,
        storage: storage,
      },
    ),
  );
}

export const useScouterScheduleStore =
  createGenericServiceStore<ScouterSchedule>(
    getScouterSchedule,
    "scouterScheduleStore",
  );

export const useTeamScoutersStore = createGenericServiceStore<Scouter[]>(
  getTeamScouters,
  "teamScoutersStore",
);

export const useTournamentsStore = createGenericServiceStore<Tournament[]>(
  getTournaments,
  "tournamentsListStore",
);
