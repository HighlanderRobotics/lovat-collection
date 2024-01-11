import { Game } from '../lib/collection/ui/Game';
import { useLandscapeLock } from '../lib/collection/ui/useLandscapeLock';

export default function GamePage() {
    useLandscapeLock();

    return (
        <Game />
    )
}


