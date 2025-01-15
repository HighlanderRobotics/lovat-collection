import React from "react";
import { Icon } from "../../../components/Icon";
import { MatchEventPosition } from "../../MatchEventPosition";
import { MatchEventType } from "../../MatchEventType";
import { useReportStateStore } from "../../reportStateStore";
import { FieldElement } from "../FieldElement";
import { GameAction } from "../GameAction";
import { TouchableOpacity } from "react-native";
import { fieldHeight, fieldWidth } from "../../../components/FieldImage";
import { OverlayState } from "../GameViewTemplate";

export const AutoCollectGroundPieceActions = ({
  setOverlay,
  setOverlayPos,
}: {
  setOverlay: (value: OverlayState) => void;
  setOverlayPos: (pos: MatchEventPosition) => void;
}) => {
  const radius = 35;
  const getRemainingGroundPieces = useReportStateStore(
    (state) => state.getRemainingGroundNotes,
  );
  const remainingGroundPieces = getRemainingGroundPieces();
  const existingGroundPieces = Object.entries(remainingGroundPieces).reduce(
    (acc, [key, value]) => ({
      ...acc,
      [Number(key) as MatchEventPosition]: value.algae || value.coral,
    }),
    {} as Record<MatchEventPosition, boolean>,
  );

  const coordsToInsets: (x: number, y: number) => [number, number, number, number] = (x: number, y: number) => [
    y - radius / fieldHeight,
    1 - x - radius / fieldWidth,
    1 - y - radius / fieldHeight,
    x - radius / fieldWidth,
  ]

  return (
    <>
      <FieldElement
        edgeInsets={coordsToInsets(0.081, 0.728)}
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
            width: radius,
            height: radius,
            alignItems: "center",
            justifyContent: "center",
          }}
          onPress={() => {
            setOverlayPos(MatchEventPosition.GroundPieceRedBarge);
            setOverlay(OverlayState.GroundPiece);
          }}
        >
          <Icon name="upload" color="#c1c337" />
        </TouchableOpacity>
      </FieldElement>
      <FieldElement
        edgeInsets={coordsToInsets(0.081, 0.51)}
      >
        <TouchableOpacity
          disabled={!existingGroundPieces[MatchEventPosition.GroundPieceCenter]}
          style={{
            opacity: existingGroundPieces[MatchEventPosition.GroundPieceCenter]
              ? 1
              : 0,
            backgroundColor: "#c1c3374d",
            borderRadius: 50,
            width: radius,
            height: radius,
            alignItems: "center",
            justifyContent: "center",
          }}
          onPress={() => {
            setOverlayPos(MatchEventPosition.GroundPieceCenter);
            setOverlay(OverlayState.GroundPiece);
          }}
        >
          <Icon name="upload" color="#c1c337" />
        </TouchableOpacity>
      </FieldElement>
      <FieldElement
        edgeInsets={coordsToInsets(0.081, 0.29)}
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
            width: radius,
            height: radius,
            alignItems: "center",
            justifyContent: "center",
          }}
          onPress={() => {
            setOverlayPos(MatchEventPosition.GroundPieceBlueBarge);
            setOverlay(OverlayState.GroundPiece);
          }}
        >
          <Icon name="upload" color="#c1c337" />
        </TouchableOpacity>
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
          onPress={() =>
            reportState.addEvent({
              type: MatchEventType.PickupCoral,
              position: MatchEventPosition.CoralStationBlueBarge,
            })
          }
        >
          <Icon name="frc_coral" size={32} color="#c1c337" />
        </GameAction>
      </FieldElement>
      <FieldElement edgeInsets={[0.8, 0.85, 0, 0]}>
        <GameAction
          color="#c1c337"
          onPress={() =>
            reportState.addEvent({
              type: MatchEventType.PickupCoral,
              position: MatchEventPosition.CoralStationRedBarge,
            })
          }
        >
          <Icon name="frc_coral" size={32} color="#c1c337" />
        </GameAction>
      </FieldElement>
    </>
  );
};
