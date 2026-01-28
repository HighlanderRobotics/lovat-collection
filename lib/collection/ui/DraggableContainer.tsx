import React, { useMemo, useRef } from "react";
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
  onMove: (displacement: number, movement: number) => void;
  onEnd: (displacement: number, movement: number) => void;
  children?: React.ReactNode;
  edgeInsets: [number, number, number, number];
  respectAlliance: boolean;
  dragDirection: DragDirection;
}) => {
  const fieldOrientation = useFieldOrientationStore((state) => state.value);
  const reportState = useReportStateStore();
  const allianceColor = reportState.meta?.allianceColor;

  const signGestureDirection = (gesture: {
    moveX: number;
    moveY: number;
    dx: number;
    dy: number;
  }) => {
    const sign = {
      [DragDirection.Up]: -1,
      [DragDirection.Down]: 1,
      [DragDirection.Left]: -1,
      [DragDirection.Right]: 1,
    }[dragDirection];
    const vertical =
      dragDirection === DragDirection.Up ||
      dragDirection === DragDirection.Down;
    const movement = sign * (vertical ? gesture.moveY : gesture.moveX);
    const displacement = sign * (vertical ? gesture.dy : gesture.dx);
    return { movement, displacement };
  };

  const dragResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderStart: onStart,
      onPanResponderMove: (_, { moveX, moveY, dx, dy }) => {
        const signedGesture = signGestureDirection({ moveX, moveY, dx, dy });
        console.log(signedGesture.displacement);
        onMove(signedGesture.displacement, signedGesture.movement);
      },
      onPanResponderEnd: (_, { moveX, moveY, dx, dy }) => {
        const signedGesture = signGestureDirection({ moveX, moveY, dx, dy });
        onEnd(signedGesture.displacement, signedGesture.movement);
      },
    }),
  ).current;

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
      {...dragResponder.panHandlers}
    >
      {children}
    </View>
  );
};
