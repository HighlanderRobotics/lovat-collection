import React from "react";
import { DimensionValue, TouchableOpacity, View } from "react-native";
import * as Haptics from "expo-haptics";
import { Icon } from "../../components/Icon";
import { useFieldRelativeDimensions } from "../useFieldRelativeDimensions";
import Svg, { Path } from "react-native-svg";
import svgPathBounds from 'svg-path-bounds';


const PressableContainer = (props: {
  onPress: () => void;
  children?: React.ReactNode;
  color: string;
  fieldRelativePadding?: [
    DimensionValue,
    DimensionValue,
    DimensionValue,
    DimensionValue,
  ];
} & ({ borderRadius?: number } | { svgPath: string })) => {
  const [paddingTop, paddingRight, paddingBottom, paddingLeft] = props.fieldRelativePadding ?? [0, 0, 0, 0];


  if ("svgPath" in props) {
    const [xMin, yMin, xMax, yMax] = svgPathBounds(props.svgPath);

    return (
      <Svg
        height="100%"
        width="100%"
        viewBox={`${xMin} ${yMin} ${xMax - xMin} ${yMax - yMin}`}
      >
        <Path
          d={props.svgPath}
          fill={props.color}
          opacity={0.3}
        />
      </Svg>
    )
  }
}

export const GameAction = ({
  onPress,
  children,
  icon,
  color,
  iconColor,
  backgroundViewReplacement,
  fieldRelativePadding,
  iconSize,
  ...props
}: {
  onPress: () => void;
  children?: React.ReactNode;
  backgroundViewReplacement?: React.ReactNode;
  color: string;
  icon?: string;
  iconColor?: string;
  iconSize?: number;
  fieldRelativePadding?: [
    DimensionValue,
    DimensionValue,
    DimensionValue,
    DimensionValue,
  ];
} & ({ borderRadius?: number } | { svgPath: string })) => {
  const [paddingTop, paddingRight, paddingBottom, paddingLeft] =
    useFieldRelativeDimensions(fieldRelativePadding ?? [0, 0, 0, 0]);

  return (
    <PressableContainer
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onPress();
      }}
      color={color}
      fieldRelativePadding={fieldRelativePadding}
      borderRadius={("borderRadius" in props && props.borderRadius) || 7}
      svgPath={"svgPath" in props && props.svgPath || undefined}

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
