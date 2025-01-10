import * as React from "react";
import Svg, { SvgProps, Path } from "react-native-svg";
const HexagonBlue = (props: SvgProps) => (
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
);
export default HexagonBlue;
