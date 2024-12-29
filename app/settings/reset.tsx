import { View } from "react-native";
import { NavBar } from "../../lib/components/NavBar";
import { IconButton } from "../../lib/components/IconButton";
import { router, useNavigation } from "expo-router";
import { colors } from "../../lib/colors";
import { SafeAreaView } from "react-native-safe-area-context";
import TitleMedium from "../../lib/components/text/TitleMedium";
import BodyMedium from "../../lib/components/text/BodyMedium";
import Button from "../../lib/components/Button";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CommonActions } from "@react-navigation/native";
import React from "react";
import {
  useFieldOrientationStore,
  useOnboardingCompleteStore,
  useQrCodeSizeStore,
  useScouterStore,
  useTeamStore,
  useTournamentStore,
  useTrainingModeStore,
} from "../../lib/storage/userStores";
import { useHistoryStore } from "../../lib/storage/historyStore";
import { useTeamScoutersStore } from "../../lib/storage/teamScoutersStore";
import { useTournamentsStore } from "../../lib/storage/tournamentsStore";
import { useScouterScheduleStore } from "../../lib/storage/scouterScheduleStore";

export default function Reset() {
  const navigation = useNavigation();

  const reset = async () => {
    console.log("resetting");
    useTeamStore.setState(useTeamStore.getInitialState());
    useOnboardingCompleteStore.setState(
      useOnboardingCompleteStore.getInitialState(),
    );
    useScouterStore.setState(useScouterStore.getInitialState());
    useTournamentStore.setState(useTournamentStore.getInitialState());
    useTrainingModeStore.setState(useTrainingModeStore.getInitialState());
    useQrCodeSizeStore.setState(useQrCodeSizeStore.getInitialState());
    useFieldOrientationStore.setState(
      useFieldOrientationStore.getInitialState(),
    );
    useHistoryStore.setState(useHistoryStore.getInitialState());
    useTeamScoutersStore.setState(useTeamScoutersStore.getInitialState());
    useTournamentsStore.setState(useTournamentsStore.getInitialState());
    useScouterScheduleStore.setState(useScouterScheduleStore.getInitialState());
    await AsyncStorage.clear();
    navigation.dispatch(
      CommonActions.reset({
        routes: [{ key: "index", name: "index" }],
      }),
    );
  };

  return (
    <>
      <NavBar
        title="Reset all data"
        left={
          <IconButton
            icon="arrow_back_ios"
            label="Back"
            onPress={() => {
              router.back();
            }}
            color={colors.onBackground.default}
          />
        }
      />
      <SafeAreaView
        edges={["bottom", "left", "right"]}
        style={{ flex: 1, gap: 7, alignItems: "center" }}
      >
        <View
          style={{
            flex: 1,
            marginVertical: 16,
            marginHorizontal: 26,
            maxWidth: 450,
          }}
        >
          <TitleMedium>Are you sure?</TitleMedium>
          <BodyMedium>
            You&apos;re about to permanently delete all Lovat Collection data
            stored on this device. This includes all settings, cached data, and
            match history.
          </BodyMedium>

          <View
            style={{
              flex: 1,
              justifyContent: "flex-end",
              gap: 10,
            }}
          >
            <Button
              variant="danger"
              onPress={() => {
                reset();
              }}
            >
              Reset
            </Button>
            <Button
              variant="secondary"
              onPress={() => {
                router.back();
              }}
            >
              Cancel
            </Button>
          </View>
        </View>
      </SafeAreaView>
    </>
  );
}
