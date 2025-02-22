import { Suspense, useCallback } from "react";
import { Game } from "../../lib/collection/ui/Game";
import { ActivityIndicator, Platform } from "react-native";
import * as NavigationBar from "expo-navigation-bar";
import { Stack, useFocusEffect } from "expo-router";

export default function GamePage() {
  useFocusEffect(
    useCallback(() => {
      (async () => {
        if (Platform.OS === "android") {
          await NavigationBar.setVisibilityAsync("hidden");
        }
      })();

      return () => {
        (async () => {
          if (Platform.OS === "android") {
            await NavigationBar.setVisibilityAsync("visible");
          }
        })();
      };
    }, []),
  );

  return (
    <>
      <Stack.Screen
        options={{
          orientation: "landscape",
          animationDuration: 0,
          animationTypeForReplace: "push",
          animation: "flip",
          gestureEnabled: false,
        }}
      />
      <Suspense fallback={<ActivityIndicator />}>
        <Game />
      </Suspense>
    </>
  );
}
