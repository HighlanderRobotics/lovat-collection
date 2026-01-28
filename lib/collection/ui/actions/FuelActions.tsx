import React, { useEffect, useRef } from "react";
import { figmaDimensionsToFieldInsets } from "../../util";
import { DragDirection, DraggableContainer } from "../DraggableContainer";
import { ScoringMode, useScoringModeStore } from "../../../storage/userStores";
import Hub from "../../../../assets/hub";
import { useReportStateStore } from "../../reportStateStore";
import { MatchEventPosition } from "../../MatchEventPosition";
import { MatchEventType } from "../../MatchEventType";

export function ScoreFuelInHubAction() {
  const scoringMode = useScoringModeStore((state) => state.value);
  const { onStart, onMove, onEnd } =
    useDragFunctionsFromScoringMode(scoringMode);

  const edgeInsets = figmaDimensionsToFieldInsets({
    x: 139.5,
    y: 121.5,
    width: 108,
    height: 93,
  });
  return (
    <DraggableContainer
      edgeInsets={edgeInsets}
      respectAlliance={true}
      dragDirection={DragDirection.Up}
      onStart={onStart}
      onMove={onMove}
      onEnd={onEnd}
    >
      <Hub />
    </DraggableContainer>
  );
}

function useDragFunctionsFromScoringMode(scoringMode: ScoringMode): {
  onStart: () => void;
  onMove: (displacement: number, movement: number) => void;
  onEnd: (displacement: number) => void;
} {
  const reportState = useReportStateStore((state) => state);
  // const scoringSensitivity = useScoringSensitivityStore

  // only used for rate
  const currentCount = useRef(0);
  const currentDelay = useRef(17);
  const isCounting = useRef(false);
  useEffect(() => {
    const startCounting = () => {
      setTimeout(() => {
        if (isCounting) {
          currentCount.current += 1;
        }
        startCounting();
      }, currentDelay.current);
    };
    startCounting();
  }, []);

  if (scoringMode === ScoringMode.Count) {
    return {
      onStart: () => {
        reportState.addEvent({
          type: MatchEventType.StartScoring,
          position: MatchEventPosition.Hub,
        });
        // turn on number
        // set count to 1
      },
      onMove: () => {
        // set count to number based on sensitivity
      },
      onEnd: (displacement) => {
        reportState.addEvent({
          type: MatchEventType.StopScoring,
          position: MatchEventPosition.Hub,
          quantity: displacement, // / scoringSensitivity * sensitivityFactor,
        });
      },
    };
  } else {
    return {
      onStart: () => {
        currentDelay.current = 1000; // add sensitivity
        isCounting.current = true;
        currentCount.current = 0;
        reportState.addEvent({
          type: MatchEventType.StartScoring,
          position: MatchEventPosition.Hub,
        });
      },
      onMove: () => {
        currentDelay.current = 1000; // add sensitivity
      },
      onEnd: () => {
        reportState.addEvent({
          type: MatchEventType.StopScoring,
          position: MatchEventPosition.Hub,
          quantity: currentCount.current,
        });
        currentDelay.current = 17;
        isCounting.current = false;
        currentCount.current = 0;
      },
    };
  }
}
