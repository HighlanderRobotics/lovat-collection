import { ActivityIndicator, ScrollView, View } from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Suspense } from "react";
import React from "react";
import BodyMedium from "../../lib/components/text/BodyMedium";
import Button from "../../lib/components/Button";
import Heading1Small from "../../lib/components/text/Heading1Small";
import { IconButton } from "../../lib/components/IconButton";
import { NavBar } from "../../lib/components/NavBar";
import { colors } from "../../lib/colors";
import { useTournamentStore } from "../../lib/storage/userStores";
import { useUrlPrefix } from "../../lib/lovatAPI/lovatAPI";

export default function Settings() {
  return (
    <>
      <NavBar
        title="Settings"
        left={
          <IconButton
            icon="arrow_back_ios"
            label="Back"
            onPress={() => router.back()}
            color={colors.onBackground.default}
          />
        }
      />
      <Suspense fallback={<ActivityIndicator style={{ flex: 1 }} />}>
        <ScrollView style={{ flex: 1, padding: 26 }}>
          <SafeAreaView edges={["bottom", "left", "right"]}>
            <View style={{ gap: 14, maxWidth: 450 }}>
              <TournamentSelector />
              <CustomAPIUrlEditor />
              <View style={{ marginVertical: 50 }}>
                <Button
                  variant="secondary"
                  onPress={() => router.push("/settings/reset")}
                >
                  Reset all settings and data
                </Button>
              </View>
            </View>
          </SafeAreaView>
        </ScrollView>
      </Suspense>
    </>
  );
}

const TournamentSelector = () => {
  const tournament = useTournamentStore((state) => state.value);
  return (
    <View style={{ gap: 7 }}>
      <Heading1Small>Tournament</Heading1Small>
      <View
        style={{
          padding: 14,
          borderRadius: 10,
          backgroundColor: colors.secondaryContainer.default,
          gap: 7,
        }}
      >
        <BodyMedium numberOfLines={1}>
          {tournament
            ? `${tournament.date.split("-")[0]} ${tournament.name}`
            : "No tournament selected"}
        </BodyMedium>
        <Button onPress={() => router.push("/settings/tournament")}>
          {tournament ? "Change" : "Select a tournament"}
        </Button>
      </View>
    </View>
  );
};

const CustomAPIUrlEditor = () => {
  const prefixIsCustom = useUrlPrefix((state) => state.getIsCustom());
  const setUrlPrefix = useUrlPrefix((state) => state.setUrlPrefix);
  if (!prefixIsCustom) return null;
  return (
    <View style={{ gap: 7 }}>
      <Heading1Small>Custom API URL</Heading1Small>
      <View
        style={{
          padding: 14,
          borderRadius: 10,
          backgroundColor: colors.secondaryContainer.default,
          gap: 7,
        }}
      >
        <BodyMedium numberOfLines={1}>
          {useUrlPrefix.getState().getUrlPrefix()}
        </BodyMedium>
        <Button variant="secondary" onPress={() => setUrlPrefix(null)}>
          Reset API URL
        </Button>
      </View>
    </View>
  );
};
