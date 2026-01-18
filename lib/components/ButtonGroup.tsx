import { View } from "react-native";
import { colors } from "../colors";
import { Key } from "react";
import Button from "./Button";
import * as Haptics from "expo-haptics";

type UnkeyedButtonGroupButton<T> = {
  label: string;
  value: T;
  key?: undefined;
};

type KeyedButtonGroupButton<T> = UnkeyedButtonGroupButton<T> & { key: Key };

export type ButtonGroupButton<T> =
  | (T extends Key ? UnkeyedButtonGroupButton<T> : KeyedButtonGroupButton<T>)
  | KeyedButtonGroupButton<T>;

type ButtonGroupProps<T> = {
  buttons: ButtonGroupButton<T>[];
  selected: T | T[];
  direction?: ButtonGroupDirection;
  onChange: (value: T) => void;
  multiSelect?: boolean;
};

export enum ButtonGroupDirection {
  Horizontal = "horizontal",
  Vertical = "vertical",
}

export function ButtonGroup<T = string>(props: ButtonGroupProps<T>) {
  const {
    buttons,
    selected,
    onChange,
    direction = ButtonGroupDirection.Horizontal,
    multiSelect = false,
  } = props;

  const isSelected = (value: T) => {
    if (multiSelect && Array.isArray(selected)) {
      return selected.includes(value);
    }
    return value === selected;
  };

  return (
    <View
      style={{
        flexDirection:
          direction === ButtonGroupDirection.Horizontal ? "row" : "column",
        gap: 2,
        backgroundColor: colors.gray.hover,
        borderRadius: 7,
        overflow: "hidden",
      }}
    >
      {buttons.map((button) => {
        return (
          <Button
            key={button.key ?? button.value}
            flex={1}
            borderRadius={0}
            variant={isSelected(button.value) ? "primary" : "secondary"}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              onChange(button.value);
            }}
          >
            {button.label}
          </Button>
        );
      })}
    </View>
  );
}
