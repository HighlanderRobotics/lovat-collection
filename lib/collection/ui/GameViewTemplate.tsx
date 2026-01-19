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
import { MatchEventPosition } from "../MatchEventPosition";

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
  overlayPos: number;
  setOverlay: (value: OverlayState) => void;
  resetOverlayPos: () => void;
  onEnd: () => void;
  onRestart: () => void;
}) => {
  const reportState = useReportStateStore();
  const { gamePhaseMessage, field, startEnabled } = props;
  if (!reportState.meta) return null;

  return (
    <>
      <StatusBar hidden={true} backgroundColor={colors.background.default} />
      <GameViewOverlay
        overlay={props.overlay}
        overlayPos={props.overlayPos}
        setOverlay={props.setOverlay}
        resetOverlayPos={props.resetOverlayPos}
      />
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

type OverlayProps = {
  overlay?: OverlayState;
  overlayPos?: MatchEventPosition;
  setOverlay: (value: OverlayState) => void;
  resetOverlayPos: () => void;
};

function GameViewOverlay({
  overlay,
  overlayPos,
  setOverlay,
  resetOverlayPos,
}: OverlayProps) {
  return (
    <Pressable
      pointerEvents={overlay !== OverlayState.None ? "auto" : "none"}
      disabled={overlay !== OverlayState.None}
      style={{
        backgroundColor: "#45454540",
        opacity: overlay !== OverlayState.None ? 1 : 0,
        position: "absolute",
        zIndex: 50,
        width: "100%",
        height: "100%",
      }}
      onPress={() => {
        setOverlay(OverlayState.None);
        resetOverlayPos();
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
            setOverlay(OverlayState.None);
            resetOverlayPos();
          }}
          activeOpacity={0.1}
        >
          <Icon name="close" color={colors.onBackground.default} size={32} />
        </TouchableOpacity>
        {/* Ground Pieces */}
        {overlay === OverlayState.GroundPiece && (
          <GroundPieceOverlay
            overlayPos={overlayPos}
            setOverlay={setOverlay}
            resetOverlayPos={resetOverlayPos}
          />
        )}
        {/* Reef */}
        {overlay === OverlayState.Reef && (
          <AutoReefOverlay
            overlayPos={overlayPos}
            setOverlay={setOverlay}
            resetOverlayPos={resetOverlayPos}
          />
        )}
        {/* Net */}
        {overlay === OverlayState.Net && (
          <NetOverlay
            setOverlay={setOverlay}
            resetOverlayPos={resetOverlayPos}
          />
        )}
      </View>
    </Pressable>
  );
}

function GroundPieceOverlay({
  overlayPos,
  setOverlay,
  resetOverlayPos,
}: OverlayProps) {
  // TODO: Implement for 2026 game
  return null;
}

function AutoReefOverlay({
  overlayPos,
  setOverlay,
  resetOverlayPos,
}: OverlayProps) {
  // TODO: Implement for 2026 game
  return null;
}

function NetOverlay({ setOverlay, resetOverlayPos }: OverlayProps) {
  // TODO: Implement for 2026 game
  return null;
}
