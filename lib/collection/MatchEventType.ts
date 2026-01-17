export enum MatchEventType {
  StartScoring,
  StopScoring,
  StartMatch,
  StartCamping,
  StopCamping,
  StartDefending,
  StopDefending,
  Intake,
  Outtake,
  Disrupt,
  Cross,
  Climb,
  StartFeeding,
  StopFeeding,
}

export type MatchEventTypeDescription = {
  name: string;
};

export const matchEventTypeDescriptions: Record<
  MatchEventType,
  MatchEventTypeDescription
> = {
  [MatchEventType.StartMatch]: {
    name: "Start Match",
  },
  [MatchEventType.StartScoring]: {
    name: "Start Scoring",
  },
  [MatchEventType.StopScoring]: {
    name: "Stop Scoring",
  },
  [MatchEventType.StartFeeding]: {
    name: "Start Feeding",
  },
  [MatchEventType.StopFeeding]: {
    name: "Stop Feeding",
  },
  [MatchEventType.StartCamping]: {
    name: "Start Camping",
  },
  [MatchEventType.StopCamping]: {
    name: "Stop Camping",
  },
  [MatchEventType.StartDefending]: {
    name: "Start Defending",
  },
  [MatchEventType.StopDefending]: {
    name: "Stop Defending",
  },
  [MatchEventType.Intake]: {
    name: "Intake",
  },
  [MatchEventType.Outtake]: {
    name: "Outtake",
  },
  [MatchEventType.Disrupt]: {
    name: "Disrupt",
  },
  [MatchEventType.Cross]: {
    name: "Cross",
  },
  [MatchEventType.Climb]: {
    name: "Climb",
  },
};
