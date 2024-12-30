import { Suspense } from "react";
import { ActivityIndicator } from "react-native";
import { View } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { router } from "expo-router";
import { colors } from "../../lib/colors";
import { IconButton } from "../../lib/components/IconButton";
import { NavBar } from "../../lib/components/NavBar";
import { SafeAreaView } from "react-native-safe-area-context";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Icon } from "../../lib/components/Icon";
import BodyMedium from "../../lib/components/text/BodyMedium";
import { useTeamScoutersStore } from "../../lib/storage/teamScoutersStore";
import React from "react";
import {
  ImpersonatedScouter,
  useImpersonatedScouterStore,
  useScouterStore,
} from "../../lib/storage/userStores";

export default function Scouter() {
  return (
    <>
      <NavBar
        title="Scouters"
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
      <Suspense fallback={<ActivityIndicator style={{ flex: 1 }} />}>
        <KeyboardAwareScrollView
          style={{ flex: 1, paddingVertical: 16, paddingHorizontal: 26 }}
        >
          <SafeAreaView
            edges={["bottom", "left", "right"]}
            style={{
              flex: 1,
              gap: 14,
              flexDirection: "row",
              justifyContent: "center",
            }}
          >
            <ScouterSelector />
          </SafeAreaView>
        </KeyboardAwareScrollView>
      </Suspense>
    </>
  );
}

const ScouterSelector = () => {
  const scouters = useTeamScoutersStore((state) => state.scouters);
  const scouter = useScouterStore((state) => state.value);

  if (scouters != null) {
    return (
      <View
        style={{
          flex: 1,
          gap: 14,
          maxWidth: 800,
        }}
      >
        <FlashList
          data={scouters.filter((item) => item.uuid !== scouter?.uuid)}
          renderItem={(item) => <ScouterItem scouter={item.item} />}
        />
      </View>
    );
  }
};

const ScouterItem = ({ scouter }: { scouter: ImpersonatedScouter }) => {
  const impersonated = useImpersonatedScouterStore((state) => state.value);
  const setImpersonated = useImpersonatedScouterStore(
    (state) => state.setValue,
  );

  return (
    <TouchableOpacity
      key={scouter.uuid}
      onPress={() => {
        setImpersonated(
          scouter.uuid !== impersonated?.uuid
            ? {
                name: scouter.name,
                uuid: scouter.uuid,
              }
            : null,
        );
      }}
      style={{
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 10,
        paddingHorizontal: 14,
        borderRadius: 7,
        backgroundColor: colors.secondaryContainer.default,
        minHeight: 50,
      }}
    >
      <View
        style={{
          flex: 1,
        }}
      >
        <BodyMedium>{scouter.name}</BodyMedium>
      </View>
      <Suspense>
        <SelectedIndicator scouter={scouter} />
      </Suspense>
    </TouchableOpacity>
  );
};

const SelectedIndicator = ({ scouter }: { scouter: ImpersonatedScouter }) => {
  const selectedScouter = useImpersonatedScouterStore((state) => state.value);

  if (selectedScouter?.uuid === scouter.uuid) {
    return <Icon name="check" color={colors.onBackground.default} />;
  } else {
    return null;
  }
};
