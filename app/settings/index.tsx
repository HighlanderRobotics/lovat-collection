import { Link, router } from "expo-router";
import {
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import BodyMedium from "../../lib/components/text/BodyMedium";
import Button from "../../lib/components/Button";
import { SafeAreaView } from "react-native-safe-area-context";
import { IconButton } from "../../lib/components/IconButton";
import { useAtom, useAtomValue } from "jotai";
import {
  FieldOrientation,
  fieldOrientationAtom,
} from "../../lib/models/FieldOrientation";
import { ButtonGroup } from "../../lib/components/ButtonGroup";
import { colors } from "../../lib/colors";
import {
  FieldImage,
  fieldHeight,
  fieldWidth,
} from "../../lib/components/FieldImage";
import Heading1Small from "../../lib/components/text/Heading1Small";
import { Suspense } from "react";
import { NavBar } from "../../lib/components/NavBar";
import { tournamentAtom } from "../../lib/storage/getTournament";
import { atomWithStorage } from "jotai/utils";
import { createStorage } from "../../lib/storage/jotaiStorage";
import { Switch } from "react-native-gesture-handler";
import LabelSmall from "../../lib/components/text/LabelSmall";
import { qrCodeSizeAtom } from "./qrcode-size";
import { Icon } from "../../lib/components/Icon";
import { z } from "zod";

export const trainingModeAtom = atomWithStorage<boolean>(
  "trainingMode",
  false,
  createStorage(z.boolean()),
);

export default function Settings() {
  return (
    <>
      <NavBar
        title="Settings"
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
        <ScrollView
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
            <View
              style={{
                flex: 1,
                maxWidth: 450,
                gap: 14,
              }}
            >
              <FieldOrientationEditor />
              <TournamentSelector />
              <TrainingModeSelector />
              <QRCodeSizeLink />
              <View
                style={{
                  marginTop: 50,
                  marginBottom: 50,
                }}
              >
                <Button
                  variant="secondary"
                  onPress={() => {
                    router.push("/settings/reset");
                  }}
                >
                  Reset all settings and data
                </Button>
              </View>
            </View>
          </SafeAreaView>
        </ScrollView>
      </Suspense>
    </>
  );
}

const TrainingModeSelector = () => {
  const [trainingModeEnabled, setTrainingModeEnabled] =
    useAtom(trainingModeAtom);

  // <View
  //             style={{
  //                 marginTop: 7,
  //                 padding: 7,
  //                 borderRadius: 10,
  //                 backgroundColor: colors.secondaryContainer.default,
  //                 gap: 7,
  //             }}
  //         ></View>

  return (
    <View style={{ gap: 7 }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginTop: 7,
          padding: 14,
          borderRadius: 10,
          backgroundColor: colors.secondaryContainer.default,
          gap: 7,
        }}
      >
        <LabelSmall>Training mode</LabelSmall>
        <Switch
          trackColor={{
            true: colors.victoryPurple.default,
            false: colors.gray.default,
          }}
          thumbColor={colors.background.default}
          value={trainingModeEnabled}
          onChange={() => setTrainingModeEnabled(!trainingModeEnabled)}
        />
      </View>
      <BodyMedium>
        Disables data saving and uploading for training, testing, etc.
      </BodyMedium>
    </View>
  );
};

const QRCodeSizeLink = () => {
  const qrCodeSize = useAtomValue(qrCodeSizeAtom);

  return (
    <Link href="/settings/qrcode-size" asChild>
      <TouchableOpacity
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginTop: 7,
          padding: 14,
          borderRadius: 10,
          backgroundColor: colors.secondaryContainer.default,
          gap: 7,
        }}
      >
        <LabelSmall>QR Code size</LabelSmall>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
          <BodyMedium>
            {qrCodeSize === 600
              ? "Default"
              : qrCodeSize < 600
                ? "Quicker scans"
                : "Fewer codes"}
          </BodyMedium>
          <Icon
            name="arrow_forward_ios"
            size={18}
            color={colors.body.default}
          />
        </View>
      </TouchableOpacity>
    </Link>
  );
};

const FieldOrientationEditor = () => {
  const [fieldOrientation, setFieldOrientation] = useAtom(fieldOrientationAtom);

  return (
    <View>
      <Heading1Small>Field orientation</Heading1Small>
      <View
        style={{
          marginTop: 7,
          padding: 7,
          borderRadius: 10,
          backgroundColor: colors.secondaryContainer.default,
          gap: 7,
        }}
      >
        <View
          style={{
            aspectRatio: fieldWidth / fieldHeight,
          }}
        >
          <FieldImage />
        </View>
        <ButtonGroup
          buttons={[
            {
              label: "Auspicious",
              value: FieldOrientation.Auspicious,
            },
            {
              label: "Sinister",
              value: FieldOrientation.Sinister,
            },
          ]}
          selected={fieldOrientation}
          onChange={(value) => {
            setFieldOrientation(value);
          }}
        />
      </View>
    </View>
  );
};

const TournamentSelector = () => {
  const tournament = useAtomValue(tournamentAtom);

  return (
    <View>
      <Heading1Small>Tournament</Heading1Small>
      <View
        style={{
          marginTop: 7,
          padding: 7,
          borderRadius: 10,
          backgroundColor: colors.secondaryContainer.default,
          gap: 7,
        }}
      >
        <View
          style={{
            flexDirection: "column",
            justifyContent: "space-between",
            alignItems: "stretch",
            gap: 7,
          }}
        >
          <View
            style={{
              padding: 7,
            }}
          >
            <BodyMedium>
              {tournament
                ? `${tournament.date.split("-")[0]} ${tournament.name}`
                : "No tournament selected"}
            </BodyMedium>
          </View>
          <Button
            onPress={() => {
              router.push("/settings/tournament");
            }}
          >
            {tournament ? "Change" : "Select a tournament"}
          </Button>
        </View>
      </View>
    </View>
  );
};
