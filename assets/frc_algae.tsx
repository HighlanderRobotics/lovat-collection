import * as React from "react";
import Svg, { SvgProps, Mask, Rect, G, Path } from "react-native-svg";
const FrcAlgae = (props: SvgProps) => (
  <Svg width={40} height={40} viewBox="0 0 40 40" fill="none" {...props}>
    <Mask
      id="mask0_4017_456"
      maskUnits="userSpaceOnUse"
      x={0}
      y={0}
      width={40}
      height={40}
    >
      <Rect width={40} height={40} fill="#D9D9D9" />
    </Mask>
    <G mask="url(#mask0_4017_456)">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M20 32C26.6274 32 32 26.6274 32 20C32 13.3726 26.6274 8 20 8C13.3726 8 8 13.3726 8 20C8 26.6274 13.3726 32 20 32ZM20 35C28.2843 35 35 28.2843 35 20C35 11.7157 28.2843 5 20 5C11.7157 5 5 11.7157 5 20C5 28.2843 11.7157 35 20 35Z"
        fill={props.color}
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M19.9793 10.8762C20.1164 11.6932 19.5652 12.4666 18.7482 12.6037C15.7512 13.1065 13.3529 15.3923 12.6858 18.3319C12.5025 19.1398 11.699 19.6461 10.8911 19.4628C10.0832 19.2794 9.57689 18.4759 9.76021 17.668C10.6951 13.5481 14.0479 10.3503 18.2518 9.64506C19.0688 9.508 19.8423 10.0592 19.9793 10.8762Z"
        fill={props.color}
      />
    </G>
  </Svg>
);
export default FrcAlgae;
