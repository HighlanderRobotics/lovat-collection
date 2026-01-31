import { colors } from "../../../colors";
import { MatchEventType } from "../../MatchEventType";
import { useReportStateStore } from "../../reportStateStore";
import { figmaDimensionsToFieldInsets } from "../../util";
import { FieldElement } from "../FieldElement";
import { GameAction } from "../GameAction";

export function AutoClimbAction() {
  const reportState = useReportStateStore();

  const climbing = reportState.isClimbing();

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
          if (climbing) {
            reportState.stopClimbing();
          } else
            reportState.addEvent({
              type: MatchEventType.Climb,
            });
        }}
        color={!climbing ? colors.victoryPurple.default : colors.danger.default}
        icon={climbing ? "close" : ""}
        iconSize={48}
      />
    </FieldElement>
  );
}
