import React from "react";
import { FieldElement } from "../FieldElement";
import { GameAction } from "../GameAction";
import { OverlayState } from "../GameViewTemplate";
import { MatchEventPosition } from "../../MatchEventPosition";
import HexagonBack from "../../../../assets/hexagon/Back";
import HexagonRed from "../../../../assets/hexagon/RedSide";
import HexagonBlue from "../../../../assets/hexagon/BlueSide";
import { colors } from "../../../colors";

export const AutoReefActions = (props: {
  setOverlay: (value: OverlayState) => void;
  setOverlayPos: (value: MatchEventPosition) => void;
}) => {
  // const addEvent = useReportStateStore((state) => state.addEvent);
  return (
    <>
      <FieldElement edgeInsets={[0.02, 0.64, 0, 0.265]}>
        <GameAction
          color={colors.victoryPurple.default}
          backgroundViewReplacement={<HexagonBack />}
          onPress={() => {
            props.setOverlay(OverlayState.Reef);
            props.setOverlayPos(MatchEventPosition.LevelOneC);
          }}
        />
      </FieldElement>
      <FieldElement edgeInsets={[-0.22, 0.75, 0, 0.157]}>
        <GameAction
          color={colors.victoryPurple.default}
          backgroundViewReplacement={<HexagonBlue />}
          onPress={() => {
            props.setOverlay(OverlayState.Reef);
            props.setOverlayPos(MatchEventPosition.LevelOneA);
          }}
        />
      </FieldElement>
      <FieldElement edgeInsets={[0.26, 0.75, 0.3, 0.157]}>
        <GameAction
          color={colors.victoryPurple.default}
          backgroundViewReplacement={<HexagonRed />}
          onPress={() => {
            props.setOverlay(OverlayState.Reef);
            props.setOverlayPos(MatchEventPosition.LevelOneB);
          }}
        />
      </FieldElement>
    </>
  );
};
