import React from "react";
import { FieldElement } from "../FieldElement";
import { GameAction } from "../GameAction";
import { OverlayState } from "../GameViewTemplate";
import { MatchEventPosition } from "../../MatchEventPosition";
import { TouchableOpacity } from "react-native-gesture-handler";
import HexagonBack from "../../../../assets/hexagon/Back";
import HexagonRed from "../../../../assets/hexagon/RedSide";
import HexagonBlue from "../../../../assets/hexagon/BlueSide";

export const AutoReefActions = (props: {
  setOverlay: (value: OverlayState) => void;
  setOverlayPos: (value: MatchEventPosition) => void;
}) => {
  // const addEvent = useReportStateStore((state) => state.addEvent);
  return (
    <>
      <FieldElement edgeInsets={[0.02, 0.64, 0, 0.265]}>
        <TouchableOpacity
          onPress={() => {
            props.setOverlay(OverlayState.Reef);
            props.setOverlayPos(MatchEventPosition.LevelOneC);
          }}
        >
          <HexagonBack />
        </TouchableOpacity>
      </FieldElement>
      <FieldElement edgeInsets={[-0.22, 0.75, 0, 0.157]}>
        <TouchableOpacity
          onPress={() => {
            props.setOverlay(OverlayState.Reef);
            props.setOverlayPos(MatchEventPosition.LevelOneA);
          }}
        >
          <HexagonBlue />
        </TouchableOpacity>
      </FieldElement>
      <FieldElement edgeInsets={[0.26, 0.75, 0, 0.157]}>
        <TouchableOpacity
          onPress={() => {
            props.setOverlay(OverlayState.Reef);
            props.setOverlayPos(MatchEventPosition.LevelOneB);
          }}
        >
          <HexagonRed />
        </TouchableOpacity>
      </FieldElement>
    </>
  );
};
