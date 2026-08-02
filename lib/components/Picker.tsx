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
  /**
   * inset-picker only: when false, drops the filled row containers and their
   * horizontal padding, rendering bare selection rows. Useful when options
   * have no descriptions and the filled container feels too heavy.
   */
  contained?: boolean;
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
    contained = true,
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
          borderRadius: contained ? 7 : 0,
          overflow: "hidden",
        }}
      >
        {options.map((option, i) => {
          // Options without a description render as a single compact,
          // vertically-centered row so the label lines up with the indicator.
          const compact = !option.description;
          return (
            <Button
              key={option.key ?? option.value}
              backgroundColorSet={
                contained
                  ? {
                      default: colors.secondaryContainer.default,
                      hover: colors.gray.default,
                      faded: colors.secondaryContainer.default,
                    }
                  : {
                      default: "transparent",
                      hover: colors.secondaryContainer.default,
                      faded: "transparent",
                    }
              }
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
                paddingHorizontal: contained ? 14 : 0,
                // Uncontained: uniform 5px top/bottom puts a 10px gap between
                // the 24px selection indicators. No leading/trailing overrides
                // are needed without a container to hug.
                paddingTop: contained ? (i === 0 ? 14 : compact ? 6 : 8) : 5,
                paddingBottom: contained
                  ? i === options.length - 1
                    ? 14
                    : compact
                      ? 6
                      : 8
                  : 5,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  gap: 12,
                  alignItems: compact ? "center" : "flex-start",
                }}
              >
                <SelectionIndicator
                  type={multiSelect ? "checkbox" : "radio"}
                  selected={isSelected(option.value)}
                  disabled={option.disabled}
                />
                <View style={{ flex: 1 }}>
                  <LabelSmall
                    color={
                      option.disabled
                        ? colors.gray.hover
                        : colors.onBackground.default
                    }
                  >
                    {option.label}
                  </LabelSmall>
                  {option.description ? (
                    <BodyMedium
                      style={{
                        color: option.disabled
                          ? colors.gray.hover
                          : colors.body.default,
                      }}
                    >
                      {option.description}
                    </BodyMedium>
                  ) : null}
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
