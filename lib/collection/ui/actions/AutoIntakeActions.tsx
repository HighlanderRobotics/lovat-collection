import { MatchEventPosition } from "../../MatchEventPosition";
import { MatchEventType } from "../../MatchEventType";
import { useReportStateStore } from "../../reportStateStore";
import { figmaDimensionsToFieldInsets } from "../../util";
import { DragDirection, DraggableContainer } from "../DraggableContainer";
import { FieldElement } from "../FieldElement";
import { GameAction } from "../GameAction";

export function AllianceZoneIntakeActions() {
  const reportState = useReportStateStore();

  return (
    <>
      <FieldElement
        edgeInsets={figmaDimensionsToFieldInsets({
          x: 9.5,
          y: 54.5,
          width: 70,
          height: 74,
        })}
      >
        <GameAction
          onPress={() =>
            reportState.addEvent({
              type: MatchEventType.Intake,
              position: MatchEventPosition.Depot,
            })
          }
          color="#C1C337"
          icon="upload"
          iconSize={42}
        />
      </FieldElement>
      <DraggableContainer
        respectAlliance
        dragDirection={DragDirection.Left}
        onStart={() => null}
        onMove={() => null}
        onEnd={(displacement) =>
          reportState.addEvent({
            type:
              displacement > 100
                ? MatchEventType.Outtake
                : MatchEventType.Intake,
            position: MatchEventPosition.Outpost,
          })
        }
        edgeInsets={figmaDimensionsToFieldInsets({
          x: 9.5,
          y: 252.5,
          width: 78,
          height: 76,
        })}
      >
        <GameAction
          onPress={() => null}
          color="#C1C337"
          icon="fort"
          iconSize={42}
        />
      </DraggableContainer>
    </>
  );
}
