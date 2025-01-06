// import React from "react";
// import { useReportStateStore } from "../../reportStateStore";
// import { MatchEventType } from "../../MatchEventType";
// import { FieldElement } from "../FieldElement";
// import { colors } from "../../../colors";
// import { MatchEventPosition } from "../../MatchEventPosition";
// import { GameAction } from "../GameAction";
// import Svg, { Path, SvgProps } from "react-native-svg";
// import { View } from "react-native";
// import { Icon } from "../../../components/Icon";
// import { AllianceColor } from "../../../models/AllianceColor";
// import {
//   FieldOrientation,
//   useFieldOrientationStore,
// } from "../../../storage/userStores";
// import AmpIcon from "../Amp";

export const HasNoteActions = () => {
  //   const addEvent = useReportStateStore((state) => state.addEvent);

  return null;
  //     <>
  //       <FieldElement edgeInsets={[0, 0.87, 0.8, 0]}>
  //         <GameAction
  //           color="#9CFF9A"
  //           onPress={() => {
  //             addEvent({
  //               type: MatchEventType.ScoreNote,
  //               position: MatchEventPosition.Amp,
  //             });
  //           }}
  //         >
  //           <AmpIcon />
  //         </GameAction>
  //       </FieldElement>

  //       <FieldElement edgeInsets={[0.21, 0.87, 0.53, 0]}>
  //         <GameAction
  //           onPress={() => {
  //             addEvent({
  //               type: MatchEventType.ScoreNote,
  //               position: MatchEventPosition.Speaker,
  //             });
  //           }}
  //           color="#9CFF9A"
  //           iconColor="#1C1B1F"
  //           icon="speaker"
  //           iconSize={48}
  //         />
  //       </FieldElement>

  //       <FieldElement edgeInsets={[0.48, 0.87, 0.21, 0]}>
  //         <GameAction
  //           color={colors.onBackground.default}
  //           onPress={() => {
  //             addEvent({
  //               type: MatchEventType.DropNote,
  //             });
  //           }}
  //           icon="output_circle"
  //           iconSize={48}
  //         />
  //       </FieldElement>

  //       {trap && (
  //         <FieldElement edgeInsets={[0.31, 0.645, 0.31, 0.19]}>
  //           <GameAction
  //             backgroundViewReplacement={<StageActionSVG />}
  //             color="#9CFF9A"
  //             onPress={() => {
  //               addEvent({
  //                 type: MatchEventType.ScoreNote,
  //                 position: MatchEventPosition.Trap,
  //               });
  //             }}
  //             fieldRelativePadding={[0, 0, 0, "30%"]}
  //           >
  //             <View
  //               style={{
  //                 flexDirection: "row",
  //               }}
  //             >
  //               <Icon name="crisis_alert" color="#1C1B1F" size={48} />
  //             </View>
  //           </GameAction>
  //         </FieldElement>
  //       )}
  //     </>
  //   );
  // };

  // function StageActionSVG(props: SvgProps) {
  //   const reportState = useReportStateStore();
  //   const fieldOrientation = useFieldOrientationStore((state) => state.value);

  //   const width = 122;
  //   const height = 140;

  //   return (
  //     <View
  //       style={{
  //         position: "absolute",
  //         top: 0,
  //         left: 0,
  //         right: 0,
  //         bottom: 0,
  //       }}
  //     >
  //       <View
  //         style={{
  //           aspectRatio: width / height,
  //           transform: [
  //             {
  //               scaleX:
  //                 reportState.meta!.allianceColor === AllianceColor.Red ? -1 : 1,
  //             },
  //             {
  //               rotate:
  //                 fieldOrientation === FieldOrientation.Auspicious
  //                   ? "0deg"
  //                   : "180deg",
  //             },
  //           ],
  //         }}
  //       >
  //         <Svg
  //           width="100%"
  //           height="100%"
  //           viewBox={`0 0 ${width} ${height}`}
  //           fill="none"
  //           {...props}
  //         >
  //           <Path
  //             d="M118.521 4.414l-5.781-3.365a7 7 0 00-7.042 0L3.479 60.537A7 7 0 000 66.587v6.826a7 7 0 003.48 6.05l102.218 59.488a6.998 6.998 0 007.042 0l5.781-3.365a6.998 6.998 0 003.479-6.05V10.464a7 7 0 00-3.479-6.05z"
  //             fill="#9CFF9A"
  //             fillOpacity={0.3}
  //           />
  //         </Svg>
  //       </View>
  //     </View>
};
