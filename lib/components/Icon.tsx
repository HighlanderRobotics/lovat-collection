import React from "react";
import { Text } from "react-native";

type IconProps = {
    name: string;
    color?: string;
}

export const Icon: React.FC<IconProps> = ({ name, color }) => {
    return (
        <Text
            style={{
                fontFamily: "MaterialSymbols_500Rounded",
                fontSize: 24,
                color,
            }}
        >
            {name}
        </Text>
    );
}


