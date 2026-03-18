import { StyleProp, Text, TextStyle } from "react-native";
import { colors } from "../../colors";

const Heading1Small = ({
  children,
  color,
  numberOfLines,
  style,
}: {
  children: React.ReactNode;
  color?: string;
  numberOfLines?: number;
  style?: StyleProp<TextStyle>;
}) => {
  return (
    <Text
      numberOfLines={numberOfLines}
      style={[
        {
          fontFamily: "Heebo_500Medium",
          fontSize: 20,
          fontWeight: "500",
          lineHeight: 32,
          color: color ?? colors.onBackground.default,
        },
        style,
      ]}
    >
      {children}
    </Text>
  );
};

export default Heading1Small;
