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
                fontFamily: {
                    24: "MaterialSymbols_500Rounded",
                    40: "MaterialSymbols_500Rounded40px",
                    48: "MaterialSymbols_500Rounded48px",
                }[size] ?? "MaterialSymbols_500Rounded",
                fontSize: size,
                color,
            }}
        >
            {name}
        </Text>
    );
}


