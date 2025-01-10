import React from "react";
import { FieldElement } from "../FieldElement";
import { GameAction } from "../GameAction";
import { OverlayState } from "../GameViewTemplate";
import { MatchEventPosition } from "../../MatchEventPosition";
import { TouchableOpacity } from "react-native-gesture-handler";
import HexagonBack from "../../../../assets/hexagon/Back";

export const AutoReefActions = (props: {
  setOverlay: (value: OverlayState) => void;
  setOverlayPos: (value: MatchEventPosition) => void;
}) => {
  // const addEvent = useReportStateStore((state) => state.addEvent);
  return (
    <>
      <FieldElement edgeInsets={[0, 0.435, 0, 0.435]}>
        <TouchableOpacity
          onPress={() => {
            props.setOverlay(OverlayState.Reef)
            props.setOverlayPos(MatchEventPosition.LevelOneC)
          }}
          activeOpacity={0.9}
        >
          <HexagonBack />
        </TouchableOpacity>
      </FieldElement>
    </>
  );
};
