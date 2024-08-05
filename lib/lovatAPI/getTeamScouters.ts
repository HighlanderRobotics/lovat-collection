import { getTeamNumber } from "../storage/getTeamNumber";
import { get } from "./lovatAPI";

export const getTeamScouters = async () => {
  const teamNumber = await getTeamNumber();

  const response = await get(`/v1/manager/scouters`);

  if (!response.ok) {
    throw new Error("Error fetching scouters");
  }

  const json = await response.json();

  return json as Scouter[];
};
