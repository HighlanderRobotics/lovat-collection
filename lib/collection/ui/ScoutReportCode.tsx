import {
  View,
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  LayoutChangeEvent,
} from "react-native";
import { colors } from "../../colors";
import { useCallback, useEffect, useRef, useState } from "react";
import { ScoutReport } from "../ScoutReport";
import QRCode from "qrcode";
import { SvgXml } from "react-native-svg";
import { useQrCodeSizeStore } from "../../storage/userStores";
import React from "react";

type ReportChunk = {
  index: number;
  total: number;
  data: string;
  uuid: string;
};

function splitScoutReportIntoCodes(
  scoutReport: ScoutReport,
  maxCodeLength: number,
): ReportChunk[] {
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

export const ResizableQRCode = ({ chunk }: { chunk: ReportChunk }) => {
  const [svgXml, setSvgXml] = useState<string | null>(null);

  useEffect(() => {
    QRCode.toString(`https://lovat.app/c?d=${JSON.stringify(chunk)}`, {
      type: "svg",
      color: {
        dark: colors.onBackground.default,
        light: "#00000000",
      },
      margin: 0,
    }).then(setSvgXml);
  }, [chunk]);

  return (
    <View
      style={{
        aspectRatio: 1,
        borderRadius: 6,
        overflow: "hidden",
      }}
    >
      {svgXml && <SvgXml xml={svgXml} />}
    </View>
  );
};

const PaginationDot = ({ active }: { active: boolean }) => (
  <View
    style={{
      width: 8,
      height: 8,
      borderRadius: 4,
      marginHorizontal: 4,
      backgroundColor: active
        ? colors.onBackground.default
        : colors.gray.default,
    }}
  />
);

export const ScoutReportCode = ({
  scoutReport,
}: {
  scoutReport: ScoutReport;
}) => {
  const maxCodeLength = useQrCodeSizeStore((state) => state.value);
  const [width, setWidth] = useState<number | null>(null);

  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList<ReportChunk>>(null);

  const chunks = splitScoutReportIntoCodes(scoutReport, maxCodeLength);
  const showPagination = chunks.length > 1;

  const handleLayout = (event: LayoutChangeEvent) => {
    setWidth(event.nativeEvent.layout.width);
  };

  const onScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      if (width === null) return false;

      const offsetX = event.nativeEvent.contentOffset.x;
      const index = Math.round(offsetX / width);
      setActiveIndex(index);
    },
    [width],
  );

  const renderItem = useCallback(
    ({ item }: { item: ReportChunk }) => (
      <View
        onLayout={handleLayout}
        style={{
          width,
          padding: 16,
          aspectRatio: 1,
        }}
      >
        <ResizableQRCode chunk={item} />
      </View>
    ),
    [width],
  );

  return (
    <>
      <View
        style={{
          aspectRatio: 1,
        }}
      >
        <FlatList
          ref={flatListRef}
          data={chunks}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={onScroll}
          scrollEventThrottle={16}
          renderItem={renderItem}
          keyExtractor={(_, index) => index.toString()}
        />
      </View>
      {showPagination && (
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            paddingTop: 8,
            height: 24,
          }}
        >
          {chunks.map((_, index) => (
            <PaginationDot key={index} active={index === activeIndex} />
          ))}
        </View>
      )}
      {!showPagination && <View style={{ height: 0 }} />}
    </>
  );
};
