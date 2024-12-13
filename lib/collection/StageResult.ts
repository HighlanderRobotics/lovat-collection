export enum StageResult {
  Nothing = "NOTHING",
  Park = "PARK",
  Onstage = "ONSTAGE",
  OnstageAndHarmony = "ONSTAGE_AND_HARMONY",
}

export type StageResultDescription = {
  localizedDescription: string;
  localizedLongDescription: string;
  num: number;
};

export const stageResultDescriptions: Record<
  StageResult,
  StageResultDescription
> = {
  [StageResult.Nothing]: {
    localizedDescription: "Nothing",
    localizedLongDescription:
      "The robot did not do anything during this stage.",
    num: 0,
  },
  [StageResult.Park]: {
    localizedDescription: "Park",
    localizedLongDescription: "The robot parked during this stage.",
    num: 1,
  },
  [StageResult.Onstage]: {
    localizedDescription: "Onstage",
    localizedLongDescription: "The robot was onstage during this stage.",
    num: 2,
  },
  [StageResult.OnstageAndHarmony]: {
    localizedDescription: "Onstage and Harmony",
    localizedLongDescription:
      "The robot was onstage and in harmony during this stage.",
    num: 3,
  },
};
