export enum CageResult {
  NotAttempted = "NOT_ATTEMPTED",
  Parked = "PARKED",
  Deep = "SUCCEEDED_DEEP",
  FailedDeep = "FAILED_DEEP",
  Shallow = "SUCCEEDED_SHALLOW",
  FailedShallow = "FAILED_SHALLOW",
}

export type CageResultDescription = {
  localizedDescription: string;
  localizedLongDescription: string;
  num: number;
};

export const cageResultDescriptions: Record<
  CageResult,
  CageResultDescription
> = {
  [CageResult.NotAttempted]: {
    localizedDescription: "Not Attempted",
    localizedLongDescription:
      "The robot did not attempt to gain points based on endgame position.",
    num: 0,
  },
  [CageResult.Parked]: {
    localizedDescription: "Parked",
    localizedLongDescription: "The robot parked in the barge zone during endgame.",
    num: 1,
  },
  [CageResult.Shallow]: {
    localizedDescription: "Shallow Cage",
    localizedLongDescription: "The robot successfully hung on the shallow cage during endgame.",
    num: 2,
  },
  [CageResult.FailedShallow]: {
    localizedDescription: "Shallow Cage Failed",
    localizedLongDescription: "The robot failed to hang on the shallow cage during endgame.",
    num: 3,
  },
  [CageResult.Deep]: {
    localizedDescription: "Deep Cage",
    localizedLongDescription: "The robot successfully hung on the deep cage during endgame.",
    num: 4,
  },
  [CageResult.FailedDeep]: {
    localizedDescription: "Deep Cage Failed",
    localizedLongDescription: "The robot failed to hang on the deep cage during endgame.",
    num: 5,
  },
};
