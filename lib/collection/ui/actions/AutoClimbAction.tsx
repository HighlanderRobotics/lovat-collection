import { colors } from "../../../colors";
import { MatchEventType } from "../../MatchEventType";
import { useReportStateStore } from "../../reportStateStore";
import { figmaDimensionsToFieldInsets } from "../../util";
import { FieldElement } from "../FieldElement";
import { GameAction } from "../GameAction";

export function AutoClimbAction() {
  const reportState = useReportStateStore();

  const hasClimbEvent = reportState.isClimbing();

  // Hide the button if a climb event has already been added
  if (hasClimbEvent) {
    return null;
  }

  return (
    <FieldElement
      edgeInsets={figmaDimensionsToFieldInsets({
        x: 9.5,
        y: 144.5,
        width: 61,
        height: 70,
      })}
    >
      <GameAction
        onPress={() => {
          reportState.addEvent({
            type: MatchEventType.Climb,
          });
        }}
        color={colors.victoryPurple.default}
        icon=""
        iconSize={48}
      />
    </FieldElement>
  );
}
