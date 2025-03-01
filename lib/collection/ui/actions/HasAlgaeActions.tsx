import React from "react";
import { useReportStateStore } from "../../reportStateStore";
import { MatchEventType } from "../../MatchEventType";
import { FieldElement } from "../FieldElement";
import { GameAction } from "../GameAction";
import { OverlayState } from "../GameViewTemplate";
import { AllianceColor } from "../../../models/AllianceColor";

export const HasAlgaeActions = (props: {
  setOverlay: (value: OverlayState) => void;
}) => {
  const addEvent = useReportStateStore((state) => state.addEvent);
  const allianceColor = useReportStateStore(
    (state) => state.meta?.allianceColor,
  );
  return (
    <>
      <FieldElement edgeInsets={[0, 0.435, 0, 0.435]}>
        <GameAction
          color="#9cff9a"
          onPress={() => {
            props.setOverlay(OverlayState.Net);
          }}
        ></GameAction>
      </FieldElement>
      {allianceColor! === AllianceColor.Red ? (
        <FieldElement edgeInsets={[0, 0.59, 0.8, 0.275]}>
          <GameAction
            color="#9cff9a"
            onPress={() => {
              addEvent({
                type: MatchEventType.ScoreProcessor,
              });
            }}
          ></GameAction>
        </FieldElement>
      ) : (
        <FieldElement edgeInsets={[0.8, 0.59, 0, 0.275]}>
          <GameAction
            color="#9cff9a"
            onPress={() => {
              addEvent({
                type: MatchEventType.ScoreProcessor,
              });
            }}
          ></GameAction>
        </FieldElement>
      )}
    </>
  );
};
