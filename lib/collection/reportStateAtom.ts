import { atom, useAtom } from "jotai";
import { GamePhase, GamePiece, ReportState } from "./ReportState";
import { MatchEventType, gainPieceEvents, losePieceEvents } from "./MatchEventType";
import { groundPieces, MatchEventPosition } from "./MatchEventPosition";

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

export const groundPiecesAtom = atom<Record<MatchEventPosition, GamePiece>>(
    Object.values(groundPieces).reduce(
        (acc, curr) => ({...acc, [curr]: GamePiece.None}), 
        {} as Record<MatchEventPosition, GamePiece>
    )
)

export const hasPiece = (reportState: ReportState) => {
    let piece = GamePiece.None;

    if (reportState.startPiece) {
        piece = reportState.startPiece;
    }

    for (let i = 0; i < reportState.events.length; i++) {
        const event = reportState.events[i];
        
        if (losePieceEvents.includes(event.type)) {
            piece = GamePiece.None;
        }

        if (gainPieceEvents.includes(event.type)) {
            piece = event.type === MatchEventType.PickupCone ? GamePiece.Cone : GamePiece.Cube;
        }
    }

    return piece;
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
