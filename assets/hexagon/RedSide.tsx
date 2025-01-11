import * as React from "react";
import { View } from "react-native";
import Svg, { SvgProps, Path } from "react-native-svg";
import { useReportStateStore } from "../../lib/collection/reportStateStore";
import { AllianceColor } from "../../lib/models/AllianceColor";
import {
  useFieldOrientationStore,
  FieldOrientation,
} from "../../lib/storage/userStores";
const HexagonRed = (props: SvgProps) => (
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
        marginTop: 'auto',
        marginBottom: 'auto',
        transform: [
          {
            scaleX:
              useReportStateStore.getState().meta!.allianceColor ===
                AllianceColor.Blue
                ? -1
                : 1,
          },
          {
            rotate:
              useFieldOrientationStore.getState().value ===
                FieldOrientation.Auspicious
                ? "0deg"
                : "270deg",
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
          d="M81.835 50.02 11 90.918C6.333 93.611.5 90.243.5 84.855V.5h77.835a7 7 0 0 1 7 7v36.459a7 7 0 0 1-3.5 6.062Z"
        />
      </Svg>
    </View>
  </View>
);
export default HexagonRed;
