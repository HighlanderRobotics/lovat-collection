export enum FeederType {
  Continuous,
  StopToShoot,
  Dump,
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
] as const satisfies FeederTypeDescription[];
