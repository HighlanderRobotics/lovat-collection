import React from 'react';
import { useAtom } from 'jotai';
import { groundPiecesAtom, useAddEvent } from '../../reportStateAtom';
import { MatchEventType } from '../../MatchEventType';
import { MatchEventPosition, groundPieces } from '../../MatchEventPosition';
import { FieldElement } from '../FieldElement';
import { GameAction } from '../GameAction';
import { fieldHeight, fieldWidth } from '../../../components/FieldImage';
import { View } from 'react-native';
import { colors } from '../../../colors';
import { GamePiece } from '../../ReportState';
import { IconButton } from '../../../components/IconButton';

export const AutoCollectPieceActions = () => {
    const radius = 19;

    const addEvent = useAddEvent();
    const [remainingNotes, setRemainingNotes] = useAtom(groundPiecesAtom);

    return (
        <>
            <FieldElement edgeInsets={[0.04, 0.611, 0.1, 0]}>
                <View
                    style={{
                        flexDirection: "column",
                        justifyContent: "space-between",
                        // borderColor: colors.danger.default,
                        // borderWidth: 5,
                        flexGrow: 1,
                    }}
                >
                    {Object.keys(remainingNotes).map((item) => {
                        const gamePiece = remainingNotes[item as MatchEventPosition]
                        if (gamePiece === GamePiece.None) {
                            return <View
                                key={`${item} spacer`}
                                style={{
                                    width: radius*2,
                                    height: radius*2,
                                }}
                            />
                        } else {
                            const piece = gamePiece === GamePiece.Cone ? 'cone' : 'cube'
                            const event = gamePiece === GamePiece.Cone ? MatchEventType.PickupCone : MatchEventType.PickupCube
                            const color = gamePiece === GamePiece.Cone ? colors.yellow.default : colors.victoryPurple.default
                            return <View
                                key={`${item} ${piece}`}
                                style={{
                                    borderRadius: 50,
                                    backgroundColor: color+"4d",
                                    width: radius*2,
                                    height: radius*2,
                                    justifyContent: "center",
                                    alignItems: "center",
                                }}
                            > 
                                <IconButton 
                                    icon={`frc_${piece}`}
                                    label={`${item} ${piece}`}
                                    size={22.8}
                                    color={color}
                                    onPress={() => {
                                        addEvent({
                                            type: event,
                                            position: item as MatchEventPosition
                                        })
                                        setRemainingNotes({
                                            ...remainingNotes,
                                            [item]: GamePiece.None
                                        })
                                    }}
                                    
                                />
                            </View>
                        }
                    })}
                </View>
            </FieldElement>
        </>
    );
};
