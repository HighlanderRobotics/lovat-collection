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

import { useCallback, useEffect, useState } from "react";

import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en.json";
import { atom, useSetAtom } from "jotai";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useTournamentKey } from "../lib/storage/getTournament";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";

const { UIManager } = NativeModules;

UIManager.setLayoutAnimationEnabledExperimental &&
  UIManager.setLayoutAnimationEnabledExperimental(true);

TimeAgo.addDefaultLocale(en);

SplashScreen.preventAutoHideAsync();

export const startMatchEnabledAtom = atom(false);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Keep query results for 14 days
      gcTime: 1000 * 60 * 60 * 24 * 14,
      networkMode: "always",
      refetchOnReconnect: true,
    },
  },
});

const persister = createAsyncStoragePersister({
  storage: AsyncStorage,
});

async function migrateStores() {
  if (useTournamentKey.getState().key === null) {
    const tournamentKey = await AsyncStorage.getItem("tournament");

    if (tournamentKey) {
      useTournamentKey.setState({ key: tournamentKey });
    }
  }
}

function useMigrateStores(): [boolean, Error | null] {
  const [isMigrated, setIsMigrated] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    migrateStores()
      .then(() => {
        setIsMigrated(true);
      })
      .catch(setError);
  }, []);

  return [isMigrated, error];
}

export default function Layout() {
  const setStartMatchEnabled = useSetAtom(startMatchEnabledAtom);

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

  const [isMigrated, migrationError] = useMigrateStores();

  const onLayoutRootView = useCallback(async () => {
    if ((fontsLoaded || fontError) && (isMigrated || migrationError)) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{ persister }}
    >
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
    </PersistQueryClientProvider>
  );
}
