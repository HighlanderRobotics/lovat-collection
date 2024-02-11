import React, { useEffect, useState } from 'react';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { gamePhaseAtom, hasNote, isAmplifiedAtom, reportStateAtom, useAddEvent } from '../reportStateAtom';
import { router } from 'expo-router';
import { PreMatchActions } from './actions/PreMatchActions';
import { GameViewTemplate } from './GameViewTemplate';
import { GamePhase } from '../ReportState';
import { Checkbox } from '../../components/Checkbox';
import { MatchEventType } from '../MatchEventType';
import { HasNoteActions } from './actions/HasNoteActions';
import { ExitWingAction } from './actions/ExitWingAction';
import * as Haptics from 'expo-haptics';
import { AutoCollectPieceActions } from './actions/AutoCollectPieceActions';
import { TouchableOpacity, View } from 'react-native';
import { colors } from '../../colors';
import { Icon } from '../../components/Icon';
import { AllianceColor } from '../../models/AllianceColor';
import { GameAction } from './GameAction';
import { FieldOrientation, fieldOrientationAtom } from '../../models/FieldOrientation';

export function Game() {
    const [reportState, setReportState] = useAtom(reportStateAtom);
    const isAmplified = useAtomValue(isAmplifiedAtom);

    const addEvent = useAddEvent();

    const [autoTimeout, setAutoTimeout] = useState<NodeJS.Timeout | null>(null);
    const [amplificationTimeout, setAmplificationTimeout] = useState<NodeJS.Timeout | null>(null);

    const setPhase = useSetAtom(gamePhaseAtom);

    useEffect(() => {
        if (!reportState) {
            router.replace("/home");
        }
    }, [reportState]);

    useEffect(() => {
        if (isAmplified) {
            setAmplificationTimeout(setTimeout(() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                addEvent({
                    type: MatchEventType.StopAmplifying,
                });
            }, 10 * 1000));
        } else {
            if (amplificationTimeout) {
                clearTimeout(amplificationTimeout);
            }
            setAmplificationTimeout(null);
        }
    }, [isAmplified])

    useEffect(() => {
        if (reportState?.gamePhase === GamePhase.Auto && reportState.startTimestamp && !autoTimeout) {
            setAutoTimeout(setTimeout(() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setPhase(GamePhase.Teleop);
            }, 18 * 1000));

            return () => {
                if (autoTimeout) {
                    clearTimeout(autoTimeout);
                }
            }
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
        router.replace('/game/post-match');
    }

    if (!reportState?.startTimestamp) {
        return (
            <GameViewTemplate
                onEnd={onEnd}
                gamePhaseMessage="Pre-match"
                field={<PreMatchActions />}
                topLeftReplacement={<Checkbox
                    label="Loaded with a note"
                    checked={reportState?.startPiece}
                    onChange={(checked) => {
                        setReportState({
                            ...reportState!,
                            startPiece: checked,
                        });
                    }}
                />}
                startEnabled={reportState?.startPosition !== undefined}
            />
        );
    }

    if (reportState.gamePhase === GamePhase.Auto) {
        const hasExited = reportState.events.some((event) => event.type === MatchEventType.LeaveWing);

        if (hasNote(reportState)) {
            if (hasExited) {
                return (
                    <GameViewTemplate
                        onEnd={onEnd}
                        gamePhaseMessage="Autonomous"
                        field={<>
                            <HasNoteActions />
                        </>}
                    />
                );
            } else {
                return (
                    <GameViewTemplate
                        onEnd={onEnd}
                        gamePhaseMessage="Autonomous"
                        field={<>
                            <HasNoteActions />
                            <ExitWingAction />
                        </>}
                    />
                );
            }
        } else {
            if (hasExited) {
                return (
                    <GameViewTemplate
                        onEnd={onEnd}
                        gamePhaseMessage="Autonomous"
                        field={<AutoCollectPieceActions />}
                    />
                );
            } else {
                return (
                    <GameViewTemplate
                        onEnd={onEnd}
                        gamePhaseMessage="Autonomous"
                        field={<>
                            <ExitWingAction />
                        </>}
                    />
                );
            }
        }
    } else if (reportState.gamePhase === GamePhase.Teleop) {
        if (hasNote(reportState)) {
            return (
                <GameViewTemplate
                    onEnd={onEnd}
                    gamePhaseMessage="Teleop"
                    field={<>
                        <FloatingActions feedEnabled />
                        <HasNoteActions trap />
                    </>}
                />
            );
        } else {
            return (
                <GameViewTemplate
                    onEnd={onEnd}
                    gamePhaseMessage="Teleop"
                    field={<FloatingActions pickupEnabled />}
                />
            );
        }
    }

    return (
        <GameViewTemplate
            onEnd={onEnd}
            gamePhaseMessage="Unknown phase"
            field={<></>} />
    );
}

const FloatingActions = ({ feedEnabled = false, pickupEnabled = false }: { feedEnabled?: boolean, pickupEnabled?: boolean }) => {
    const reportState = useAtomValue(reportStateAtom);
    const isAmplified = useAtomValue(isAmplifiedAtom);
    const fieldOrientation = useAtomValue(fieldOrientationAtom);

    const [defenseHighlighted, setDefenseHighlighted] = useState(false);

    const addEvent = useAddEvent();

    return (
        <View
            style={{
                position: 'absolute',
                top: 0,
                right: 0,
                bottom: 0,
                left: 0,
                flexDirection: fieldOrientation === FieldOrientation.Auspicious ? 
                    (reportState?.meta.allianceColor === AllianceColor.Blue ? 'row' : 'row-reverse') : 
                    (reportState?.meta.allianceColor === AllianceColor.Blue ? 'row-reverse' : 'row'),
                padding: 4,
                gap: 4,
            }}
        >
            <View style={{ flex: 1.8 }}>
                {pickupEnabled && <GameAction
                    color="#C1C337"
                    icon="upload"
                    iconSize={48}
                    onPress={() => {
                        addEvent({
                            type: MatchEventType.PickupNote,
                        });
                    }}
                />}
            </View>

            <View style={{ flex: 1, gap: 4, }}>
                <TouchableOpacity
                    accessibilityLabel="Amplify"
                    style={{
                        flex: 1,
                        backgroundColor: isAmplified ? colors.victoryPurple.default : colors.secondaryContainer.default,
                        borderRadius: 7,
                        alignItems: 'center',
                        justifyContent: 'center',
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
                    <Icon name="campaign" color={isAmplified ? colors.background.default : colors.onBackground.default} size={40} />
                </TouchableOpacity>

                <TouchableOpacity
                    accessibilityLabel="Defend"
                    style={{
                        flex: 1,
                        backgroundColor: defenseHighlighted ? colors.danger.default : colors.secondaryContainer.default,
                        borderRadius: 7,
                        alignItems: 'center',
                        justifyContent: 'center',
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
                    {feedEnabled && <TouchableOpacity
                        accessibilityLabel="Feed note"
                        style={{
                            flex: 1,
                            backgroundColor: colors.secondaryContainer.default,
                            borderRadius: 7,
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                        activeOpacity={0.9}
                        onPress={() => {
                            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                            addEvent({
                                type: MatchEventType.FeedNote,
                            });
                        }}
                    >
                        <Icon name="conveyor_belt" color={colors.onBackground.default} size={40} />
                    </TouchableOpacity>}
                </View>
            </View>
        </View>
    )
}
