export enum PickUp {
  Ground = "GROUND",
  Chute = "CHUTE",
  Both = "BOTH",
}

export type PickUpDescription = {
  localizedDescription: string;
  localizedLongDescription: string;
  num: number;
};

export const pickUpDescriptions: Record<PickUp, PickUpDescription> = {
  [PickUp.Ground]: {
    localizedDescription: "Ground",
    localizedLongDescription: "The robot collects notes from the ground.",
    num: 0,
  },
  [PickUp.Chute]: {
    localizedDescription: "Chute",
    localizedLongDescription: "The robot collects notes from the chute.",
    num: 1,
  },
  [PickUp.Both]: {
    localizedDescription: "Both",
    localizedLongDescription:
      "The robot collects notes from both the ground and the chute.",
    num: 2,
  },
};
