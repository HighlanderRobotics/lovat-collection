import { View } from "react-native";
import { colors } from "../../colors";
import { useEffect, useState } from "react";
import { ScoutReport } from "../ScoutReport";
import QRCode from 'qrcode';
import { SvgXml } from "react-native-svg";


export const ScoutReportCode = ({ scoutReport }: { scoutReport: ScoutReport; }) => {
    const [svgXml, setSvgXml] = useState<string | null>(null);

    useEffect(() => {
        QRCode
            .toString(JSON.stringify(scoutReport), {
                type: 'svg',
                color: {
                    dark: colors.onBackground.default,
                    light: "#00000000",
                },
                margin: 0,
            })
            .then(setSvgXml);
    }, [scoutReport]);

    return (
        <View style={{
            aspectRatio: 1,
            borderRadius: 6,
            overflow: 'hidden',
        }}>
            {svgXml && <SvgXml xml={svgXml} />}
        </View>
    );
};
