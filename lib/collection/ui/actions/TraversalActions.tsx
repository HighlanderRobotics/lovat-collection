import { colors } from "../../../colors";
import { MatchEventPosition } from "../../MatchEventPosition";
import { MatchEventType } from "../../MatchEventType";
import { useReportStateStore } from "../../reportStateStore";
import { figmaDimensionsToFieldInsets } from "../../util";
import { FieldElement } from "../FieldElement";
import { GameAction } from "../GameAction";

export default function TraversalActions() {
  const reportState = useReportStateStore();
  return (
    <>
      <FieldElement
        edgeInsets={figmaDimensionsToFieldInsets({
          x: 163,
          y: 5.5,
          width: 61,
          height: 53,
        })}
      >
        <GameAction
          onPress={() =>
            reportState.addEvent({
              type: MatchEventType.Cross,
              position: MatchEventPosition.LeftTrench,
            })
          }
          color={colors.victoryPurple.default}
        />
      </FieldElement>
      <FieldElement
        edgeInsets={figmaDimensionsToFieldInsets({
          x: 163,
          y: 62.5,
          width: 61,
          height: 52.5,
        })}
      >
        <GameAction
          onPress={() =>
            reportState.addEvent({
              type: MatchEventType.Cross,
              position: MatchEventPosition.LeftBump,
            })
          }
          color={colors.victoryPurple.default}
        />
      </FieldElement>
      <FieldElement
        edgeInsets={figmaDimensionsToFieldInsets({
          x: 163,
          y: 216,
          width: 61,
          height: 52.5,
        })}
      >
        <GameAction
          onPress={() =>
            reportState.addEvent({
              type: MatchEventType.Cross,
              position: MatchEventPosition.RightBump,
            })
          }
          color={colors.victoryPurple.default}
        />
      </FieldElement>
      <FieldElement
        edgeInsets={figmaDimensionsToFieldInsets({
          x: 163,
          y: 272.5,
          width: 61,
          height: 53,
        })}
      >
        <GameAction
          onPress={() =>
            reportState.addEvent({
              type: MatchEventType.Cross,
              position: MatchEventPosition.RightTrench,
            })
          }
          color={colors.victoryPurple.default}
        />
      </FieldElement>
    </>
  );
}
