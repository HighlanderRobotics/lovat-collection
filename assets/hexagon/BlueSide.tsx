import * as React from "react";
import { View } from "react-native";
import Svg, { SvgProps, Path } from "react-native-svg";
import { useReportStateStore } from "../../lib/collection/reportStateStore";
import { AllianceColor } from "../../lib/models/AllianceColor";
import {
  useFieldOrientationStore,
  FieldOrientation,
} from "../../lib/storage/userStores";
const HexagonBlue = (props: SvgProps) => (
  <View
    style={{
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    }}
  >
    <View
      style={{
        aspectRatio: 86 / 92,
        transform: [
          {
            scaleX:
              useReportStateStore.getState().meta!.allianceColor ===
              AllianceColor.Red
                ? -1
                : 1,
          },
          {
            rotate:
              useFieldOrientationStore.getState().value ===
              FieldOrientation.Auspicious
                ? "0deg"
                : "180deg",
          },
        ],
      }}
    >
      <Svg
        width={"100%"}
        height={"100%"}
        viewBox="0 0 86 92"
        fill="none"
        {...props}
      >
        <Path
          fill="#B59AFF"
          fillOpacity={0.3}
          d="M.5 7.145C.5 1.756 6.333-1.61 11 1.083l70.835 40.896a7 7 0 0 1 3.5 6.063V84.5a7 7 0 0 1-7 7H.5V7.145Z"
        />
      </Svg>
    </View>
  </View>
);
export default HexagonBlue;
