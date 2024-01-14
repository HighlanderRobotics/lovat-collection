import { Suspense, useEffect } from 'react';
import { Game } from '../../lib/collection/ui/Game';
import { OrientationLock, lockAsync } from 'expo-screen-orientation';
import { ActivityIndicator } from 'react-native';

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
        <Suspense fallback={<ActivityIndicator />}>
            <Game />
        </Suspense>
    )
}


