export enum FeederType {
  Continuous,
  StopToShoot,
  Dump,
  Push,
}

export type FeederTypeDescription = {
  feederType: FeederType;
  localizedDescription: string;
  localizedLongDescription: string;
  num: number;
};

export const feederTypeDescriptions = [
  {
    feederType: FeederType.Continuous,
    localizedDescription: "Continuous",
    localizedLongDescription:
      "The robot feeds fuel continuously without stopping.",
    num: 0,
  },
  {
    feederType: FeederType.StopToShoot,
    localizedDescription: "Stop to Shoot",
    localizedLongDescription: "The robot stops to shoot when feeding.",
    num: 1,
  },
  {
    feederType: FeederType.Dump,
    localizedDescription: "Dump",
    localizedLongDescription: "The robot dumps fuel when feeding.",
    num: 2,
  },
  {
    feederType: FeederType.Push,
    localizedDescription: "Push",
    localizedLongDescription: "The robot pushes fuel when feeding.",
    num: 3,
  },
] as const satisfies FeederTypeDescription[];
