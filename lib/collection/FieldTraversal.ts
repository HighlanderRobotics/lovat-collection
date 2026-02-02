export enum FieldTraversal {
  Trench,
  Bump,
  Both,
  None,
}

export type FieldTraversalDescription = {
  traversal: FieldTraversal;
  localizedDescription: string;
  localizedLongDescription: string;
  num: number;
};

export const fieldTraversalDescriptions = [
  {
    traversal: FieldTraversal.Trench,
    localizedDescription: "Trench",
    localizedLongDescription: "The robot traverses through the trench.",
    num: 0,
  },
  {
    traversal: FieldTraversal.Bump,
    localizedDescription: "Bump",
    localizedLongDescription: "The robot traverses over the bump.",
    num: 1,
  },
  {
    traversal: FieldTraversal.Both,
    localizedDescription: "Both",
    localizedLongDescription:
      "The robot can traverse through both the trench and over the bump.",
    num: 2,
  },
  {
    traversal: FieldTraversal.None,
    localizedDescription: "None",
    localizedLongDescription:
      "The robot does not traverse through the trench or over the bump.",
    num: 3,
  },
] as const satisfies FieldTraversalDescription[];
