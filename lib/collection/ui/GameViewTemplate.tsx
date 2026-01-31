import { Pressable, View, TouchableOpacity } from "react-native";
import { colors } from "../../colors";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  FieldImage,
  fieldHeight,
  fieldWidth,
} from "../../components/FieldImage";
import { Text } from "react-native";
import LabelSmall from "../../components/text/LabelSmall";
import {
  AllianceColor,
  getAllianceColorDescription,
} from "../../models/AllianceColor";
import { IconButton } from "../../components/IconButton";
import * as Haptics from "expo-haptics";
import { GameTimer } from "./GameTimer";
import { StatusBar } from "expo-status-bar";
import * as DropdownMenu from "zeego/dropdown-menu";
import { useReportStateStore } from "../reportStateStore";
import React from "react";
import { Icon } from "../../components/Icon";
import { MatchEventType } from "../MatchEventType";
import { MatchEventPosition } from "../MatchEventPosition";

export const GameViewTemplate = (props: {
  field: React.ReactNode;
  topLeftReplacement?: React.ReactNode;
  gamePhaseMessage: string;
  startEnabled?: boolean;
  overlay: boolean;
  setOverlay: (value: boolean) => void;
  onEnd: () => void;
  onRestart: () => void;
}) => {
  const reportState = useReportStateStore();
  const { gamePhaseMessage, field, startEnabled } = props;
  if (!reportState.meta) return null;

  return (
    <>
      <StatusBar hidden={true} backgroundColor={colors.background.default} />
      <GameViewOverlay overlay={props.overlay} setOverlay={props.setOverlay} />
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
          style={{
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          {/* Left as null incase something should be added here */}
          {props.topLeftReplacement ?? (
            <View
              style={{
                flex: 1,
                flexDirection: "row",
              }}
            >
              <IconButton
                icon="undo"
                label="Undo"
                color={colors.onBackground.default}
                disabled={reportState.events.length === 0}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  reportState.undoEvent();
                }}
              />
            </View>
          )}

          <View
            style={{ alignItems: "flex-end", gap: 2, flex: 1, marginRight: 13 }}
          >
            <View
              style={{
                backgroundColor: getAllianceColorDescription(
                  reportState?.meta.allianceColor ?? AllianceColor.Red,
                ).backgroundColor,
                borderRadius: 4,
                paddingHorizontal: 6,
                paddingVertical: 2,
              }}
            >
              <Text
                style={{
                  color: getAllianceColorDescription(
                    reportState?.meta.allianceColor ?? AllianceColor.Red,
                  ).foregroundColor,
                  fontFamily: "Heebo_500Medium",
                  fontSize: 12,
                }}
              >
                {reportState?.meta.teamNumber}
              </Text>
            </View>
            <LabelSmall color={colors.body.default}>
              {gamePhaseMessage} •{" "}
              <GameTimer startTime={reportState?.startTimestamp} />
            </LabelSmall>
          </View>

          {!reportState?.startTimestamp && (
            <IconButton
              label="Start match"
              icon="play_arrow"
              color={colors.onBackground.default}
              size={30}
              disabled={!startEnabled}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

                reportState.initializeMatchTimestamp();
              }}
            />
          )}

          {reportState?.startTimestamp && (
            <DropdownMenu.Root>
              <DropdownMenu.Trigger>
                <IconButton
                  label="End match"
                  icon="stop"
                  color={colors.onBackground.default}
                  size={30}
                />
              </DropdownMenu.Trigger>

              <DropdownMenu.Content>
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
          style={{
            height: "100%",
            width: "100%",
            flexDirection: "row",
            alignItems: "stretch",
            justifyContent: "center",
          }}
        >
          <View
            style={{
              position: "relative",
              aspectRatio: fieldWidth / fieldHeight,
              maxWidth: "100%",
              maxHeight: "100%",
            }}
          >
            <FieldImage />
            {field}
          </View>
        </View>
      </SafeAreaView>
    </>
  );
};

function GameViewOverlay({
  overlay,
  setOverlay,
}: {
  overlay: boolean;
  setOverlay: (value: boolean) => void;
}) {
  return (
    <Pressable
      pointerEvents={overlay ? "auto" : "none"}
      disabled={overlay}
      style={{
        backgroundColor: "#45454540",
        opacity: overlay ? 1 : 0,
        position: "absolute",
        zIndex: 50,
        width: "100%",
        height: "100%",
      }}
      onPress={() => {
        setOverlay(false);
      }}
    >
      <View
        style={{
          marginHorizontal: 40,
          marginVertical: 20,
          borderRadius: 14,
          padding: 10,
          backgroundColor: colors.background.default,
          flexGrow: 1,
          shadowColor: "#00000040",
          elevation: 4,
          shadowOpacity: 1,
          shadowOffset: {
            width: 0,
            height: 4,
          },
          shadowRadius: 4,
          flexDirection: "row",
        }}
      >
        <TouchableOpacity
          accessibilityLabel="Close Overlay"
          style={{
            position: "absolute",
            right: 16,
            top: 16,
            width: 40,
            height: 40,
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 50,
            backgroundColor: colors.secondaryContainer.default,
            zIndex: 1,
          }}
          onPress={() => {
            setOverlay(false);
          }}
          activeOpacity={0.1}
        >
          <Icon name="close" color={colors.onBackground.default} size={32} />
        </TouchableOpacity>
        <OutpostOverlay setOverlay={setOverlay} />
      </View>
    </Pressable>
  );
}

function OutpostOverlay({
  setOverlay,
}: {
  setOverlay: (value: boolean) => void;
}) {
  const reportState = useReportStateStore();

  return (
    <View
      style={{
        flexDirection: "row",
        gap: 10,
        width: "100%",
      }}
    >
      <TouchableOpacity
        style={{
          backgroundColor: "#3EE6794d",
          borderRadius: 7,
          flexGrow: 1,
          alignItems: "center",
          justifyContent: "center",
        }}
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          reportState.addEvent({
            type: MatchEventType.Outtake,
            position: MatchEventPosition.Outpost,
          });
          setOverlay(false);
        }}
      >
        <Icon name="download" size={60} color="#3EE679" />
      </TouchableOpacity>
      <TouchableOpacity
        style={{
          backgroundColor: "#c1c3374d",
          borderRadius: 7,
          flexGrow: 1,
          alignItems: "center",
          justifyContent: "center",
        }}
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          reportState.addEvent({
            type: MatchEventType.Intake,
            position: MatchEventPosition.Outpost,
          });
          setOverlay(false);
        }}
      >
        <Icon name="upload" size={60} color="#c1c337" />
      </TouchableOpacity>
    </View>
  );
}
