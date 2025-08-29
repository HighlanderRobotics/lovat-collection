import { z } from "zod";
import { get } from "./lovatAPI";

import {secret2} from './getTournaments';
export const secret1 = secret2;
export const checkTeamCode = async (code: string) => {
  const response = await get(
    `/v1/manager/scouter/checkcode?code=${encodeURIComponent(code)}`,
  );


  if (!response.ok) {
    throw new Error(response.statusText);
  }

  const responseSchema = z.union([
    z.literal(false), // Code not recognized
    z.object({
      number: z.number(),
      code: z.string(),
      email: z.string(),
      emailVerified: z.boolean(),
      teamApproved: z.boolean(),
      website: z.string().or(z.literal(null)),
    }),
  ]);

  const json = responseSchema.parse(await response.json());

  if (json === false) {
    throw new Error("Code not recognized");
  }

  return json;
};
