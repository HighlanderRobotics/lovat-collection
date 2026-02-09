import { Platform, View } from "react-native";
import { colors } from "../colors";
import { Key } from "react";
import Button from "./Button";
import * as Haptics from "expo-haptics";
import BodyMedium from "./text/BodyMedium";
import LabelSmall from "./text/LabelSmall";
import { SelectionIndicator } from "./Checkbox";

type UnkeyedPickerOption<T> = {
  label: string;
  description?: string;
  value: T;
  key?: undefined;
  disabled?: boolean;
};

type KeyedPickerOption<T> = UnkeyedPickerOption<T> & { key: Key };

export type PickerOption<T> =
  | (T extends Key ? UnkeyedPickerOption<T> : KeyedPickerOption<T>)
  | (KeyedPickerOption<T> & { disabled?: boolean });

type PickerProps<T> = {
  options: PickerOption<T>[];
  selected: T | T[];
  onChange: (value: T) => void;
  multiSelect?: boolean;
  style?: PickerStyle;
};

export type PickerStyle =
  | "horizontal-group"
  | "vertical-group"
  | "inset-picker";

export function Picker<T = string>(props: PickerProps<T>) {
  const {
    options,
    selected,
    onChange,
    multiSelect = false,
    style = "horizontal-group",
  } = props;

  const isSelected = (value: T) => {
    if (multiSelect && Array.isArray(selected)) {
      return selected.includes(value);
    }
    return value === selected;
  };

  if (style === "inset-picker") {
    return (
      <View
        style={{
          borderRadius: 7,
          overflow: "hidden",
        }}
      >
        {options.map((option, i) => {
          return (
            <Button
              key={option.key ?? option.value}
              backgroundColorSet={{
                default: colors.secondaryContainer.default,
                hover: colors.gray.default,
                faded: colors.gray.faded,
              }}
              borderRadius={0}
              disabled={option.disabled}
              onPress={() => {
                if (option.disabled) return;
                if (Platform.OS === "ios") {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }
                onChange(option.value);
              }}
              style={{
                paddingHorizontal: 14,
                paddingTop: i === 0 ? 14 : 8,
                paddingBlock: i === options.length - 1 ? 14 : 8,
                opacity: option.disabled ? 0.5 : 1,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  gap: 12,
                }}
              >
                <SelectionIndicator
                  type={multiSelect ? "checkbox" : "radio"}
                  selected={isSelected(option.value)}
                />
                <View style={{ flex: 1 }}>
                  <LabelSmall>{option.label}</LabelSmall>
                  <BodyMedium>{option.description}</BodyMedium>
                </View>
              </View>
            </Button>
          );
        })}
      </View>
    );
  } else if (style === "horizontal-group" || style === "vertical-group") {
    return (
      <View
        style={{
          flexDirection: style === "horizontal-group" ? "row" : "column",
          gap: 2,
          backgroundColor: colors.gray.hover,
          borderRadius: 7,
          overflow: "hidden",
        }}
      >
        {options.map((option) => {
          return (
            <Button
              key={option.key ?? option.value}
              flex={1}
              borderRadius={0}
              variant={isSelected(option.value) ? "primary" : "secondary"}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                onChange(option.value);
              }}
            >
              {option.label}
            </Button>
          );
        })}
      </View>
    );
  }
}
