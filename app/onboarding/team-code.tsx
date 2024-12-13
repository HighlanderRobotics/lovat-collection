import { useState } from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import TitleMedium from "../../lib/components/text/TitleMedium";
import Button from "../../lib/components/Button";
import TextField from "../../lib/components/TextField";
import BodyMedium from "../../lib/components/text/BodyMedium";
import { checkTeamCode } from "../../lib/lovatAPI/checkTeamCode";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { colors } from "../../lib/colors";
import { z } from "zod";

export default function TeamCode() {
  const [code, setCode] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async () => {
    if (loading) return;

    setLoading(true);
    setError(null);

    try {
      const team = await checkTeamCode(code);

      await AsyncStorage.setItem("team-code", code);
      await AsyncStorage.setItem("team-number", team.number.toString());
      router.push("onboarding/name");
    } catch (e) {
      let message;
      try {
        message = z.object({ message: z.string() }).parse(e).message;
      } catch {
        message = "An unknown error occurred";
      }

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView
      style={{ flex: 1, flexDirection: "row", justifyContent: "center" }}
    >
      <View
        style={{
          flex: 1,
          paddingVertical: 16,
          paddingHorizontal: 26,
          gap: 7,
          maxWidth: 550,
        }}
      >
        <TitleMedium>Enter your team&apos;s code</TitleMedium>
        <TextField
          placeholder="Code"
          autoFocus
          autoCorrect={false}
          autoCapitalize="characters"
          returnKeyType="done"
          onChangeText={(text) => {
            setCode(text);
            setError(null);
          }}
          editable={true}
          error={!!error}
        />
        {!!error && (
          <BodyMedium color={colors.danger.default}>{error}</BodyMedium>
        )}
        <BodyMedium>
          No code? Download Lovat Dashboard to register your team.
        </BodyMedium>

        <View style={{ paddingTop: 50, alignItems: "flex-end" }}>
          <Button variant="primary" disabled={loading} onPress={onSubmit}>
            Next
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
}
