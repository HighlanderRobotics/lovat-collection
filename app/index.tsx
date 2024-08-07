import AsyncStorage from "@react-native-async-storage/async-storage";
import { Redirect, Stack } from "expo-router";
import { useMemo, useState } from "react";
import { Text } from "react-native";

export default function Index() {
  // Based on "onboarding-complete" key in AsyncStorage, redirect to onboarding or home page
  const [onboardingComplete, setOnboardingComplete] = useState<boolean | null>(
    null,
  );

  useMemo(async () => {
    const onboardingComplete = await AsyncStorage.getItem(
      "onboarding-complete",
    );
    setOnboardingComplete(onboardingComplete === "true");
  }, []);

  // if (onboardingComplete === null) {
  //     return <>
  //         <Stack.Screen
  //             options={{
  //                 animation: "fade",
  //             }}
  //         />
  //         <Text>
  //             Loading...
  //         </Text>;
  //     </>

  //     // return <Text>Loading...</Text>;
  // }

  // return <Redirect href={onboardingComplete ? '/home' : '/onboarding'} />;

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
