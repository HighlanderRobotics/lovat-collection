import AsyncStorage from "@react-native-async-storage/async-storage";
import { raceTournamentsCached } from "../lovatAPI/getTournaments";

export async function getTournament() {
    const tournaments = await raceTournamentsCached();

    const tournamentKey = await AsyncStorage.getItem("tournament");

    if (tournamentKey) {
        const tournament = tournaments.data.find(t => t.key === tournamentKey);

        if (tournament) {
            return tournament;
        }
    } else {
        // No tournament set, go by date
        const now = new Date().getTime();

        tournaments.data.sort((a, b) => {
            // Parse the dates: YYYY-MM-DD
            const parseDate = (date: string) => {
                const [year, month, day] = date.split("-").map(n => parseInt(n));

                return new Date(year, month - 1, day).getTime();
            }

            const aDate = parseDate(a.date);
            const bDate = parseDate(b.date);

            return aDate - bDate;
        });

        const tournament = tournaments.data[tournaments.data.length - 1];

        if (tournament) {
            await AsyncStorage.setItem("tournament", tournament.key);
            return tournament;
        }

        throw new Error("No tournaments available");
    }
}
