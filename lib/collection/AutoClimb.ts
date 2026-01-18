export enum AutoClimb {
  NotAttempted,
  Failed,
  Succeeded,
}

export type AutoClimbDescription = {
  localizedDescription: string;
  localizedLongDescription: string;
  num: number;
};

export const autoClimbDescriptions: Record<AutoClimb, AutoClimbDescription> = {
  [AutoClimb.NotAttempted]: {
    localizedDescription: "Not Attempted",
    localizedLongDescription:
      "The robot did not attempt to climb during autonomous.",
    num: 0,
  },
  [AutoClimb.Failed]: {
    localizedDescription: "Failed",
    localizedLongDescription:
      "The robot attempted to climb during autonomous but failed.",
    num: 1,
  },
  [AutoClimb.Succeeded]: {
    localizedDescription: "Succeeded",
    localizedLongDescription:
      "The robot successfully climbed during autonomous.",
    num: 2,
  },
};
