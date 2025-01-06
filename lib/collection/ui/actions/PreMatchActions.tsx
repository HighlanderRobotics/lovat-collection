import { useReportStateStore } from "../../reportStateStore";
import { TouchableOpacity } from "react-native";
import { MatchEventPosition, StartingPosition } from "../../MatchEventPosition";
import { FieldElement } from "../FieldElement";
import React from "react";

export const PreMatchActions = () => {
  const reportState = useReportStateStore();

  return (
    <>
      <FieldElement edgeInsets={[0.02, 0.5, 0.76, 0.36]}>
        <TouchableOpacity
          style={{
            height: "98%",
            width: "100%",
            backgroundColor: "#e0e0e0",
            opacity:
              reportState.startPosition ===
              MatchEventPosition.StartBlueProcessor
                ? 0.8
                : 0.3,
            borderRadius: 7,
          }}
          activeOpacity={0.2}
          onPress={() => {
            reportState.setStartPosition(MatchEventPosition.StartBlueProcessor);
          }}
        />
      </FieldElement>

      <FieldElement edgeInsets={[0.26, 0.5, 0.51, 0.36]}>
        <TouchableOpacity
          style={{
            height: "98%",
            width: "100%",
            backgroundColor: "#e0e0e0",
            opacity:
              reportState.startPosition === MatchEventPosition.StartBlueNet
                ? 0.8
                : 0.3,
            borderRadius: 7,
          }}
          activeOpacity={0.2}
          onPress={() => {
            reportState.setStartPosition(MatchEventPosition.StartBlueNet);
          }}
        />
      </FieldElement>

      <FieldElement edgeInsets={[0.51, 0.5, 0.26, 0.36]}>
        <TouchableOpacity
          style={{
            height: "98%",
            width: "100%",
            backgroundColor: "#e0e0e0",
            opacity:
              reportState.startPosition === MatchEventPosition.StartRedNet
                ? 0.8
                : 0.3,
            borderRadius: 7,
          }}
          activeOpacity={0.2}
          onPress={() => {
            reportState.setStartPosition(MatchEventPosition.StartRedNet);
          }}
        />
      </FieldElement>

      <FieldElement edgeInsets={[0.76, 0.5, 0.02, 0.36]}>
        <TouchableOpacity
          style={{
            height: "98%",
            width: "100%",
            backgroundColor: "#e0e0e0",
            opacity:
              reportState.startPosition === MatchEventPosition.StartRedProcessor
                ? 0.8
                : 0.3,
            borderRadius: 7,
          }}
          activeOpacity={0.2}
          onPress={() => {
            reportState.setStartPosition(MatchEventPosition.StartRedProcessor);
          }}
        />
      </FieldElement>
    </>
  );
};
