export enum IntakeType {
  Ground,
  Outpost,
  Both,
  Neither,
}

export type IntakeTypeDescription = {
  intakeType: IntakeType;
  localizedDescription: string;
  localizedLongDescription: string;
  num: number;
};

export const intakeTypeDescriptions = [
  {
    intakeType: IntakeType.Ground,
    localizedDescription: "Ground",
    localizedLongDescription: "The robot intakes fuel from the ground.",
    num: 0,
  },
  {
    intakeType: IntakeType.Outpost,
    localizedDescription: "Outpost",
    localizedLongDescription: "The robot intakes fuel from the outpost.",
    num: 1,
  },
  {
    intakeType: IntakeType.Both,
    localizedDescription: "Both",
    localizedLongDescription:
      "The robot intakes fuel from both the ground and the outpost.",
    num: 2,
  },
  {
    intakeType: IntakeType.Neither,
    localizedDescription: "Neither",
    localizedLongDescription: "The robot does not intake fuel.",
    num: 3,
  },
] as const satisfies IntakeTypeDescription[];
