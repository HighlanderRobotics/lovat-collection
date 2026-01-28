import * as React from "react";
import { View } from "react-native";
import Svg, { SvgProps, Path } from "react-native-svg";

const width = 108;
const height = 93;
const Hub = (props: SvgProps) => (
  <View
    style={{
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    }}
  >
    <Svg
      width={"100%"}
      height={"100%"}
      fill="none"
      viewBox={[0, 0, width, height].join(" ")}
      {...props}
    >
      <Path
        fill="#9CFF9A"
        fillOpacity={0.3}
        d="M75.876 0a7 7 0 0 1 6.053 3.485l22.936 39.5a7 7 0 0 1 0 7.03l-22.936 39.5A7 7 0 0 1 75.876 93h-45.94a7 7 0 0 1-6.054-3.485L.946 50.015a7 7 0 0 1 0-7.03l22.936-39.5A7 7 0 0 1 29.935 0h45.94Z"
      />
    </Svg>
  </View>
);
export default Hub;
