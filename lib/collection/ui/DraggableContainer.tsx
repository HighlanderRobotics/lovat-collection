import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { PanResponder, View } from "react-native";
import {
  FieldOrientation,
  useFieldOrientationStore,
} from "../../storage/userStores";
import { AllianceColor } from "../../models/AllianceColor";
import { useReportStateStore } from "../reportStateStore";
import { GamePhase } from "../ReportState";

export enum DragDirection {
  Up,
  Down,
  Right,
  Left,
}

export const DraggableContainer = ({
  onStart,
  onMove,
  onEnd,
  forceStop,
  children,
  edgeInsets,
  respectAlliance,
  dragDirection,
}: {
  onStart: () => void;
  onMove: (displacement: number, totalDistance: number) => void;
  onEnd: (
    displacement: number,
    totalDistance: number,
    timestamp?: number,
  ) => void;
  forceStop?: () => void;
  children?: React.ReactNode;
  edgeInsets: [number, number, number, number];
  respectAlliance: boolean;
  dragDirection: DragDirection;
}) => {
  const fieldOrientation = useFieldOrientationStore((state) => state.value);
  const reportState = useReportStateStore();
  const allianceColor = reportState.meta?.allianceColor;
  const gamePhase = useReportStateStore((state) => state.gamePhase);

  const startXRef = useRef<number>(0);
  const startYRef = useRef<number>(0);
  const initialTouchIdRef = useRef<string | null>(null);
  const isActiveRef = useRef<boolean>(false);
  const previousGamePhaseRef = useRef<GamePhase>(gamePhase);

  const signGestureDirection = useCallback(
    (dx: number, dy: number) => {
      const sign = {
        [DragDirection.Up]: -1,
        [DragDirection.Down]: 1,
        [DragDirection.Left]: -1,
        [DragDirection.Right]: 1,
      }[dragDirection];
      const allianceRespectingConstant =
        (fieldOrientation === FieldOrientation.Auspicious ? 1 : -1) *
        (allianceColor === AllianceColor.Blue ? 1 : -1);
      const vertical =
        dragDirection === DragDirection.Up ||
        dragDirection === DragDirection.Down;
      const displacement =
        sign *
        (vertical ? dy : dx) *
        (respectAlliance ? allianceRespectingConstant : 1);
      return displacement;
    },
    [dragDirection, fieldOrientation, allianceColor, respectAlliance],
  );

  const triggerEndEvent = useCallback(() => {
    const dx = startXRef.current - startXRef.current; // Will be 0
    const dy = startYRef.current - startYRef.current; // Will be 0
    const totalDistance = 0;
    // Set timestamp to just before 18 seconds (17999ms) to ensure it's in Auto phase
    const reportState = useReportStateStore.getState();
    const autoEndTimestamp = reportState.startTimestamp
      ? reportState.startTimestamp.getTime() + 17999
      : Date.now();
    onEnd(signGestureDirection(dx, dy), totalDistance, autoEndTimestamp);
    // Force stop any ongoing intervals/haptics
    forceStop?.();
    isActiveRef.current = false;
    initialTouchIdRef.current = null;
  }, [onEnd, signGestureDirection, forceStop]);

  useEffect(() => {
    if (
      previousGamePhaseRef.current === GamePhase.Auto &&
      gamePhase === GamePhase.Teleop &&
      isActiveRef.current
    ) {
      triggerEndEvent();
    }
    previousGamePhaseRef.current = gamePhase;
  }, [gamePhase, triggerEndEvent]);

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: (event) =>
          event.nativeEvent.identifier === initialTouchIdRef.current ||
          initialTouchIdRef.current === null,
        onMoveShouldSetPanResponder: (event) =>
          event.nativeEvent.identifier === initialTouchIdRef.current,
        onPanResponderTerminationRequest: (event) =>
          event.nativeEvent.identifier === initialTouchIdRef.current,
        onPanResponderGrant: (event) => {
          if (initialTouchIdRef.current === null) {
            initialTouchIdRef.current = event.nativeEvent.identifier;
          }

          if (initialTouchIdRef.current !== event.nativeEvent.identifier) {
            return;
          }

          const { pageX, pageY } = event.nativeEvent;
          startXRef.current = pageX;
          startYRef.current = pageY;
          isActiveRef.current = true;
          onStart();
        },
        onPanResponderMove: (event) => {
          if (initialTouchIdRef.current !== event.nativeEvent.identifier) {
            return;
          }

          const { pageX, pageY } = event.nativeEvent;
          const dx = pageX - startXRef.current;
          const dy = pageY - startYRef.current;
          const totalDistance = Math.sqrt(dx * dx + dy * dy);
          onMove(signGestureDirection(dx, dy), totalDistance);
        },
        onPanResponderRelease: (event) => {
          if (initialTouchIdRef.current !== event.nativeEvent.identifier) {
            return;
          }

          initialTouchIdRef.current = null;
          isActiveRef.current = false;

          const { pageX, pageY } = event.nativeEvent;
          const dx = pageX - startXRef.current;
          const dy = pageY - startYRef.current;
          const totalDistance = Math.sqrt(dx * dx + dy * dy);
          onEnd(signGestureDirection(dx, dy), totalDistance);
        },
        onPanResponderTerminate: (event) => {
          if (initialTouchIdRef.current !== event.nativeEvent.identifier) {
            return;
          }

          initialTouchIdRef.current = null;
          isActiveRef.current = false;

          const { pageX, pageY } = event.nativeEvent;
          const dx = pageX - startXRef.current;
          const dy = pageY - startYRef.current;
          const totalDistance = Math.sqrt(dx * dx + dy * dy);
          onEnd(signGestureDirection(dx, dy), totalDistance);
        },
      }),
    [onStart, onMove, onEnd, signGestureDirection, forceStop],
  );

  const [givenTop, givenRight, givenButtom, givenLeft] = edgeInsets;

  const top = useMemo(() => {
    if (fieldOrientation === FieldOrientation.Auspicious) {
      // return givenTop;
      return respectAlliance
        ? allianceColor === AllianceColor.Blue
          ? givenTop
          : givenButtom
        : givenButtom;
    } else {
      return respectAlliance
        ? allianceColor === AllianceColor.Blue
          ? givenButtom
          : givenTop
        : givenTop;
    }
  }, [respectAlliance, fieldOrientation, givenTop, givenButtom]);

  const bottom = useMemo(() => {
    if (fieldOrientation === FieldOrientation.Auspicious) {
      return respectAlliance
        ? allianceColor === AllianceColor.Blue
          ? givenButtom
          : givenTop
        : givenTop;
    } else {
      return respectAlliance
        ? allianceColor === AllianceColor.Blue
          ? givenTop
          : givenButtom
        : givenButtom;
    }
  }, [respectAlliance, fieldOrientation, givenTop, givenButtom]);

  const left = useMemo(() => {
    if (fieldOrientation === FieldOrientation.Auspicious) {
      return respectAlliance
        ? allianceColor === AllianceColor.Blue
          ? givenLeft
          : givenRight
        : givenLeft;
    } else {
      return respectAlliance
        ? allianceColor === AllianceColor.Blue
          ? givenRight
          : givenLeft
        : givenRight;
    }
  }, [respectAlliance, fieldOrientation, givenLeft, givenRight]);

  const right = useMemo(() => {
    if (fieldOrientation === FieldOrientation.Auspicious) {
      return respectAlliance
        ? allianceColor === AllianceColor.Blue
          ? givenRight
          : givenLeft
        : givenRight;
    } else {
      return respectAlliance
        ? allianceColor === AllianceColor.Blue
          ? givenLeft
          : givenRight
        : givenLeft;
    }
  }, [respectAlliance, fieldOrientation, givenLeft, givenRight]);
  return (
    <View
      style={{
        position: "absolute",
        top: `${top * 100}%`,
        right: `${right * 100}%`,
        bottom: `${bottom * 100}%`,
        left: `${left * 100}%`,
      }}
      {...panResponder.panHandlers}
    >
      {children}
    </View>
  );
};
