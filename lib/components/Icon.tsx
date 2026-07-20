import React from "react";
import { Text } from "react-native";
import FrcCoral from "../../assets/frc_coral";
import FrcAlgae from "../../assets/frc_algae";
import FeedAlgae from "../../assets/feed_algae";

type IconProps = {
  name: string;
  color?: string;
  size?: number;
};

export const Icon: React.FC<IconProps> = ({ name, color, size = 24 }) => {
  if (name === "frc_coral") {
    return <FrcCoral color={color} width={size} height={size} />;
  }

  if (name === "frc_algae") {
    return <FrcAlgae color={color} width={size} height={size} />;
  }

  if (name === "feeder") {
    return <FeedAlgae color={color} width={size} height={size} />;
  }

  return (
    <Text
      style={{
        fontFamily:
          {
            24: "MaterialSymbols_500Rounded",
            40: "MaterialSymbols_500Rounded40px",
            48: "MaterialSymbols_500Rounded48px",
          }[size] ?? "MaterialSymbols_500Rounded",
        fontSize: size,
        color,
      }}
    >
      {name}
    </Text>
  );
};
