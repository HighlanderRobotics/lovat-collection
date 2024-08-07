import AsyncStorage from "@react-native-async-storage/async-storage";
import { get } from "../lovatAPI/lovatAPI";
import { AllianceColor } from "../models/AllianceColor";
import { MatchIdentity, matchTypes } from "../models/match";
import { getTournament, tournamentAtom } from "./getTournament";
import { DataSource, LocalCache } from "../localCache";
import { atomWithDefault } from "jotai/utils";
import { z } from "zod";

const scouterScheduleResponseSchema = z.object({
  hash: z.string(),
  data: z.array(
    z.object({
      matchType: z.number(),
      matchNumber: z.number(),
      scouters: z.record(
        z.object({
          team: z.number(),
          alliance: z.union([z.literal("red"), z.literal("blue")]),
        }),
      ),
    }),
  ),
});

export type ScouterSchedule = {
  tournamentKey: string;
  hash: string;
  data: ScouterScheduleMatch[];
};

export type ScouterScheduleMatch = {
  matchIdentity: MatchIdentity;
  scouters: {
    [scouterUUID: string]: ScouterScheduleScouterEntry;
  };
};

type ScouterScheduleScouterEntry = {
  teamNumber: number;
  allianceColor: AllianceColor;
};

export async function getScouterSchedule(
  tournamentKey: string,
): Promise<ScouterSchedule> {
  const response = await get("/v1/manager/scouterschedules/" + tournamentKey);

  if (!response.ok) {
    throw new Error("Error fetching scouter schedule");
  }

  const json = scouterScheduleResponseSchema.parse(await response.json());

  const data = json.data.map((match) => {
    const matchType = matchTypes.find(
      (matchType) => matchType.num === match.matchType,
    )?.type;

    if (!matchType) throw new Error("Invalid match type: " + match.matchType);

    return {
      ...match,
      matchIdentity: {
        tournamentKey,
        matchType,
        matchNumber: match.matchNumber,
      } as MatchIdentity,
      scouters: Object.fromEntries(
        Object.entries(match.scouters).map(([key, value]) => {
          return [
            key,
            {
              ...value,
              teamNumber: value.team,
              allianceColor:
                value.alliance === "red"
                  ? AllianceColor.Red
                  : AllianceColor.Blue,
            },
          ];
        }),
      ),
    };
  });

  const schedule: ScouterSchedule = {
    data: data,
    hash: json.hash,
    tournamentKey,
  };

  cacheScouterSchedule(schedule);

  return schedule as ScouterSchedule;
}

const cacheScouterSchedule = async (schedule: ScouterSchedule) => {
  const cachedSchedule: ScouterSchedule = {
    tournamentKey: schedule.tournamentKey,
    hash: schedule.hash,
    data: schedule.data,
  };

  const scheduleCache: LocalCache<ScouterSchedule> = {
    data: cachedSchedule,
    sourcedAt: new Date().getTime(),
    source: DataSource.Cache,
  };

  await AsyncStorage.setItem(
    "scouter-schedule-" + schedule.tournamentKey,
    JSON.stringify(scheduleCache),
  );
};

export const getLocalScouterSchedule = async (tournamentKey: string) => {
  const cachedScheduleString = await AsyncStorage.getItem(
    "scouter-schedule-" + tournamentKey,
  );

  if (!cachedScheduleString) {
    return null;
  }

  const cachedSchedule = JSON.parse(
    cachedScheduleString,
  ) as LocalCache<ScouterSchedule>;

  return cachedSchedule;
};

export const getScouterScheduleCached = async (tournamentKey: string) => {
  try {
    return {
      data: await getScouterSchedule(tournamentKey),
      sourcedAt: new Date().getTime(),
      source: DataSource.Server,
    } as LocalCache<ScouterSchedule>;
  } catch (e) {
    const cachedSchedule = await getLocalScouterSchedule(tournamentKey);

    if (!cachedSchedule) {
      throw e;
    }

    return cachedSchedule;
  }
};

export const getCurrentScouterScheduleCached = async () => {
  const tournament = await getTournament();

  if (!tournament) {
    throw new Error("No tournament set");
  }

  return await getScouterScheduleCached(tournament.key);
};

export const getVerionsColor = (
  hash: string,
  saturation: number,
  value: number,
) => {
  let sum = 0;

  for (let i = 0; i < hash.length; i++) {
    sum += hash.charCodeAt(i);
  }

  const hue = (sum * Math.E) % 360;

  return `hsl(${hue}, ${saturation}%, ${value}%)`;
};

export const scouterScheduleAtom = atomWithDefault(async (get) => {
  try {
    const tournament = await get(tournamentAtom);

    if (!tournament) {
      return null;
    }

    return await getCurrentScouterScheduleCached();
  } catch (e) {
    console.error(e);
    return undefined;
  }
});
