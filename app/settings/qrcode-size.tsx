import { View } from "react-native";
import { NavBar } from "../../lib/components/NavBar";
import { IconButton } from "../../lib/components/IconButton";
import { router } from "expo-router";
import { colors } from "../../lib/colors";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScoutReportCode } from "../../lib/collection/ui/ScoutReportCode";
import { Suspense } from "react";
import { ScoutReport } from "../../lib/collection/ScoutReport";
import { useQrCodeSizeStore } from "../../lib/storage/userStores";
import Slider from "@react-native-community/slider";
import LabelSmall from "../../lib/components/text/LabelSmall";
import React from "react";

const EXAMPLE_SCOUT_REPORT: ScoutReport = {
  uuid: "f23698c6-a084-4659-9644-fc91c9f88d14",
  tournamentKey: "2024caoc",
  matchType: 0,
  matchNumber: 58,
  startTime: 1711817590420,
  notes: "",
  robotRole: 0,
  cage: 1,
  pickUp: 2,
  driverAbility: 4,
  scouterUuid: "034d8eda-d579-4e83-9ccf-53bebab38724",
  teamNumber: 3476,
  events: [
    [0, 1, 5],
    [0, 8, 5],
    [2.991, 3, 2],
    [3.601, 0, 0],
    [4.535, 1, 9],
    [5.333, 3, 2],
    [7.501, 1, 14],
    [10.744, 3, 2],
    [12.365, 1, 8],
    [15.265, 3, 2],
    [16.165, 1, 10],
    [16.592, 3, 2],
    [30.086, 1, 0],
    [39.767, 3, 1],
    [48.89, 1, 0],
    [54.458, 3, 1],
    [59.577, 1, 0],
    [60.658, 3, 2],
    [61.238, 6, 0],
    [71.286, 7, 0],
    [77.185, 1, 0],
    [78.794, 3, 1],
    [89.164, 1, 0],
    [95.08, 3, 1],
    [99.253, 1, 0],
    [100.583, 2, 0],
    [102.218, 1, 0],
    [104.12, 3, 2],
    [105.836, 6, 0],
    [115.886, 7, 0],
    [125.171, 1, 0],
    [136.625, 3, 2],
    [147.056, 1, 0],
  ],
};

export default function QRCodeSizeEditor() {
  return (
    <>
      <NavBar
        title="QR Code Size"
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
      <Suspense>
        <Body />
      </Suspense>
    </>
  );
}

const Body = () => {
  const qrCodeSize = useQrCodeSizeStore((state) => state.value);
  const setQRCodeSize = useQrCodeSizeStore((state) => state.setValue);
  console.log({ qrCodeSize });

  return (
    <SafeAreaView
      edges={["bottom", "left", "right"]}
      style={{ flex: 1, gap: 7 }}
    >
      <View style={{ flex: 1, maxWidth: 450 }}>
        <ScoutReportCode scoutReport={EXAMPLE_SCOUT_REPORT} />
        <View
          style={{
            flex: 1,
            justifyContent: "flex-end",
            gap: 7,
            padding: 16,
          }}
        >
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <LabelSmall>Quicker scans</LabelSmall>
            <LabelSmall>Fewer codes</LabelSmall>
          </View>
          <Slider
            minimumValue={100}
            maximumValue={1100}
            step={1}
            value={qrCodeSize}
            onSlidingComplete={(value) => {
              setQRCodeSize(value);
            }}
            minimumTrackTintColor={colors.gray.default}
            maximumTrackTintColor={colors.gray.default}
            thumbTintColor={colors.onBackground.default}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};
