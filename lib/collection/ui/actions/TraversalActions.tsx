import { View } from "react-native";
import { colors } from "../../../colors";
import { AllianceColor } from "../../../models/AllianceColor";
import {
  FieldOrientation,
  useFieldOrientationStore,
} from "../../../storage/userStores";
import { MatchEventPosition } from "../../MatchEventPosition";
import { MatchEventType } from "../../MatchEventType";
import { useReportStateStore } from "../../reportStateStore";
import { figmaDimensionsToFieldInsets } from "../../util";
import { FieldElement } from "../FieldElement";
import { GameAction } from "../GameAction";
import { Icon } from "../../../components/Icon";

function TraversalArrow() {
  const fieldOrientation = useFieldOrientationStore((state) => state.value);
  const allianceColor = useReportStateStore(
    (state) => state.meta?.allianceColor,
  );
  const events = useReportStateStore((state) => state.events);

  const crossCount = events.filter(
    (event) => event.type === MatchEventType.Cross,
  ).length;
  const isInAllianceZone = crossCount % 2 === 0;

  const allianceIsOnLeft =
    (allianceColor === AllianceColor.Red) ===
    (fieldOrientation === FieldOrientation.Sinister);

  const arrowPointsLeft = isInAllianceZone
    ? !allianceIsOnLeft // away from alliance
    : allianceIsOnLeft; // toward alliance

  return (
    <View
      style={{
        transform: [{ scaleX: arrowPointsLeft ? -1 : 1 }],
      }}
    >
      <Icon
        name="chevron_right"
        color={colors.victoryPurple.default}
        size={32}
      />
    </View>
  );
}

export default function TraversalActions() {
  const reportState = useReportStateStore();

  return (
    <>
      <FieldElement
        edgeInsets={figmaDimensionsToFieldInsets({
          x: 163,
          y: 8,
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
        >
          <TraversalArrow />
        </GameAction>
      </FieldElement>
      <FieldElement
        edgeInsets={figmaDimensionsToFieldInsets({
          x: 163,
          y: 65,
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
        >
          <TraversalArrow />
        </GameAction>
      </FieldElement>
      <FieldElement
        edgeInsets={figmaDimensionsToFieldInsets({
          x: 163,
          y: 218.5,
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
        >
          <TraversalArrow />
        </GameAction>
      </FieldElement>
      <FieldElement
        edgeInsets={figmaDimensionsToFieldInsets({
          x: 163,
          y: 275,
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
        >
          <TraversalArrow />
        </GameAction>
      </FieldElement>
    </>
  );
}
