import { colors } from "../../../colors";
import { MatchEventType } from "../../MatchEventType";
import { GamePhase } from "../../ReportState";
import { useReportStateStore } from "../../reportStateStore";
import { figmaDimensionsToFieldInsets } from "../../util";
import { FieldElement } from "../FieldElement";
import { GameAction } from "../GameAction";

export function ClimbAction(props: { phase: GamePhase }) {
  const { phase } = props;

  const reportState = useReportStateStore();

  if (phase == GamePhase.Auto && reportState.hasAutoClimbEvent()) return null;
  if (phase == GamePhase.Endgame && reportState.hasEndgameClimbEvent())
    return null;

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
