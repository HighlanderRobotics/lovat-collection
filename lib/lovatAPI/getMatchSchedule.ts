import { z } from "zod";
import { MatchIdentity, matchTypes } from "../models/match";
import { get } from "./lovatAPI";
import { useTournamentStore } from "../storage/userStores";

const matchScheduleResponseSchema = z.object({
  data: z.array(
    z.object({
      matchType: z.number(),
      matchNumber: z.number(),
      red: z.array(z.number()),
      blue: z.array(z.number()),
    }),
  ),
});

export type MatchSchedule = {
  tournamentKey: string;
  data: Match[];
};

export type Match = {
  matchIdentity: MatchIdentity;
  red: number[];
  blue: number[];
};

export async function getMatchSchedule(): Promise<MatchSchedule | undefined> {
  const tournamentKey = useTournamentStore.getState().value!.key;
  const response = await get("/v1/manager/matches/" + tournamentKey);

  if (!response.ok) {
    const json = await response.json();

    if (json["error"] === "Match Schedule has not been posted") {
      return;
    }

    throw new Error("Error fetching match schedule");
  }

  const json = matchScheduleResponseSchema.parse(await response.json());

  const data = json.data.map((match) => {
    const matchType = matchTypes.find(
      (matchType) => matchType.num === match.matchType,
    )?.type;

    if (!matchType) throw new Error("Invalid match type: " + match.matchType);

    return {
      matchIdentity: {
        tournamentKey,
        matchType,
        matchNumber: match.matchNumber,
      },
      red: match.red,
      blue: match.blue,
    };
  });

  return {
    data: data,
    tournamentKey,
  };
}
