import { get } from "./lovatAPI";



export const checkTeamCode = async (code: string) => {
  const response = await get(`/manager/scouter/checkcode?code=${encodeURIComponent(code)}`);

  if (!response.ok) {
    throw new Error(response.statusText);
  }

  const json = await response.json();

  if (json === false) { // I know this seems a bit silly, but json isn't always a boolean. It has more data on the team when the code is valid.
    throw new Error("Code not recognized");
  } else {
    return json as {
      number: number;
      code: string;
      email: string;
      emailVerified: boolean;
      teamApproved: boolean;
      website?: string;
    };
  }
};
