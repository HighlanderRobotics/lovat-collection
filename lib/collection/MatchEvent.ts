import { MatchEventType } from "./MatchEventType";
import { MatchEventPosition } from "./MatchEventPosition";

export type MatchEvent = {
  type: MatchEventType;
  position: MatchEventPosition;
  timestamp: number;
};
