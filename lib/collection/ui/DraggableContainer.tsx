import React, { useRef } from "react";
import { PanResponder, View } from "react-native";
import * as Haptics from "expo-haptics";

export enum DragDirection {
  Up,
  Down,
  Right,
  Left,
}

export const DraggableContainer = ({
  onDrag,
  children,
  edgeInsets,
  dragDirection,
}: {
  onDrag: (displacement: number, movement: number) => void;
  children?: React.ReactNode;
  edgeInsets: [number, number, number, number];
  dragDirection: DragDirection;
}) => {
  console.log(edgeInsets);

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
      onPanResponderMove: (_, { moveX, moveY, dx, dy }) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        const signedGesture = signGestureDirection({ moveX, moveY, dx, dy });
        onDrag(signedGesture.displacement, signedGesture.movement);
      },
    }),
  ).current;
  return (
    <View
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
      }}
      {...dragResponder.panHandlers}
    >
      {children}
    </View>
  );
};
