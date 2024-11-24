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
import { HasNoteActions } from "./actions/HasNoteActions";
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

type MatchStateType = {
  field: React.ReactNode,
  gamePhaseMessage: string,
  topLeftReplacement?: React.ReactNode,
  startEnabled?: boolean,
}

export function Game() {
    const [reportState, setReportState] = useAtom(reportStateAtom);
    // const reportState = useAtomValue(reportStateAtom)
    // const setReportState = useSetAtom(reportStateAtom)
    console.log(reportState)

    const addEvent = useAddEvent(); 
    const undoEvent = useUndoEvent();
    
    const setPhase = useSetAtom(gamePhaseAtom);

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
            field: <HasNoteActions />, 
            gamePhaseMessage: "Autonomous"
        },
        AutoNotExitedNote: {
            field: <>
                <HasNoteActions /> 
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
                <HasNoteActions trap />
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
                        <FieldImage />
                        {gameViewParams.field}
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
      {/* <View style={{ flex: 1.8 }}>
        {pickupEnabled && (
          <GameAction
            color="#C1C337"
            icon="upload"
            iconSize={48}
            onPress={() => {
              addEvent({
                type: MatchEventType.PickupNote,
              });
            }}
          />
        )}
      </View>

      <View style={{ flex: 1, gap: 4 }}>
        {/* <TouchableOpacity
          accessibilityLabel="Amplify"
          style={{
            flex: 1,
            backgroundColor: isAmplified
              ? colors.victoryPurple.default
              : colors.secondaryContainer.default,
            borderRadius: 7,
            alignItems: "center",
            justifyContent: "center",
          }}
          activeOpacity={0.9}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            if (isAmplified) {
              addEvent({
                type: MatchEventType.StopAmplifying,
              });
            } else {
              addEvent({
                type: MatchEventType.StartAmplfying,
              });
            }
          }}
        >
          <Icon
            name="campaign"
            color={
              isAmplified
                ? colors.background.default
                : colors.onBackground.default
            }
            size={40}
          />
        </TouchableOpacity>

        <TouchableOpacity
          accessibilityLabel="Defend"
          style={{
            flex: 1,
            backgroundColor: defenseHighlighted
              ? colors.danger.default
              : colors.secondaryContainer.default,
            borderRadius: 7,
            alignItems: "center",
            justifyContent: "center",
          }}
          activeOpacity={0.9}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            addEvent({
              type: MatchEventType.Defend,
            });

            setDefenseHighlighted(true);
            setTimeout(() => setDefenseHighlighted(false), 200);
          }}
        >
          <Icon name="shield" color={colors.onBackground.default} size={40} />
        </TouchableOpacity>

         <View
          style={{
            flex: 1,
          }}
        >
          {feedEnabled && (
            <TouchableOpacity
              accessibilityLabel="Feed note"
              style={{
                flex: 1,
                backgroundColor: colors.secondaryContainer.default,
                borderRadius: 7,
                alignItems: "center",
                justifyContent: "center",
              }}
              activeOpacity={0.9}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                addEvent({
                  type: MatchEventType.FeedNote,
                });
              }}
            >
              <Icon
                name="conveyor_belt"
                color={colors.onBackground.default}
                size={40}
              />
            </TouchableOpacity>
          )}
        </View> 
      </View> */}
    </View>
  );
};