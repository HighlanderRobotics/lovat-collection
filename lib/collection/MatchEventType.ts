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

export type MatchEventTypeDescription = {
    name: string;
    icon: string;
}

export const matchEventTypeDescriptions: Record<MatchEventType, MatchEventTypeDescription> = {
    [MatchEventType.LeaveWing]: {
        name: "Leave Wing",
        icon: "exit_to_app",
    },
    [MatchEventType.PickupNote]: {
        name: "Pick Up Note",
        icon: "upload",
    },
    [MatchEventType.DropNote]: {
        name: "Drop Note",
        icon: "output_circle",
    },
    [MatchEventType.ScoreNote]: {
        name: "Score Note",
        icon: "sports_score",
    },
    [MatchEventType.Defend]: {
        name: "Defend",
        icon: "shield",
    },
    [MatchEventType.FeedNote]: {
        name: "Feed Note",
        icon: "conveyor_belt",
    },
    [MatchEventType.StartAmplfying]: {
        name: "Start Amplifying",
        icon: "campaign",
    },
    [MatchEventType.StopAmplifying]: {
        name: "Stop Amplifying",
        icon: "volume_off",
    },
    [MatchEventType.StartingPosition]: {
        name: "Starting Position",
        icon: "play_arrow",
    },
};

export const gainNoteEvents: MatchEventType[] = [
    MatchEventType.PickupNote,
];

export const loseNoteEvents: MatchEventType[] = [
    MatchEventType.ScoreNote,
    MatchEventType.DropNote,
    MatchEventType.FeedNote,
];
