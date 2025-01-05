import { get } from "./lovatAPI";
import { scouterSchema } from "../models/scouter";
import { z } from "zod";

export const getTeamScouters = async () => {
  const response = await get(`/v1/manager/scouters`);

  if (!response.ok) {
    throw new Error("Error fetching scouters");
  }

  const json = z.array(scouterSchema).parse(await response.json());

  return json;
};
