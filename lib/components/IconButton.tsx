import React from "react";
import { Pressable, View } from "react-native";
import { Icon } from "./Icon";

type IconButtonProps = {
  icon: string;
  label: string;
  color?: string;
  size?: number;
  disabled?: boolean;
  onPress?: () => void;
  ref?: React.Ref<View>;
};

export const IconButton: React.FC<IconButtonProps> = ({
  icon,
  label,
  color,
  size,
  disabled,
  onPress,
  ref,
}) => {
  return (
    <View style={{ margin: -10 }}>
      <Pressable
        onPress={onPress}
        accessibilityLabel={label}
        disabled={disabled}
        ref={ref}
        style={{ padding: 10 }}
      >
        <View style={{ opacity: disabled ? 0.5 : 1 }}>
          <Icon name={icon} color={color} size={size} />
        </View>
      </Pressable>
    </View>
  );
};
