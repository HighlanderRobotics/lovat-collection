export enum MatchEventType {
  PickupCoral,
  PickupAlgae,
  FeedAlgae,
  AutoLeave,
  Defend,
  ScoreNet,
  FailNet,
  ScoreProcessor,
  ScoreCoral,
  DropAlgae,
  DropCoral,
  StartPosition,
}

export type MatchEventTypeDescription = {
  name: string;
  icon: string;
};

export const matchEventTypeDescriptions: Record<
  MatchEventType,
  MatchEventTypeDescription
> = {
  [MatchEventType.PickupCoral]: {
    name: "Pickup Coral",
    icon: "frc_coral",
  },
  [MatchEventType.PickupAlgae]: {
    name: "Pickup Algae",
    icon: "frc_algae",
  },
  [MatchEventType.FeedAlgae]: {
    name: "Feed",
    icon: "feeder",
  },
  [MatchEventType.AutoLeave]: {
    name: "Leave",
    icon: "exit_to_app",
  },
  [MatchEventType.Defend]: {
    name: "Defend",
    icon: "shield",
  },
  [MatchEventType.ScoreNet]: {
    name: "Score Net",
    icon: "hub",
  },
  [MatchEventType.FailNet]: {
    name: "Miss Net",
    icon: "signal_wifi_bad",
  },
  [MatchEventType.ScoreProcessor]: {
    name: "Score Processor",
    icon: "account_tree",
  },
  [MatchEventType.ScoreCoral]: {
    name: "Score Coral",
    icon: "token",
  },
  [MatchEventType.DropAlgae]: {
    name: "Drop Algae",
    icon: "arrow_drop_down_circle",
  },
  [MatchEventType.DropCoral]: {
    name: "Drop Coral",
    icon: "output_circle",
  },
  [MatchEventType.StartPosition]: {
    name: "Start Position",
    icon: "text_select_start",
  },
};
