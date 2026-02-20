import React, { useCallback, useEffect, useRef, useState } from "react";
import { figmaDimensionsToFieldInsets } from "../../util";
import { DraggableContainer } from "../DraggableContainer";
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
const CHECKMARK_DURATION_MS = 200;

export function ScoreFuelInHubAction() {
  const scoringMode = useScoringModeStore((state) => state.value);
  const gamePhase = useReportStateStore((state) => state.gamePhase);

  const [showCheckmark, setShowCheckmark] = useState(false);

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
    forceStop,
  } = useDragFunctionsFromScoringMode(
    scoringMode,
    MatchEventType.StartScoring,
    MatchEventType.StopScoring,
    MatchEventPosition.Hub,
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
    (dx: number, dy: number, totalDistance: number) => {
      Animated.timing(hubOpacity, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }).start();
      baseOnEnd(dx, dy, totalDistance);
      setShowCheckmark(true);
      setTimeout(() => setShowCheckmark(false), CHECKMARK_DURATION_MS);
    },
    [baseOnEnd, hubOpacity],
  );

  const onForceStop = useCallback(() => {
    forceStop();
    setShowCheckmark(true);
    setTimeout(() => setShowCheckmark(false), CHECKMARK_DURATION_MS);
  }, [forceStop]);

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
      onStart={onStart}
      onMove={onMove}
      onEnd={onEnd}
      forceStop={onForceStop}
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
        editable={false}
        showSoftInputOnFocus={false}
        selectTextOnFocus={false}
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
      {showCheckmark && (
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Icon name="check" color="#3EE679" size={48} />
        </View>
      )}
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

  const [showCheckmark, setShowCheckmark] = useState(false);

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

  const { onStart, onMove, onEnd, isCounting, forceStop } =
    useDragFunctionsFromScoringMode(
      scoringMode,
      MatchEventType.StartFeeding,
      MatchEventType.StopFeeding,
      MatchEventPosition.NeutralZone,
      updateTextDisplay,
    );

  const handleOnEnd = useCallback(
    (...args: Parameters<typeof onEnd>) => {
      onEnd(...args);
      setShowCheckmark(true);
      setTimeout(() => setShowCheckmark(false), CHECKMARK_DURATION_MS);
    },
    [onEnd],
  );

  const handleForceStop = useCallback(() => {
    forceStop();
    setShowCheckmark(true);
    setTimeout(() => setShowCheckmark(false), CHECKMARK_DURATION_MS);
  }, [forceStop]);

  console.log({ isCounting });

  return (
    <DraggableContainer
      edgeInsets={edgeInsets}
      respectAlliance={true}
      onStart={onStart}
      onMove={onMove}
      onEnd={handleOnEnd}
      forceStop={handleForceStop}
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
          editable={false}
          showSoftInputOnFocus={false}
          selectTextOnFocus={false}
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
        {!isCounting && !showCheckmark && (
          <View style={{ transform: [{ scaleX: shouldFlipIcon ? -1 : 1 }] }}>
            <Icon
              name={"conveyor_belt"}
              color={colors.onBackground.default}
              size={48}
            />
          </View>
        )}
        {showCheckmark && (
          <View style={{ alignItems: "center", justifyContent: "center" }}>
            <Icon name="check" color={colors.onBackground.default} size={48} />
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
  matchEventPosition: MatchEventPosition,
  updateDisplay: (value: string) => void,
): {
  onStart: () => void;
  onMove: (dx: number, dy: number, totalDistance: number) => void;
  onEnd: (
    dx: number,
    dy: number,
    totalDistance: number,
    timestamp?: number,
  ) => void;
  forceStop: () => void;
  isCounting: boolean;
} {
  const reportState = useReportStateStore((state) => state);

  const currentCount = useRef(0);

  const BASE_INTERVAL_MS = 500;
  const MIN_INTERVAL_MS = 25;
  const DRAG_SENSITIVITY = 200;
  const DIRECTION_LOCK_THRESHOLD = 20;

  const targetIntervalRef = useRef(BASE_INTERVAL_MS);
  const lastIncrementTimeRef = useRef(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const initialAngleRef = useRef<number | null>(null);
  const isDecrementingRef = useRef(false);
  const [isCounting, setIsCounting] = useState(false);
  const isCountingRef = useRef(isCounting);
  isCountingRef.current = isCounting;
  const [shouldClearDisplay, setShouldClearDisplay] = useState(false);

  // Clear display when isCounting changes to false and shouldClearDisplay is set
  useEffect(() => {
    if (!isCounting && shouldClearDisplay) {
      updateDisplay("");
      setShouldClearDisplay(false);
    }
  }, [isCounting, shouldClearDisplay, updateDisplay]);

  const startIncrementing = useCallback(() => {
    if (intervalRef.current) return;

    lastIncrementTimeRef.current = Date.now();

    intervalRef.current = setInterval(() => {
      const now = Date.now();
      const elapsed = now - lastIncrementTimeRef.current;

      if (elapsed >= targetIntervalRef.current) {
        if (isDecrementingRef.current) {
          if (currentCount.current > 0) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
            currentCount.current -= 1;
            updateDisplay(currentCount.current.toString());
          }
        } else {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          currentCount.current += 1;
          updateDisplay(currentCount.current.toString());
        }
        lastIncrementTimeRef.current = now;
      }
    }, 16);
  }, [updateDisplay]);

  const stopIncrementing = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    targetIntervalRef.current = BASE_INTERVAL_MS;
  }, []);

  const forceStop = useCallback(() => {
    stopIncrementing();
    setIsCounting(false);
    setShouldClearDisplay(true);
  }, [stopIncrementing]);

  // for count mode - exponential falloff
  const SCALE_FACTOR = 80;

  const pixelsToItems = (pixels: number): number => {
    if (pixels <= 0) return 0;
    return Math.floor(Math.pow(1 + 1 / SCALE_FACTOR, pixels));
  };

  if (scoringMode === ScoringMode.Count) {
    return {
      onStart: () => {
        if (isCountingRef.current) return;

        setIsCounting(true);
        reportState.addEvent({
          type: matchEventStartType,
          position: matchEventPosition,
        });
        currentCount.current = 0;
        updateDisplay("0");
      },
      onMove: (dx, dy, totalDistance) => {
        if (!isCountingRef.current) return;

        const count = pixelsToItems(totalDistance);
        if (count !== currentCount.current) {
          if (count > currentCount.current) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          } else {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
          }
          currentCount.current = count;
          updateDisplay(count.toString());
        }
      },
      onEnd: (dx, dy, totalDistance, timestamp) => {
        setIsCounting(false);
        const finalCount = pixelsToItems(totalDistance);
        if (finalCount > 0) {
          reportState.addEvent({
            type: matchEventEndType,
            position: matchEventPosition,
            quantity: finalCount,
            timestamp,
          });
        }
        currentCount.current = 0;
        setShouldClearDisplay(true);
      },
      isCounting: isCounting,
      forceStop,
    };
  } else {
    return {
      onStart: () => {
        if (isCountingRef.current) return;

        initialAngleRef.current = null;
        isDecrementingRef.current = false;
        targetIntervalRef.current = BASE_INTERVAL_MS;
        setIsCounting(true);
        currentCount.current = 0;
        updateDisplay("0");
        reportState.addEvent({
          type: matchEventStartType,
          position: matchEventPosition,
        });
        startIncrementing();
      },
      onMove: (dx, dy, totalDistance) => {
        if (!isCountingRef.current) return;

        if (initialAngleRef.current === null) {
          if (totalDistance >= DIRECTION_LOCK_THRESHOLD) {
            initialAngleRef.current = Math.atan2(dy, dx);
            isDecrementingRef.current = false;
          }
        } else {
          const currentAngle = Math.atan2(dy, dx);
          let angleDiff = currentAngle - initialAngleRef.current;
          if (angleDiff > Math.PI) {
            angleDiff -= 2 * Math.PI;
          } else if (angleDiff < -Math.PI) {
            angleDiff += 2 * Math.PI;
          }
          isDecrementingRef.current = Math.abs(angleDiff) > Math.PI / 2;
        }

        const speedMultiplier = Math.max(
          0,
          Math.min(1, totalDistance / DRAG_SENSITIVITY),
        );
        targetIntervalRef.current = Math.round(
          BASE_INTERVAL_MS -
            speedMultiplier * (BASE_INTERVAL_MS - MIN_INTERVAL_MS),
        );
      },
      onEnd: (dx, dy, totalDistance, timestamp) => {
        stopIncrementing();
        if (currentCount.current > 0) {
          reportState.addEvent({
            type: matchEventEndType,
            position: matchEventPosition,
            quantity: currentCount.current,
            timestamp,
          });
        }
        setIsCounting(false);
        currentCount.current = 0;
        setShouldClearDisplay(true);
      },
      isCounting: isCounting,
      forceStop,
    };
  }
}
