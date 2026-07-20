import { View } from "react-native";
import { Stack, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import Heading1Small from "../lib/components/text/Heading1Small";
import BodyMedium from "../lib/components/text/BodyMedium";
import { IconButton } from "../lib/components/IconButton";
import { colors } from "../lib/colors";

export default function Home() {
  return (
    <>
      <Stack.Screen options={{ animation: "fade" }} />
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ flex: 1, padding: 26 }}>
          <View style={{ alignItems: "flex-end" }}>
            <IconButton
              label="settings"
              icon="settings"
              color={colors.onBackground.default}
              onPress={() => router.push("/settings")}
            />
          </View>
          <View style={{ flex: 1, justifyContent: "center", gap: 8 }}>
            <Heading1Small>2026 scouting</Heading1Small>
            <BodyMedium>
              Collection screens are ready to be rebuilt for practice season.
            </BodyMedium>
          </View>
        </View>
      </SafeAreaView>
    </>
  );
}
