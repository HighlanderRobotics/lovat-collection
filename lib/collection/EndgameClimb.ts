export enum EndgameClimb {
  NotAttempted,
  Failed,
  L1,
  L2,
  L3,
}

export type EndgameClimbDescription = {
  climb: EndgameClimb;
  localizedDescription: string;
  localizedLongDescription: string;
  num: number;
};

export const endgameClimbDescriptions = [
  {
    climb: EndgameClimb.NotAttempted,
    localizedDescription: "Not Attempted",
    localizedLongDescription: "The robot did not attempt to climb.",
    num: 0,
  },
  {
    climb: EndgameClimb.Failed,
    localizedDescription: "Failed",
    localizedLongDescription: "The robot attempted to climb but failed.",
    num: 1,
  },
  {
    climb: EndgameClimb.L1,
    localizedDescription: "L1",
    localizedLongDescription: "The robot successfully climbed to Level 1.",
    num: 2,
  },
  {
    climb: EndgameClimb.L2,
    localizedDescription: "L2",
    localizedLongDescription: "The robot successfully climbed to Level 2.",
    num: 3,
  },
  {
    climb: EndgameClimb.L3,
    localizedDescription: "L3",
    localizedLongDescription: "The robot successfully climbed to Level 3.",
    num: 4,
  },
] as const satisfies EndgameClimbDescription[];
