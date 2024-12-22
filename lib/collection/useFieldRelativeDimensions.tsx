import React from "react";
import {
  FieldOrientation,
  useFieldOrientationStore,
} from "../models/FieldOrientation";
import { AllianceColor } from "../models/AllianceColor";
import { useReportStateStore } from "./reportStateStore";

export function useFieldRelativeDimensions<T>(dimensions: [T, T, T, T]) {
  const reportState = useReportStateStore((state) => state);
  const fieldOrientation = useFieldOrientationStore((state) => state.value);

  if (!reportState.meta) return [null, null, null, null];

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
