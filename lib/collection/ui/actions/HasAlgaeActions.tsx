import React from "react";
import { useReportStateStore } from "../../reportStateStore";
import { MatchEventType } from "../../MatchEventType";
import { FieldElement } from "../FieldElement";
import { GameAction } from "../GameAction";

export const HasAlgaeActions = () => {
  const addEvent = useReportStateStore((state) => state.addEvent);
  return (
    <>
      <FieldElement edgeInsets={[0, 0.425, 0, 0.425]}>
        <GameAction
          color="#9cff9a"
          onPress={() => {
            addEvent({
              type: MatchEventType.ScoreNet,
            });
          }}
        ></GameAction>
      </FieldElement>

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
    </>
  );
};
