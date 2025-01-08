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
  const getRemainingGroundPieces = useReportStateStore(
    (state) => state.getRemainingGroundNotes,
  );
  const remainingGroundPieces = getRemainingGroundPieces();
  return <></>;
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
              position: MatchEventPosition.CoralStationBlueBarge,
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
              position: MatchEventPosition.CoralStationRedBarge,
            })
          }
        >
          <Icon name="frc_coral" size={32} color="#c1c337" />
        </GameAction>
      </FieldElement>
    </>
  );
};
