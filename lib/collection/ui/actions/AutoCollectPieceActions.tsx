// import React from "react";
// import { useReportStateStore } from "../../reportStateStore";
// import { MatchEventType } from "../../MatchEventType";
// import { MatchEventPosition } from "../../MatchEventPosition";
// import { FieldElement } from "../FieldElement";
// import { GameAction } from "../GameAction";
// import { fieldHeight, fieldWidth } from "../../../components/FieldImage";
// import { View } from "react-native";
// import { colors } from "../../../colors";

import React from "react";
import { Icon } from "../../../components/Icon";
import { MatchEventPosition } from "../../MatchEventPosition";
import { MatchEventType } from "../../MatchEventType";
import { useReportStateStore } from "../../reportStateStore";
import { FieldElement } from "../FieldElement";
import { GameAction } from "../GameAction";

export const AutoCollectGroundPieceActions = () => {
  const radius = 35;
  const addEvent = useReportStateStore((state) => state.addEvent);
  const getRemainingNotes = useReportStateStore(
    (state) => state.getRemainingGroundNoteLocations,
  );

  const remainingNotes = getRemainingNotes();
  return (
    <>
      {Object.entries(groundNotePositions).map(([key, position]) => {
        if (remainingNotes?.includes(key as MatchEventPosition)) {
          return (
            <FieldElement
              key={key}
              edgeInsets={[
                position.fieldCoordinates.y - radius / fieldHeight,
                1 - position.fieldCoordinates.x - radius / fieldWidth,
                1 - position.fieldCoordinates.y - radius / fieldHeight,
                position.fieldCoordinates.x - radius / fieldWidth,
              ]}
            >
              <GameAction
                color="#C1C337"
                borderRadius={100}
                icon="upload"
                onPress={() => {
                  addEvent({
                    type: MatchEventType.PickupNote,
                    position: key as MatchEventPosition,
                  });
                }}
              />
            </FieldElement>
          );
        } else {
          <FieldElement
            key={key}
            edgeInsets={[
              position.fieldCoordinates.y - radius / fieldHeight,
              1 - position.fieldCoordinates.x - radius / fieldWidth,
              1 - position.fieldCoordinates.y - radius / fieldHeight,
              position.fieldCoordinates.x - radius / fieldWidth,
            ]}
          >
            <View
              style={{
                height: "100%",
                width: "100%",
                borderRadius: 100,
                backgroundColor: colors.onBackground.default,
                opacity: 0.1,
              }}
            />
          </FieldElement>;
        }
      })}
    </>
  );
};

export const AutoCoralStationActions = () => {
  const reportState = useReportStateStore();

  return (
    <>
      <FieldElement edgeInsets={[0, 0.85, 0.8, 0]}>
        <GameAction
          color="#c1c3374d"
          onPress={() =>
            reportState.addEvent({
              type: MatchEventType.PickupCoral,
              position: MatchEventPosition.CoralStationA,
            })
          }
        >
          <Icon name="frc_coral" size={32} color="#c1c337" />
        </GameAction>
      </FieldElement>
      <FieldElement edgeInsets={[0.8, 0.85, 0, 0]}>
        <GameAction
          color="#c1c3374d"
          onPress={() =>
            reportState.addEvent({
              type: MatchEventType.PickupCoral,
              position: MatchEventPosition.CoralStationB,
            })
          }
        >
          <Icon name="frc_coral" size={32} color="#c1c337" />
        </GameAction>
      </FieldElement>
    </>
  );
};
