import AsyncStorage from "@react-native-async-storage/async-storage";
import { getScouter } from "../storage/getScouter";
import { get } from "./lovatAPI";
import { DataSource, LocalCache, localCacheSchema } from "../localCache";
import { Tournament, tournamentSchema } from "../models/tournament";
import z from "zod";

export const getTournaments = async () => {
  const scouter = await getScouter();

  const response = await get(
    `/v1/manager/scouters/${scouter.uuid}/tournaments`,
  );

  if (!response.ok) {
    throw new Error("Error fetching tournaments");
  }

  const json = await response.json();

  const { tournaments } = z
    .object({ tournaments: z.array(tournamentSchema) })
    .parse(json);

  cacheTournaments(tournaments);

  return tournaments;
};

const cacheTournaments = async (tournaments: Tournament[]) => {
  const cachedTournaments: LocalCache<Tournament[]> = {
    data: tournaments,
    sourcedAt: new Date().getTime(),
    source: DataSource.Cache,
  };

  await AsyncStorage.setItem(
    "tournaments-cache",
    JSON.stringify(cachedTournaments),
  );
};

export const getLocalTournaments: () => Promise<LocalCache<
  Tournament[]
> | null> = async () => {
  const cachedTournamentsString =
    await AsyncStorage.getItem("tournaments-cache");

  if (!cachedTournamentsString) {
    return null;
  }

  const cachedTournaments = localCacheSchema(z.array(tournamentSchema)).parse(
    JSON.parse(cachedTournamentsString),
  );

  return cachedTournaments;
};

export const getTournamentsCached: () => Promise<
  LocalCache<Tournament[]>
> = async () => {
  try {
    return {
      data: await getTournaments(),
      sourcedAt: new Date().getTime(),
      source: DataSource.Server,
    };
  } catch (e) {
    const cachedTournaments = await getLocalTournaments();

    if (!cachedTournaments) {
      throw e;
    }

    return cachedTournaments;
  }
};

export const raceTournamentsCached = async () => {
  const cached = getLocalTournaments;
  const server = async () => {
    const tournaments = await getTournaments();
    const localCache: LocalCache<Tournament[]> = {
      data: tournaments,
      sourcedAt: new Date().getTime(),
      source: DataSource.Server,
    };

    return localCache;
  };

  const output = await Promise.any([cached(), server()]);

  if (!output || output.data === undefined || output.data === null) {
    return await server();
  }

  return output;
};
