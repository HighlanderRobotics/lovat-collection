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
import { useLoadServices} from "../lib/services";

import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en.json";
import { atom, useSetAtom } from "jotai";
import { useScouterScheduleStore } from "../lib/storage/scouterScheduleStore";
import { useTournamentStore } from "../lib/storage/activeTournamentStore";
import { create } from "zustand";

const { UIManager } = NativeModules;

if (UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

TimeAgo.addDefaultLocale(en);

SplashScreen.preventAutoHideAsync();

export const useStartMatchEnabledStore = create<{
  value: boolean;
  setValue: (value: boolean) => void;
}>((set, get) => ({
  value: false,
  setValue: (value) => set(() => ({ value: value })),
}));

export default function Layout() {
  const loadServices = useLoadServices;

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
