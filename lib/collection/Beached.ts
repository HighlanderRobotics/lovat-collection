export enum Beached {
  OnFuel,
  OnBump,
  Both,
  Neither,
}

export type BeachedDescription = {
  beached: Beached;
  localizedDescription: string;
  localizedLongDescription: string;
  num: number;
};

export const beachedDescriptions = [
  {
    beached: Beached.OnFuel,
    localizedDescription: "On Fuel",
    localizedLongDescription: "The robot got beached on fuel.",
    num: 0,
  },
  {
    beached: Beached.OnBump,
    localizedDescription: "On Bump",
    localizedLongDescription: "The robot got beached on the bump.",
    num: 1,
  },
  {
    beached: Beached.Both,
    localizedDescription: "Both",
    localizedLongDescription:
      "The robot got beached on both fuel and the bump.",
    num: 2,
  },
  {
    beached: Beached.Neither,
    localizedDescription: "Neither",
    localizedLongDescription: "The robot did not get beached.",
    num: 3,
  },
] as const satisfies BeachedDescription[];
