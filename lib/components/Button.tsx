import React, { useEffect, useRef } from "react";
import {
  TouchableOpacity,
  Text,
  Animated,
  ActivityIndicator,
  View,
} from "react-native";
import { colors, ColorSet } from "../colors";
import BodyMedium from "./text/BodyMedium";

type ButtonProps = {
  variant?: "primary" | "secondary" | "danger";
  filled?: boolean;
  disabled?: boolean;
  backgroundColorSet?: ColorSet;
  density?: "comfortable" | "compact";
  children: React.ReactNode;
  loadingChildren?: React.ReactNode;
  onPress?: () => void | Promise<void>;
  flex?: number;
  borderRadius?: number;
};

const AnimatedTouchableOpacity =
  Animated.createAnimatedComponent(TouchableOpacity);
const AnimatedText = Animated.createAnimatedComponent(Text);

const Button: React.FC<ButtonProps> = ({
  variant = "secondary",
  filled = true,
  disabled = false,
  density = "comfortable",
  children,
  onPress,
  flex,
  borderRadius,
  backgroundColorSet,
  loadingChildren,
}) => {
  let textColor: string = "";
  let padding: number[] = [];
  let radius: number = 0;

  const [pressed, setPressed] = React.useState(false);

  const [promise, setPromise] = React.useState<Promise<void> | null>(null);

  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  useEffect(() => {
    if (promise) {
      setLoading(true);

      promise
        .catch((e) => {
          setError(e.message);
        })
        .finally(() => {
          setLoading(false);

          setPromise(null);
        });
    }
  }, [promise]);

  const effectivelyDisabled = disabled || loading;

  textColor =
    variant === "primary"
      ? colors.background.default
      : colors.onBackground.default;

  const backgroundColors =
    backgroundColorSet ??
    {
      primary: colors.victoryPurple,
      secondary: filled
        ? colors.gray
        : {
            ...colors.onBackground,
            faded: colors.gray.default,
            hover: colors.gray.hover,
          },
      danger: colors.danger,
    }[variant];

  const disabledTextColor = {
    primary: colors.background.default,
    secondary: "#5f5f5f",
    danger: "#746767",
  }[variant];

  if (density === "comfortable") {
    padding = [10, 20];
    radius = 7;
  } else if (density === "compact") {
    padding = [6, 12];
    radius = 5;
  }

  const colorAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(colorAnimation, {
      toValue: pressed ? 1 : 0,
      duration: 100,
      useNativeDriver: false,
    }).start();
  }, [pressed]);

  useEffect(() => {
    Animated.timing(colorAnimation, {
      toValue: effectivelyDisabled ? 1 : 0,
      duration: 100,
      useNativeDriver: false,
    }).start();
  }, [effectivelyDisabled]);

  const backgroundColorInterpolation = colorAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [
      backgroundColors.default,
      effectivelyDisabled ? backgroundColors.faded : backgroundColors.hover,
    ],
  });

  const textColorInterpolation = colorAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [
      textColor,
      effectivelyDisabled ? disabledTextColor : textColor,
    ],
  });

  const buttonStyle = {
    backgroundColor: filled ? backgroundColorInterpolation : "transparent",
    paddingVertical: padding[0],
    paddingHorizontal: padding[1],
    flex,
    borderRadius: borderRadius ?? radius,
  };

  const textStyle = {
    color: filled ? textColorInterpolation : backgroundColorInterpolation,
    fontFamily: "Heebo_500Medium",
    fontSize: density === "comfortable" ? 16 : 14,
    fontWeight: "500",
    lineHeight: density === "comfortable" ? 24 : 21,
  } as const;

  return (
    <>
      {error && (
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "row",
            marginBottom: 8,
          }}
        >
          <BodyMedium color={colors.danger.default}>{error}</BodyMedium>
        </View>
      )}
      <AnimatedTouchableOpacity
        style={[
          buttonStyle,
          {
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            gap: 8,
          },
        ]}
        disabled={effectivelyDisabled}
        onPress={() => {
          if (onPress) {
            setError(null);

            const result = onPress();
            if (result instanceof Promise) {
              setPromise(result);
            }
          }
        }}
        activeOpacity={1}
        onPressIn={() => setPressed(true)}
        onPressOut={() => setPressed(false)}
      >
        {loading && (
          <ActivityIndicator
            color={filled ? textColor : backgroundColors.default}
          />
        )}
        <AnimatedText style={textStyle}>
          {loading ? (loadingChildren ?? children) : children}
        </AnimatedText>
      </AnimatedTouchableOpacity>
    </>
  );
};

export default Button;
