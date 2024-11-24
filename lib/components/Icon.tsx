import React from "react";
import { Text } from "react-native";
import Svg, { Path, SvgXml } from "react-native-svg";

type IconProps = {
    name: string;
    color?: string;
    size?: number;
}

export const Icon: React.FC<IconProps> = ({ name, color, size = 24 }) => {
    if (name === "frc_cube") {
        return (
            <Svg
                style={{
                    position: "relative"
                }}
                width={`${size}px`}
                height={`${size}px`}
            >
                <Path
                    d="M20 7L12 11M20 7C20 7 20.5 10 20.5 12C20.5 14 20 17 20 17C20 17 18.8407 17.9828 17 19C15.7676 19.6811 12 21 12 21M20 7C20 7 18.5621 5.78105 17 5C15.4379 4.21895 12 3 12 3C12 3 8.23239 4.31894 7 5C5.15933 6.01721 4 7 4 7M12 21V11M12 21C12 21 8.23239 19.6811 7 19C5.15933 17.9828 4 17 4 17C4 17 3.5 14 3.5 12C3.5 10 4 7 4 7M4 7L12 11"
                    stroke={color}
                    fill={"none"}
                    strokeWidth={2}
                    scale={size/24}
                />
            </Svg>
        )
    }
    else if (name === "frc_cone") {
        return (
            <Svg
                style={{
                    position: "relative"
                }}
                width={`${size}px`}
                height={`${size}px`}
            >
                <Path d="M2 21H22" stroke={color} strokeWidth="2" fill={"none"}/>
                <Path d="M18 21L14 3H10L6 21" stroke={color} strokeWidth="2" fill={"none"}/>
                <Path d="M9 9H15" stroke={color} strokeWidth="2" fill={"none"}/>
                <Path d="M8 12H16" stroke={color} strokeWidth="2" fill={"none"}/>
            </Svg>
        )
    }
    else {
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
}


