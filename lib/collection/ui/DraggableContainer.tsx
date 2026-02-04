import React, { useCallback, useMemo, useRef } from "react";
import { PanResponder, View } from "react-native";
import {
  FieldOrientation,
  useFieldOrientationStore,
} from "../../storage/userStores";
import { AllianceColor } from "../../models/AllianceColor";
import { useReportStateStore } from "../reportStateStore";

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
  children,
  edgeInsets,
  respectAlliance,
  dragDirection,
}: {
  onStart: () => void;
  onMove: (displacement: number, totalDistance: number) => void;
  onEnd: (displacement: number, totalDistance: number) => void;
  children?: React.ReactNode;
  edgeInsets: [number, number, number, number];
  respectAlliance: boolean;
  dragDirection: DragDirection;
}) => {
  const fieldOrientation = useFieldOrientationStore((state) => state.value);
  const reportState = useReportStateStore();
  const allianceColor = reportState.meta?.allianceColor;

  const startXRef = useRef<number>(0);
  const startYRef = useRef<number>(0);

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

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderTerminationRequest: () => false,
        onPanResponderGrant: (event) => {
          const { pageX, pageY } = event.nativeEvent;
          startXRef.current = pageX;
          startYRef.current = pageY;
          onStart();
        },
        onPanResponderMove: (event) => {
          const { pageX, pageY } = event.nativeEvent;
          const dx = pageX - startXRef.current;
          const dy = pageY - startYRef.current;
          const totalDistance = Math.sqrt(dx * dx + dy * dy);
          onMove(signGestureDirection(dx, dy), totalDistance);
        },
        onPanResponderRelease: (event) => {
          const { pageX, pageY } = event.nativeEvent;
          const dx = pageX - startXRef.current;
          const dy = pageY - startYRef.current;
          const totalDistance = Math.sqrt(dx * dx + dy * dy);
          onEnd(signGestureDirection(dx, dy), totalDistance);
        },
        onPanResponderTerminate: (event) => {
          const { pageX, pageY } = event.nativeEvent;
          const dx = pageX - startXRef.current;
          const dy = pageY - startYRef.current;
          const totalDistance = Math.sqrt(dx * dx + dy * dy);
          onEnd(signGestureDirection(dx, dy), totalDistance);
        },
      }),
    [onStart, onMove, onEnd, signGestureDirection],
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
