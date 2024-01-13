import React, { useEffect, useState } from 'react';
import { useAtom } from 'jotai';
import { hasNote, reportStateAtom, useAddEvent, useSetPhase } from '../reportStateAtom';
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
