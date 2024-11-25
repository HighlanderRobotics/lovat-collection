import React from 'react';
import { useAddEvent } from '../../reportStateAtom';
import { MatchEventType } from '../../MatchEventType';
import { FieldElement } from '../FieldElement';
import { GameAction } from '../GameAction';
import { colors } from '../../../colors';
import { MatchEventPosition } from '../../MatchEventPosition';


export const ExitWingAction = () => {
    const addEvent = useAddEvent();

    return (
        <FieldElement
            edgeInsets={[
                0.02,
                0.31,
                0.02,
                0.225,
            ]}
        >
            <GameAction
                color={colors.victoryPurple.default}
                onPress={() => {
                    addEvent({
                        type: MatchEventType.LeaveWing,
                        position: MatchEventPosition.None
                    });
                }} />
        </FieldElement>
    );
};
