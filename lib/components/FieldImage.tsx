import { AllianceColor } from "../models/AllianceColor";
import { Image, useWindowDimensions } from "react-native";

export const fieldWidth = 747;
export const fieldHeight = 334;

export const FieldImage = (props: {color: AllianceColor}) => {
    const red = require("../../assets/field_red.png")
    const blue = require("../../assets/field_blue.png")
    const color = props.color === AllianceColor.Red ? red : blue

    return (
        <Image
            source={color}
            style={{
                flex: 1,
                width: null,
                height: null,
                resizeMode: "contain",
                transform: [
                    {"rotateZ": color === red ? "180deg" : "0deg"}
                ]
            }}
        />
    )
}