export enum RobotRole {
  Cycling,
  Scoring,
  Feeding,
  Defending,
  Immobile,
}

export type RobotRoleDescription = {
  localizedDescription: string;
  localizedLongDescription: string;
  num: number;
};

export const robotRoleDescriptions: Record<RobotRole, RobotRoleDescription> = {
  [RobotRole.Cycling]: {
    localizedDescription: "Cycling",
    localizedLongDescription:
      "The robot cycles game pieces between pickup and scoring locations.",
    num: 0,
  },
  [RobotRole.Scoring]: {
    localizedDescription: "Scoring",
    localizedLongDescription:
      "The robot primarily focuses on scoring fuel at the hub.",
    num: 1,
  },
  [RobotRole.Feeding]: {
    localizedDescription: "Feeding",
    localizedLongDescription:
      "The robot feeds fuel to other robots on the alliance.",
    num: 2,
  },
  [RobotRole.Defending]: {
    localizedDescription: "Defending",
    localizedLongDescription:
      "The robot primarily plays defense against the opposing alliance.",
    num: 3,
  },
  [RobotRole.Immobile]: {
    localizedDescription: "Immobile",
    localizedLongDescription:
      "The robot was immobile or non-functional during the match.",
    num: 4,
  },
};
