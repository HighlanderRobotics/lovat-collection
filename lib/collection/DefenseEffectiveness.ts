export enum DefenseEffectiveness {
  Terrible,
  Poor,
  Average,
  Good,
  Great,
}

export type DefenseEffectivenessDescription = {
  localizedDescription: string;
  localizedLongDescription: string;
  num: number;
};

export const defenseEffectivenessDescriptions: Record<
  DefenseEffectiveness,
  DefenseEffectivenessDescription
> = {
  [DefenseEffectiveness.Terrible]: {
    localizedDescription: "Terrible",
    localizedLongDescription:
      "The robot's defense was ineffective and detrimental.",
    num: 0,
  },
  [DefenseEffectiveness.Poor]: {
    localizedDescription: "Poor",
    localizedLongDescription:
      "The robot's defense was mostly ineffective with minimal impact.",
    num: 1,
  },
  [DefenseEffectiveness.Average]: {
    localizedDescription: "Average",
    localizedLongDescription:
      "The robot's defense was adequate but not exceptional.",
    num: 2,
  },
  [DefenseEffectiveness.Good]: {
    localizedDescription: "Good",
    localizedLongDescription:
      "The robot's defense was effective and impactful.",
    num: 3,
  },
  [DefenseEffectiveness.Great]: {
    localizedDescription: "Great",
    localizedLongDescription:
      "The robot's defense was exceptional and highly disruptive.",
    num: 4,
  },
};
