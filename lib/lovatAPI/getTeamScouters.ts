import AsyncStorage from "@react-native-async-storage/async-storage";
import { DataSource, LocalCache } from "../localCache";
import { get } from "./lovatAPI";
import { Scouter, scouterSchema } from "../models/scouter";
import { z } from "zod";

export const getTeamScouters = async () => {
  const response = await get(`/v1/manager/scouters`);

  if (!response.ok) {
    throw new Error("Error fetching scouters");
  }

  const json = z.array(scouterSchema).parse(await response.json());

  return json;
};

const cacheTeamScouters = async (scouters: Scouter[]) => {
  const cachedScouters: LocalCache<Scouter[]> = {
    data: scouters,
    sourcedAt: new Date().getTime(),
    source: DataSource.Cache,
  };

  await AsyncStorage.setItem("scouters-cache", JSON.stringify(cachedScouters));
};

export const getLocalTeamScouters = async () => {
  const cachedScoutersString = await AsyncStorage.getItem("scouters-cache");

  if (!cachedScoutersString) {
    return null;
  }

  const cachedScouters = JSON.parse(cachedScoutersString) as LocalCache<
    Scouter[]
  >;

  return cachedScouters;
};

export const getTeamScoutersCached = async () => {
  try {
    return {
      data: await getTeamScouters(),
      sourcedAt: new Date().getTime(),
      source: DataSource.Server,
    } as LocalCache<Scouter[]>;
  } catch (e) {
    const cachedScouters = await getLocalTeamScouters();

    if (!cachedScouters) {
      throw e;
    }

    return cachedScouters;
  }
};
