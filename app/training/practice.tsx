// import { useGlobalSearchParams } from "expo-router";
import React from "react";
import { NavBar } from "../../lib/components/NavBar";
import { IconButton } from "../../lib/components/IconButton";
import { router } from "expo-router";
import { colors } from "../../lib/colors";
import BodyMedium from "../../lib/components/text/BodyMedium";
import { View } from "react-native";
import Button from "../../lib/components/Button";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Practice() {
  //   const {s: sessionId} = useGlobalSearchParams()
  return (
    <>
      <NavBar
        title="Practice a match"
        left={
          <IconButton
            icon="arrow_back_ios"
            color={colors.onBackground.default}
            onPress={() => router.back()}
            label="Back"
          />
        }
      />
      <SafeAreaView
        style={{
          marginTop: -26,
          marginHorizontal: 26,
          flexDirection: "column",
          flexGrow: 1,
          gap: 10,
        }}
      >
        <View
          style={{
            borderRadius: 7,
            backgroundColor: colors.secondaryContainer.default,
            height: 250,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <BodyMedium>Fancy illustration goes here</BodyMedium>
        </View>
        <BodyMedium color={colors.onBackground.default}>
          Improve your accuracy by practicing scouting a match. Mark actions the
          robot takes on this device while you watch the match and get feedback
          in real time from the device you just scanned.
        </BodyMedium>
        <View
          style={{
            justifyContent: "flex-end",
            flexGrow: 1,
          }}
        >
          <Button variant="primary">I&apos;m ready</Button>
        </View>
      </SafeAreaView>
    </>
  );
}
