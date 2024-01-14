import AsyncStorage from "@react-native-async-storage/async-storage";
import { getScouter } from "../storage/getScouter"
import { get } from "./lovatAPI"
import { DataSource, LocalCache } from "../localCache";

export const getTournaments = async () => {
    const scouter = await getScouter();

    const response = await get(`/manager/scouters/${scouter.uuid}/tournaments`);

    if (!response.ok) {
        throw new Error("Error fetching tournaments");
    }

    const json = await response.json();

    cacheTournaments(json);

    return json as Tournament[];
}

const cacheTournaments = async (tournaments: Tournament[]) => {
    const cachedTournaments: LocalCache<Tournament[]> = {
        data: tournaments,
        sourcedAt: new Date().getTime(),
        source: DataSource.Cache,
    };

    await AsyncStorage.setItem("tournaments-cache", JSON.stringify(cachedTournaments));
}

const getLocalTournaments = async () => {
    const cachedTournamentsString = await AsyncStorage.getItem("tournaments-cache");

    if (!cachedTournamentsString) {
        return null;
    }

    const cachedTournaments = JSON.parse(cachedTournamentsString) as LocalCache<Tournament[]>;

    return cachedTournaments;
}

export const getTournamentsCached = async () => {
    try {
        return {
            data: await getTournaments(),
            sourcedAt: new Date().getTime(),
            source: DataSource.Server,
        } as LocalCache<Tournament[]>;
    } catch (e) {
        const cachedTournaments = await getLocalTournaments();

        if (!cachedTournaments) {
            throw e;
        }

        return cachedTournaments;
    }
}

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
    }

    const output = await Promise.any([cached(), server()]);

    if (output === null) {
        throw new Error("No tournaments available");
    }

    return output;
}
