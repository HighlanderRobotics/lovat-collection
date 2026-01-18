export enum EndgameClimb {
  NotAttempted,
  Failed,
  L1,
  L2,
  L3,
}

export type EndgameClimbDescription = {
  localizedDescription: string;
  localizedLongDescription: string;
  num: number;
};

export const endgameClimbDescriptions: Record<
  EndgameClimb,
  EndgameClimbDescription
> = {
  [EndgameClimb.NotAttempted]: {
    localizedDescription: "Not Attempted",
    localizedLongDescription: "The robot did not attempt to climb.",
    num: 0,
  },
  [EndgameClimb.Failed]: {
    localizedDescription: "Failed",
    localizedLongDescription: "The robot attempted to climb but failed.",
    num: 1,
  },
  [EndgameClimb.L1]: {
    localizedDescription: "L1",
    localizedLongDescription: "The robot successfully climbed to Level 1.",
    num: 2,
  },
  [EndgameClimb.L2]: {
    localizedDescription: "L2",
    localizedLongDescription: "The robot successfully climbed to Level 2.",
    num: 3,
  },
  [EndgameClimb.L3]: {
    localizedDescription: "L3",
    localizedLongDescription: "The robot successfully climbed to Level 3.",
    num: 4,
  },
};
