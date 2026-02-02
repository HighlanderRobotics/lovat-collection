import { Pressable, StyleProp, View, ViewStyle } from "react-native";
import { colors } from "../colors";
import LabelSmall from "./text/LabelSmall";
import { Icon } from "./Icon";

export const Checkbox = (props: {
  label: string;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
}) => {
  const { label, checked, onChange } = props;

  return (
    <Pressable
      style={{ flexDirection: "row", alignItems: "center", gap: 10 }}
      onPress={() => {
        onChange?.(!checked);
      }}
      role="checkbox"
      aria-checked={checked}
    >
      <SelectionIndicator type="checkbox" selected={checked ?? false} />
      <LabelSmall color={colors.body.default}>{label}</LabelSmall>
    </Pressable>
  );
};

type SelectionIndicatorProps = {
  type: "checkbox" | "radio";
  selected: boolean;
};

export const SelectionIndicator = (props: SelectionIndicatorProps) => {
  const unCheckedStyle: StyleProp<ViewStyle> = {
    backgroundColor: colors.secondaryContainer.default,
    borderColor: colors.gray.default,
    borderWidth: 2,
  };

  const checkedStyle: StyleProp<ViewStyle> = {
    backgroundColor: colors.victoryPurple.default,
  };

  return (
    <View
      style={[
        props.selected ? checkedStyle : unCheckedStyle,
        {
          width: 24,
          height: 24,
          borderRadius: props.type === "checkbox" ? 5 : 12,
          alignItems: "center",
          justifyContent: "center",
        },
      ]}
    >
      {props.selected && props.type === "checkbox" && (
        <Icon name="check" color={colors.background.default} size={20} />
      )}
      {props.selected && props.type === "radio" && (
        <View
          style={{
            height: 8,
            width: 8,
            borderRadius: 4,
            backgroundColor: colors.background.default,
          }}
        />
      )}
    </View>
  );
};
