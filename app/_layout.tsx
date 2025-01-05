import { SplashScreen, Stack } from "expo-router";
import { NativeModules, View } from "react-native";
import { colors } from "../lib/colors";

import {
  useFonts,
  Heebo_400Regular,
  Heebo_500Medium,
  Heebo_600SemiBold,
  Heebo_700Bold,
} from "@expo-google-fonts/heebo";

import { useCallback, useEffect } from "react";
import { getServiceLoader } from "../lib/services";

import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en.json";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  useFieldOrientationStore,
  useOnboardingCompleteStore,
  useQrCodeSizeStore,
  useScouterStore,
  useStartMatchEnabledStore,
  useTeamStore,
  useTournamentStore,
  useTrainingModeStore,
} from "../lib/storage/userStores";
import { HistoryEntry, useHistoryStore } from "../lib/storage/historyStore";

const { UIManager } = NativeModules;

if (UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

TimeAgo.addDefaultLocale(en);

SplashScreen.preventAutoHideAsync();

// This record does not actually have a type of any, it is using any because when it uses any other type, typescript complains because it treats the functions to have an argument of never
/* eslint-disable-next-line */
const storageMigratorsByLegacyKey: Record<string, (value: any) => void> = {
  "onboarding-complete": useOnboardingCompleteStore.getState().setValue,
  "team-number": useTeamStore.getState().setNumber,
  "team-code": useTeamStore.getState().setCode,
  scouter: useScouterStore.getState().setValue,
  tournament: useTournamentStore.getState().setValue,
  trainingMode: useTrainingModeStore.getState().setValue,
  qrCodeSize: useQrCodeSizeStore.getState().setValue,
  fieldOrientation: useFieldOrientationStore.getState().setValue,
  history: (data: HistoryEntry[]) =>
    data.forEach((item) => {
      useHistoryStore
        .getState()
        .upsertMatch(item.scoutReport, item.uploaded, item.meta);
    }),
} as const;

export default function Layout() {
  Object.keys(storageMigratorsByLegacyKey).forEach(async (key) => {
    const result = await AsyncStorage.getItem(key);
    console.log({ key }, { result });
    if (result !== null) {
      let data;
      if (key === "team-code" || key === "tournament") {
        data = result;
      } else {
        data = JSON.parse(result);
      }
      const migrationFunction = storageMigratorsByLegacyKey[key];
      migrationFunction(data);
      AsyncStorage.removeItem(key);
    }
  });
  const loadServices = getServiceLoader();

  const setStartMatchEnabled = useStartMatchEnabledStore(
    (state) => state.setValue,
  );

  useEffect(() => {
    const timeout = setTimeout(() => {
      setStartMatchEnabled(true);
    }, 2000);

    return () => {
      clearTimeout(timeout);
    };
  });

  const [fontsLoaded, fontError] = useFonts({
    Heebo_400Regular,
    Heebo_500Medium,
    Heebo_600SemiBold,
    Heebo_700Bold,
    MaterialSymbols_500Rounded: require("../assets/fonts/Material-Symbols-Rounded.ttf"),
    MaterialSymbols_500Rounded40px: require("../assets/fonts/Material-Symbols-Rounded-40px.ttf"),
    MaterialSymbols_500Rounded48px: require("../assets/fonts/Material-Symbols-Rounded-48px.ttf"),
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded || fontError) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  useEffect(() => {
    loadServices();

    const interval = setInterval(loadServices, 2 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <View
      style={{ backgroundColor: colors.background.default, flex: 1 }}
      onLayout={onLayoutRootView}
    >
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: {
            backgroundColor: colors.background.default,
          },
        }}
      />
    </View>
  );
}
