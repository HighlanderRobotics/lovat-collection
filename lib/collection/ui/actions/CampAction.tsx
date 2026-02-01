import { TouchableOpacity, View } from "react-native";
import { MatchEventPosition } from "../../MatchEventPosition";
import { MatchEventType } from "../../MatchEventType";
import { useReportStateStore } from "../../reportStateStore";
import { figmaDimensionsToFieldInsets } from "../../util";
import { FieldElement } from "../FieldElement";
import { GameAction } from "../GameAction";
import { Icon } from "../../../components/Icon";
import { useRef } from "react";

export function CampAction() {
  const reportState = useReportStateStore();
  const isCamping = useRef(false);

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
          reportState.addEvent({
            type: MatchEventType.StartCamping,
          });
          isCamping.current = true;
        }}
        onPressOut={() => {
          reportState.addEvent({
            type: MatchEventType.StopCamping,
          });
          isCamping.current = false;
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
          backgroundColor: isCamping.current ? "#1DA3F6" : "#1DA3F64d",
        }}
        activeOpacity={1}
      >
        <Icon
          name="camping"
          color={isCamping.current ? "#1e4760" : "#1da3f6"}
          size={48}
        />
      </TouchableOpacity>
    </FieldElement>
  );
}
