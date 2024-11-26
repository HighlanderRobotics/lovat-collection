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
import { TouchableOpacity } from 'react-native-gesture-handler';

export const PreMatchSelectPieceActions = () => {
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
                        
                        flexGrow: 1,
                    }}
                >
                    {Object.keys(remainingNotes).map((item) => {
                        const gamePiece = remainingNotes[item as MatchEventPosition]
                        if (gamePiece === GamePiece.None) {
                            return <TouchableOpacity
                                key={`${item} not selected`}
                                style={{
                                    width: radius*2,
                                    height: radius*2,
                                    backgroundColor: colors.background.default,
                                    borderWidth: 1,
                                    borderRadius: 50,
                                    borderColor: colors.gray.default,
                                }}
                                onPress={() => {
                                    setRemainingNotes({
                                        ...remainingNotes,
                                        [item]: GamePiece.Cone 
                                    })
                                }}
                            />
                        } else {
                            const piece = gamePiece === GamePiece.Cone ? 'cone' : 'cube'
                            const next = gamePiece === GamePiece.Cone ? GamePiece.Cube : GamePiece.Cone
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
                                        setRemainingNotes({
                                            ...remainingNotes,
                                            [item]: next,
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
