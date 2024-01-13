import React, { useEffect, useState } from 'react';
import { useAtom } from 'jotai';
import { hasNote, remainingGroundNoteLocationsAtom, reportStateAtom, useAddEvent, useSetPhase } from '../reportStateAtom';
import { router } from 'expo-router';
import { PreMatchActions } from './actions/PreMatchActions';
import { GameViewTemplate } from './GameViewTemplate';
import { GamePhase } from '../ReportState';
import { Checkbox } from '../../components/Checkbox';
import { MatchEventType } from '../MatchEventType';
import { HasNoteActions } from './actions/HasNoteActions';
import { ExitWingAction } from './actions/ExitWingAction';
import { MatchEventPosition, groundNotePositions } from '../MatchEventPosition';
import { FieldElement } from './FieldElement';
import { GameAction } from './GameAction';
import { fieldHeight, fieldWidth } from '../../components/FieldImage';
import { View } from 'react-native';
import { colors } from '../../colors';
import * as Haptics from 'expo-haptics';

export function Game() {
    const [reportState, setReportState] = useAtom(reportStateAtom);

    const [autoTimeout, setAutoTimeout] = useState<NodeJS.Timeout | null>(null);

    const addEvent = useAddEvent();
    const setPhase = useSetPhase();

    useEffect(() => {
        if (!reportState) {
            router.replace("/home");
        }
    }, [reportState]);

    useEffect(() => {
        if (reportState?.gamePhase === GamePhase.Auto && reportState.startTimestamp && !autoTimeout) {
            setAutoTimeout(setTimeout(() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setPhase(GamePhase.Teleop);
            }, 18 * 1000));
        } else {
            setAutoTimeout(null);
        }
    }, [reportState?.gamePhase, reportState?.startTimestamp]);

    if (!reportState?.startTimestamp) {
        return (
            <GameViewTemplate
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
                        gamePhaseMessage="Autonomous"
                        field={<>
                            <HasNoteActions />
                        </>}
                    />
                );
            } else {
                return (
                    <GameViewTemplate
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
                        gamePhaseMessage="Autonomous"
                        field={<AutoCollectPieceActions />}
                    />
                );
            } else {
                return (
                    <GameViewTemplate
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
                    gamePhaseMessage="Teleop"
                    field={<>
                        <HasNoteActions trap={true} />
                    </>}
                />
            );
        } else {
            return (
                <GameViewTemplate
                    gamePhaseMessage="Teleop"
                    // field={<TeleopCollectPieceAtions />}
                    field={<>

                    </>}
                />
            );
        }
    }

    return (
        <GameViewTemplate
            gamePhaseMessage="Unknown phase"
            field={<></>} />
    );
}

const AutoCollectPieceActions = () => {
    const radius = 35;

    const addEvent = useAddEvent();
    const [remainingNotes] = useAtom(remainingGroundNoteLocationsAtom);

    return (
        <>
            {Object.entries(groundNotePositions).map(([key, position]) => {
                if (remainingNotes?.includes(key as MatchEventPosition)) {
                    return (
                        <FieldElement
                            key={key}
                            edgeInsets={[
                                position.fieldCoordinates.y - (radius / fieldHeight),
                                1 - position.fieldCoordinates.x - (radius / fieldWidth),
                                1 - position.fieldCoordinates.y - (radius / fieldHeight),
                                position.fieldCoordinates.x - (radius / fieldWidth),
                            ]}
                        >
                            <GameAction
                                color="#C1C337"
                                borderRadius={100}
                                icon="upload"
                                onPress={() => {
                                    addEvent({
                                        type: MatchEventType.PickupNote,
                                        position: key as MatchEventPosition,
                                    });
                                }}
                            />
                        </FieldElement>
                    )
                } else {
                    <FieldElement
                        key={key}
                        edgeInsets={[
                            position.fieldCoordinates.y - (radius / fieldHeight),
                            1 - position.fieldCoordinates.x - (radius / fieldWidth),
                            1 - position.fieldCoordinates.y - (radius / fieldHeight),
                            position.fieldCoordinates.x - (radius / fieldWidth),
                        ]}
                    >
                        <View
                            style={{
                                height: "100%",
                                width: "100%",
                                borderRadius: 100,
                                backgroundColor: colors.onBackground.default,
                                opacity: 0.1,
                            }}
                        />
                    </FieldElement>
                }
            })}
        </>
    );
};


