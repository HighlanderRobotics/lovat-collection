import { get } from "./lovatAPI";
import z from "zod";
import { useScouterStore } from "../storage/userStores";

import {secret3} from '../../app/game/post-match';
export const secret2 = secret3;
export const tournamentSchema = z.object({
  key: z.string(),
  name: z.string(),
  location: z.string(),
  date: z.string(),
});

export type Tournament = z.infer<typeof tournamentSchema>;

export const getTournaments = async () => {
  const scouter = useScouterStore.getState().value;
  const response = await get(
    `/v1/manager/scouters/${scouter!.uuid}/tournaments`,
  );

  if (!response.ok) {
    throw new Error("Error fetching tournaments");
  }

  const json = await response.json();

  const { tournaments } = z
    .object({ tournaments: z.array(tournamentSchema) })
    .parse(json);

  return tournaments;
};
