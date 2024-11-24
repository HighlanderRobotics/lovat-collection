export enum ChargingResult {
    Nothing = "NOTHING",
    Failed = "FAILED",
    Tilted = "TILTED",
    Engaged = "ENGAGED"
}

export type ChargingResultDescription = {
    localizedDescription: string;
    localizedLongDescription: string;
    num: number;
};

export const chargingResultDescriptions: Record<ChargingResult, ChargingResultDescription> = {
    [ChargingResult.Nothing]: {
        localizedDescription: "Nothing",
        localizedLongDescription: "The robot did not do anything during this stage.",
        num: 0,
    },
    [ChargingResult.Failed]: {
        localizedDescription: "Failed",
        localizedLongDescription: "The robot attempted to charge and failed.",
        num: 1,
    },
    [ChargingResult.Tilted]: {
        localizedDescription: "Tilted",
        localizedLongDescription: "The robot tilted the charging station.",
        num: 2,
    },
    [ChargingResult.Engaged]: {
        localizedDescription: "Engaged",
        localizedLongDescription: "The robot engaged the charging station.",
        num: 3,
    },
};
