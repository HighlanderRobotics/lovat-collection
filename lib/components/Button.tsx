import React, { useEffect } from "react";
import {
  Text,
  ActivityIndicator,
  View,
  TouchableHighlight,
  ColorValue,
} from "react-native";
import { colors } from "../colors";
import BodyMedium from "./text/BodyMedium";

type ButtonProps = {
  color: ColorValue;
  textColor: ColorValue;
  filled?: boolean;
  disabled?: boolean;
  density?: "comfortable" | "compact";
  children: React.ReactNode;
  loadingChildren?: React.ReactNode;
  onPress?: () => void | Promise<void>;
  flex?: number;
  borderRadius?: number;
};

const Button: React.FC<ButtonProps> = ({
  color = colors.gray.default,
  textColor = colors.onBackground.default,
  filled = true,
  disabled = false,
  density = "comfortable",
  children,
  onPress,
  flex,
  borderRadius,
  loadingChildren,
}) => {
  let padding: number[] = [];
  let radius: number = 0;

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

  if (density === "comfortable") {
    padding = [10, 20];
    radius = 7;
  } else if (density === "compact") {
    padding = [6, 12];
    radius = 5;
  }

  const buttonStyle = {
    backgroundColor: filled ? color : "transparent",
    paddingVertical: padding[0],
    paddingHorizontal: padding[1],
    flex,
    borderRadius: borderRadius ?? radius,
  };

  const textStyle = {
    color: filled ? textColor : color,
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
      <TouchableHighlight
        style={[
          buttonStyle,
          {
            opacity: disabled ? 0.35 : 1,
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
        activeOpacity={0.8}
        {...(!filled
          ? {
              underlayColor: textColor,
            }
          : {})}
      >
        <>
          {loading && <ActivityIndicator color={filled ? textColor : color} />}
          <Text style={textStyle}>
            {loading ? (loadingChildren ?? children) : children}
          </Text>
        </>
      </TouchableHighlight>
    </>
  );
};

export default Button;
