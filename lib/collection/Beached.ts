export enum Beached {
  OnFuel,
  OnBump,
  Both,
  Neither,
}

export type BeachedDescription = {
  localizedDescription: string;
  localizedLongDescription: string;
  num: number;
};

export const beachedDescriptions: Record<Beached, BeachedDescription> = {
  [Beached.OnFuel]: {
    localizedDescription: "On Fuel",
    localizedLongDescription: "The robot got beached on fuel.",
    num: 0,
  },
  [Beached.OnBump]: {
    localizedDescription: "On Bump",
    localizedLongDescription: "The robot got beached on the bump.",
    num: 1,
  },
  [Beached.Both]: {
    localizedDescription: "Both",
    localizedLongDescription:
      "The robot got beached on both fuel and the bump.",
    num: 2,
  },
  [Beached.Neither]: {
    localizedDescription: "Neither",
    localizedLongDescription: "The robot did not get beached.",
    num: 3,
  },
};
