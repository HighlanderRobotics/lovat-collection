import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import * as DropdownMenu from "zeego/dropdown-menu";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { colors } from "../../colors";
import {
  FieldImage,
  fieldHeight,
  fieldWidth,
} from "../../components/FieldImage";
import { IconButton } from "../../components/IconButton";
import LabelSmall from "../../components/text/LabelSmall";
import {
  AllianceColor,
  getAllianceColorDescription,
} from "../../models/AllianceColor";
import { useReportStateStore } from "../reportStateStore";
import { GameTimer } from "./GameTimer";

export const GameViewTemplate = (props: {
  gamePhaseMessage: string;
  startEnabled?: boolean;
  onEnd: () => void;
  onRestart: () => void;
}) => {
  const reportState = useReportStateStore();
  if (!reportState.meta) return null;

  return (
    <>
      <StatusBar hidden backgroundColor={colors.background.default} />
      <View
        style={{
          backgroundColor: colors.secondaryContainer.default,
          paddingVertical: 7,
          paddingHorizontal: 14,
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <SafeAreaView
          edges={["top", "left", "right"]}
          style={{ flexDirection: "row", alignItems: "center" }}
        >
          <View style={{ flex: 1 }} />
          <View
            style={{ alignItems: "flex-end", gap: 2, flex: 1, marginRight: 13 }}
          >
            <View
              style={{
                backgroundColor: getAllianceColorDescription(
                  reportState.meta.allianceColor ?? AllianceColor.Red,
                ).backgroundColor,
                borderRadius: 4,
                paddingHorizontal: 6,
                paddingVertical: 2,
              }}
            >
              <Text
                style={{
                  color: getAllianceColorDescription(
                    reportState.meta.allianceColor ?? AllianceColor.Red,
                  ).foregroundColor,
                  fontFamily: "Heebo_500Medium",
                  fontSize: 12,
                }}
              >
                {reportState.meta.teamNumber}
              </Text>
            </View>
            <LabelSmall color={colors.body.default}>
              {props.gamePhaseMessage} •{" "}
              <GameTimer startTime={reportState.startTimestamp} />
            </LabelSmall>
          </View>

          {!reportState.startTimestamp ? (
            <IconButton
              label="Start match"
              icon="play_arrow"
              color={colors.onBackground.default}
              size={30}
              disabled={!props.startEnabled}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                reportState.initializeMatchTimestamp();
              }}
            />
          ) : (
            <DropdownMenu.Root>
              <DropdownMenu.Trigger>
                <IconButton
                  label="End match"
                  icon="stop"
                  color={colors.onBackground.default}
                  size={30}
                />
              </DropdownMenu.Trigger>
              <DropdownMenu.Content
                loop={false}
                side="bottom"
                align="end"
                alignOffset={0}
                avoidCollisions={true}
                collisionPadding={0}
                sideOffset={0}
              >
                <DropdownMenu.Item key="end" onSelect={props.onEnd}>
                  <DropdownMenu.ItemTitle>End match</DropdownMenu.ItemTitle>
                </DropdownMenu.Item>
                <DropdownMenu.Item key="restart" onSelect={props.onRestart}>
                  <DropdownMenu.ItemTitle>Restart match</DropdownMenu.ItemTitle>
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Root>
          )}
        </SafeAreaView>
      </View>
      <SafeAreaView edges={["bottom", "left", "right"]} style={{ flex: 1 }}>
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <View
            style={{
              aspectRatio: fieldWidth / fieldHeight,
              maxWidth: "100%",
              maxHeight: "100%",
              width: "100%",
            }}
          >
            <FieldImage />
          </View>
        </View>
      </SafeAreaView>
    </>
  );
};
