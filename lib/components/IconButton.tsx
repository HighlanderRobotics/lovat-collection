import React from "react";
import { Pressable } from "react-native";
import { Icon } from "./Icon";

type IconButtonProps = {
    icon: string;
    label: string;
    color?: string;
    onPress?: () => void;
};

export const IconButton: React.FC<IconButtonProps> = ({ icon, label, color, onPress }) => {
    return (
        <Pressable
            onPress={onPress}
            accessibilityLabel={label}
        >
            <Icon name={icon} color={color} />
        </Pressable>
    );
};
