export enum ScoresWhileMoving {
  No,
  Yes,
}

export type ScoresWhileMovingDescription = {
  scoresWhileMoving: ScoresWhileMoving;
  localizedDescription: string;
  localizedLongDescription: string;
  num: number;
};

export const scoresWhileMovingDescriptions = [
  {
    scoresWhileMoving: ScoresWhileMoving.No,
    localizedDescription: "No",
    localizedLongDescription: "The robot does not score while moving.",
    num: 0,
  },
  {
    scoresWhileMoving: ScoresWhileMoving.Yes,
    localizedDescription: "Yes",
    localizedLongDescription: "The robot scores while moving.",
    num: 1,
  },
] as const satisfies ScoresWhileMovingDescription[];
