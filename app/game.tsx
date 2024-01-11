import { lockAsync, getOrientationLockAsync, OrientationLock } from 'expo-screen-orientation';
import { useEffect, useMemo, useState } from 'react';
import { atom, useAtom } from 'jotai';
import { reportStateAtom } from '../lib/collection/reportStateAtom';
import { router } from 'expo-router';
import { TouchableOpacity, View } from 'react-native';
import { colors } from '../lib/colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FieldImage, fieldHeight, fieldWidth } from '../lib/components/FieldImage';
import { Text } from 'react-native';
import LabelSmall from '../lib/components/text/LabelSmall';
import { AllianceColor, getAllianceColorDescription } from '../lib/models/AllianceColor';
import { FieldOrientation, fieldOrientationAtom } from '../lib/models/FieldOrientation';
import { MatchEventPosition } from '../lib/collection/MatchEventPosition';
import { IconButton } from '../lib/components/IconButton';
import * as Haptics from 'expo-haptics';

export default function GamePage() {
    return (
        <LandscapeLock>
            <Game />
        </LandscapeLock>
    )
}

function Game() {
    const [reportState] = useAtom(reportStateAtom);

    useEffect(() => {
        if (!reportState) {
            router.replace("/home");
        }
    }, [reportState]);

    if (!reportState?.startTimestamp) {
        return (
            <GameViewTemplate
                gamePhaseMessage="Pre-match"
                field={<PreMatchActions />}
                startEnabled={reportState?.startPosition !== undefined}
            />
        );
    }

    return (
        <GameViewTemplate
            gamePhaseMessage="Unknown phase"
            field={<></>}
        />
    )
}

const GameViewTemplate = (props: {
    field: React.ReactNode,
    gamePhaseMessage: string,
    startEnabled?: boolean,
}) => {
    const [reportState, setReportState] = useAtom(reportStateAtom);
    const { gamePhaseMessage, field, startEnabled } = props;

    return (
        <>
            <View
                style={{
                    backgroundColor: colors.secondaryContainer.default,
                    height: 59,
                    flexDirection: 'row',
                    alignItems: 'center',
                }}
            >
                <SafeAreaView
                    edges={['top', 'left', 'right']}
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                    }}
                >
                    <View style={{ flex: 1 }} />
                    <View style={{ alignItems: 'flex-end', gap: 2, flex: 1, marginRight: 13 }}>
                        <View
                            style={{
                                backgroundColor: getAllianceColorDescription(reportState?.meta.allianceColor!).backgroundColor,
                                borderRadius: 4,
                                paddingHorizontal: 6,
                                paddingVertical: 2,
                            }}
                        >
                            <Text style={{
                                color: getAllianceColorDescription(reportState?.meta.allianceColor!).foregroundColor,
                                fontFamily: 'Heebo_500Medium',
                                fontSize: 12,
                            }}>{reportState?.meta.teamNumber}</Text>
                        </View>
                        <LabelSmall color={colors.body.default}>
                            {gamePhaseMessage} • <Timer
                                startTime={reportState?.startTimestamp}
                            />
                        </LabelSmall>
                    </View>

                    {!reportState?.startTimestamp && <IconButton
                        label="Start match"
                        icon="play_arrow"
                        color={colors.onBackground.default}
                        size={30}
                        disabled={!startEnabled}
                        onPress={() => {
                            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

                            setReportState({
                                ...reportState!,
                                startTimestamp: new Date(),
                            })
                        }}
                    />}

                    {reportState?.startTimestamp && <IconButton
                        label="End match"
                        icon="stop"
                        color={colors.onBackground.default}
                        size={30}
                    />}
                </SafeAreaView>
            </View>
            <SafeAreaView style={{ flex: 1, alignItems: 'center', position: 'relative' }}>
                <View
                    style={{
                        aspectRatio: fieldWidth / fieldHeight,
                        flex: 1,
                    }}
                >
                    <FieldImage />

                    {field}
                </View>
            </SafeAreaView>
        </>
    )
}


