import { Stack, router } from "expo-router";
import { View } from "react-native";
import BodyMedium from "../../lib/components/text/BodyMedium";
import Button from "../../lib/components/Button";
import { SafeAreaView } from "react-native-safe-area-context";
import TitleMedium from "../../lib/components/text/TitleMedium";
import { colors } from "../../lib/colors";

export default function OnboardingWelcome() {
  return (
    <SafeAreaView
      style={{
        flex: 1,
        flexDirection: "row",
        justifyContent: "center",
      }}
    >
      <Stack.Screen
        options={{
          animation: "fade",
          animationDuration: 1000,
        }}
      />
      <View
        style={{
          flex: 1,
          paddingVertical: 16,
          paddingHorizontal: 26,
          maxWidth: 550,
        }}
      >
        <TitleMedium>Welcome to Lovat&nbsp;Collection</TitleMedium>
        <BodyMedium>Let&apos;s get you ready to scout.</BodyMedium>
        <View style={{ paddingTop: 50, alignItems: "flex-end" }}>
          <Button
            color={colors.victoryPurple.default}
            textColor={colors.background.default}
            onPress={() => {
              router.push("/onboarding/team-code");
            }}
          >
            Begin
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
}
