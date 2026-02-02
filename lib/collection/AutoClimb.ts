export enum AutoClimb {
  NotAttempted,
  Failed,
  Succeeded,
}

export type AutoClimbDescription = {
  climb: AutoClimb;
  localizedDescription: string;
  localizedLongDescription: string;
  num: number;
};

export const autoClimbDescriptions = [
  {
    climb: AutoClimb.NotAttempted,
    localizedDescription: "Not Attempted",
    localizedLongDescription:
      "The robot did not attempt to climb during autonomous.",
    num: 0,
  },
  {
    climb: AutoClimb.Failed,
    localizedDescription: "Failed",
    localizedLongDescription:
      "The robot attempted to climb during autonomous but failed.",
    num: 1,
  },
  {
    climb: AutoClimb.Succeeded,
    localizedDescription: "Succeeded",
    localizedLongDescription:
      "The robot successfully climbed during autonomous.",
    num: 2,
  },
] as const satisfies AutoClimbDescription[];
