export enum FieldTraversal {
  Trench,
  Bump,
  Both,
  None,
}

export type FieldTraversalDescription = {
  localizedDescription: string;
  localizedLongDescription: string;
  num: number;
};

export const fieldTraversalDescriptions: Record<
  FieldTraversal,
  FieldTraversalDescription
> = {
  [FieldTraversal.Trench]: {
    localizedDescription: "Trench",
    localizedLongDescription: "The robot traverses through the trench.",
    num: 0,
  },
  [FieldTraversal.Bump]: {
    localizedDescription: "Bump",
    localizedLongDescription: "The robot traverses over the bump.",
    num: 1,
  },
  [FieldTraversal.Both]: {
    localizedDescription: "Both",
    localizedLongDescription:
      "The robot can traverse through both the trench and over the bump.",
    num: 2,
  },
  [FieldTraversal.None]: {
    localizedDescription: "None",
    localizedLongDescription:
      "The robot does not traverse through the trench or over the bump.",
    num: 3,
  },
};
