import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { PanResponder, View } from "react-native";
import {
  FieldOrientation,
  useFieldOrientationStore,
} from "../../storage/userStores";
import { AllianceColor } from "../../models/AllianceColor";
import { useReportStateStore } from "../reportStateStore";
import { GamePhase } from "../ReportState";

export const DraggableContainer = ({
  onStart,
  onMove,
  onEnd,
  forceStop,
  children,
  edgeInsets,
  respectAlliance,
}: {
  onStart: () => void;
  onMove: (dx: number, dy: number, totalDistance: number) => void;
  onEnd: (
    dx: number,
    dy: number,
    totalDistance: number,
    timestamp?: number,
  ) => void;
  forceStop?: () => void;
  children?: React.ReactNode;
  edgeInsets: [number, number, number, number];
  respectAlliance: boolean;
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

  const triggerEndEvent = useCallback(() => {
    const totalDistance = 0;
    const reportState = useReportStateStore.getState();
    const autoEndTimestamp = reportState.startTimestamp
      ? reportState.startTimestamp.getTime() + 22999
      : Date.now();
    onEnd(0, 0, totalDistance, autoEndTimestamp);
    forceStop?.();
    isActiveRef.current = false;
    initialTouchIdRef.current = null;
  }, [onEnd, forceStop]);

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

          if (isActiveRef.current) {
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
          onMove(dx, dy, totalDistance);
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
          onEnd(dx, dy, totalDistance);
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
          onEnd(dx, dy, totalDistance);
        },
      }),
    [onStart, onMove, onEnd, forceStop],
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
