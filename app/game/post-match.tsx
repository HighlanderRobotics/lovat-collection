import { Alert, View } from "react-native";
import { NavBar } from "../../lib/components/NavBar";
import { Stack, router, useNavigation } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import Button from "../../lib/components/Button";
import LabelSmall from "../../lib/components/text/LabelSmall";
import {
  ButtonGroup,
  ButtonGroupButton,
  ButtonGroupDirection,
} from "../../lib/components/ButtonGroup";
import { RobotRole } from "../../lib/collection/ReportState";
import { useReportStateStore } from "../../lib/collection/reportStateStore";
import {
  DriverAbility,
  driverAbilityDescriptions,
} from "../../lib/collection/DriverAbility";
import {
  StageResult,
  stageResultDescriptions,
} from "../../lib/collection/StageResult";
import { HighNote, highNoteDescriptions } from "../../lib/collection/HighNote";
import { PickUp, pickUpDescriptions } from "../../lib/collection/PickUp";
import TextField from "../../lib/components/TextField";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { CommonActions } from "@react-navigation/native";
import BodyMedium from "../../lib/components/text/BodyMedium";
import { useTrainingModeStore } from "../../lib/storage/userStores";
import React from "react";
import { colors } from "../../lib/colors";

export default function PostMatch() {
  const reportState = useReportStateStore();
  const trainingModeEnabled = useTrainingModeStore((state) => state.value);

  const navigation = useNavigation();

  if (!reportState) {
    navigation.dispatch(
      CommonActions.reset({
        routes: [{ key: "index", name: "index" }],
      }),
    );
    return null;
  }

  return (
    <>
      <Stack.Screen
        options={{
          orientation: "portrait_up",
          animationDuration: 0,
          animationTypeForReplace: "push",
          animation: "flip",
        }}
      />
      <NavBar title="Post match" />
      <KeyboardAwareScrollView
        style={{ flex: 1, paddingVertical: 16, paddingHorizontal: 26, gap: 28 }}
        contentContainerStyle={{
          flexDirection: "row",
          justifyContent: "center",
        }}
      >
        <SafeAreaView
          edges={["bottom", "left", "right"]}
          style={{ flex: 1, gap: 7, paddingBottom: 200, maxWidth: 550 }}
        >
          <PostMatchSelector
            title="Robot role"
            updateStore={reportState.setRobotRole}
            items={[
              { label: "Offense", value: RobotRole.Offense },
              { label: "Defense", value: RobotRole.Defense },
              { label: "Feeder", value: RobotRole.Feeder },
              { label: "Immobile", value: RobotRole.Immobile },
            ]}
            selected={reportState.robotRole}
          />

          <PostMatchSelector
            title="Driver Ability"
            updateStore={reportState.setDriverAbility}
            items={Object.entries(driverAbilityDescriptions).map(
              ([key, value]) => ({
                label: value.numericalRating.toString(),
                value: key as DriverAbility,
              }),
            )}
            selected={reportState.driverAbility}
            direction={ButtonGroupDirection.Horizontal}
          />

          <PostMatchSelector
            title="Stage result"
            updateStore={reportState.setStageResult}
            items={Object.entries(stageResultDescriptions).map(
              ([key, value]) => ({
                label: value.localizedDescription,
                value: key as StageResult,
              }),
            )}
            selected={reportState.stageResult}
          />

          <PostMatchSelector
            title="High Note"
            updateStore={reportState.setHighNote}
            items={Object.entries(highNoteDescriptions).map(([key, value]) => ({
              label: value.localizedDescription,
              value: key as HighNote,
            }))}
            selected={reportState.highNote}
          />

          <PostMatchSelector
            title="Pick up"
            updateStore={reportState.setPickUp}
            items={Object.entries(pickUpDescriptions).map(([key, value]) => ({
              label: value.localizedDescription,
              value: key as PickUp,
            }))}
            selected={reportState.pickUp}
          />

          <View style={{ gap: 7, marginBottom: 18 }}>
            <LabelSmall>Notes</LabelSmall>
            <TextField
              value={reportState!.notes}
              onChangeText={reportState.setNotes}
              multiline={true}
              returnKeyType="done"
            />
          </View>

          <View style={{ gap: 10 }}>
            <Button
              disabled={trainingModeEnabled}
              color={colors.victoryPurple.default}
              textColor={colors.background.default}
              onPress={() => {
                router.push("/game/submit");
              }}
            >
              Submit
            </Button>
            <Button
              color={colors.gray.default}
              textColor={colors.onBackground.default}
              onPress={() => {
                Alert.alert(
                  "Discard match?",
                  "You will lose all of the data that you recorded.",
                  [
                    {
                      text: "Cancel",
                    },
                    {
                      text: "Discard",
                      style: "destructive",
                      onPress: () => {
                        reportState.reset();
                        navigation.dispatch(
                          CommonActions.reset({
                            routes: [{ key: "index", name: "index" }],
                          }),
                        );
                      },
                    },
                  ],
                );
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

function PostMatchSelector<T>(props: {
  title: string;
  updateStore: (value: T) => void;
  items: ButtonGroupButton<T>[];
  selected: T;
  direction?: ButtonGroupDirection;
}) {
  const [title, updateStore, items, selected, direction] = [
    props.title,
    props.updateStore,
    props.items,
    props.selected,
    props.direction ?? ButtonGroupDirection.Vertical,
  ];
  return (
    <View style={{ gap: 7 }}>
      <LabelSmall>{title}</LabelSmall>
      <ButtonGroup
        color={colors.secondaryContainer.default}
        direction={direction}
        buttons={items}
        selected={selected}
        onChange={(value) => updateStore(value)}
      />
    </View>
  );
}
