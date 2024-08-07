import React from "react";
import { useAddEvent } from "../../reportStateAtom";
import { MatchEventType } from "../../MatchEventType";
import { FieldElement } from "../FieldElement";
import { GameAction } from "../GameAction";
import { colors } from "../../../colors";

export const ExitWingAction = () => {
  const addEvent = useAddEvent();

  return (
    <FieldElement edgeInsets={[0, 0, 0.21, 0.14]}>
      <GameAction
        color={colors.victoryPurple.default}
        onPress={() => {
          addEvent({
            type: MatchEventType.LeaveWing,
          });
        }}
      />
    </FieldElement>
  );
};
