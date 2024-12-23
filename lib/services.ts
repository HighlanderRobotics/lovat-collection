import { useScouterScheduleStore } from "./storage/scouterScheduleStore";
import { useTeamScoutersStore } from "./storage/teamScoutersStore";
import { useTournamentsStore } from "./storage/tournamentsStore";

export function useLoadServices() {
  const fetchScouterSchedule = useScouterScheduleStore(
    (state) => state.fetchScouterSchedule,
  );
  const fetchTeamScouters = useTeamScoutersStore(
    (state) => state.fetchScouters,
  );
  const fetchTournaments = useTournamentsStore(
    (state) => state.fetchTournaments,
  );
  return async () => {
    try {
      await fetchTournaments();
      await fetchTeamScouters();
      await fetchScouterSchedule();
    } catch (e: any) {
      console.error(e);
    } finally {
      console.log("Fetch successful");
    }
  };
}
