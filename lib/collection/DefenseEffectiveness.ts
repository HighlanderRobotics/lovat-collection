export enum DefenseEffectiveness {
  Terrible,
  Poor,
  Average,
  Good,
  Great,
}

export type DefenseEffectivenessDescription = {
  effectiveness: DefenseEffectiveness;
  localizedDescription: string;
  localizedLongDescription: string;
  num: number;
};

export const defenseEffectivenessDescriptions = [
  {
    effectiveness: DefenseEffectiveness.Terrible,
    localizedDescription: "Terrible",
    localizedLongDescription:
      "The robot's defense was ineffective and detrimental.",
    num: 0,
  },
  {
    effectiveness: DefenseEffectiveness.Poor,
    localizedDescription: "Poor",
    localizedLongDescription:
      "The robot's defense was mostly ineffective with minimal impact.",
    num: 1,
  },
  {
    effectiveness: DefenseEffectiveness.Average,
    localizedDescription: "Average",
    localizedLongDescription:
      "The robot's defense was adequate but not exceptional.",
    num: 2,
  },
  {
    effectiveness: DefenseEffectiveness.Good,
    localizedDescription: "Good",
    localizedLongDescription:
      "The robot's defense was effective and impactful.",
    num: 3,
  },
  {
    effectiveness: DefenseEffectiveness.Great,
    localizedDescription: "Great",
    localizedLongDescription:
      "The robot's defense was exceptional and highly disruptive.",
    num: 4,
  },
] as const satisfies DefenseEffectivenessDescription[];
