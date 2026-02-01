import { TouchableOpacity } from "react-native";
import { figmaDimensionsToFieldInsets } from "../../util";
import { FieldElement } from "../FieldElement";
import { colors } from "../../../colors";
import { Icon } from "../../../components/Icon";

export function DefendAction() {
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
        style={{
          width: "100%",
          height: "100%",
          justifyContent: "center",
          alignItems: "center",
          borderRadius: 7,
          backgroundColor: colors.secondaryContainer.default,
        }}
      >
        <Icon name="shield" color={colors.onBackground.default} size={48} />
      </TouchableOpacity>
    </FieldElement>
  );
}
