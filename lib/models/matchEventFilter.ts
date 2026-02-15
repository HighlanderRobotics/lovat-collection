import { MatchEvent } from "../collection/MatchEvent";
import { MatchEventType } from "../collection/MatchEventType";

export const isStopEvent = (event: MatchEvent): boolean => {
  return (
    event.type === MatchEventType.StopFeeding ||
    event.type === MatchEventType.StopScoring
  );
};

export const isStartEvent = (event: MatchEvent): boolean => {
  return (
    event.type === MatchEventType.StartFeeding ||
    event.type === MatchEventType.StartScoring
  );
};

export const getMatchingStopType = (
  eventType: MatchEventType,
): MatchEventType | undefined => {
  if (eventType === MatchEventType.StartFeeding)
    return MatchEventType.StopFeeding;
  if (eventType === MatchEventType.StartScoring)
    return MatchEventType.StopScoring;
  return undefined;
};

export const getMatchingStartType = (
  eventType: MatchEventType,
): MatchEventType | undefined => {
  if (eventType === MatchEventType.StopFeeding)
    return MatchEventType.StartFeeding;
  if (eventType === MatchEventType.StopScoring)
    return MatchEventType.StartScoring;
  return undefined;
};

export const filterInvalidStopEvents = (events: MatchEvent[]): MatchEvent[] => {
  return events.reduce<MatchEvent[]>((acc, event) => {
    if (!isStopEvent(event)) {
      return [...acc, event];
    }

    const hasZeroQuantity = (event.quantity ?? 0) === 0;
    if (hasZeroQuantity) {
      return acc;
    }

    const matchingStartType = getMatchingStartType(event.type);
    const hasMatchingStart = matchingStartType
      ? acc.some((e) => e.type === matchingStartType)
      : false;
    if (!hasMatchingStart) {
      return acc;
    }

    return [...acc, event];
  }, []);
};

export const filterUnmatchedStartEvents = (
  events: MatchEvent[],
): MatchEvent[] => {
  return events.reduce<MatchEvent[]>((acc, event) => {
    if (!isStartEvent(event)) {
      return [...acc, event];
    }

    const matchingStopType = getMatchingStopType(event.type);
    const hasMatchingStop = matchingStopType
      ? events.some((e) => e.type === matchingStopType)
      : false;
    if (!hasMatchingStop) {
      return acc;
    }

    return [...acc, event];
  }, []);
};
