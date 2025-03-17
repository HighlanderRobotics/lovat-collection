import React from "react";
import { Icon } from "../../../components/Icon";
import { MatchEventPosition } from "../../MatchEventPosition";
import { MatchEventType } from "../../MatchEventType";
import { useReportStateStore } from "../../reportStateStore";
import { FieldElement } from "../FieldElement";
import { GameAction } from "../GameAction";
import { TouchableOpacity, View } from "react-native";
import { OverlayState } from "../GameViewTemplate";
import * as Haptics from "expo-haptics";

export const AutoCollectGroundPieceActions = ({
  setOverlay,
  setOverlayPos,
}: {
  setOverlay: (value: OverlayState) => void;
  setOverlayPos: (pos: MatchEventPosition) => void;
}) => {
  const diameter = 35;
  const getRemainingGroundPieces = useReportStateStore(
    (state) => state.getRemainingGroundPieces,
  );
  const remainingGroundPieces = getRemainingGroundPieces();
  const existingGroundPieces = Object.entries(remainingGroundPieces).reduce(
    (acc, [key, value]) => ({
      ...acc,
      [Number(key) as MatchEventPosition]: value.algae || value.coral,
    }),
    {} as Record<MatchEventPosition, boolean>,
  );

  const coordsToInsets: (
    x: number,
    y: number,
  ) => [number, number, number, number] = (x: number, y: number) => [
    y,
    1 - x,
    1 - y,
    x,
  ];

  return (
    <>
      <FieldElement edgeInsets={coordsToInsets(0.0755, 0.72)}>
        <View
          style={{
            width: 0,
            height: 0,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <TouchableOpacity
            disabled={
              !existingGroundPieces[MatchEventPosition.GroundPieceRedBarge]
            }
            style={{
              opacity: existingGroundPieces[
                MatchEventPosition.GroundPieceRedBarge
              ]
                ? 1
                : 0,
              backgroundColor: "#c1c3374d",
              borderRadius: 50,
              width: diameter,
              height: diameter,
              alignItems: "center",
              justifyContent: "center",
            }}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setOverlayPos(MatchEventPosition.GroundPieceRedBarge);
              setOverlay(OverlayState.GroundPiece);
            }}
          >
            <Icon name="upload" color="#c1c337" />
          </TouchableOpacity>
        </View>
      </FieldElement>
      <FieldElement edgeInsets={coordsToInsets(0.0755, 0.5)}>
        <View
          style={{
            width: 0,
            height: 0,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <TouchableOpacity
            disabled={
              !existingGroundPieces[MatchEventPosition.GroundPieceCenter]
            }
            style={{
              opacity: existingGroundPieces[
                MatchEventPosition.GroundPieceCenter
              ]
                ? 1
                : 0,
              backgroundColor: "#c1c3374d",
              borderRadius: 50,
              width: diameter,
              height: diameter,
              alignItems: "center",
              justifyContent: "center",
            }}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setOverlayPos(MatchEventPosition.GroundPieceCenter);
              setOverlay(OverlayState.GroundPiece);
            }}
          >
            <Icon name="upload" color="#c1c337" />
          </TouchableOpacity>
        </View>
      </FieldElement>
      <FieldElement edgeInsets={coordsToInsets(0.0755, 0.278)}>
        <View
          style={{
            width: 0,
            height: 0,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <TouchableOpacity
            disabled={
              !existingGroundPieces[MatchEventPosition.GroundPieceBlueBarge]
            }
            style={{
              opacity: existingGroundPieces[
                MatchEventPosition.GroundPieceBlueBarge
              ]
                ? 1
                : 0,
              backgroundColor: "#c1c3374d",
              borderRadius: 50,
              width: diameter,
              height: diameter,
              alignItems: "center",
              justifyContent: "center",
            }}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setOverlayPos(MatchEventPosition.GroundPieceBlueBarge);
              setOverlay(OverlayState.GroundPiece);
            }}
          >
            <Icon name="upload" color="#c1c337" />
          </TouchableOpacity>
        </View>
      </FieldElement>
    </>
  );
};

export const AutoCoralStationActions = () => {
  const reportState = useReportStateStore();

  return (
    <>
      <FieldElement edgeInsets={[0, 0.85, 0.8, 0]}>
        <GameAction
          color="#c1c337"
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            reportState.addEvent({
              type: MatchEventType.PickupCoral,
              position: MatchEventPosition.CoralStationBlueBarge,
            });
          }}
        >
          <Icon name="frc_coral" size={32} color="#c1c337" />
        </GameAction>
      </FieldElement>
      <FieldElement edgeInsets={[0.8, 0.85, 0, 0]}>
        <GameAction
          color="#c1c337"
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            reportState.addEvent({
              type: MatchEventType.PickupCoral,
              position: MatchEventPosition.CoralStationRedBarge,
            });
          }}
        >
          <Icon name="frc_coral" size={32} color="#c1c337" />
        </GameAction>
      </FieldElement>
    </>
  );
};
