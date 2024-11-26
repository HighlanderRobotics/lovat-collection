import { Alert, View } from "react-native";
import { NavBar } from "../../lib/components/NavBar";
import { Stack, router, useNavigation } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import Button from "../../lib/components/Button";
import LabelSmall from "../../lib/components/text/LabelSmall";
import { ButtonGroup, ButtonGroupDirection, UnkeyedButtonGroupButton } from "../../lib/components/ButtonGroup";
import { exportScoutReport, GamePiece, RobotRole } from "../../lib/collection/ReportState";
import { groundPiecesAtom, reportStateAtom } from "../../lib/collection/reportStateAtom";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { DriverAbility, driverAbilityDescriptions } from "../../lib/collection/DriverAbility";
import { ChargingResult, chargingResultDescriptions } from "../../lib/collection/ChargingResult";
import { PickUp, pickUpDescriptions } from "../../lib/collection/PickUp";
import TextField from "../../lib/components/TextField";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { CommonActions } from '@react-navigation/native'
import { trainingModeAtom } from "../settings";
import BodyMedium from "../../lib/components/text/BodyMedium";
import { MatchEventType } from "../../lib/collection/MatchEventType";
import { groundPieces, MatchEventPosition } from "../../lib/collection/MatchEventPosition";


export default function PostMatch() {
    const [reportState, setReportState] = useAtom(reportStateAtom);
    const trainingModeEnabled = useAtomValue(trainingModeAtom);
    const setGroundPieces = useSetAtom(groundPiecesAtom)

    const navigation = useNavigation();

    if (!reportState) {
        navigation.dispatch(CommonActions.reset({
            routes: [{key: "index", name: "index"}]
        }))
        return null;
    }


    return (
        <>
            <Stack.Screen 
                options={{ 
                    orientation: 'portrait_up', 
                    animationDuration: 0, 
                    animationTypeForReplace: "push", 
                    animation: "flip" 
                }} 
            />
            <NavBar
                title="Post match"
            />
            <KeyboardAwareScrollView 
                style={{ 
                    flex: 1, 
                    paddingVertical: 16, 
                    paddingHorizontal: 26, 
                    gap: 28 
                }} 
                contentContainerStyle={{ 
                    flexDirection: "row", 
                    justifyContent: "center" 
                }}
            >
                <SafeAreaView 
                    edges={['bottom', 'left', 'right']} 
                    style={{ 
                        flex: 1, 
                        gap: 7, 
                        paddingBottom: 200, 
                        maxWidth: 550 
                    }}
                >
                    <PostMatchGroupSection
                        name={"Robot Role"}
                        items={[
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
                        onChange={(value) => 
                            setReportState({
                                ...reportState,
                                robotRole: value,
                            })
                        }
                        selected={reportState!.robotRole}
                    />

                    <PostMatchGroupSection 
                        name={"Driver Ability"}
                        items={
                            Object.keys(driverAbilityDescriptions).map((key) => ({
                                label: driverAbilityDescriptions[key as DriverAbility].numericalRating.toString(),
                                value: key as DriverAbility,
                            }))
                        }
                        onChange={(value) => 
                            setReportState({
                                ...reportState,
                                driverAbility: value,
                            })
                        }
                        selected={reportState!.driverAbility}
                        direction={ButtonGroupDirection.Horizontal}
                    />

                    <PostMatchGroupSection
                        name={"Endgame Charging Result"}
                        items={
                            Object.keys(chargingResultDescriptions).map((key) => ({
                                label: chargingResultDescriptions[Number(key) as ChargingResult].localizedDescription.toString(),
                                value: Number(key) as ChargingResult,
                            }))
                        }
                        onChange={(value) => { 
                            setReportState({
                                ...reportState!,
                                endChargingResult: value
                            })
                        }}
                        selected={reportState!.endChargingResult}
                    /> 

                    <PostMatchGroupSection
                        name={"Autonomus Charging Result"}
                        items={
                            Object.keys(chargingResultDescriptions).map((key) => ({
                                label: chargingResultDescriptions[Number(key) as ChargingResult].localizedDescription.toString(),
                                value: Number(key) as ChargingResult,
                            }))
                        }
                        onChange={(value) => { 
                            setReportState({
                                ...reportState,
                                autoChargingResult: value
                            })
                        }}
                        selected={reportState!.autoChargingResult}
                    /> 
                    
                    <PostMatchGroupSection 
                        name={"Pick Up"}
                        items={
                            Object.keys(pickUpDescriptions).map((key) => ({
                                label: pickUpDescriptions[key as PickUp].localizedDescription.toString(),
                                value: key as PickUp,
                            }))
                        }
                        onChange={(value) => 
                            setReportState({
                                ...reportState,
                                pickUp: value,
                            })
                        }
                        selected={reportState!.pickUp}
                    />

                    <View 
                        style={{ 
                            gap: 7, 
                            marginBottom: 18, 
                        }}
                    >
                        <LabelSmall>
                            Notes
                        </LabelSmall>
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

                    <View 
                        style={{
                            gap: 10 
                        }}
                    >
                        <Button
                            disabled={trainingModeEnabled}
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
                                Alert.alert("Discard match?", "You will lose all of the data that you recorded.", [
                                    {
                                        text: "Cancel",
                                    },
                                    {
                                        text: "Discard",
                                        style: "destructive",
                                        onPress: () => {
                                            console.log(exportScoutReport(reportState))
                                            setReportState(null);
                                            setGroundPieces(
                                                Object.values(groundPieces).reduce(
                                                    (acc, curr) => ({...acc, [curr]: GamePiece.None}), 
                                                    {} as Record<MatchEventPosition, GamePiece>
                                                )
                                            )
                                            navigation.dispatch(CommonActions.reset({
                                                routes: [{key: "index", name: "index"}]
                                            }))
                                        }
                                    },
                                ])
                            }}
                        >
                            Discard match
                        </Button>

                        {trainingModeEnabled && (
                            <BodyMedium>
                                Disable training mode in settings to submit data.
                            </BodyMedium>
                        )}
                    </View>
                </SafeAreaView>
            </KeyboardAwareScrollView>
        </>
    );
}

function PostMatchGroupSection(props: {
    name: string, 
    onChange: (value: any) => void, 
    selected: any, 
    direction?: ButtonGroupDirection, 
    items: UnkeyedButtonGroupButton<any>[]
}) {
    const [name, onChange, selected, direction, items] = [
        props.name,
        props.onChange,
        props.selected,
        props.direction ?? ButtonGroupDirection.Vertical,
        props.items,
    ]
    return (
        <View 
            style={{ 
                gap: 7 
            }}
        >
            <LabelSmall>
                {name}
            </LabelSmall>
            <ButtonGroup
                direction={direction}
                buttons={items}
                selected={selected}
                onChange={onChange}
            />
        </View>
    )
}