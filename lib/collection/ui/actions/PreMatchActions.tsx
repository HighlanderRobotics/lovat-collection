import { useReportStateStore } from "../../reportStateStore";
import { TouchableOpacity } from "react-native";
import { MatchEventPosition } from "../../MatchEventPosition";
import { FieldElement } from "../FieldElement";
import React from "react";
import type { StartingPosition as StartingPositionType } from "../../ReportState";
import * as Haptics from "expo-haptics";

export const PreMatchActions = () => {
  return (
    <>
      <StartingPosition
        edgeInsets={[0.02, 0.5, 0.76, 0.36]}
        position={MatchEventPosition.StartBlueProcessor}
      />

      <StartingPosition
        edgeInsets={[0.26, 0.5, 0.51, 0.36]}
        position={MatchEventPosition.StartBlueNet}
      />

      <StartingPosition
        edgeInsets={[0.51, 0.5, 0.26, 0.36]}
        position={MatchEventPosition.StartRedNet}
      />

      <StartingPosition
        edgeInsets={[0.76, 0.5, 0.02, 0.36]}
        position={MatchEventPosition.StartRedProcessor}
      />
    </>
  );
};

function StartingPosition(props: {
  edgeInsets: [number, number, number, number];
  position: StartingPositionType;
}) {
  const { edgeInsets, position } = props;
  const reportState = useReportStateStore();
  return (
    <FieldElement edgeInsets={edgeInsets}>
      <TouchableOpacity
        style={{
          height: "98%",
          width: "100%",
          backgroundColor: "#e0e0e0",
          opacity: reportState.startPosition === position ? 0.8 : 0.3,
          borderRadius: 7,
        }}
        activeOpacity={0.2}
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          reportState.setStartPosition(position);
        }}
      />
    </FieldElement>
  );
}
