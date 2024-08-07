export enum AllianceColor {
  Red = "RED",
  Blue = "BLUE",
}

export type AllianceColorDescription = {
  color: AllianceColor;
  localizedDescription: string;
  foregroundColor: string;
  backgroundColor: string;
};

export const allianceColors = [
  {
    color: AllianceColor.Red,
    localizedDescription: "Red",
    foregroundColor: "#793F3F",
    backgroundColor: "#D0A2A2",
  },
  {
    color: AllianceColor.Blue,
    localizedDescription: "Blue",
    foregroundColor: "#364077",
    backgroundColor: "#A2A7D0",
  },
];

export const getAllianceColorDescription = (
  color: AllianceColor,
): AllianceColorDescription => {
  return allianceColors.find(
    (colorDescription) => colorDescription.color === color,
  )!;
};
