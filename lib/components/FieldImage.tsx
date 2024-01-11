import { useAtom } from "jotai";
import React, { useEffect, useState } from "react";
import { LayoutAnimation, View } from "react-native";
import Svg, { SvgProps, Path, Circle, Rect } from "react-native-svg"
import { FieldOrientation, fieldOrientationAtom } from "../models/FieldOrientation";

export const fieldWidth = 957;
export const fieldHeight = 489;

export const FieldImage = (props: SvgProps) => {
  const [fieldOrientation] = useAtom(fieldOrientationAtom);

  return (
      <Svg
        width="100%"
        height="100%"
        viewBox={[
          0,
          0,
          fieldWidth,
          fieldHeight,
        ].join(" ")}
        fill="none"
        {...props}
        rotation={fieldOrientation === FieldOrientation.Auspicious ? 0 : 180}
      >
        <Path fill="#292929" stroke="#292929" d="M477.5 6.5h3v475h-3z" />
        <Circle cx={479} cy={52} r={6} fill="#424242" />
        <Circle cx={479} cy={148} r={6} fill="#424242" />
        <Circle cx={479} cy={244} r={6} fill="#424242" />
        <Circle cx={479} cy={340} r={6} fill="#424242" />
        <Circle cx={479} cy={436} r={6} fill="#424242" />
        <Circle cx={171} cy={244} r={6} fill="#424242" />
        <Circle cx={171} cy={78} r={6} fill="#424242" />
        <Circle cx={171} cy={161} r={6} fill="#424242" />
        <Path fill="#364077" d="M338 6h4v476h-4z" />
        <Path
          stroke="#364077"
          strokeWidth={5}
          d="M187.252 251.298v-15.929l138.724-80.093 13.796 7.965v160.185l-13.796 7.965-138.724-80.093Z"
        />
        <Path
          fill="#292929"
          d="M310.167 198.589v89.489l-77.5-44.744 77.5-44.745Z"
        />
        <Rect
          width={32}
          height={32}
          x={348.356}
          y={164.531}
          fill="#585858"
          rx={4}
          transform="rotate(120 348.356 164.531)"
        />
        <Rect width={32} height={32} x={183} y={228} fill="#585858" rx={4} />
        <Rect
          width={32}
          height={32}
          x={320.644}
          y={339.469}
          fill="#585858"
          rx={4}
          transform="rotate(-120 320.644 339.469)"
        />
        <Path
          fill="#424242"
          d="m337.062 166.094-12.124-7a1.999 1.999 0 0 0-2.732.732L278.804 235H192a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h86.804l43.402 75.174a1.999 1.999 0 0 0 2.732.732l12.124-7a1.999 1.999 0 0 0 .732-2.732L294.392 244l43.402-75.174a1.999 1.999 0 0 0-.732-2.732Z"
        />
        <Path
          stroke="#292929"
          strokeLinejoin="round"
          strokeWidth={4}
          d="M115 33v447"
        />
        <Path
          stroke="#364077"
          strokeLinejoin="round"
          strokeWidth={4}
          d="M7 33h186V8"
        />
        <Path fill="#292929" d="M58 132 7 155v13l51 23v-59Z" />
        <Path fill="#D9D9D9" d="M7 168v53l51-30-51-23Z" />
        <Path fill="#364077" d="M7 168v53l51-30-51-23Z" />
        <Path fill="#D9D9D9" d="M7 102v53l51-23-51-30Z" />
        <Path fill="#364077" d="M7 102v53l51-23-51-30Z" />
        <Path
          fill="#585858"
          d="M7 127h24a2 2 0 0 1 2 2v65a2 2 0 0 1-2 2H7v-69ZM141 6.5v2a2 2 0 0 1-2 2H82a2 2 0 0 1-2-2v-2h61ZM11 420.402l.952-1.646a2.005 2.005 0 0 1 2.734-.733l25.993 14.98a1.996 1.996 0 0 1 .731 2.73l-.952 1.646L11 420.402ZM42.18 438.404l.952-1.646a2.003 2.003 0 0 1 2.734-.733l25.992 14.979a1.996 1.996 0 0 1 .732 2.73l-.952 1.646-29.459-16.976ZM73.359 456.405l.952-1.646a2.005 2.005 0 0 1 2.734-.733l25.993 14.98a1.996 1.996 0 0 1 .731 2.73l-.952 1.646-29.458-16.977Z"
        />
        <Path
          stroke="#793F3F"
          strokeLinejoin="round"
          strokeWidth={4}
          d="m6 387 105 61v31.5"
        />
        <Circle
          cx={6}
          cy={6}
          r={6}
          fill="#424242"
          transform="matrix(-1 0 0 1 792.001 238)"
        />
        <Circle
          cx={6}
          cy={6}
          r={6}
          fill="#424242"
          transform="matrix(-1 0 0 1 792.001 72)"
        />
        <Circle
          cx={6}
          cy={6}
          r={6}
          fill="#424242"
          transform="matrix(-1 0 0 1 792.001 155)"
        />
        <Path fill="#793F3F" d="M619.003 6h-4v476h4z" />
        <Path
          stroke="#793F3F"
          strokeWidth={5}
          d="M769.749 251.298v-15.929l-138.723-80.093-13.795 7.965v160.185l13.795 7.965 138.723-80.093Z"
        />
        <Path
          fill="#292929"
          d="M646.836 198.589v89.489l77.499-44.744-77.499-44.745Z"
        />
        <Rect
          width={32}
          height={32}
          fill="#585858"
          rx={4}
          transform="matrix(.5 .86603 .86602 -.5 608.647 164.531)"
        />
        <Rect
          width={32}
          height={32}
          fill="#585858"
          rx={4}
          transform="matrix(-1 0 0 1 774.001 228)"
        />
        <Rect
          width={32}
          height={32}
          fill="#585858"
          rx={4}
          transform="matrix(.5 -.86603 -.86602 -.5 636.359 339.469)"
        />
        <Path
          fill="#424242"
          d="m619.941 166.094 12.124-7a1.999 1.999 0 0 1 2.732.732L678.198 235h86.803a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-86.803l-43.401 75.174a1.999 1.999 0 0 1-2.732.732l-12.124-7a1.999 1.999 0 0 1-.732-2.732L662.61 244l-43.401-75.174a1.999 1.999 0 0 1 .732-2.732Z"
        />
        <Path
          stroke="#292929"
          strokeLinejoin="round"
          strokeWidth={4}
          d="M842.001 33v447"
        />
        <Path
          stroke="#793F3F"
          strokeLinejoin="round"
          strokeWidth={4}
          d="M950 33H764.002V8"
        />
        <Path fill="#292929" d="m899 132 51 23v13l-51 23v-59Z" />
        <Path fill="#D9D9D9" d="M950 168v53l-51-30 51-23Z" />
        <Path fill="#793F3F" d="M950 168v53l-51-30 51-23Z" />
        <Path fill="#D9D9D9" d="M950 102v53l-51-23 51-30Z" />
        <Path fill="#793F3F" d="M950 102v53l-51-23 51-30Z" />
        <Path
          fill="#585858"
          d="M950 127h-24a2 2 0 0 0-2 2v65a2 2 0 0 0 2 2h24v-69ZM816.001 6.5v2a2 2 0 0 0 2 2h57a2 2 0 0 0 2-2v-2h-61ZM946 420.402l-.952-1.646a2.004 2.004 0 0 0-2.734-.733l-25.993 14.98a1.996 1.996 0 0 0-.731 2.73l.952 1.646L946 420.402ZM914.821 438.404l-.953-1.646a2.004 2.004 0 0 0-2.734-.733l-25.992 14.98a1.996 1.996 0 0 0-.732 2.73l.952 1.646 29.459-16.977ZM883.641 456.405l-.952-1.646a2.003 2.003 0 0 0-2.734-.732l-25.993 14.979a1.996 1.996 0 0 0-.731 2.73l.952 1.646 29.458-16.977Z"
        />
        <Path
          stroke="#364077"
          strokeLinejoin="round"
          strokeWidth={4}
          d="m951 387-104.999 61v31.5"
        />
        <Path
          stroke="#424242"
          strokeLinejoin="round"
          strokeWidth={4}
          d="M5 6v411.5L117 482h723l112-64.5V6H5Z"
        />
      </Svg>
  );
}
