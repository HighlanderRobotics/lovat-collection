import React from "react";
import { MatchEventType } from "../../MatchEventType";
import { FieldElement } from "../FieldElement";
import { GameAction } from "../GameAction";
import { colors } from "../../../colors";
import { useReportStateStore } from "../../reportStateStore";

export const ExitWingAction = () => {
  const addEvent = useReportStateStore((state) => state.addEvent);
  return (
    <FieldElement edgeInsets={[0, 0.5, 0, 0]}>
      <GameAction
        color={colors.victoryPurple.default}
        onPress={() => {
          addEvent({
            type: MatchEventType.AutoLeave,
          });
        }}
      />
    </FieldElement>
  );
};
