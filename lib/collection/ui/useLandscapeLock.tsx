import { lockAsync, OrientationLock } from 'expo-screen-orientation';
import { useEffect } from 'react';

export function useLandscapeLock() {
    useEffect(() => {
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
    }, []);
}
