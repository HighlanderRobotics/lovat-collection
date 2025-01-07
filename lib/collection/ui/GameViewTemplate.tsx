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
import TitleLarge from "../../components/text/TitleLarge";

export enum OverlayState {
  None,
  GroundPiece,
  Reef,
  Net,
}

export const GameViewTemplate = (props: {
  field: React.ReactNode;
  topLeftReplacement?: React.ReactNode;
  gamePhaseMessage: string;
  startEnabled?: boolean;
  overlay: OverlayState;
  reefPos: number;
  setOverlay: (value: OverlayState) => void;
  resetReefPos: () => void;
  onEnd: () => void;
  onRestart: () => void;
}) => {
  const reportState = useReportStateStore();
  const { gamePhaseMessage, field, startEnabled } = props;

  if (!reportState.meta) return null;

  return (
    <>
      <StatusBar hidden={true} backgroundColor={colors.background.default} />
      {/* Overlay */}
      <Pressable
        pointerEvents={props.overlay !== OverlayState.None ? "auto" : "none"}
        disabled={props.overlay !== OverlayState.None}
        style={{
          backgroundColor: "#45454540",
          opacity: props.overlay !== OverlayState.None ? 1 : 0,
          position: "absolute",
          zIndex: 50,
          width: "100%",
          height: "100%",
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
            onPress={() => props.setOverlay(OverlayState.None)}
            activeOpacity={0.1}
          >
            <Icon name="close" color={colors.onBackground.default} size={32} />
          </TouchableOpacity>
          {/* Ground Pieces */}
          {props.overlay === OverlayState.GroundPiece && (
            <View
              style={{
                flexDirection: "row",
                gap: 10,
                width: "100%",
              }}
            >
              <TouchableOpacity
                style={{
                  backgroundColor: "#ffffff4d",
                  borderRadius: 7,
                  borderWidth: 2,
                  borderColor: "#ffffff",
                  flexGrow: 1,
                  alignItems: "center",
                  justifyContent: "center",
                }}
                onPress={() => {
                  reportState.addEvent({
                    type: MatchEventType.PickupCoral,
                  });
                  props.setOverlay(OverlayState.None);
                }}
              >
                <Icon name="frc_coral" color="#ffffff" size={100} />
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  backgroundColor: "#14ceac4d",
                  borderRadius: 7,
                  borderWidth: 2,
                  borderColor: "#14ceac",
                  flexGrow: 1,
                  alignItems: "center",
                  justifyContent: "center",
                }}
                onPress={() => {
                  reportState.addEvent({
                    type: MatchEventType.PickupAlgae,
                  });
                  props.setOverlay(OverlayState.None);
                }}
              >
                <Icon name="frc_algae" color="#14ceac" size={100} />
              </TouchableOpacity>
            </View>
          )}
          {/* Reef */}
          {props.overlay === OverlayState.Reef && (
            <View
              style={{
                flexDirection: "column",
                gap: 10,
                width: "100%",
              }}
            >
              <View
                style={{
                  height: "70%",
                  flexDirection: "row",
                  gap: 10,
                }}
              >
                <TouchableOpacity
                  style={{
                    backgroundColor: "#9cff9a4d",
                    borderRadius: 7,
                    borderWidth: 2,
                    borderColor: "#9cff9a",
                    flexGrow: 1,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  onPress={() => {}}
                >
                  <TitleLarge color="#9cff9a">L1</TitleLarge>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    backgroundColor: "#9cff9a4d",
                    borderRadius: 7,
                    borderWidth: 2,
                    borderColor: "#9cff9a",
                    flexGrow: 1,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  onPress={() => {}}
                >
                  <TitleLarge color="#9cff9a">L2</TitleLarge>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    backgroundColor: "#9cff9a4d",
                    borderRadius: 7,
                    borderWidth: 2,
                    borderColor: "#9cff9a",
                    flexGrow: 1,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  onPress={() => {}}
                >
                  <TitleLarge color="#9cff9a">L3</TitleLarge>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    backgroundColor: "#9cff9a4d",
                    borderRadius: 7,
                    borderWidth: 2,
                    borderColor: "#9cff9a",
                    flexGrow: 1,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  onPress={() => {}}
                >
                  <TitleLarge color="#9cff9a">L4</TitleLarge>
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                style={{
                  backgroundColor: "#14ceac4d",
                  borderRadius: 7,
                  borderWidth: 2,
                  borderColor: "#14ceac",
                  flexGrow: 1,
                  alignItems: "center",
                  justifyContent: "center",
                }}
                onPress={() => {
                  reportState.addEvent({
                    type: MatchEventType.PickupAlgae,
                  });
                  props.setOverlay(OverlayState.None);
                }}
              >
                <Icon name="frc_algae" color="#14ceac" size={60} />
              </TouchableOpacity>
            </View>
          )}
          {/* Net */}
          {props.overlay === OverlayState.Net && (
            <View
              style={{
                flexDirection: "row",
                gap: 10,
                width: "100%",
              }}
            >
              <TouchableOpacity
                style={{
                  backgroundColor: "#9cff9a4d",
                  borderRadius: 7,
                  borderWidth: 2,
                  borderColor: "#9cff9a",
                  minWidth: 200,
                  flexGrow: 1,
                  alignItems: "center",
                  justifyContent: "center",
                }}
                onPress={() => {
                  reportState.addEvent({
                    type: MatchEventType.ScoreNet,
                  });
                  props.setOverlay(OverlayState.None);
                }}
              >
                <TitleLarge color="#9cff9a"> Sucess </TitleLarge>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  backgroundColor: "#b13b3b4d",
                  borderRadius: 7,
                  borderWidth: 2,
                  borderColor: "#fbadad",
                  minWidth: 200,
                  flexGrow: 1,
                  alignItems: "center",
                  justifyContent: "center",
                }}
                onPress={() => {
                  reportState.addEvent({
                    type: MatchEventType.PickupAlgae,
                  });
                  props.setOverlay(OverlayState.None);
                }}
              >
                <TitleLarge color="#fbadad"> Fail </TitleLarge>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </Pressable>
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
          {props.topLeftReplacement ?? null}

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
