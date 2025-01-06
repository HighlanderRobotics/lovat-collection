export enum CoralPickUp {
  None,
  Ground,
  Station,
  Both,
}

export enum AlgaePickUp {
  None,
  Ground,
  Reef,
  Both,
}

export type PickUpDescription = {
  localizedDescription: string;
  localizedLongDescription: string;
  num: number;
};

export const coralPickUpDescriptions: Record<CoralPickUp, PickUpDescription> = {
  [CoralPickUp.None]: {
    localizedDescription: "None",
    localizedLongDescription: "The robot does not collect coral.",
    num: 0,
  },
  [CoralPickUp.Ground]: {
    localizedDescription: "Ground",
    localizedLongDescription: "The robot collects coral from the ground.",
    num: 1,
  },
  [CoralPickUp.Station]: {
    localizedDescription: "Station",
    localizedLongDescription: "The robot collects coral from the station.",
    num: 2,
  },
  [CoralPickUp.Both]: {
    localizedDescription: "Both",
    localizedLongDescription:
      "The robot collects coral from both the ground and the station.",
    num: 3,
  },
};

export const algaePickUpDescriptions: Record<AlgaePickUp, PickUpDescription> = {
  [AlgaePickUp.None]: {
    localizedDescription: "None",
    localizedLongDescription: "The robot does not collect algae.",
    num: 0,
  },
  [AlgaePickUp.Ground]: {
    localizedDescription: "Ground",
    localizedLongDescription: "The robot collects algae from the ground.",
    num: 1,
  },
  [AlgaePickUp.Reef]: {
    localizedDescription: "Reef",
    localizedLongDescription: "The robot collects algae from the reef.",
    num: 2,
  },
  [AlgaePickUp.Both]: {
    localizedDescription: "Both",
    localizedLongDescription:
      "The robot collects algae from both the ground and the reef.",
    num: 3,
  },
};
