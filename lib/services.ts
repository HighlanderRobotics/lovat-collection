import { useScouterScheduleStore } from "./storage/scouterScheduleStore";
import { useTeamScoutersStore } from "./storage/teamScoutersStore";
import { useTournamentStore } from "./storage/userStores";
import { useTournamentsStore } from "./storage/tournamentsStore";

export function useLoadServices() {
  const tournament = useTournamentStore((state) => state.value);
  const fetchScouterSchedule = useScouterScheduleStore(
    (state) => state.fetchScouterSchedule,
  );
  const fetchTeamScouters = useTeamScoutersStore(
    (state) => state.fetchScouters,
  );
  const fetchTournaments = useTournamentsStore(
    (state) => state.fetchTournaments,
  );
  return () => {
    try {
      fetchTournaments();
      fetchTeamScouters();
      fetchScouterSchedule(tournament!.key);
    } catch (e: any) {
      console.error(e);
    } finally {
      console.log("Fetch successful");
    }
  }
}
