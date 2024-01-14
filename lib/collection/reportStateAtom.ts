import { atom, useAtom } from "jotai";
import { GamePhase, ReportState } from "./ReportState";
import { MatchEventType, gainNoteEvents, loseNoteEvents } from "./MatchEventType";
import { MatchEvent } from "./MatchEvent";
import { GroundNotePosition, MatchEventPosition, groundNotePositions } from "./MatchEventPosition";

export const reportStateAtom = atom<ReportState | null>(null);
export const gamePhaseAtom = atom(
    (get) => get(reportStateAtom)?.gamePhase ?? null,
    (get, set, newGamePhase: GamePhase) => {
        const reportState = get(reportStateAtom);

        if (reportState) {
            set(reportStateAtom, {
                ...reportState,
                gamePhase: newGamePhase,
            });
        }
    }
);

export const remainingGroundNoteLocationsAtom = atom<GroundNotePosition[] | null>((get) => {
    const reportState = get(reportStateAtom);

    if (!reportState) {
        return null;
    }

    const remainingGroundPieceLocations: GroundNotePosition[] = Object.keys(groundNotePositions) as GroundNotePosition[];

    for (let i = 0; i < reportState.events.length; i++) {
        const event = reportState.events[i];

        if (event.position && remainingGroundPieceLocations.includes(event.position)) {
            remainingGroundPieceLocations.splice(remainingGroundPieceLocations.indexOf(event.position), 1);
        }
    }

    return remainingGroundPieceLocations;
});

export const isAmplifiedAtom = atom<boolean>((get) => {
    const reportState = get(reportStateAtom);

    if (!reportState) {
        return false;
    }

    let isAmplified = false;

    for (let i = 0; i < reportState.events.length; i++) {
        const event = reportState.events[i];

        if (event.type === MatchEventType.StartAmplfying) {
            isAmplified = true;
        }

        if (event.type === MatchEventType.StopAmplifying) {
            isAmplified = false;
        }
    }

    return isAmplified;
});

export const hasNote = (reportState: ReportState) => {
    let hasNote = false;

    if (reportState.startPiece) {
        hasNote = true;
    }

    for (let i = 0; i < reportState.events.length; i++) {
        const event = reportState.events[i];
        
        if (loseNoteEvents.includes(event.type)) {
            hasNote = false;
        }

        if (gainNoteEvents.includes(event.type)) {
            hasNote = true;
        }
    }

    return hasNote;
}

export const useAddEvent = () => {
    const [reportState, setReportState] = useAtom(reportStateAtom);

    return (event: { type: MatchEventType, position?: MatchEventPosition }) => {
        if (reportState) {
            setReportState({
                ...reportState,
                events: [
                    ...reportState.events,
                    {
                        type: event.type,
                        position: event.position ?? MatchEventPosition.None,
                        timestamp: Date.now(),
                    },
                ]
            });
        }
    }
}
