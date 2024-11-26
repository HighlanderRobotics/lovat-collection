export enum MatchEventType {
    LeaveWing,
    PickupCone,
    PickupCube,
    DropPiece,
    Defend,

    ScorePiece,

    ChargingEngaged,
    ChargingTipped,
    ChargingFailed,
    ChargingNotAttempted,
    
    StartingPosition,
}


export type MatchEventTypeDescription = {
    name: string;
    icon: string;
}

// export const matchEventTypeDescriptions: Record<MatchEventType, MatchEventTypeDescription> = {
//     [MatchEventType.LeaveWing]: {
//         name: "Leave Wing",
//         icon: "exit_to_app",
//     },
//     [MatchEventType.PickupCone]: {
//         name: "Pick Up Cone",
//         icon: "upload",
//     },
//     [MatchEventType.PickupCube]: {
//         name: "Pick Up Cube",
//         icon: "upload",
//     },
//     [MatchEventType.DropPiece]: {
//         name: "Drop Piece",
//         icon: "output_circle",
//     },

//     [MatchEventType.GridOneLow | MatchEventType.GridTwoLow | MatchEventType.GridThreeLow | MatchEventType.GenericLow]: {
//         name: "Place Low",
//         icon: "",
//     },
//     [MatchEventType.GridOneMedium | MatchEventType.GridTwoMedium | MatchEventType.GridThreeMedium | MatchEventType.GenericMedium]: {

//     },
//     [MatchEventType.GridOneHigh | MatchEventType.GridTwoHigh | MatchEventType.GridThreeHigh | MatchEventType.GenericHigh]: {

//     },

//     [MatchEventType.Defend]: {
//         name: "Defend",
//         icon: "shield",
//     },
//     // [MatchEventType.ChargingEngaged]: {

//     // },
//     [MatchEventType.StartingPosition]: {
//         name: "Starting Position",
//         icon: "play_arrow",
//     },
// };

export const gainPieceEvents: MatchEventType[] = [
    MatchEventType.PickupCone,
    MatchEventType.PickupCube,
];

export const losePieceEvents: MatchEventType[] = [
    MatchEventType.ScorePiece,
    MatchEventType.DropPiece,
];
