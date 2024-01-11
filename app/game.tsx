import { useEffect } from 'react';
import { Game } from '../lib/collection/ui/Game';
import { OrientationLock, lockAsync } from 'expo-screen-orientation';

export default function GamePage() {
    useEffect(() => {
        (async () => {
            await lockAsync(OrientationLock.LANDSCAPE);
        })();

        return () => {
            (async () => {
                await lockAsync(OrientationLock.PORTRAIT_UP);
            })();
        };
    }, []);

    return (
        <Game />
    )
}


