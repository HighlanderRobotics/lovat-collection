import { Suspense, useEffect } from 'react';
import { Game } from '../../lib/collection/ui/Game';
import { OrientationLock, lockAsync } from 'expo-screen-orientation';
import { ActivityIndicator, Platform } from 'react-native';
import * as NavigationBar from 'expo-navigation-bar';

export default function GamePage() {
    useEffect(() => {
        (async () => {
            await lockAsync(OrientationLock.LANDSCAPE);

            if (Platform.OS === "android") {
                await NavigationBar.setVisibilityAsync("hidden");
            }
        })();

        return () => {
            (async () => {
                await lockAsync(OrientationLock.PORTRAIT_UP);

                if (Platform.OS === "android") {
                    await NavigationBar.setVisibilityAsync("visible");
                }
            })();
        };
    }, []);

    return (
        <Suspense fallback={<ActivityIndicator />}>
            <Game />
        </Suspense>
    )
}


