export enum StealingType {
  toAlliance,
  toNeutral,
}

export type StealingTypeDescription = {
  stealingType: StealingType;
  localizedDescription: string;
  localizedLongDescription: string;
  num: number;
};

export const stealingTypeDescriptions = [
  {
    stealingType: StealingType.toAlliance,
    localizedDescription: "To Alliance",
    localizedLongDescription:
      "The robot moves fuel from the opposing alliance zone to its alliance zone.",
    num: 0,
  },
  {
    stealingType: StealingType.toNeutral,
    localizedDescription: "To Neutral",
    localizedLongDescription:
      "The robot moves fuel from the opposing alliance zone to the neutral zone.",
    num: 1,
  },
] as const satisfies StealingTypeDescription[];
