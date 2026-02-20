import { SplashScreen, Stack } from "expo-router";
import { NativeModules } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { colors } from "../lib/colors";
import { KeyboardProvider } from "react-native-keyboard-controller";

import { useEffect } from "react";
import { useFonts } from "expo-font";
import { getServiceLoader, useTournamentsStore } from "../lib/services";

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
import { HistoryEntry } from "../lib/storage/historyStore";

const { UIManager } = NativeModules;

if (UIManager?.setLayoutAnimationEnabledExperimental) {
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
  tournament: (value: string) => {
    (async () => {
      const setTournament = useTournamentStore.getState().setValue;
      await useTournamentsStore.getState().fetchData();
      const tournaments = useTournamentsStore.getState().data;
      if (!tournaments) {
        return;
      }
      const tournament = tournaments.find((item) => item.key === value);
      if (tournament) {
        setTournament(tournament);
      }
    })();
  },
  trainingMode: useTrainingModeStore.getState().setValue,
  qrCodeSize: useQrCodeSizeStore.getState().setValue,
  fieldOrientation: useFieldOrientationStore.getState().setValue,
  history: (data: HistoryEntry[]) => data,
} as const;

export default function Layout() {
  Object.keys(storageMigratorsByLegacyKey).forEach(async (key) => {
    const result = await AsyncStorage.getItem(key);

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
    Heebo_400Regular: require("../assets/fonts/Heebo-Regular.ttf"),
    Heebo_500Medium: require("../assets/fonts/Heebo-Medium.ttf"),
    Heebo_600SemiBold: require("../assets/fonts/Heebo-SemiBold.ttf"),
    Heebo_700Bold: require("../assets/fonts/Heebo-Bold.ttf"),
    MaterialSymbols_500Rounded: require("../assets/fonts/Material-Symbols-Rounded.ttf"),
    MaterialSymbols_500Rounded40px: require("../assets/fonts/Material-Symbols-Rounded-40px.ttf"),
    MaterialSymbols_500Rounded48px: require("../assets/fonts/Material-Symbols-Rounded-48px.ttf"),
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  useEffect(() => {
    const timer = setTimeout(() => {
      SplashScreen.hideAsync();
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    loadServices();

    const interval = setInterval(loadServices, 2 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <KeyboardProvider>
      <GestureHandlerRootView
        style={{ backgroundColor: colors.background.default, flex: 1 }}
      >
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: {
              backgroundColor: colors.background.default,
            },
          }}
        />
      </GestureHandlerRootView>
    </KeyboardProvider>
  );
}
