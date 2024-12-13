import React from "react";
import { reportStateAtom } from "./reportStateAtom";
import { useAtomValue } from "jotai";
import {
  FieldOrientation,
  fieldOrientationAtom,
} from "../models/FieldOrientation";
import { AllianceColor } from "../models/AllianceColor";

export function useFieldRelativeDimensions<T>(dimensions: [T, T, T, T]) {
  const reportState = useAtomValue(reportStateAtom);
  const fieldOrientation = useAtomValue(fieldOrientationAtom);
  const allianceColor = reportState?.meta.allianceColor;

  const [top, right, bottom, left] = dimensions;

  const topValue = React.useMemo(() => {
    if (fieldOrientation === FieldOrientation.Auspicious) {
      return top;
    } else {
      return bottom;
    }
  }, [fieldOrientation, top, bottom]);

  const bottomValue = React.useMemo(() => {
    if (fieldOrientation === FieldOrientation.Auspicious) {
      return bottom;
    } else {
      return top;
    }
  }, [fieldOrientation, top, bottom]);

  const leftValue = React.useMemo(() => {
    if (fieldOrientation === FieldOrientation.Auspicious) {
      return allianceColor === AllianceColor.Blue ? left : right;
    } else {
      return allianceColor === AllianceColor.Blue ? right : left;
    }
  }, [fieldOrientation, allianceColor, left, right]);

  const rightValue = React.useMemo(() => {
    if (fieldOrientation === FieldOrientation.Auspicious) {
      return allianceColor === AllianceColor.Blue ? right : left;
    } else {
      return allianceColor === AllianceColor.Blue ? left : right;
    }
  }, [fieldOrientation, allianceColor, left, right]);

  return [topValue, rightValue, bottomValue, leftValue] as const;
}
