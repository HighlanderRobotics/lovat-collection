export enum ScoresWhileMoving {
  No,
  Yes,
}

export type ScoresWhileMovingDescription = {
  localizedDescription: string;
  localizedLongDescription: string;
  num: number;
};

export const scoresWhileMovingDescriptions: Record<
  ScoresWhileMoving,
  ScoresWhileMovingDescription
> = {
  [ScoresWhileMoving.No]: {
    localizedDescription: "No",
    localizedLongDescription: "The robot does not score while moving.",
    num: 0,
  },
  [ScoresWhileMoving.Yes]: {
    localizedDescription: "Yes",
    localizedLongDescription: "The robot scores while moving.",
    num: 1,
  },
};
