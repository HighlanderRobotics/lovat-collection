import { atom, useAtom } from "jotai";
import { GamePhase, GamePiece, ReportState } from "./ReportState";
import { MatchEventType, gainPieceEvents, losePieceEvents } from "./MatchEventType";
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

// export const isAmplifiedAtom = atom<boolean>((get) => {
//     const reportState = get(reportStateAtom);

//     if (!reportState) {
//         return false;
//     }

//     let isAmplified = false;

//     for (let i = 0; i < reportState.events.length; i++) {
//         const event = reportState.events[i];

//         if (event.type === MatchEventType.StartAmplfying) {
//             isAmplified = true;
//         }

//         if (event.type === MatchEventType.StopAmplifying) {
//             isAmplified = false;
//         }
//     }

//     return isAmplified;
// });

export const hasPiece = (reportState: ReportState) => {
    let hasNote = GamePiece.None;

    if (reportState.startPiece) {
        hasNote = reportState.startPiece;
    }

    for (let i = 0; i < reportState.events.length; i++) {
        const event = reportState.events[i];
        
        if (losePieceEvents.includes(event.type)) {
            hasNote = GamePiece.None;
        }

        if (gainPieceEvents.includes(event.type)) {
            hasNote = event.type === MatchEventType.PickupCone ? GamePiece.Cone : GamePiece.Cube;
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

export const useUndoEvent = () => {
    const [reportState, setReportState] = useAtom(reportStateAtom);

    return () => {
        if (reportState) {
            setReportState({
                ...reportState,
                events: reportState.events.slice(0, -1),
            });
        }
    }
}
