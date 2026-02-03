import React, { useCallback, useEffect, useRef } from "react";
import { figmaDimensionsToFieldInsets } from "../../util";
import { DragDirection, DraggableContainer } from "../DraggableContainer";
import { ScoringMode, useScoringModeStore } from "../../../storage/userStores";
import Hub from "../../../../assets/hub";
import { useReportStateStore } from "../../reportStateStore";
import { MatchEventPosition } from "../../MatchEventPosition";
import { MatchEventType } from "../../MatchEventType";
import * as Haptics from "expo-haptics";
import { Animated, Easing, TextInput, View } from "react-native";
import { colors } from "../../../colors";
import { Icon } from "../../../components/Icon";
import { GamePhase } from "../../ReportState";

const ACTIVE_OPACITY = 0.2;
const TELEOP_SCALE = 1.28;

export function ScoreFuelInHubAction() {
  const scoringMode = useScoringModeStore((state) => state.value);
  const gamePhase = useReportStateStore((state) => state.gamePhase);

  // textinput is used to allow direct manipulation
  const textContainerRef = useRef<TextInput>(null);
  const updateTextDisplay = useCallback((newValue: string) => {
    textContainerRef.current?.setNativeProps({ text: newValue });
  }, []);

  const hubOpacity = useRef(new Animated.Value(1)).current;
  const hubScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.timing(hubScale, {
      toValue: gamePhase === GamePhase.Auto ? 1 : TELEOP_SCALE,
      duration: 300,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [gamePhase, hubScale]);

  const {
    onStart: baseOnStart,
    onMove,
    onEnd: baseOnEnd,
  } = useDragFunctionsFromScoringMode(
    scoringMode,
    MatchEventType.StartScoring,
    MatchEventType.StopScoring,
    updateTextDisplay,
  );

  const onStart = useCallback(() => {
    Animated.timing(hubOpacity, {
      toValue: ACTIVE_OPACITY,
      duration: 0,
      useNativeDriver: true,
    }).start();
    baseOnStart();
  }, [baseOnStart, hubOpacity]);

  const onEnd = useCallback(
    (displacement: number, totalDistance: number) => {
      Animated.timing(hubOpacity, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }).start();
      baseOnEnd(displacement, totalDistance);
    },
    [baseOnEnd, hubOpacity],
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
      <Animated.View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: hubOpacity,
          transform: [{ scale: hubScale }],
        }}
      >
        <Hub />
      </Animated.View>
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
          opacity: 0.8,
        }}
      />
    </DraggableContainer>
  );
}

function GeneralisedFeedAction({
  edgeInsets,
}: {
  edgeInsets: [number, number, number, number];
}) {
  const scoringMode = useScoringModeStore((state) => state.value);

  // textinput is used to allow direct manipulation
  const textContainerRef = useRef<TextInput>(null);
  const updateTextDisplay = useCallback((newValue: string) => {
    textContainerRef.current?.setNativeProps({ text: newValue });
  }, []);

  const { onStart, onMove, onEnd, isCounting } =
    useDragFunctionsFromScoringMode(
      scoringMode,
      MatchEventType.StartFeeding,
      MatchEventType.StopFeeding,
      updateTextDisplay,
    );

  console.log({ isCounting });

  return (
    <DraggableContainer
      edgeInsets={edgeInsets}
      respectAlliance={true}
      dragDirection={DragDirection.Up}
      onStart={onStart}
      onMove={onMove}
      onEnd={onEnd}
    >
      <View
        style={{
          height: "100%",
          width: "100%",
          borderRadius: 7,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: colors.secondaryContainer.default,
        }}
      >
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
            color: colors.onBackground.default,
          }}
        />
        {!isCounting && (
          <Icon
            name={"conveyor_belt"}
            color={colors.onBackground.default}
            size={48}
          />
        )}
      </View>
    </DraggableContainer>
  );
}

export function AutoFeedAction() {
  const edgeInsets = figmaDimensionsToFieldInsets({
    x: 530.83,
    y: 12.5,
    width: 132.66,
    height: 311,
  });
  return <GeneralisedFeedAction edgeInsets={edgeInsets} />;
}

export function TeleopFeedAction() {
  const edgeInsets = figmaDimensionsToFieldInsets({
    x: 280.5,
    y: 12.5,
    width: 152,
    height: 311,
  });
  return <GeneralisedFeedAction edgeInsets={edgeInsets} />;
}

function useDragFunctionsFromScoringMode(
  scoringMode: ScoringMode,
  matchEventStartType: MatchEventType,
  matchEventEndType: MatchEventType,
  updateDisplay: (value: string) => void,
): {
  onStart: () => void;
  // unused _ to fit function parameters
  onMove: (_: number, displacement: number) => void;
  onEnd: (_: number, displacement: number) => void;
  isCounting: boolean;
} {
  const reportState = useReportStateStore((state) => state);
  // const scoringSensitivity = useScoringSensitivityStore

  const currentCount = useRef(0);

  // for rate
  const currentDelay = useRef(17);
  const isTicking = useRef(false);
  const isCounting = useRef(false);

  useEffect(() => {
    const startCounting = () => {
      setTimeout(() => {
        if (isTicking.current) {
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
        isCounting.current = true;
        reportState.addEvent({
          type: matchEventStartType,
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
        isCounting.current = false;
        reportState.addEvent({
          type: matchEventEndType,
          position: MatchEventPosition.Hub,
          quantity: getCountFromDisplacement(displacement),
        });
        currentCount.current = 0;
        updateDisplay("");
      },
      isCounting: isCounting.current,
    };
  } else {
    return {
      onStart: () => {
        currentDelay.current = 1000; // add sensitivity
        isTicking.current = true;
        isCounting.current = true;
        currentCount.current = 0;
        reportState.addEvent({
          type: matchEventStartType,
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
          type: matchEventEndType,
          position: MatchEventPosition.Hub,
          quantity: currentCount.current,
        });
        currentDelay.current = 17;
        isTicking.current = false;
        isCounting.current = false;
        currentCount.current = 0;
        updateDisplay("");
      },
      isCounting: isCounting.current,
    };
  }
}
