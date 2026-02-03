import { TouchableOpacity } from "react-native";
import { figmaDimensionsToFieldInsets } from "../../util";
import { FieldElement } from "../FieldElement";
import { colors } from "../../../colors";
import { Icon } from "../../../components/Icon";
import { MatchEventType } from "../../MatchEventType";
import { useReportStateStore } from "../../reportStateStore";
import { useState } from "react";
import * as Haptics from "expo-haptics";

export function DefendAction() {
  const reportState = useReportStateStore();
  const [isDefending, setIsDefending] = useState(false);

  return (
    <FieldElement
      edgeInsets={figmaDimensionsToFieldInsets({
        x: 535.5,
        y: 12.5,
        width: 125,
        height: 311,
      })}
    >
      <TouchableOpacity
        onPressIn={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          reportState.addEvent({
            type: MatchEventType.StartDefending,
          });
          setIsDefending(true);
        }}
        onPressOut={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          reportState.addEvent({
            type: MatchEventType.StopDefending,
          });
          setIsDefending(false);
        }}
        style={{
          width: "100%",
          height: "100%",
          justifyContent: "center",
          alignItems: "center",
          borderRadius: 7,
          backgroundColor: isDefending
            ? colors.danger.default
            : colors.secondaryContainer.default,
        }}
        activeOpacity={1}
      >
        <Icon name="shield" color={colors.onBackground.default} size={48} />
      </TouchableOpacity>
    </FieldElement>
  );
}
