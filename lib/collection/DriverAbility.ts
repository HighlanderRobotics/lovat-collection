export enum DriverAbility {
  Terrible = "TERRIBLE",
  Poor = "POOR",
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
    ability: DriverAbility.Terrible,
    localizedDescription: "Terrible",
    localizedLongDescription:
      "This driver cannot control the robot at all. They are a danger to everyone around them.",
    numericalRating: 1,
  },
  {
    ability: DriverAbility.Poor,
    localizedDescription: "Poor",
    localizedLongDescription:
      "This driver struggles to keep the robot under control. They make many mistakes and are not very reliable.",
    numericalRating: 2,
  },
  {
    ability: DriverAbility.Average,
    localizedDescription: "Average",
    localizedLongDescription:
      "This driver can operate the robot competently. However, they are not particularly skilled or exceptional.",
    numericalRating: 3,
  },
  {
    ability: DriverAbility.Great,
    localizedDescription: "Great",
    localizedLongDescription:
      "This driver can operate the robot with skill and precision. They are reliable and make few mistakes.",
    numericalRating: 4,
  },
  {
    ability: DriverAbility.Exceptional,
    localizedDescription: "Exceptional",
    localizedLongDescription:
      "This driver can operate the robot with mastery. They are highly skilled, precise, and efficient and they can think ahead.",
    numericalRating: 5,
  },
] as const satisfies DriverAbilityDescription[];
