import { Text, View } from "react-native";
import { colors } from "../../colors";
import { useEffect, useState } from "react";
import { ScoutReport } from "../ScoutReport";
import QRCode from 'qrcode';
import { SvgXml } from "react-native-svg";
import SwiperFlatList from "react-native-swiper-flatlist";

const maxCodeLength = 1000;

type ReportChunk = {
    index: number;
    total: number;
    data: string;
    uuid: string;
}

function splitScoutReportIntoCodes(scoutReport: ScoutReport): ReportChunk[] {
    const json = JSON.stringify(scoutReport);
    const chunks: ReportChunk[] = [];

    for (let i = 0; i < json.length; i += maxCodeLength) {
        chunks.push({
            index: i,
            total: Math.ceil(json.length / maxCodeLength),
            data: json.slice(i, i + maxCodeLength),
            uuid: scoutReport.uuid,
        });
    }

    return chunks;
}

export const ResizableQRCode = ({ chunk }: { chunk: ScoutReport; }) => {
    const [svgXml, setSvgXml] = useState<string | null>(null);

    useEffect(() => {
        QRCode
            .toString(`https://lovat.app/c?d=${JSON.stringify(chunk)}`, {
                type: 'svg',
                color: {
                    dark: colors.onBackground.default,
                    light: "#00000000",
                },
                margin: 0,
            })
            .then(setSvgXml);
    }, [chunk]);

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

export const ScoutReportCode = ({ scoutReport }: { scoutReport: ScoutReport; }) => {
    const chunks = splitScoutReportIntoCodes(scoutReport);
    const showPagination = chunks.length > 1;

    return (
        <>
            <View
                style={{
                    aspectRatio: 1,
                }}
            >
                <SwiperFlatList
                    data={chunks}
                    horizontal
                    showPagination={showPagination}
                    paginationActiveColor={colors.onBackground.default}
                    paginationDefaultColor={colors.gray.default}
                    paginationStyleItem={{
                        width: 8,
                        height: 8,
                        borderRadius: 4,
                        marginHorizontal: 4,
                        transform: [{ translateY: 24 }]
                    }}
                    renderItem={({ item }) => (
                        <View
                            style={{
                                padding: 16,
                                aspectRatio: 1,
                            }}
                        >
                            <ResizableQRCode chunk={item} />
                        </View>
                    )} />
            </View>
            <View style={{ height: showPagination ? 24 : 0 }} />
        </>
    );
};

const BubbleIndicator = ({ index, currentIndex }: { index: number; currentIndex: number; }) => {
    return (
        <View
            style={{
                width: 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: index === currentIndex ? colors.victoryPurple.default : colors.gray.default,
            }}
        />
    );
}
