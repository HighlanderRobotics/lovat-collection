import { useMemo } from "react";
import { useReportStateStore } from "../reportStateStore";
import { View } from "react-native";
import { AllianceColor } from "../../models/AllianceColor";
import {
  FieldOrientation,
  useFieldOrientationStore,
} from "../../storage/userStores";

export const FieldElement = (props: {
  children: React.ReactNode;
  edgeInsets: [number, number, number, number];
  respectAlliance?: boolean;
}) => {
  const { edgeInsets, respectAlliance = true } = props;

  const fieldOrientation = useFieldOrientationStore((state) => state.value);
  const reportState = useReportStateStore();
  const allianceColor = reportState.meta?.allianceColor;

  const [givenTop, givenRight, givenButtom, givenLeft] = edgeInsets;

  const top = useMemo(() => {
    if (fieldOrientation === FieldOrientation.Auspicious) {
      return givenTop;
    } else {
      return givenButtom;
    }
  }, [respectAlliance, fieldOrientation, givenTop, givenButtom]);

  const bottom = useMemo(() => {
    if (fieldOrientation === FieldOrientation.Auspicious) {
      return givenButtom;
    } else {
      return givenTop;
    }
  }, [respectAlliance, fieldOrientation, givenTop, givenButtom]);

  const left = useMemo(() => {
    if (fieldOrientation === FieldOrientation.Auspicious) {
      return respectAlliance
        ? allianceColor === AllianceColor.Blue
          ? givenLeft
          : givenRight
        : givenLeft;
    } else {
      return respectAlliance
        ? allianceColor === AllianceColor.Blue
          ? givenRight
          : givenLeft
        : givenRight;
    }
  }, [respectAlliance, fieldOrientation, givenLeft, givenRight]);

  const right = useMemo(() => {
    if (fieldOrientation === FieldOrientation.Auspicious) {
      return respectAlliance
        ? allianceColor === AllianceColor.Blue
          ? givenRight
          : givenLeft
        : givenRight;
    } else {
      return respectAlliance
        ? allianceColor === AllianceColor.Blue
          ? givenLeft
          : givenRight
        : givenLeft;
    }
  }, [respectAlliance, fieldOrientation, givenLeft, givenRight]);

  return (
    <View
      style={{
        position: "absolute",
        top: `${top * 100}%`,
        right: `${right * 100}%`,
        bottom: `${bottom * 100}%`,
        left: `${left * 100}%`,
      }}
    >
      {props.children}
    </View>
  );
};
