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
import { MatchEventType } from "../../lib/collection/MatchEventType";
import { MatchEventPosition } from "../../lib/collection/MatchEventPosition";

const EXAMPLE_SCOUT_REPORT: ScoutReport = {
  uuid: "f23698c6-a084-4659-9644-fc91c9f88d14",
  tournamentKey: "2026caoc",
  matchType: "QUALIFICATION",
  matchNumber: 58,
  startTime: 1711817590420,
  notes: "",
  robotBrokeDescription: null,
  robotRoles: ["CYCLING", "FEEDING", "DEFENDING"],
  mobility: "BUMP",
  disrupts: false,
  accuracy: 4,
  autoClimb: "FAILED",
  intakeType: "GROUND",
  feederTypes: ["STOP_TO_SHOOT"],
  beached: "ON_FUEL",
  defenseEffectiveness: 4,
  scoresWhileMoving: true,
  endgameClimb: "L2",
  driverAbility: 4,
  scouterUuid: "034d8eda-d579-4e83-9ccf-53bebab38724",
  teamNumber: 3476,
  events: [
    [0, MatchEventType.StartMatch, MatchEventPosition.Hub],
    [1.234, MatchEventType.StartScoring, MatchEventPosition.None],
    [2.991, MatchEventType.StopScoring, MatchEventPosition.None, 30],
    [3.601, MatchEventType.Cross, MatchEventPosition.LeftBump],
    [20.744, MatchEventType.StartFeeding, MatchEventPosition.None],
    [25.265, MatchEventType.StopFeeding, MatchEventPosition.None, 22],
    [26.165, MatchEventType.StartScoring, MatchEventPosition.None],
    [26.592, MatchEventType.StopScoring, MatchEventPosition.None, 30],
    [30.086, MatchEventType.StartDefending, MatchEventPosition.None],
    [48.89, MatchEventType.StopDefending, MatchEventPosition.None],
    [59.577, MatchEventType.Climb, MatchEventPosition.None],
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
            maximumValue={800}
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
