import { Text } from "react-native";
import { colors } from "../../colors";
import React from "react";

const BodyMedium = ({
  children,
  color,
  style,
  ...props
}: {
  children: React.ReactNode;
  color?: string;
  style?: React.ComponentProps<typeof Text>["style"];
} & React.ComponentProps<typeof Text>) => {
  return (
    <Text
      style={[
        {
          fontFamily: "Heebo_400Regular",
          fontSize: 16,
          color: color ?? colors.body.default,
        },
        style,
      ]}
      {...props}
    >
      {children}
    </Text>
  );
};

export default BodyMedium;
