import AsyncStorage from "@react-native-async-storage/async-storage";
import { get } from "../lovatAPI/lovatAPI";
import { AllianceColor } from "../models/AllianceColor";
import { matchIdentitySchema } from "../models/match";
import { getTournament, tournamentAtom } from "./getTournament";
import { DataSource, LocalCache } from "../localCache";
import { atomWithDefault } from "jotai/utils";
import { z } from "zod";

const scouterScheduleScouterEntrySchema = z.object({
  teamNumber: z.number(),
  allianceColor: z
    .union([z.nativeEnum(AllianceColor), z.string()])
    .transform((value) => {
      if (typeof value === "string") {
        return value === "red" ? AllianceColor.Red : AllianceColor.Blue;
      } else {
        return value;
      }
    }),
});

export type ScouterScheduleScouterEntry = z.infer<
  typeof scouterScheduleScouterEntrySchema
>;

const scouterScheduleMatchSchema = z.object({
  matchIdentity: matchIdentitySchema,
  scouters: z.record(scouterScheduleScouterEntrySchema),
});

export type ScouterScheduleMatch = z.infer<typeof scouterScheduleMatchSchema>;

const scouterScheduleSchema = z.object({
  tournamentKey: z.string(),
  hash: z.string(),
  data: z.array(scouterScheduleMatchSchema),
});

export type ScouterSchedule = z.infer<typeof scouterScheduleSchema>;

export async function getScouterSchedule(
  tournamentKey: string,
): Promise<ScouterSchedule> {
  const response = await get("/v1/manager/scouterschedules/" + tournamentKey);

  if (!response.ok) {
    throw new Error("Error fetching scouter schedule");
  }

  const json = await response.json();

  const schedule = scouterScheduleSchema.parse({
    ...json,
    tournamentKey,
  });

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
