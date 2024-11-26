import React from 'react';
import { reportStateAtom, useAddEvent } from '../../reportStateAtom';
import { MatchEventType } from '../../MatchEventType';
import { FieldElement } from '../FieldElement';
import { GameAction } from '../GameAction';
import { colors } from '../../../colors';
import { MatchEventPosition } from '../../MatchEventPosition';
import { FieldOverlay } from '../Game';
import { useAtomValue } from 'jotai';

export const ChargeStationAction = (props: {setOverlay: React.Dispatch<React.SetStateAction<[FieldOverlay, 1 | 2 | 3 | null]>>}) => {
    const addEvent = useAddEvent();
    const reportState = useAtomValue(reportStateAtom)
    
    return (
        <FieldElement
            edgeInsets={[
                0.2,
                0.25,
                0.25,
                0.545,
            ]}
        >
            <GameAction
                color={"#9CFF9A"}
                onPress={() => {
                    props.setOverlay([ FieldOverlay.Charge, null ])
                    if (reportState!.events.some((item) => 
                        item.type === MatchEventType.ChargingEngaged
                        || item.type === MatchEventType.ChargingTipped
                        || item.type === MatchEventType.ChargingFailed
                        || item.type === MatchEventType.ChargingNotAttempted
                    )) {
                        addEvent({
                            type: MatchEventType.ChargingNotAttempted
                        })
                    }
                }}
            />
        </FieldElement>
    );
};
