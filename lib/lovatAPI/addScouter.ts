import { Scouter } from "../models/scouter";
import { post } from "./lovatAPI";

export const addScouter = async (name: string, teamNumber: number) => {
  const response = await post(`/v1/manager/scouter`, {
    name,
    teamNumber,
  });

  if (!response.ok) {
    throw new Error("Error adding scouter");
  }

  const json = await response.json();

  return json as Scouter;
};
