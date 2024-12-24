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
import { useLoadServices } from "../lib/services";

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
  useTrainingModeStore,
} from "../lib/storage/userStores";
import { HistoryEntry, useHistoryStore } from "../lib/storage/historyStore";

const { UIManager } = NativeModules;

if (UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

TimeAgo.addDefaultLocale(en);

SplashScreen.preventAutoHideAsync();

function storageMigrator() {
  const setOnboardingComplete = useOnboardingCompleteStore.getState().setValue;
  const setTeamNumber = useTeamStore.getState().setNumber;
  const setTeamCode = useTeamStore.getState().setCode;
  const setScouter = useScouterStore.getState().setValue;
  const setTrainingModeEnabled = useTrainingModeStore.getState().setValue;
  const setQrCodeSize = useQrCodeSizeStore.getState().setValue;
  const setFieldOrientation = useFieldOrientationStore.getState().setValue;
  const upsertMatchToHistory = useHistoryStore.getState().upsertMatch;
  /* eslint-disable-next-line */
  const keys: Record<string, (value: any) => void> = {
    "onboarding-complete": setOnboardingComplete,
    "team-number": setTeamNumber,
    "team-code": setTeamCode,
    scouter: setScouter,
    trainingMode: setTrainingModeEnabled,
    qrCodeSize: setQrCodeSize,
    fieldOrientation: setFieldOrientation,
    history: (data: HistoryEntry[]) =>
      data.forEach((item) => {
        upsertMatchToHistory(item.scoutReport, item.uploaded, item.meta);
      }),
  };

  return (key: string) => {
    if (Object.keys(keys).includes(key)) {
      return keys[key];
    }
    return (key: string) => key;
  };
}

export default function Layout() {
  const migrateStorage = storageMigrator();
  AsyncStorage.getAllKeys((e, result) => {
    result?.forEach(async (key) => {
      if (!key.includes("Store")) {
        const data = JSON.parse((await AsyncStorage.getItem(key)) ?? "");
        const migrationFunction = migrateStorage(key);
        migrationFunction(data);
        AsyncStorage.removeItem(key);
      }
    });
  });
  const loadServices = useLoadServices();

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
