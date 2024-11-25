import React, { useEffect, useMemo, useState } from "react";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import {
  gamePhaseAtom,
  hasPiece,
  reportStateAtom,
  useAddEvent,
  useUndoEvent,
} from "../reportStateAtom";
import { router } from "expo-router";
import { PreMatchActions } from "./actions/PreMatchActions";
import { GameViewTemplate } from "./GameViewTemplate";
import { GamePhase, GamePiece } from "../ReportState";
import { Checkbox } from "../../components/Checkbox";
import { MatchEventType } from "../MatchEventType";
import { HasPieceActions } from "./actions/HasPieceActions";
import { ExitWingAction } from "./actions/ExitWingAction";
import * as Haptics from "expo-haptics";
import { AutoCollectPieceActions } from "./actions/AutoCollectPieceActions";
import { TouchableOpacity, View, Text } from "react-native";
import { colors } from "../../colors";
import { Icon } from "../../components/Icon";
import { AllianceColor, getAllianceColorDescription } from "../../models/AllianceColor";
import { GameAction } from "./GameAction";
import {
  FieldOrientation,
  fieldOrientationAtom,
} from "../../models/FieldOrientation";
import LabelSmall from "../../components/text/LabelSmall";
import { IconButton } from "../../components/IconButton";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import { GameTimer } from "./GameTimer";
import * as DropdownMenu from 'zeego/dropdown-menu'
import { fieldHeight, FieldImage, fieldWidth } from "../../components/FieldImage";
import { MatchEventPosition } from "../MatchEventPosition";
import TitleMedium from "../../components/text/TitleMedium";

type MatchStateType = {
  field: React.ReactNode,
  gamePhaseMessage: string,
  topLeftReplacement?: React.ReactNode,
  startEnabled?: boolean,
}

export enum FieldOverlay {
    None,
    Score,
    Charge,
}

