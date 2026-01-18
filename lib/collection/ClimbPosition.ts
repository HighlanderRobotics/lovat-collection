export enum ClimbPosition {
  Side,
  Middle,
}

export type ClimbPositionDescription = {
  localizedDescription: string;
  localizedLongDescription: string;
  num: number;
};

export const climbPositionDescriptions: Record<
  ClimbPosition,
  ClimbPositionDescription
> = {
  [ClimbPosition.Side]: {
    localizedDescription: "Side",
    localizedLongDescription: "The robot climbed on the side of the structure.",
    num: 0,
  },
  [ClimbPosition.Middle]: {
    localizedDescription: "Middle",
    localizedLongDescription:
      "The robot climbed in the middle of the structure.",
    num: 1,
  },
};
