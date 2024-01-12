import React from 'react';
import { useAddEvent } from '../../reportStateAtom';
import { MatchEventType } from '../../MatchEventType';
import { FieldElement } from '../FieldElement';
import { colors } from '../../../colors';
import { MatchEventPosition } from '../../MatchEventPosition';
import { GameAction } from '../GameAction';


export const HasNoteActions = () => {
    const addEvent = useAddEvent();

    return (
        <>
            <FieldElement
                edgeInsets={[
                    0,
                    0.87,
                    0.8,
                    0,
                ]}
            >
                <GameAction
                    color="#9CFF9A"
                    onPress={() => {
                        addEvent({
                            type: MatchEventType.ScoreNote,
                            position: MatchEventPosition.Amp,
                        });
                    }} />
            </FieldElement>

            <FieldElement
                edgeInsets={[
                    0.21,
                    0.87,
                    0.53,
                    0,
                ]}
            >
                <GameAction
                    onPress={() => {
                        addEvent({
                            type: MatchEventType.ScoreNote,
                            position: MatchEventPosition.Speaker,
                        });
                    }}
                    color="#9CFF9A"
                    icon="speaker" />
            </FieldElement>

            <FieldElement
                edgeInsets={[
                    0.48,
                    0.87,
                    0.21,
                    0,
                ]}
            >
                <GameAction
                    color={colors.onBackground.default}
                    onPress={() => {
                        addEvent({
                            type: MatchEventType.DropNote,
                        });
                    }}
                    icon="output_circle" />
            </FieldElement>
        </>
    );
};
