import React from "react";
import { DimensionValue, TouchableOpacity, View } from "react-native";
import * as Haptics from "expo-haptics";
import { Icon } from "../../components/Icon";
import { useFieldRelativeDimensions } from "../useFieldRelativeDimensions";

export const GameAction = ({
  onPress,
  children,
  icon,
  color,
  iconColor,
  borderRadius,
  backgroundViewReplacement,
  fieldRelativePadding,
  iconSize,
}: {
  onPress: () => void;
  children?: React.ReactNode;
  backgroundViewReplacement?: React.ReactNode;
  color: string;
  icon?: string;
  iconColor?: string;
  iconSize?: number;
  borderRadius?: number;
  fieldRelativePadding?: [
    DimensionValue,
    DimensionValue,
    DimensionValue,
    DimensionValue,
  ];
}) => {
  const [paddingTop, paddingRight, paddingBottom, paddingLeft] =
    useFieldRelativeDimensions(fieldRelativePadding ?? [0, 0, 0, 0]);

  return (
    <TouchableOpacity
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onPress();
      }}
      style={{
        height: "100%",
        width: "100%",
        borderRadius: borderRadius ?? 7,
        position: "relative",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        paddingTop: paddingTop,
        paddingRight: paddingRight,
        paddingBottom: paddingBottom,
        paddingLeft: paddingLeft,
      }}
    >
      {backgroundViewReplacement ?? (
        <View
          style={{
            height: "100%",
            width: "100%",
            backgroundColor: color,
            opacity: 0.3,
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          }}
        />
      )}
      {icon && <Icon name={icon} color={iconColor ?? color} size={iconSize} />}
      {children}
    </TouchableOpacity>
  );
};
