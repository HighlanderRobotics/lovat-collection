import React, { useEffect, useRef } from 'react';
import { TouchableOpacity, Text, ViewStyle, TextStyle, Animated } from 'react-native';
import { colors } from '../colors';

type ButtonProps = {
    variant?: 'primary' | 'secondary' | 'danger';
    disabled?: boolean;
    density?: 'comfortable' | 'compact';
    children: React.ReactNode;
    onPress?: () => void;
    flex?: number;
    borderRadius?: number;
};

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);
const AnimatedText = Animated.createAnimatedComponent(Text);

const Button: React.FC<ButtonProps> = ({ variant = 'secondary', disabled = false, density = 'comfortable', children, onPress, flex, borderRadius, }) => {
    let textColor: string = '';
    let padding: number[] = [];
    let radius: number = 0;

    const [pressed, setPressed] = React.useState(false);

    textColor = variant === 'primary' ? colors.background.default : colors.onBackground.default;

    const backgroundColors = {
        primary: colors.victoryPurple,
        secondary: colors.gray,
        danger: colors.danger,
    }[variant];

    const disabledTextColor = {
        primary: colors.background.default,
        secondary: "#5f5f5f",
        danger: "#746767",
    }[variant];

    if (density === 'comfortable') {
        padding = [10, 20];
        radius = 7;
    } else if (density === 'compact') {
        padding = [6, 12];
        radius = 5;
    }

    const colorAnimation = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(colorAnimation, {
            toValue: pressed ? 1 : 0,
            duration: 100,
            useNativeDriver: false,
        }).start();
    }, [ pressed ]);

    useEffect(() => {
        Animated.timing(colorAnimation, {
            toValue: disabled ? 1 : 0,
            duration: 100,
            useNativeDriver: false,
        }).start();
    }, [ disabled ]);

    const backgroundColorInterpolation = colorAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: [backgroundColors.default, disabled ? backgroundColors.faded : backgroundColors.hover],
    });

    const textColorInterpolation = colorAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: [textColor, disabled ? disabledTextColor : textColor],
    });

    const buttonStyle = {
        backgroundColor: backgroundColorInterpolation,
        paddingVertical: padding[0],
        paddingHorizontal: padding[1],
        flex,
        borderRadius: borderRadius ?? radius,
    };

    const textStyle = {
        color: textColorInterpolation,
        fontFamily: 'Heebo_500Medium',
        fontSize: density === 'comfortable' ? 16 : 14,
        fontWeight: "500",
        lineHeight: density === 'comfortable' ? 24 : 21,
    } as const;


    return (
        <AnimatedTouchableOpacity
            style={[buttonStyle, {
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
            }]}
            disabled={disabled}
            onPress={onPress}
            activeOpacity={1}
            onPressIn={() => setPressed(true)}
            onPressOut={() => setPressed(false)}
        >
            <AnimatedText style={textStyle}>{children}</AnimatedText>
        </AnimatedTouchableOpacity>
    );
};

export default Button;
