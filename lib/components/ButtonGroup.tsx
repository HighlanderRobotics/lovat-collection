import { Pressable, View } from "react-native";
import { colors } from "../colors";
import BodyMedium from "./text/BodyMedium";
import { Key } from "react";
import Button from "./Button";

type UnkeyedButtonGroupButton<T> = {
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
            backgroundColor: colors.gray.hover,
            borderRadius: 7,
            overflow: 'hidden',
        }}>
            {buttons.map((button) => {
                const isSelected = button.value === selected;

                return (
                    <Button
                        key={button.key ?? button.value}
                        flex={1}
                        borderRadius={0}
                        variant={isSelected ? 'primary' : 'secondary'}
                        onPress={() => onChange(button.value)}
                    >
                        {button.label}
                    </Button>
                );
            })}
        </View>
    );
}