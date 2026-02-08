import React, { useCallback, useEffect, useRef } from "react";
import { figmaDimensionsToFieldInsets } from "../../util";
import { DragDirection, DraggableContainer } from "../DraggableContainer";
import {
  FieldOrientation,
  ScoringMode,
  useFieldOrientationStore,
  useScoringModeStore,
} from "../../../storage/userStores";
import Hub from "../../../../assets/hub";
import { useReportStateStore } from "../../reportStateStore";
import { MatchEventPosition } from "../../MatchEventPosition";
import { MatchEventType } from "../../MatchEventType";
import * as Haptics from "expo-haptics";
import { Animated, Easing, TextInput, View } from "react-native";
import { colors } from "../../../colors";
import { Icon } from "../../../components/Icon";
import { GamePhase } from "../../ReportState";
import { AllianceColor } from "../../../models/AllianceColor";

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
  const fieldOrientation = useFieldOrientationStore((state) => state.value);
  const allianceColor = useReportStateStore(
    (state) => state.meta?.allianceColor,
  );

  // Flip icon to face the robot's alliance side
  // Default icon faces right
  // In Auspicious mode: Blue is on left, Red is on right
  // In Sinister mode: Red is on left, Blue is on right
  // Flip when alliance is on the left side:
  //   - Red + Sinister (Red is on left)
  //   - Blue + Auspicious (Blue is on left)
  const shouldFlipIcon =
    (allianceColor === AllianceColor.Red) ===
    (fieldOrientation === FieldOrientation.Sinister);

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
          <View style={{ transform: [{ scaleX: shouldFlipIcon ? -1 : 1 }] }}>
            <Icon
              name={"conveyor_belt"}
              color={colors.onBackground.default}
              size={48}
            />
          </View>
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
  onMove: (_: number, totalDistance: number) => void;
  onEnd: (_: number, totalDistance: number) => void;
  isCounting: boolean;
} {
  const reportState = useReportStateStore((state) => state);
  // const scoringSensitivity = useScoringSensitivityStore

  const currentCount = useRef(0);

  // for rate mode - using fast polling approach from gist
  const BASE_INTERVAL_MS = 500;
  const MIN_INTERVAL_MS = 25;
  const DRAG_SENSITIVITY = 200;

  const targetIntervalRef = useRef(BASE_INTERVAL_MS);
  const lastIncrementTimeRef = useRef(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isCounting = useRef(false);

  const startIncrementing = useCallback(() => {
    if (intervalRef.current) return; // Already running

    lastIncrementTimeRef.current = Date.now();

    // Use a fast polling interval and check elapsed time
    // This allows the rate to change dynamically as the user drags
    intervalRef.current = setInterval(() => {
      const now = Date.now();
      const elapsed = now - lastIncrementTimeRef.current;

      if (elapsed >= targetIntervalRef.current) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        currentCount.current += 1;
        updateDisplay(currentCount.current.toString());
        lastIncrementTimeRef.current = now;
      }
    }, 16); // ~60fps polling
  }, [updateDisplay]);

  const stopIncrementing = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    targetIntervalRef.current = BASE_INTERVAL_MS;
  }, []);

  // for count mode - quadratic falloff from gist
  // Using formula: items = (pixels / SCALE_FACTOR)^2
  // Solving for SCALE_FACTOR: 50 = (400 / k)^2 => k = 400 / sqrt(50) ~= 56.57
  const SCALE_FACTOR = 400 / Math.sqrt(50);

  const pixelsToItems = (pixels: number): number => {
    if (pixels <= 0) return 0;
    return Math.floor(Math.pow(pixels / SCALE_FACTOR, 2));
  };

  if (scoringMode === ScoringMode.Count) {
    return {
      onStart: () => {
        if (isCounting.current) return;

        isCounting.current = true;
        reportState.addEvent({
          type: matchEventStartType,
          position: MatchEventPosition.Hub,
        });
        currentCount.current = 0;
        updateDisplay("0");
      },
      onMove: (_, totalDistance) => {
        if (!isCounting.current) return;

        const count = pixelsToItems(totalDistance);
        if (count !== currentCount.current) {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          currentCount.current = count;
          updateDisplay(count.toString());
        }
      },
      onEnd: (_, totalDistance) => {
        isCounting.current = false;
        const finalCount = pixelsToItems(totalDistance);
        if (finalCount > 0) {
          reportState.addEvent({
            type: matchEventEndType,
            position: MatchEventPosition.Hub,
            quantity: finalCount,
          });
        }
        currentCount.current = 0;
        updateDisplay("");
      },
      isCounting: isCounting.current,
    };
  } else {
    return {
      onStart: () => {
        if (isCounting.current) return;

        targetIntervalRef.current = BASE_INTERVAL_MS;
        isCounting.current = true;
        currentCount.current = 0;
        updateDisplay("0");
        reportState.addEvent({
          type: matchEventStartType,
          position: MatchEventPosition.Hub,
        });
        startIncrementing();
      },
      onMove: (_, totalDistance) => {
        if (!isCounting.current) return;

        // Linear interpolation from BASE_INTERVAL_MS to MIN_INTERVAL_MS
        const speedMultiplier = Math.max(
          0,
          Math.min(1, totalDistance / DRAG_SENSITIVITY),
        );
        targetIntervalRef.current = Math.round(
          BASE_INTERVAL_MS -
            speedMultiplier * (BASE_INTERVAL_MS - MIN_INTERVAL_MS),
        );
      },
      onEnd: () => {
        stopIncrementing();
        if (currentCount.current > 0) {
          reportState.addEvent({
            type: matchEventEndType,
            position: MatchEventPosition.Hub,
            quantity: currentCount.current,
          });
        }
        isCounting.current = false;
        currentCount.current = 0;
        updateDisplay("");
      },
      isCounting: isCounting.current,
    };
  }
}
