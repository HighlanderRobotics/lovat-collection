import { Pressable, StyleProp, View, ViewStyle } from "react-native";
import { colors } from "../colors";
import LabelSmall from "./text/LabelSmall";

export const RadioButton = (props: {
  label: string;
  textColor?: string;
  checkColor?: string;
  size?: number;
  bgColor?: string;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
}) => {
  const { label, checked, onChange } = props;
  const unCheckedStyle: StyleProp<ViewStyle> = {
    backgroundColor: colors.secondaryContainer.default,
    borderColor: colors.gray.default,
    borderWidth: 2,
  };

  const checkedStyle: StyleProp<ViewStyle> = {
    backgroundColor: props.bgColor
      ? props.bgColor
      : colors.victoryPurple.default,
  };

  const size = props.size !== undefined ? props.size : 24;

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
            width: size,
            height: size,
            borderRadius: 50,
            alignItems: "center",
            justifyContent: "center",
          },
        ]}
      >
        {checked && (
          <View
            style={{
              backgroundColor: colors.background.default,
              borderRadius: 50,
              width: size - size * 0.6,
              height: size - size * 0.6,
            }}
          ></View>
        )}
      </View>

      <LabelSmall
        color={props.textColor ? props.textColor : colors.body.default}
      >
        {label}
      </LabelSmall>
    </Pressable>
  );
};
