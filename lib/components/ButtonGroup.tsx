import { TouchableOpacity, View } from "react-native";
import { colors } from "../colors";
import { Key } from "react";
import Button from "./Button";
import * as Haptics from 'expo-haptics';
import BodyMedium from "./text/BodyMedium";
import LabelSmall from "./text/LabelSmall";

export type UnkeyedButtonGroupButton<T> = {
    label: string;
    value: T;
    key?: undefined;
}

type KeyedButtonGroupButton<T> = UnkeyedButtonGroupButton<T> & { key: Key }

type ButtonGroupButton<T> = (T extends Key ? UnkeyedButtonGroupButton<T> : KeyedButtonGroupButton<T>) | KeyedButtonGroupButton<T>;

type ButtonGroupProps<T> = {
    buttons: ButtonGroupButton<T>[];
    selected: T;
    direction?: ButtonGroupDirection;
    onChange: (value: T) => void;
}

export enum ButtonGroupDirection {
    Horizontal = 'horizontal',
    Vertical = 'vertical',
}

export function ButtonGroup<T = string>(props: ButtonGroupProps<T>) {
    const { buttons, selected, onChange, direction = ButtonGroupDirection.Horizontal } = props;

    return (
        <View style={{
            flexDirection: direction === ButtonGroupDirection.Horizontal ? 'row' : 'column',
            gap: 2,
            backgroundColor: colors.background.default,
            borderRadius: 7,
            overflow: 'hidden',
        }}>
            {buttons.map((button) => {
                const isSelected = button.value === selected;

                return (
                    <TouchableOpacity
                        key={button.key ?? button.value}
                        style={{
                            flex: 1,
                            borderRadius: 0,
                            backgroundColor: isSelected ? colors.victoryPurple.default : colors.secondaryContainer.default,
                        }}
                        onPress={() => {
                            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
                            onChange(button.value)
                        }}
                    >
                        <View style={{paddingHorizontal: 10, paddingVertical: 10, alignItems: "center"}}>
                            <LabelSmall color={isSelected ? colors.background.default : colors.onBackground.default}>
                                {button.label}
                            </LabelSmall>
                        </View>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
}