import { TouchableOpacity } from "react-native";
import { MatchEventType } from "../../MatchEventType";
import { useReportStateStore } from "../../reportStateStore";
import { figmaDimensionsToFieldInsets } from "../../util";
import { FieldElement } from "../FieldElement";
import { Icon } from "../../../components/Icon";
import { useState } from "react";
import * as Haptics from "expo-haptics";

export function CampAction() {
  const reportState = useReportStateStore();
  const [isCamping, setIsCamping] = useState(false);

  return (
    <FieldElement
      edgeInsets={figmaDimensionsToFieldInsets({
        x: 389.17,
        y: 12.5,
        width: 132.66,
        height: 311,
      })}
    >
      <TouchableOpacity
        onPressIn={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          reportState.addEvent({
            type: MatchEventType.StartCamping,
          });
          setIsCamping(true);
        }}
        onPressOut={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          reportState.addEvent({
            type: MatchEventType.StopCamping,
          });
          setIsCamping(false);
        }}
        style={{
          height: "100%",
          width: "100%",
          borderRadius: 7,
          position: "relative",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: isCamping ? "#1DA3F6b2" : "#1DA3F64d",
        }}
        activeOpacity={1}
      >
        <Icon
          name="camping"
          color={isCamping ? "#003455" : "#1da3f6"}
          size={48}
        />
      </TouchableOpacity>
    </FieldElement>
  );
}
