import { View } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { colors } from "../colors";
import Heading1Small from "./text/Heading1Small";

export const NavBar = (props: NavBarProps) => {
  const { title, left, right, bottom } = props;

  const insets = useSafeAreaInsets();

  return (
    <View
      style={{
        flexDirection: "row",
        backgroundColor: colors.secondaryContainer.default,
      }}
    >
      <SafeAreaView
        edges={["top", "left", "right"]}
        style={{
          flex: 1,
          flexDirection: "row",
        }}
      >
        <View
          style={{
            flex: 1,
            paddingTop: 16 - insets.top / 4,
            paddingBottom: 16,
            paddingHorizontal: 14,
            position: "relative",
            borderBottomColor: colors.gray.default,
            borderBottomWidth: 2,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <View style={{ flex: 1 }}>{left}</View>
            <View
              style={{
                flex: 4,
                alignItems: "center",
              }}
            >
              <Heading1Small numberOfLines={1}>{title}</Heading1Small>
            </View>
            <View style={{ flex: 1 }}>{right}</View>
          </View>
          {bottom}
        </View>
      </SafeAreaView>
    </View>
  );
};

type NavBarProps = {
  title: string;
  left?: React.ReactNode;
  right?: React.ReactNode;
  bottom?: React.ReactNode;
};