const PreMatchActions = () => {
    const [reportState, setReportState] = useAtom(reportStateAtom);

    return (
        <>
            <FieldElement edgeInsets={[0.07, 0.88, 0.8, 0.005]}>
                <TouchableOpacity
                    style={{
                        height: '100%',
                        width: '100%',
                        backgroundColor: reportState?.startPosition === MatchEventPosition.WingNearAmp ? "rgba(200, 200, 200, 0.5)" : "rgba(200, 200, 200, 0.2)",
                        borderRadius: 7,
                    }}
                    activeOpacity={0.8}
                    onPress={() => {
                        setReportState({
                            ...reportState!,
                            startPosition: MatchEventPosition.WingNearAmp,
                        })
                    }}
                />
            </FieldElement>

            <FieldElement edgeInsets={[0.21, 0.88, 0.54, 0.06]}>
                <TouchableOpacity
                    style={{
                        height: '100%',
                        width: '100%',
                        backgroundColor: reportState?.startPosition === MatchEventPosition.WingFrontOfSpeaker ? "rgba(200, 200, 200, 0.5)" : "rgba(200, 200, 200, 0.2)",
                        borderRadius: 7,
                    }}
                    activeOpacity={0.8}
                    onPress={() => {
                        setReportState({
                            ...reportState!,
                            startPosition: MatchEventPosition.WingFrontOfSpeaker,
                        })
                    }}
                />
            </FieldElement>

            <FieldElement edgeInsets={[0.47, 0.88, 0.35, 0.005]}>
                <TouchableOpacity
                    style={{
                        height: '100%',
                        width: '100%',
                        backgroundColor: reportState?.startPosition === MatchEventPosition.WingCenter ? "rgba(200, 200, 200, 0.5)" : "rgba(200, 200, 200, 0.2)",
                        borderRadius: 7,
                    }}
                    activeOpacity={0.8}
                    onPress={() => {
                        setReportState({
                            ...reportState!,
                            startPosition: MatchEventPosition.WingCenter,
                        })
                    }}
                />
            </FieldElement>

            <FieldElement edgeInsets={[0.66, 0.88, 0.15, 0.005]}>
                <TouchableOpacity
                    style={{
                        height: '100%',
                        width: '100%',
                        backgroundColor: reportState?.startPosition === MatchEventPosition.WingNearSource ? "rgba(200, 200, 200, 0.5)" : "rgba(200, 200, 200, 0.2)",
                        borderRadius: 7,
                    }}
                    activeOpacity={0.8}
                    onPress={() => {
                        setReportState({
                            ...reportState!,
                            startPosition: MatchEventPosition.WingNearSource,
                        })
                    }}
                />
            </FieldElement>
        </>
    )
}

const FieldElement = (props: {
    children: React.ReactNode,
    edgeInsets: [number, number, number, number],
    respectAlliance?: boolean,
}) => {
    const {
        edgeInsets,
        respectAlliance = true,
    } = props;

    const [fieldOrientation] = useAtom(fieldOrientationAtom)
    const [reportState] = useAtom(reportStateAtom);
    const allianceColor = reportState?.meta.allianceColor;

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
            return respectAlliance ? (allianceColor === AllianceColor.Blue ? givenLeft : givenRight) : givenLeft;
        } else {
            return respectAlliance ? (allianceColor === AllianceColor.Blue ? givenRight : givenLeft) : givenRight;
        }
    }, [respectAlliance, fieldOrientation, givenLeft, givenRight]);

    const right = useMemo(() => {
        if (fieldOrientation === FieldOrientation.Auspicious) {
            return respectAlliance ? (allianceColor === AllianceColor.Blue ? givenRight : givenLeft) : givenRight;
        } else {
            return respectAlliance ? (allianceColor === AllianceColor.Blue ? givenLeft : givenRight) : givenLeft;
        }
    }, [respectAlliance, fieldOrientation, givenLeft, givenRight]);

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
    )
};

const Timer = (props: { startTime?: Date }) => {
    const [time, setTime] = useState<number>(0);

    useEffect(() => {
        if (!props.startTime) {
            setTime(0);
        } else {
            const interval = setInterval(() => {
                setTime((new Date().getTime() - (props.startTime?.getTime() ?? 0)) / 1000);
            }, 1000);

            return () => {
                clearInterval(interval);
            }
        }
    }, [props.startTime]);

    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);

    return (
        <Text>{minutes}:{seconds.toString().padStart(2, "0")}</Text>
    );
}

type LockedOrientationProps = {
    children?: React.ReactNode;
}

export function LandscapeLock(props: LockedOrientationProps) {
    useEffect(() => {
        (async () => {
            await lockAsync(OrientationLock.LANDSCAPE);
        })();

        return () => {
            (async () => {
                await lockAsync(OrientationLock.PORTRAIT_UP);
            })();
        }
    }, []);

    return <>{props.children}</>;
}
