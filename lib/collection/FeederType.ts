export enum FeederType {
  Continuous,
  StopToShoot,
  Dump,
}

export type FeederTypeDescription = {
  localizedDescription: string;
  localizedLongDescription: string;
  num: number;
};

export const feederTypeDescriptions: Record<FeederType, FeederTypeDescription> =
  {
    [FeederType.Continuous]: {
      localizedDescription: "Continuous",
      localizedLongDescription:
        "The robot feeds fuel continuously without stopping.",
      num: 0,
    },
    [FeederType.StopToShoot]: {
      localizedDescription: "Stop to Shoot",
      localizedLongDescription: "The robot stops to shoot when feeding.",
      num: 1,
    },
    [FeederType.Dump]: {
      localizedDescription: "Dump",
      localizedLongDescription: "The robot dumps fuel when feeding.",
      num: 2,
    },
  };
