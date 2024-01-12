import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Icon } from '../../components/Icon';


export const GameAction = ({ onPress, children, icon, color, borderRadius }: {
    onPress: () => void;
    children?: React.ReactNode;
    icon?: string;
    color: string;
    borderRadius?: number;
}) => (
    <TouchableOpacity
        onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            onPress();
        }}
        style={{
            height: "100%",
            width: "100%",
            borderRadius: borderRadius ?? 7,
            position: "relative",
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
        }}
    >
        <View
            style={{
                height: "100%",
                width: "100%",
                backgroundColor: color,
                opacity: 0.3,
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
            }} />
        {icon && <Icon name={icon} color={color} />}
        {children}
    </TouchableOpacity>
);
