import React from 'react';
import { reportStateAtom, useAddEvent } from '../../reportStateAtom';
import { MatchEventType } from '../../MatchEventType';
import { FieldElement } from '../FieldElement';
import { colors } from '../../../colors';
import { MatchEventPosition } from '../../MatchEventPosition';
import { GameAction } from '../GameAction';
import Svg, { Path, SvgProps } from "react-native-svg"
import { View } from 'react-native';
import { Icon } from '../../../components/Icon';
import { useAtomValue } from 'jotai';
import { AllianceColor } from '../../../models/AllianceColor';
import { FieldOrientation, fieldOrientationAtom } from '../../../models/FieldOrientation';
import AmpIcon from '../Amp';
import { FieldOverlay } from '../Game';
import { TouchableOpacity } from 'react-native-gesture-handler';


export const HasPieceActions = (props: {auto?: boolean, setOverlay: React.Dispatch<React.SetStateAction<[FieldOverlay, 1 | 2 | 3 | null]>>}) => {
    const addEvent = useAddEvent();
    const auto = props.auto ?? false

    return (
        <>
            <FieldElement
                edgeInsets={[0.02, 0.01, 0, 0.015]}
            >
                <View
                    style={{
                        flexDirection: "column",
                        gap: 10,
                        flexGrow: 1,
                        width: "15%",
                        marginBottom: 5
                    }}
                >
                    {auto ? 
                        ([1, 2, 3] as (1|2|3)[]).map((item) => (
                            <TouchableOpacity
                                key={item}
                                onPress={() => {
                                    props.setOverlay([FieldOverlay.Score, item])
                                }}

                                style={{
                                    flexDirection: "column",
                                    flexBasis: "31%",
                                    flex: 1,
                                    width: "100%",
                                    backgroundColor: "#9CFF9A"+"4e",
                                    borderRadius: 7,
                                }}
                            />
                        ))
                        // <>
                            
                            /* <View
                                style={{
                                    height: "31%"
                                }}

                            >
                                <GameAction
                                    onPress={() => {
                                        props.setOverlay([FieldOverlay.Score, 1])
                                    }}
                                    
                                    color='#9CFF9A'
                                />
                                <TouchableOpacity
                                    onPress={() => {
                                        props.setOverlay([FieldOverlay.Score, 1])
                                    }}

                                    style={{
                                        backgroundColor: "#9CFF9A"+"4e",
                                        borderRadius: 7,
                                        width: "100%",
                                        height: "100%",
                                    }}
                                    
                                /> 
                            </View>
                            <View
                                style={{
                                    height: "31%"
                                }}
                            >
                                <GameAction
                                    onPress={() => {
                                        props.setOverlay([FieldOverlay.Score, 2])
                                    }}
                                    
                                    color='#9CFF9A'
                                /> 
                                <TouchableOpacity
                                    onPress={() => {
                                        props.setOverlay([FieldOverlay.Score, 2])
                                    }}
                                    
                                    style={{
                                        backgroundColor: "#9CFF9A"+"4e",
                                        borderRadius: 7,
                                        width: "100%",
                                        height: "100%",
                                    }}
                                /> 
                            </View>
                            // <View
                            //     style={{
                            //         height: "31%"
                            //     }}
                            // >
                            //     <GameAction
                            //         onPress={() => {
                            //             props.setOverlay([FieldOverlay.Score, 3])
                            //         }}

                            //         color='#9CFF9A'
                            //     />
                                {/* <TouchableOpacity
                                    onPress={() => {
                                        props.setOverlay([FieldOverlay.Score, 3])
                                    }}
                                    
                                    style={{
                                        backgroundColor: "#9CFF9A"+"4e",
                                        borderRadius: 7,
                                        width: "100%",
                                        height: "100%",
                                    }}
                                /> 
                            </View> */
                        // </>
                        :<>
                            <GameAction
                                onPress={() => {
                                    props.setOverlay([FieldOverlay.Score, null])
                                }}
                                color="#9CFF9A"
                            />
                        </>
                    }
                </View>
            </FieldElement>
        </>
    );
};

// function StageActionSVG(props: SvgProps) {
//     const reportState = useAtomValue(reportStateAtom);
//     const fieldOrientation = useAtomValue(fieldOrientationAtom);

//     const width = 122;
//     const height = 140;

//     return (
//         <View
//             style={{
//                 position: "absolute",
//                 top: 0,
//                 left: 0,
//                 right: 0,
//                 bottom: 0,
//             }}
//         >
//             <View
//                 style={{
//                     aspectRatio: width / height,
//                     transform: [
//                         {
//                             scaleX: reportState?.meta.allianceColor === AllianceColor.Red ? -1 : 1,
//                         },
//                         {
//                             rotate: fieldOrientation === FieldOrientation.Auspicious ? "0deg" : "180deg",
//                         }
//                     ]
//                 }}
//             >
//                 <Svg
//                     width="100%"
//                     height="100%"
//                     viewBox={`0 0 ${width} ${height}`}
//                     fill="none"
//                     {...props}
//                 >
//                     <Path
//                         d="M118.521 4.414l-5.781-3.365a7 7 0 00-7.042 0L3.479 60.537A7 7 0 000 66.587v6.826a7 7 0 003.48 6.05l102.218 59.488a6.998 6.998 0 007.042 0l5.781-3.365a6.998 6.998 0 003.479-6.05V10.464a7 7 0 00-3.479-6.05z"
//                         fill="#9CFF9A"
//                         fillOpacity={0.3}
//                     />
//                 </Svg>
//             </View>
//         </View>
//     )
// }

// export default StageActionSVG

