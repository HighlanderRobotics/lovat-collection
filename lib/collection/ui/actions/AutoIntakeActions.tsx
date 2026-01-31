import { MatchEventPosition } from "../../MatchEventPosition";
import { MatchEventType } from "../../MatchEventType";
import { useReportStateStore } from "../../reportStateStore";
import { figmaDimensionsToFieldInsets } from "../../util";
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
          iconSize={48}
        />
      </FieldElement>
      <FieldElement
        edgeInsets={figmaDimensionsToFieldInsets({
          x: 9.5,
          y: 252.5,
          width: 78,
          height: 76,
        })}
      >
        <GameAction
          onPress={() => null} // overlay istg
          color="#C1C337"
          icon="fort"
          iconSize={48}
        />
      </FieldElement>
    </>
  );
}

export function NeutralZoneAutoIntakeAction() {
  const reportState = useReportStateStore();

  return (
    <FieldElement
      edgeInsets={figmaDimensionsToFieldInsets({
        x: 247.5,
        y: 12.5,
        width: 132.66,
        height: 311,
      })}
    >
      <GameAction
        onPress={() =>
          reportState.addEvent({
            type: MatchEventType.Intake,
            position: MatchEventPosition.NeutralZone,
          })
        }
        color="#C1C337"
        icon="upload"
        iconSize={48}
      />
    </FieldElement>
  );
}
