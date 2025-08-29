import { View } from "react-native";
import { NavBar } from "../../lib/components/NavBar";
import { IconButton } from "../../lib/components/IconButton";
import { Link, router } from "expo-router";
import { colors } from "../../lib/colors";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScoutReportCode } from "../../lib/collection/ui/ScoutReportCode";
import { Suspense, useState } from "react";
import { ScoutReport } from "../../lib/collection/ScoutReport";
import { useQrCodeSizeStore } from "../../lib/storage/userStores";
import Slider from "@react-native-community/slider";
import LabelSmall from "../../lib/components/text/LabelSmall";
import React from "react";
import { MatchEventType } from "../../lib/collection/MatchEventType";
import { MatchEventPosition } from "../../lib/collection/MatchEventPosition";
import {
  AlgaePickUp,
  algaePickUpDescriptions,
} from "../../lib/collection/PickUp";
import Button from "../../lib/components/Button";
import { Label } from "zeego/dropdown-menu";
import {secret1} from "../../lib/lovatAPI/checkTeamCode";
const EXAMPLE_SCOUT_REPORT: ScoutReport = {
  uuid: "f23698c6-a084-4659-9644-fc91c9f88d14",
  tournamentKey: "2024caoc",
  matchType: 0,
  matchNumber: 58,
  startTime: 1711817590420,
  notes: "",
  robotRole: 0,
  barge: 1,
  coralPickUp: 2,
  algaePickUp: algaePickUpDescriptions[AlgaePickUp.Reef].num,
  knocksAlgae: 0,
  traversesUnderCage: 1,
  driverAbility: 4,
  scouterUuid: "034d8eda-d579-4e83-9ccf-53bebab38724",
  teamNumber: 3476,
  events: [
    [0, MatchEventType.StartPosition, MatchEventPosition.StartBlueNet],
    [0, MatchEventType.PickupCoral, MatchEventPosition.StartBlueNet],
    [2.991, MatchEventType.AutoLeave, MatchEventPosition.None],
    [3.601, MatchEventType.ScoreCoral, MatchEventPosition.LevelOneA],
    [4.735, MatchEventType.PickupCoral, MatchEventPosition.GroundPieceRedBarge],
    [4.535, MatchEventType.PickupAlgae, MatchEventPosition.LevelOneA],
    [5.333, MatchEventType.ScoreNet, MatchEventPosition.None],
    [7.501, MatchEventType.PickupAlgae, MatchEventPosition.LevelOneA],
    [10.744, MatchEventType.FailNet, MatchEventPosition.None],
    [11.534, MatchEventType.ScoreCoral, MatchEventPosition.LevelFourA],
    [12.365, MatchEventType.PickupAlgae, MatchEventPosition.LevelOneA],
    [15.265, MatchEventType.ScoreProcessor, MatchEventPosition.None],
    [16.165, MatchEventType.Defend, MatchEventPosition.None],
    [16.592, MatchEventType.PickupAlgae, MatchEventPosition.GroundPieceCenter],
    [30.086, MatchEventType.FeedAlgae, MatchEventPosition.None],
    [39.767, MatchEventType.PickupCoral, MatchEventPosition.None],
    [48.89, MatchEventType.PickupAlgae, MatchEventPosition.None],
    [54.458, MatchEventType.DropCoral, MatchEventPosition.None],
    [59.577, MatchEventType.DropAlgae, MatchEventPosition.None],
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
      {(qrCodeSize === 117 || qrCodeSize === 797) &&
        <View
          style={{
            padding: 16,
            borderRadius: 8,
            position: 'absolute',
            bottom: 0,
          }}
        ><Link href={secret1}>
          _
          </Link>
        </View>}
    </SafeAreaView>
  );
};
