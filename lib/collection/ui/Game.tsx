import { useEffect } from 'react';
import { useAtom } from 'jotai';
import { reportStateAtom } from '../reportStateAtom';
import { router } from 'expo-router';
import { PreMatchActions } from './actions/PreMatchActions';
import { GameViewTemplate } from './GameViewTemplate';

export function Game() {
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
                startEnabled={reportState?.startPosition !== undefined} />
        );
    }

    return (
        <GameViewTemplate
            gamePhaseMessage="Unknown phase"
            field={<></>} />
    );
}
