import { useMemo } from 'react';
import { useAtom } from 'jotai';
import { reportStateAtom } from '../reportStateAtom';
import { View } from 'react-native';
import { AllianceColor } from '../../models/AllianceColor';
import { FieldOrientation, fieldOrientationAtom } from '../../models/FieldOrientation';


export const FieldElement = (props: {
    children: React.ReactNode;
    edgeInsets: [number, number, number, number];
    respectAlliance?: boolean;
}) => {
    const {
        edgeInsets, respectAlliance = false,
    } = {...props, respectAlliance: false};

    const [fieldOrientation] = useAtom(fieldOrientationAtom);
    const [reportState] = useAtom(reportStateAtom);
    const allianceColor = reportState?.meta.allianceColor;

    const [givenTop, givenRight, givenBottom, givenLeft] = edgeInsets;

    // const top = useMemo(() => {
    //     if (fieldOrientation === FieldOrientation.Auspicious) {
    //         return givenTop;
    //     } else {
    //         return givenBottom;
    //     }
    // }, [respectAlliance, fieldOrientation, givenTop, givenBottom]);

    // const bottom = useMemo(() => {
    //     if (fieldOrientation === FieldOrientation.Auspicious) {
    //         return givenBottom;
    //     } else {
    //         return givenTop;
    //     }
    // }, [respectAlliance, fieldOrientation, givenTop, givenBottom]);

    // const left = useMemo(() => {
    //     if (fieldOrientation === FieldOrientation.Auspicious) {
    //         return respectAlliance ? (allianceColor === AllianceColor.Blue ? givenLeft : givenRight) : givenLeft;
    //     } else {
    //         return respectAlliance ? (allianceColor === AllianceColor.Blue ? givenRight : givenLeft) : givenRight;
    //     }
    // }, [respectAlliance, fieldOrientation, givenLeft, givenRight]);

    // const right = useMemo(() => {
    //     if (fieldOrientation === FieldOrientation.Auspicious) {
    //         return respectAlliance ? (allianceColor === AllianceColor.Blue ? givenRight : givenLeft) : givenRight;
    //     } else {
    //         return respectAlliance ? (allianceColor === AllianceColor.Blue ? givenLeft : givenRight) : givenLeft;
    //     }
    // }, [respectAlliance, fieldOrientation, givenLeft, givenRight]);

    const [top, bottom, right, left] = [
        givenTop,
        givenBottom,
        givenLeft,
        givenRight
    ]

    return (
        <View
            style={{
                position: 'absolute',
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
