export enum MatchEventType {
    LeaveWing,
    PickupNote,
    DropNote,
    ScoreNote,
    Defend,
    FeedNote,
    StartAmplfying,
    StopAmplifying,
    StartingPosition,
}

export const gainNoteEvents: MatchEventType[] = [
    MatchEventType.PickupNote,
];

export const loseNoteEvents: MatchEventType[] = [
    MatchEventType.ScoreNote,
    MatchEventType.DropNote,
    MatchEventType.FeedNote,
];
