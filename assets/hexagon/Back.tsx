import * as React from "react";
import Svg, { SvgProps, Path } from "react-native-svg";
const HexagonBack = (props: SvgProps) => (
  <Svg
    width={"100%"}
    height={"100%"}
    viewBox="0 0 86 190"
    fill="none"
    {...props}
  >
    <Path
      fill="#B59AFF"
      fillOpacity={0.3}
      d="M85.5 182.855c0 5.389-5.833 8.756-10.5 6.062L4.165 148.021a7.001 7.001 0 0 1-3.5-6.062V48.041a7 7 0 0 1 3.5-6.062L75 1.083c4.667-2.694 10.5.673 10.5 6.062v175.71Z"
    />
  </Svg>
);
export default HexagonBack;
