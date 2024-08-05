import { get } from "../lovatAPI/lovatAPI";
import { AllianceColor } from "../models/AllianceColor";
import { MatchIdentity, matchTypes } from "../models/match";

export type ScouterSchedule = {
  tournamentKey: string;
  hash: string;
  data: ScouterScheduleMatch[];
};

export type ScouterScheduleMatch = {
  matchIdentity: MatchIdentity;
  scouters: {
    [scouterUUID: string]: ScouterScheduleScouterEntry;
  };
};

type ScouterScheduleScouterEntry = {
  teamNumber: number;
  allianceColor: AllianceColor;
};

export async function getScouterSchedule(
  tournamentKey: string
): Promise<ScouterSchedule> {
  const response = await get("/v1/manager/scouterschedules/" + tournamentKey);

  if (!response.ok) {
    throw new Error("Error fetching scouter schedule");
  }

  const json = await response.json();

  json.data = json.data.map((match: any) => {
    const matchType = matchTypes.find(
      (matchType) => matchType.num === match.matchType
    )?.type;

    if (!matchType) throw new Error("Invalid match type: " + match.matchType);

    return {
      ...match,
      matchIdentity: {
        tournamentKey,
        matchType,
        matchNumber: match.matchNumber,
      } as MatchIdentity,
      scouters: Object.fromEntries(
        Object.entries(match.scouters).map(([key, value]: any) => {
          return [
            key,
            {
              ...value,
              teamNumber: value.team,
              allianceColor:
                value.alliance === "red"
                  ? AllianceColor.Red
                  : AllianceColor.Blue,
            },
          ];
        })
      ),
    };
  });

  const schedule: ScouterSchedule = {
    ...json,
    tournamentKey,
  };

  return schedule as ScouterSchedule;
}

export const getVerionsColor = (
  hash: string,
  saturation: number,
  value: number
) => {
  let sum = 0;

  for (let i = 0; i < hash.length; i++) {
    sum += hash.charCodeAt(i);
  }

  const hue = (sum * Math.E) % 360;

  return `hsl(${hue}, ${saturation}%, ${value}%)`;
};
