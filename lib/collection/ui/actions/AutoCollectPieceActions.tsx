import React from 'react';
import { useAtom } from 'jotai';
import { remainingGroundNoteLocationsAtom, useAddEvent } from '../../reportStateAtom';
import { MatchEventType } from '../../MatchEventType';
import { MatchEventPosition, groundNotePositions } from '../../MatchEventPosition';
import { FieldElement } from '../FieldElement';
import { GameAction } from '../GameAction';
import { fieldHeight, fieldWidth } from '../../../components/FieldImage';
import { View } from 'react-native';
import { colors } from '../../../colors';

export const AutoCollectPieceActions = () => {
    const radius = 35;

    const addEvent = useAddEvent();
    const [remainingNotes] = useAtom(remainingGroundNoteLocationsAtom);

    return (
        <>
            {Object.entries(groundNotePositions).map(([key, position]) => {
                if (remainingNotes?.includes(key as MatchEventPosition)) {
                    return (
                        <FieldElement
                            key={key}
                            edgeInsets={[
                                position.fieldCoordinates.y - (radius / fieldHeight),
                                1 - position.fieldCoordinates.x - (radius / fieldWidth),
                                1 - position.fieldCoordinates.y - (radius / fieldHeight),
                                position.fieldCoordinates.x - (radius / fieldWidth),
                            ]}
                        >
                            <GameAction
                                color="#C1C337"
                                borderRadius={100}
                                icon="upload"
                                onPress={() => {
                                    addEvent({
                                        type: MatchEventType.PickupNote,
                                        position: key as MatchEventPosition,
                                    });
                                }} />
                        </FieldElement>
                    );
                } else {
                    <FieldElement
                        key={key}
                        edgeInsets={[
                            position.fieldCoordinates.y - (radius / fieldHeight),
                            1 - position.fieldCoordinates.x - (radius / fieldWidth),
                            1 - position.fieldCoordinates.y - (radius / fieldHeight),
                            position.fieldCoordinates.x - (radius / fieldWidth),
                        ]}
                    >
                        <View
                            style={{
                                height: "100%",
                                width: "100%",
                                borderRadius: 100,
                                backgroundColor: colors.onBackground.default,
                                opacity: 0.1,
                            }} />
                    </FieldElement>;
                }
            })}
        </>
    );
};
