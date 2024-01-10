import { getTeamNumber } from "../storage/getTeamNumber";
import { post } from "./lovatAPI";


export const addScouter = async (name: string) => {
  const teamNumber = await getTeamNumber();

  const response = await post(`/manager/scouter`, {
    name,
    teamNumber,
  });

  if (!response.ok) {
    throw new Error("Error adding scouter");
  }

  const json = await response.json();

  return json as Scouter;
};
