import AsyncStorage from "@react-native-async-storage/async-storage";
import { get } from "../lovatAPI/lovatAPI";
import { AllianceColor } from "../models/AllianceColor";
import { MatchIdentity } from "../models/match";
import { getTournament, tournamentAtom } from "./getTournament";
import { DataSource, LocalCache } from "../localCache";
import { useAtomValue, atom } from "jotai";
import { atomWithDefault } from "jotai/utils";

export type ScouterSchedule = {
    tournamentKey: string;
    hash: string;
    data: ScouterScheduleMatch[];
}

type ScouterScheduleMatch = {
    matchIdentity: MatchIdentity;
    scouters: {
        [scouterUUID: string]: ScouterScheduleScouterEntry;
    }
}

type ScouterScheduleScouterEntry = {
    teamNumber: number;
    allianceColor: AllianceColor;
}

export async function getScouterSchedule(tournamentKey: string): Promise<ScouterSchedule> {
    const response = await get("/manager/scouterschedules/" + tournamentKey);

    if (!response.ok) {
        throw new Error("Error fetching scouter schedule");
    }

    const schedule: ScouterSchedule = {...await response.json(), tournamentKey};

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

    await AsyncStorage.setItem("scouter-schedule-" + schedule.tournamentKey, JSON.stringify(scheduleCache));
}

const getLocalScouterSchedule = async (tournamentKey: string) => {
    const cachedScheduleString = await AsyncStorage.getItem("scouter-schedule-" + tournamentKey);

    if (!cachedScheduleString) {
        return null;
    }

    const cachedSchedule = JSON.parse(cachedScheduleString) as LocalCache<ScouterSchedule>;

    return cachedSchedule;
}

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
}

export const getCurrentScouterScheduleCached = async () => {
    const tournament = await getTournament();

    if (!tournament) {
        throw new Error("No tournament set");
    }

    return await getScouterScheduleCached(tournament.key);
}

export const getVerionsColor = (hash: string, saturation: number, value: number) => {
    let sum = 0;

    for (let i = 0; i < hash.length; i++) {
        sum += hash.charCodeAt(i);
    }

    const hue = (sum*Math.E) % 360;

    return `hsl(${hue}, ${saturation}%, ${value}%)`;
}

export const scouterScheduleAtom = atomWithDefault(async (get) => {
    const tournament = await get(tournamentAtom);

    if (!tournament) {
        return null;
    }

    return await getCurrentScouterScheduleCached();
});

