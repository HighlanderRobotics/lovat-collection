import { getScouter } from "../storage/getScouter";
import { get } from "./lovatAPI";

export const getTournaments = async () => {
  const scouter = await getScouter();

  const response = await get(
    `/v1/manager/scouters/${scouter.uuid}/tournaments`
  );

  if (!response.ok) {
    throw new Error("Error fetching tournaments");
  }

  const json = await response.json();
  const tournaments: Tournament[] = json["tournaments"];

  return tournaments;
};
