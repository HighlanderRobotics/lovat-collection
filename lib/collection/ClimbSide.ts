export enum ClimbSide {
  Front,
  Back,
}

export type ClimbSideDescription = {
  localizedDescription: string;
  localizedLongDescription: string;
  num: number;
};

export const climbSideDescriptions: Record<ClimbSide, ClimbSideDescription> = {
  [ClimbSide.Front]: {
    localizedDescription: "Front",
    localizedLongDescription:
      "The robot climbed from the front, away from the driver stations.",
    num: 0,
  },
  [ClimbSide.Back]: {
    localizedDescription: "Back",
    localizedLongDescription:
      "The robot climbed from the back, towards the driver stations.",
    num: 1,
  },
};
