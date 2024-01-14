import { getTeamNumber } from "../storage/getTeamNumber";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { DataSource, LocalCache } from "../localCache";
import { get } from "./lovatAPI";

export const getTeamScouters = async () => {
  const teamNumber = await getTeamNumber();

  const response = await get(`/manager/scouters`);

  if (!response.ok) {
    console.log(await response.text());
    throw new Error("Error fetching scouters");
  }

  const json = await response.json();

  cacheTeamScouters(json);

  return json as Scouter[];
}

const cacheTeamScouters = async (scouters: Scouter[]) => {
  const cachedScouters: LocalCache<Scouter[]> = {
    data: scouters,
    sourcedAt: new Date().getTime(),
    source: DataSource.Cache,
  };

  await AsyncStorage.setItem("scouters-cache", JSON.stringify(cachedScouters));
}

const getLocalTeamScouters = async () => {
  const cachedScoutersString = await AsyncStorage.getItem("scouters-cache");

  if (!cachedScoutersString) {
    return null;
  }

  const cachedScouters = JSON.parse(cachedScoutersString) as LocalCache<Scouter[]>;

  return cachedScouters;
}

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
}
