import React from "react";
import { Text } from "react-native";

type IconProps = {
    name: string;
    color?: string;
    size?: number;
}

export const Icon: React.FC<IconProps> = ({ name, color, size = 24 }) => {
    return (
        <Text
            style={{
                fontFamily: "MaterialSymbols_500Rounded",
                fontSize: size,
                color,
            }}
        >
            {name}
        </Text>
    );
}


