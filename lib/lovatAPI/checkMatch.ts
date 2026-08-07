import z from "zod";
import { MatchIdentity, MatchType } from "../models/match";
import { get } from "./lovatAPI";
import NetInfo from "@react-native-community/netinfo";
import { AllianceColor } from "../models/AllianceColor";

export const checkMatch = async (
  match: MatchIdentity,
  teamNumber: number,
  alliance: AllianceColor,
) => {
  const state = await NetInfo.fetch();

  if (!state.isConnected) {
    return { exists: true, alliance: alliance };
  }

  const response = await get(
    `/v1/manager/checkmatch?teamNumber=${encodeURIComponent(String(teamNumber))}&tournamentKey=${encodeURIComponent(match.tournamentKey)}&matchNumber=${encodeURIComponent(String(match.matchNumber))}&isElim=${encodeURIComponent(String(match.matchType === MatchType.Elimination))}`,
  );

  const responseSchema = z.union([
    z.null(),
    z.object({
      match: z.object({
        key: z.string(),
        tournamentKey: z.string(),
        matchNumber: z.number().int(),
        teamNumber: z.number().int(),
        matchType: z.enum(["QUALIFICATION", "ELIMINATION"]),
      }),
      alliance: z.string(),
    }),
  ]);

  const exists = response.status === 200;

  return {
    exists,
    alliance: exists
      ? responseSchema.parse(await response.json())?.alliance === "red"
        ? AllianceColor.Red
        : AllianceColor.Blue
      : alliance,
  };
};
