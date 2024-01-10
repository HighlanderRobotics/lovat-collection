import { lockAsync, getOrientationLockAsync, OrientationLock } from 'expo-screen-orientation';
import { useEffect, useState } from 'react';
import TitleMedium from '../lib/components/text/TitleMedium';

export default function Game() {
    return (
        <LandscapeLock>
            <TitleMedium>Game</TitleMedium>
        </LandscapeLock>
    );
}

type LockedOrientationProps = {
    children?: React.ReactNode;
}

export function LandscapeLock(props: LockedOrientationProps) {
    useEffect(() => {
        (async () => {
            await lockAsync(OrientationLock.LANDSCAPE);
        })();

        return () => {
            (async () => {
                await lockAsync(OrientationLock.PORTRAIT_UP);
            })();
        }
    }, []);

    return <>{props.children}</>;
}
