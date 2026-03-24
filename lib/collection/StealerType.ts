export enum StealerType {
  toAlliance,
  toNeutral,
}

export type StealerTypeDescription = {
  stealerType: StealerType;
  localizedDescription: string;
  localizedLongDescription: string;
  num: number;
};

export const stealerTypeDescriptions = [
  {
    stealerType: StealerType.toAlliance,
    localizedDescription: "To Alliance",
    localizedLongDescription:
      "The robot steals fuel and brings it to the alliance zone.",
    num: 0,
  },
  {
    stealerType: StealerType.toNeutral,
    localizedDescription: "To Neutral",
    localizedLongDescription:
      "The robot steals fuel and brings it to the neutral zone.",
    num: 1,
  },
] as const satisfies StealerTypeDescription[];
