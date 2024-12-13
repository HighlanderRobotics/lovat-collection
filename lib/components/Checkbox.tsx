import { Pressable, StyleProp, View, ViewStyle } from "react-native";
import { colors } from "../colors";
import LabelSmall from "./text/LabelSmall";
import { Icon } from "./Icon";

export const Checkbox = (props: {
  label: string;
  checked?: boolean;
  onChange?: (checked: boolean) => any;
}) => {
  const { label, checked, onChange } = props;

  const unCheckedStyle: StyleProp<ViewStyle> = {
    backgroundColor: colors.secondaryContainer.default,
    borderColor: colors.gray.default,
    borderWidth: 2,
  };

  const checkedStyle: StyleProp<ViewStyle> = {
    backgroundColor: colors.victoryPurple.default,
  };

  return (
    <Pressable
      style={{ flexDirection: "row", alignItems: "center", gap: 10 }}
      onPress={() => {
        onChange?.(!checked);
      }}
      role="checkbox"
      aria-checked={checked}
    >
      <View
        style={[
          checked ? checkedStyle : unCheckedStyle,
          {
            width: 24,
            height: 24,
            borderRadius: 5,
            alignItems: "center",
            justifyContent: "center",
          },
        ]}
      >
        {checked && (
          <Icon name="check" color={colors.background.default} size={20} />
        )}
      </View>

      <LabelSmall color={colors.body.default}>{label}</LabelSmall>
    </Pressable>
  );
};
