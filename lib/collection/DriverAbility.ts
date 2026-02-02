export enum DriverAbility {
  Poor = "POOR",
  BelowAverage = "BELOW_AVERAGE",
  Average = "AVERAGE",
  Great = "GOOD",
  Exceptional = "GREAT",
}

export type DriverAbilityDescription = {
  ability: DriverAbility;
  localizedDescription: string;
  localizedLongDescription: string;
  numericalRating: number;
};

export const driverAbilityDescriptions = [
  {
    ability: DriverAbility.Exceptional,
    localizedDescription: "Exceptional",
    localizedLongDescription:
      "Impressively precise and efficient. Evades defense with little time lost and thinks ahead.",
    numericalRating: 5,
  },
  {
    ability: DriverAbility.Great,
    localizedDescription: "Great",
    localizedLongDescription:
      "Driver is well-practiced and makes very few mistakes.",
    numericalRating: 4,
  },
  {
    ability: DriverAbility.Average,
    localizedDescription: "Average",
    localizedLongDescription:
      "The driver operates the robot competently, but nothing stood out.",
    numericalRating: 3,
  },
  {
    ability: DriverAbility.BelowAverage,
    localizedDescription: "Below average",
    localizedLongDescription: "Moves inefficiently and makes some mistakes.",
    numericalRating: 2,
  },
  {
    ability: DriverAbility.Poor,
    localizedDescription: "Poor",
    localizedLongDescription:
      "Struggles to keep the robot under control or makes frequent mistakes.",
    numericalRating: 1,
  },
] as const satisfies DriverAbilityDescription[];
