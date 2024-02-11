import { View } from "react-native";
import { NavBar } from "../../lib/components/NavBar";
import { router, useNavigation } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import Button from "../../lib/components/Button";
import LabelSmall from "../../lib/components/text/LabelSmall";
import { ButtonGroup, ButtonGroupDirection } from "../../lib/components/ButtonGroup";
import { RobotRole } from "../../lib/collection/ReportState";
import { reportStateAtom } from "../../lib/collection/reportStateAtom";
import { useAtom } from "jotai";
import { DriverAbility, driverAbilityDescriptions } from "../../lib/collection/DriverAbility";
import { StageResult, stageResultDescriptions } from "../../lib/collection/StageResult";
import { HighNote, highNoteDescriptions } from "../../lib/collection/HighNote";
import { PickUp, pickUpDescriptions } from "../../lib/collection/PickUp";
import TextField from "../../lib/components/TextField";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { CommonActions } from '@react-navigation/native'


export default function PostMatch() {
    const [reportState, setReportState] = useAtom(reportStateAtom);

    const navigation = useNavigation();

    if (!reportState) {
        navigation.dispatch(CommonActions.reset({
            routes: [{key: "index", name: "index"}]
        }))
        return null;
    }


    return (
        <>
            <NavBar
                title="Post match"
            />
            <KeyboardAwareScrollView style={{ flex: 1, paddingVertical: 16, paddingHorizontal: 26, gap: 28 }}>
                <SafeAreaView edges={['bottom', 'left', 'right']} style={{ flex: 1, gap: 7, paddingBottom: 200 }}>
                    <View style={{ gap: 7 }}>
                        <LabelSmall>Robot role</LabelSmall>
                        <ButtonGroup
                            direction={ButtonGroupDirection.Vertical}
                            buttons={[
                                {
                                    label: 'Offense',
                                    value: RobotRole.Offense,
                                },
                                {
                                    label: 'Defense',
                                    value: RobotRole.Defense,
                                },
                                {
                                    label: 'Feeder',
                                    value: RobotRole.Feeder,
                                },
                                {
                                    label: 'Immobile',
                                    value: RobotRole.Immobile,
                                }
                            ]}
                            selected={reportState!.robotRole}
                            onChange={(value) => {
                                setReportState({
                                    ...reportState!,
                                    robotRole: value,
                                })
                            }}
                        />
                    </View>

                    <View style={{ gap: 7 }}>
                        <LabelSmall>Driver ability</LabelSmall>
                        <ButtonGroup
                            buttons={
                                Object.keys(driverAbilityDescriptions).map((key) => {
                                    return {
                                        label: driverAbilityDescriptions[key as DriverAbility].numericalRating.toString(),
                                        value: key as DriverAbility,
                                    }
                                })
                            }
                            selected={reportState!.driverAbility}
                            onChange={(value) => {
                                setReportState({
                                    ...reportState!,
                                    driverAbility: value,
                                })
                            }}
                        />
                    </View>

                    <View style={{ gap: 7 }}>
                        <LabelSmall>Stage result</LabelSmall>
                        <ButtonGroup
                            direction={ButtonGroupDirection.Vertical}
                            buttons={Object.keys(stageResultDescriptions).map((key) => {
                                return {
                                    label: stageResultDescriptions[key as StageResult].localizedDescription.toString(),
                                    value: key as StageResult,
                                }
                            })}
                            selected={reportState!.stageResult}
                            onChange={(value) => {
                                setReportState({
                                    ...reportState!,
                                    stageResult: value,
                                })
                            }}
                        />
                    </View>

                    <View style={{ gap: 7 }}>
                        <LabelSmall>High note</LabelSmall>
                        <ButtonGroup
                            direction={ButtonGroupDirection.Vertical}
                            buttons={Object.keys(highNoteDescriptions).map((key) => {
                                return {
                                    label: highNoteDescriptions[key as HighNote].localizedDescription.toString(),
                                    value: key as HighNote,
                                }
                            })}
                            selected={reportState!.highNote}
                            onChange={(value) => {
                                setReportState({
                                    ...reportState!,
                                    highNote: value,
                                })
                            }}
                        />
                    </View>

                    <View style={{ gap: 7 }}>
                        <LabelSmall>Pick up</LabelSmall>
                        <ButtonGroup
                            direction={ButtonGroupDirection.Vertical}
                            buttons={Object.keys(pickUpDescriptions).map((key) => {
                                return {
                                    label: pickUpDescriptions[key as PickUp].localizedDescription.toString(),
                                    value: key as PickUp,
                                }
                            })}
                            selected={reportState!.pickUp}
                            onChange={(value) => {
                                setReportState({
                                    ...reportState!,
                                    pickUp: value,
                                })
                            }}
                        />
                    </View>

                    <View style={{ gap: 7, marginBottom: 18, }}>
                        <LabelSmall>Notes</LabelSmall>
                        <TextField
                            value={reportState!.notes}
                            onChangeText={(text) => {
                                setReportState({
                                    ...reportState!,
                                    notes: text,
                                })
                            }}
                            multiline={true}
                            returnKeyType="done"
                        />
                    </View>

                    <View style={{ gap: 10 }}>
                        <Button
                            variant="primary"
                            onPress={() => {
                                router.push('/game/submit');
                            }}
                        >
                            Submit
                        </Button>
                        <Button
                            variant="secondary"
                            onPress={() => {
                                setReportState(null);
                                navigation.dispatch(CommonActions.reset({
                                    routes: [{key: "index", name: "index"}]
                                }))
                            }}
                        >
                            Discard match
                        </Button>
                    </View>
                </SafeAreaView>
            </KeyboardAwareScrollView>
        </>
    );
}
