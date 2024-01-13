export enum MatchEventType {
    PickupNote,
    ScoreNote,
    DropNote,
    FeedNote,
    LeaveWing,
}

export const gainNoteEvents: MatchEventType[] = [
    MatchEventType.PickupNote,
];

export const loseNoteEvents: MatchEventType[] = [
    MatchEventType.ScoreNote,
    MatchEventType.DropNote,
    MatchEventType.FeedNote,
];
