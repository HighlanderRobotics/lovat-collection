import { View, Text } from "react-native";
import TitleMedium from "../../lib/components/text/TitleMedium";
import BodyMedium from "../../lib/components/text/BodyMedium";
import { colors } from "../../lib/colors";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  return (
    <SafeAreaView
      style={{
        marginVertical: 16,
        marginHorizontal: 26,
        flexDirection: "column",
        flexGrow: 1,
        gap: 10,
      }}
    >
      <View
        style={{
          borderRadius: 7,
          backgroundColor: colors.secondaryContainer.default,
          height: 250,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <BodyMedium>Fancy illustration goes here</BodyMedium>
      </View>
      <TitleMedium>You&apos;re almost there</TitleMedium>
      <BodyMedium color={colors.onBackground.default}>
        It looks like you&apos;re new to Lovat Collection this year. Before
        starting a match, you&apos;ll need to learn how to scout.
      </BodyMedium>
      <BodyMedium color={colors.onBackground.default}>
        Visit{" "}
        <Text
          style={{ color: colors.victoryPurple.default, fontWeight: "500" }}
        >
          lovat.app/training
        </Text>{" "}
        on a computer with a bigger screen to finish setting up.
      </BodyMedium>
      <View
        style={{
          justifyContent: "flex-end",
          flexGrow: 1,
        }}
      >
        <BodyMedium>
          ...or you can have a Scouting Lead bypass this and just watch your
          data suffer
        </BodyMedium>
      </View>
    </SafeAreaView>
  );
}
