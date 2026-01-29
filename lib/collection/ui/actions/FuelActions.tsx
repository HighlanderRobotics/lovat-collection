import React, { useCallback, useEffect, useRef } from "react";
import { figmaDimensionsToFieldInsets } from "../../util";
import { DragDirection, DraggableContainer } from "../DraggableContainer";
import { ScoringMode, useScoringModeStore } from "../../../storage/userStores";
import Hub from "../../../../assets/hub";
import { useReportStateStore } from "../../reportStateStore";
import { MatchEventPosition } from "../../MatchEventPosition";
import { MatchEventType } from "../../MatchEventType";
import * as Haptics from "expo-haptics";
import { TextInput } from "react-native";

export function ScoreFuelInHubAction() {
  const scoringMode = useScoringModeStore((state) => state.value);

  // textinput is used to allow direct manipulation
  const textContainerRef = useRef<TextInput>(null);
  const updateTextDisplay = useCallback((newValue: string) => {
    textContainerRef.current?.setNativeProps({ text: newValue });
  }, []);

  const { onStart, onMove, onEnd } = useDragFunctionsFromScoringMode(
    scoringMode,
    updateTextDisplay,
  );

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
      <TextInput
        pointerEvents="none"
        ref={textContainerRef}
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
          alignItems: "center",
          textAlign: "center",
          fontFamily: "Heebo_500Medium",
          fontSize: 36,
          fontWeight: "500",
          color: "#3EE679",
        }}
      />
    </DraggableContainer>
  );
}

function useDragFunctionsFromScoringMode(
  scoringMode: ScoringMode,
  updateDisplay: (value: string) => void,
): {
  onStart: () => void;
  // unused _ to fit function parameters
  onMove: (_: number, displacement: number) => void;
  onEnd: (_: number, displacement: number) => void;
} {
  const reportState = useReportStateStore((state) => state);
  // const scoringSensitivity = useScoringSensitivityStore

  const currentCount = useRef(0);

  // for rate
  const currentDelay = useRef(17);
  const isCounting = useRef(false);
  useEffect(() => {
    const startCounting = () => {
      setTimeout(() => {
        if (isCounting.current) {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          currentCount.current += 1;
          updateDisplay(currentCount.current.toString());
        }
        startCounting();
      }, currentDelay.current);
    };
    startCounting();
  }, []);

  // for count
  const getCountFromDisplacement = (displacement: number) =>
    1 + Math.floor((Math.abs(displacement) + displacement) / (2 * 20));

  if (scoringMode === ScoringMode.Count) {
    return {
      onStart: () => {
        reportState.addEvent({
          type: MatchEventType.StartScoring,
          position: MatchEventPosition.Hub,
        });
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        currentCount.current = 0;
        updateDisplay("1");
      },
      onMove: (_, displacement) => {
        const count = getCountFromDisplacement(displacement);
        if (count != currentCount.current) {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          currentCount.current = count;
          updateDisplay(count.toString());
        }
      },
      onEnd: (_, displacement) => {
        reportState.addEvent({
          type: MatchEventType.StopScoring,
          position: MatchEventPosition.Hub,
          quantity: getCountFromDisplacement(displacement),
        });
        currentCount.current = 0;
        updateDisplay("");
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
      onMove: (_, displacement) => {
        currentDelay.current =
          displacement / Math.abs(displacement) === 1 // checks if you're dragging in the right direction
            ? 1000 / Math.log(1 + displacement)
            : 1000;
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
        updateDisplay("");
      },
    };
  }
}