export function Game() {
    const [reportState, setReportState] = useAtom(reportStateAtom);
    const addEvent = useAddEvent(); 
    const undoEvent = useUndoEvent();
    
    const setPhase = useSetAtom(gamePhaseAtom);
    const [overlay, setOverlay] = useState<[FieldOverlay, 1 | 2 | 3 | null]>([FieldOverlay.None, null]) 

    useEffect(() => {
    if (!reportState) {
        router.replace("/home");
    }
    }, [reportState]);

    
    const matchStates: Record<string, MatchStateType> = {
        preMatch: {
            field: <PreMatchActions />, 
            gamePhaseMessage: "Pre-match", 
            startEnabled: reportState?.startPosition !== undefined,
            topLeftReplacement: <View
                style={{
                    flexDirection: "row",
                    gap: 5,
                    alignItems: "center",
                }}
            >
                <LabelSmall>
                    Piece Loaded? 
                </LabelSmall>
                <View
                    style={{
                        padding: 5,
                        backgroundColor: reportState?.startPiece === GamePiece.Cube ? colors.victoryPurple.default+"4d" : '#00000000',
                        borderRadius: 50,
                    }}
                >
                    <IconButton
                        icon={"frc_cube"}
                        label="Starts with cube?"
                        color={colors.victoryPurple.default}
                        size={24}
                        onPress={() => {
                            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
                            const piece = reportState!.startPiece === GamePiece.Cube ? GamePiece.None : GamePiece.Cube
                            setReportState({
                                ...reportState!,
                                startPiece: piece
                            })
                        }}
                    />
                </View>
                <View
                    style={{
                        padding: 5,
                        backgroundColor: reportState?.startPiece === GamePiece.Cone ? colors.yellow.default+"4d" : '#00000000',
                        borderRadius: 50,
                    }}
                >
                    <IconButton
                        icon={"frc_cone"}
                        label="Starts with cone?"
                        color={colors.yellow.default}
                        size={24}
                        onPress={() => {
                            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
                            const piece = reportState!.startPiece === GamePiece.Cone ? GamePiece.None : GamePiece.Cone
                            setReportState({
                                ...reportState!,
                                startPiece: piece
                            })
                        }}
                    />
                </View>
            </View>
        },
        AutoExitedNote: {
            field: <HasPieceActions auto={true} setOverlay={setOverlay} />, 
            gamePhaseMessage: "Autonomous"
        },
        AutoNotExitedNote: {
            field: <>
                <HasPieceActions auto={true} setOverlay={setOverlay} /> 
                <ExitWingAction />
            </>,
            gamePhaseMessage: "Autonomous"
        },
        AutoExitedNoNote: {
            field: <AutoCollectPieceActions />, 
            gamePhaseMessage: "Autonomous"
        },
        AutoNotExitedNoNote: {
            field: <ExitWingAction/>,
            gamePhaseMessage: "Autonomous"
        },
        TeleopNote: {
            field: <>
                <FloatingActions feedEnabled />,
                <HasPieceActions auto={false} setOverlay={setOverlay} />
            </>,
            gamePhaseMessage: "Teleop"
        },
        TeleopNoNote: {
            field: <FloatingActions pickupEnabled />, 
            gamePhaseMessage: "Teleop"
        },
        UnknownPhase: {
            field: <></>, 
            gamePhaseMessage: "Problem finding phase"
        }
    }
    // const [gameViewParams, setGameViewParams] = useState<MatchStateType>(matchStates.preMatch)
    const [autoTimeout, setAutoTimeout] = useState<NodeJS.Timeout | null>(null);
    const [amplificationTimeout, setAmplificationTimeout] =
    useState<NodeJS.Timeout | null>(null);
    
    useEffect(() => {
        if (
            reportState?.gamePhase === GamePhase.Auto &&
            reportState.startTimestamp &&
            !autoTimeout
        ) {
            setAutoTimeout(
                setTimeout(() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setPhase(GamePhase.Teleop);
                }, 18 * 1000),
            );

            return () => {
                if (autoTimeout) {
                    clearTimeout(autoTimeout);
                }
            };
        } else {
            if (autoTimeout) {
                clearTimeout(autoTimeout);
            }
            setAutoTimeout(null);
        }
    }, [reportState?.gamePhase, reportState?.startTimestamp]);

    const onEnd = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        
        if (autoTimeout) clearTimeout(autoTimeout);
        if (amplificationTimeout) clearTimeout(amplificationTimeout);
        
        router.replace("/game/post-match");
    };
    const gameViewParams: MatchStateType = useMemo(() => {
        if (!reportState?.startTimestamp) {
            return matchStates.preMatch
        }
        else if (reportState?.gamePhase === GamePhase.Auto) {
            const hasExited = reportState.events.some(
                (event) => event.type === MatchEventType.LeaveWing,
            )
            if (hasPiece(reportState)) {
                return ( hasExited ? matchStates.AutoExitedNote : matchStates.AutoNotExitedNote )
            } else {
                return ( hasExited ? matchStates.AutoExitedNoNote : matchStates.AutoNotExitedNoNote )
            }
        } else if (reportState?.gamePhase === GamePhase.Teleop) {
            return ( hasPiece(reportState) ? matchStates.TeleopNote : matchStates.TeleopNoNote )
        }
        return (matchStates.UnknownPhase)
    }, [reportState])

    return (
        <>
            <StatusBar 
                hidden={true} 
                backgroundColor={colors.background.default} 
            />
            <View
                style={{
                    backgroundColor: colors.secondaryContainer.default,
                    paddingVertical: 7,
                    paddingHorizontal: 14,
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
                    {gameViewParams.topLeftReplacement ?? (
                        <View style={{
                            flex: 1,
                            flexDirection: 'row',
                        }}>
                            <IconButton
                                icon="undo"
                                label="Undo"
                                color={colors.onBackground.default}
                                disabled={reportState?.events.length === 0}
                                onPress={() => {
                                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                    undoEvent();
                                }}
                            />
                        </View>
                    )}

                    <View style={{ alignItems: 'flex-end', gap: 2, flex: 1, marginRight: 13 }}>
                        <View
                            style={{
                                backgroundColor: getAllianceColorDescription((reportState?.meta.allianceColor) ?? AllianceColor.Red).backgroundColor,
                                borderRadius: 4,
                                paddingHorizontal: 6,
                                paddingVertical: 2,
                            }}
                        >
                            <Text style={{
                                color: getAllianceColorDescription((reportState?.meta.allianceColor) ?? AllianceColor.Red).foregroundColor,
                                fontFamily: 'Heebo_500Medium',
                                fontSize: 12,
                            }}>{reportState?.meta.teamNumber}</Text>
                        </View>
                        <LabelSmall color={colors.body.default}>
                            {gameViewParams.gamePhaseMessage} • <GameTimer
                                startTime={reportState?.startTimestamp} />
                        </LabelSmall>
                    </View>

                    {!reportState?.startTimestamp && <IconButton
                        label="Start match"
                        icon="play_arrow"
                        color={colors.onBackground.default}
                        size={30}
                        disabled={!gameViewParams?.startEnabled}
                        onPress={() => {
                            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                            setReportState({
                                ...reportState!,
                                startTimestamp: new Date(),
                            });
                        }} />}

                    {reportState?.startTimestamp && 
                        <DropdownMenu.Root>
                            <DropdownMenu.Trigger>
                                <IconButton
                                    label="End match"
                                    icon="stop"
                                    color={colors.onBackground.default}
                                    size={30}
                                />
                            </DropdownMenu.Trigger>

                            <DropdownMenu.Content>
                                <DropdownMenu.Item key="end" onSelect={onEnd}>
                                    <DropdownMenu.ItemTitle>End match</DropdownMenu.ItemTitle>    
                                </DropdownMenu.Item>
                            </DropdownMenu.Content>
                        </DropdownMenu.Root>
                    }
                </SafeAreaView>
            </View>
            <SafeAreaView edges={['bottom', 'left', 'right']} style={{ flex: 1 }}>
                <View style={{
                    height: "100%",
                    width: "100%",
                    flexDirection: "row",
                    alignItems: "stretch",
                    justifyContent: "center",
                }}>
                    <View
                        style={{
                            position: "relative",
                            aspectRatio: fieldWidth / fieldHeight,
                            maxWidth: "100%",
                            maxHeight: "100%",
                        }}
                    >
                        <FieldImage 
                            color={(reportState?.meta.allianceColor) ?? AllianceColor.Red}
                        />
                        {overlay[0] === FieldOverlay.None && gameViewParams.field}
                        {overlay[0] === FieldOverlay.Score && 
                            <View
                                style={{
                                    width: "100%",
                                    height: "100%",
                                    position: "absolute",
                                }}
                            >
                                <View
                                    style={{
                                        marginHorizontal: "5%",
                                        marginVertical: "2%",
                                        padding: 10,
                                        flexGrow: 1,
                                        borderRadius: 7,
                                        borderWidth: 2,
                                        borderColor: colors.gray.default,
                                        flexDirection: "row",
                                        gap: 10,
                                        overflow: "visible",
                                    }}
                                >
                                    <TouchableOpacity
                                        onPress={() => {
                                            addEvent({
                                                type: MatchEventType.ScorePiece,
                                                position: (
                                                    overlay[1] === null ?
                                                        MatchEventPosition.ScoreHigh
                                                        :overlay[1] === 1 ?
                                                            MatchEventPosition.GridOneHigh
                                                            :overlay[1] === 2 ?
                                                                MatchEventPosition.GridTwoHigh
                                                                :MatchEventPosition.GridThreeHigh
                                                )
                                            })
                                            setOverlay([FieldOverlay.None, null])
                                        }}
                                        style={{
                                            backgroundColor: colors.secondaryContainer.default,
                                            borderRadius: 7,
                                            flexGrow: 1,
                                            alignItems: "center",
                                            justifyContent: "center"
                                        }}
                                    >
                                        <TitleMedium>
                                            High
                                        </TitleMedium>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={() => {
                                            addEvent({
                                                type: MatchEventType.ScorePiece,
                                                position: (
                                                    overlay[1] === null ?
                                                        MatchEventPosition.ScoreMid
                                                        :overlay[1] === 1 ?
                                                            MatchEventPosition.GridOneMid
                                                            :overlay[1] === 2 ?
                                                                MatchEventPosition.GridTwoMid
                                                                :MatchEventPosition.GridThreeMid
                                                )
                                            })
                                            setOverlay([FieldOverlay.None, null])
                                        }}
                                        style={{
                                            backgroundColor: colors.secondaryContainer.default,
                                            borderRadius: 7,
                                            flexGrow: 1,
                                            alignItems: "center",
                                            justifyContent: "center"
                                        }}
                                    >
                                        <TitleMedium>
                                            Mid
                                        </TitleMedium>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={() => {
                                            addEvent({
                                                type: MatchEventType.ScorePiece,
                                                position: (
                                                    overlay[1] === null ?
                                                        MatchEventPosition.ScoreLow
                                                        :overlay[1] === 1 ?
                                                            MatchEventPosition.GridOneLow
                                                            :overlay[1] === 2 ?
                                                                MatchEventPosition.GridTwoLow
                                                                :MatchEventPosition.GridThreeLow
                                                )
                                            })
                                            setOverlay([FieldOverlay.None, null])
                                        }}
                                        style={{
                                            backgroundColor: colors.secondaryContainer.default,
                                            borderRadius: 7,
                                            flexGrow: 1,
                                            alignItems: "center",
                                            justifyContent: "center"
                                        }}
                                    >
                                        <TitleMedium>
                                            High
                                        </TitleMedium>
                                    </TouchableOpacity>
                                    <View
                                        style={{
                                            position: "absolute",
                                            right: 0,
                                            top: 0,
                                            marginTop: -10,
                                            marginRight: -10,
                                            paddingLeft: 2,
                                            backgroundColor: colors.background.default
                                        }}
                                    >
                                        <IconButton
                                            icon="cancel"
                                            label="Cancel"
                                            size={20}
                                            color={colors.danger.default}
                                            onPress={() => setOverlay([FieldOverlay.None, null])}
                                        />
                                    </View>
                                </View>
                            </View>
                        }
                        {overlay[0] === FieldOverlay.Charge && 
                            <View
                                style={{
                                    width: "100%",
                                    height: "100%",
                                    backgroundColor: colors.yellow.default + "87"
                                }}
                            >

                            </View>
                        }
                    </View>
                </View>
            </SafeAreaView>
        </>
    )
}

const FloatingActions = ({
    feedEnabled = false,
    pickupEnabled = false,
}: {
    feedEnabled?: boolean;
    pickupEnabled?: boolean;
}) => {
    const reportState = useAtomValue(reportStateAtom);
    const fieldOrientation = useAtomValue(fieldOrientationAtom);

    const [defenseHighlighted, setDefenseHighlighted] = useState(false);
    
    const holdingPiece = hasPiece(reportState!)

    const addEvent = useAddEvent();

    return (
        <View
            style={{
            position: "absolute",
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            flexDirection:
                fieldOrientation === FieldOrientation.Auspicious
                ? (reportState?.meta.allianceColor === AllianceColor.Blue ? "row" : "row-reverse")
                : (reportState?.meta.allianceColor === AllianceColor.Blue ? "row-reverse" : "row"),
            padding: 4,
            gap: 4,
            }}
        >
            <View
                style={{
                    position: "absolute",
                    left: 20,
                    flexDirection: 'row',
                    height: "100%",
                    gap: 10,
                }}
            >
                {!(reportState?.gamePhase === GamePhase.Auto || holdingPiece) && 
                    <View
                        style={{
                            height: "90%",
                            alignSelf: "center",
                            flexDirection: "column",
                            width: 180,
                            gap: 10,
                        }}
                    >
                        <TouchableOpacity
                            style={{
                                borderRadius: 7,
                                backgroundColor: colors.victoryPurple.default+"4d",
                                flexGrow: 1,
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                            onPress={() => {
                                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
                                addEvent({
                                    type: MatchEventType.PickupCube
                                })
                            }}
                            activeOpacity={0.6}
                        >
                            <Icon
                                name="frc_cube"
                                color={colors.victoryPurple.default}
                                size={40}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={{
                                borderRadius: 7,
                                backgroundColor: colors.yellow.default+"4d",
                                flexGrow: 1,
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                            onPress={() => {
                                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
                                addEvent({
                                    type: MatchEventType.PickupCone
                                })
                            }}
                            activeOpacity={0.6}
                        >
                            <Icon
                                name="frc_cone"
                                color={colors.yellow.default}
                                size={40}
                            />
                        </TouchableOpacity>
                    </View>
                }
                <TouchableOpacity
                    accessibilityLabel="Defend"
                    style={{
                        flex: 1,
                        backgroundColor: reportState?.gamePhase !== GamePhase.Auto 
                        ? defenseHighlighted
                            ? colors.victoryPurple.default
                            : colors.secondaryContainer.default
                        : "#00000000",
                        borderRadius: 7,
                        alignSelf: "center",
                        alignItems: "center",
                        justifyContent: "center",
                        height: "60%",
                        width: 60,
                        borderColor: colors.gray.default,
                        borderWidth: 1,
                    }}
                    
                    activeOpacity={0.9}
                    onPress={() => {
                        if (reportState?.gamePhase !== GamePhase.Auto) {
                            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                            addEvent({
                                type: MatchEventType.Defend,
                            });
                            setDefenseHighlighted(true);
                            setTimeout(() => setDefenseHighlighted(false), 200);
                        }
                    }}
                >
                    <Icon 
                        name="shield" 
                        color={colors.onBackground.default} 
                        size={40} 
                    />
                </TouchableOpacity>
                <TouchableOpacity
                    accessibilityLabel="Drop Piece"
                    style={{
                        flex: 1,
                        backgroundColor: holdingPiece ? colors.gray.hover+"cd" : "#00000000",
                        borderRadius: 7,
                        alignSelf: "center",
                        alignItems: "center",
                        justifyContent: "center",
                        height: "60%",
                        width: 80,
                    }}
                    
                    activeOpacity={0.9}
                    onPress={() => {
                        if (holdingPiece) {
                            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                            addEvent({
                                type: MatchEventType.DropPiece
                            });
                        }
                    }}
                >
                    {holdingPiece ? <Icon
                        name="output_circle"
                        color={colors.onBackground.default}
                        size={48}
                    /> : null}
                </TouchableOpacity>
            </View>
        </View>
    );
};