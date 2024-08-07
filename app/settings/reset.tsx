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
import { useSetTournament } from "../../lib/storage/getTournament";

export default function Reset() {
  const navigation = useNavigation();

  const setTournament = useSetTournament();

  const reset = async () => {
    console.log("resetting");
    await setTournament(null);
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
