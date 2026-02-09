import { MatchEventPosition } from "../../MatchEventPosition";
import { MatchEventType } from "../../MatchEventType";
import { useReportStateStore } from "../../reportStateStore";
import { figmaDimensionsToFieldInsets } from "../../util";
import { FieldElement } from "../FieldElement";
import { GameAction } from "../GameAction";

export function AutoDisruptAction() {
  const reportState = useReportStateStore();

  // Hide the button if a disrupt event has already been added
  if (reportState.hasEventOfType(MatchEventType.Disrupt)) {
    return null;
  }

  return (
    <FieldElement
      edgeInsets={figmaDimensionsToFieldInsets({
        x: 389.17,
        y: 12.5,
        width: 132.66,
        height: 311,
      })}
    >
      <GameAction
        onPress={() =>
          reportState.addEvent({
            type: MatchEventType.Disrupt,
            position: MatchEventPosition.NeutralZone,
          })
        }
        color="#1DA3F6"
        icon="bomb"
        iconSize={48}
      />
    </FieldElement>
  );
}
