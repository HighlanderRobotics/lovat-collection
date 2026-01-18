export enum IntakeType {
  Ground,
  Outpost,
  Both,
  Neither,
}

export type IntakeTypeDescription = {
  localizedDescription: string;
  localizedLongDescription: string;
  num: number;
};

export const intakeTypeDescriptions: Record<IntakeType, IntakeTypeDescription> =
  {
    [IntakeType.Ground]: {
      localizedDescription: "Ground",
      localizedLongDescription: "The robot intakes fuel from the ground.",
      num: 0,
    },
    [IntakeType.Outpost]: {
      localizedDescription: "Outpost",
      localizedLongDescription: "The robot intakes fuel from the outpost.",
      num: 1,
    },
    [IntakeType.Both]: {
      localizedDescription: "Both",
      localizedLongDescription:
        "The robot intakes fuel from both the ground and the outpost.",
      num: 2,
    },
    [IntakeType.Neither]: {
      localizedDescription: "Neither",
      localizedLongDescription: "The robot does not intake fuel.",
      num: 3,
    },
  };
