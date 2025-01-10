import * as React from "react";
import Svg, { SvgProps, Path } from "react-native-svg";
const HexagonRed = (props: SvgProps) => (
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
);
export default HexagonRed;
