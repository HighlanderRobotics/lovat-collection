import { Redirect, Stack } from "expo-router";
import React from "react";
import { Text } from "react-native";
import { useOnboardingCompleteStore } from "../lib/storage/userStores";

export default function Index() {
  const onboardingComplete = useOnboardingCompleteStore((state) => state.value)
  // Based on "onboardingCompleteStore" key in AsyncStorage accesed by zustand, redirect to onboarding or home page

  return (
    <>
      <Stack.Screen
        options={{
          animation: "none",
        }}
      />
      {onboardingComplete === null ? (
        <Text>Loading...</Text>
      ) : (
        <Redirect href={onboardingComplete ? "/home" : "/onboarding"} />
      )}
    </>
  );
}
