export enum AllianceColor {
    Red = "RED",
    Blue = "BLUE",
}

export type AllianceColorDescription = {
    color: AllianceColor;
    localizedDescription: string;
}

export const allianceColors = [
    {
        color: AllianceColor.Red,
        localizedDescription: 'Red',
    },
    {
        color: AllianceColor.Blue,
        localizedDescription: 'Blue',
    },
];
