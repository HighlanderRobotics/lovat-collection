import { MatchIdentity, MatchType } from "../models/match";
import { get } from "./lovatAPI";
import NetInfo from "@react-native-community/netinfo";

export const checkMatch = async (match: MatchIdentity, teamNumber: number) => {
  const state = await NetInfo.fetch();

  // state.type tells you if they are on 'wifi', 'cellular', or 'none'
  if (!state.isConnected || state.type !== "wifi") {
    return {
      ok: true,
      data: "",
    };
  }
  const response = await get(
    `/v1/manager/checkmatch?teamNumber=${encodeURIComponent(String(teamNumber))}&tournamentKey=${encodeURIComponent(match.tournamentKey)}&matchNumber=${encodeURIComponent(String(match.matchNumber))}&isElim=${encodeURIComponent(String(match.matchType === MatchType.Elimination))}`,
  );

  const data = response.ok ? ((await response.json()) ?? "") : "";

  return {
    ok: response.ok,
    data,
  };
};
