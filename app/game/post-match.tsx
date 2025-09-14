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
  BargeResult,
  bargeResultDescriptions,
} from "../../lib/collection/BargeResult";
import {
  algaePickUpDescriptions,
  coralPickUpDescriptions,
} from "../../lib/collection/PickUp";
import TextField from "../../lib/components/TextField";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { CommonActions } from "@react-navigation/native";
import BodyMedium from "../../lib/components/text/BodyMedium";
import { useTrainingModeStore } from "../../lib/storage/userStores";
import React from "react";
import { Checkbox } from "../../lib/components/Checkbox";

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
            title="Robot Role"
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
          <View style={{ marginVertical: 18 }}>
            <Checkbox
              label="Robot broke"
              checked={reportState.robotBrokeDescription != null}
              onChange={(checked) => {
                checked
                  ? reportState.setRobotBrokeDescription("")
                  : reportState.setRobotBrokeDescription(null);
              }}
            ></Checkbox>
            {reportState.robotBrokeDescription != null && (
              <View style={{ gap: 7, marginTop: 7 }}>
                <TextField
                  onChangeText={reportState.setRobotBrokeDescription}
                  multiline={true}
                  returnKeyType="done"
                  placeholder="How did it break?"
                />
              </View>
            )}
          </View>

          <PostMatchSelector
            title="Endgame Barge Result"
            updateStore={reportState.setBargeResult}
            items={Object.entries(bargeResultDescriptions).map(
              ([key, value]) => ({
                label: value.localizedDescription,
                value: key as BargeResult,
              }),
            )}
            selected={reportState.bargeResult}
          />
          <PostMatchSelector
            title="Coral Pick Up"
            updateStore={reportState.setCoralPickUp}
            items={Object.entries(coralPickUpDescriptions).map(
              ([key, value]) => ({
                label: value.localizedDescription,
                value: Number(key),
              }),
            )}
            selected={reportState.coralPickUp}
          />
          <PostMatchSelector
            title="Algae Pick Up"
            updateStore={reportState.setAlgaePickUp}
            items={Object.entries(algaePickUpDescriptions).map(
              ([key, value]) => ({
                label: value.localizedDescription,
                value: Number(key),
              }),
            )}
            selected={reportState.algaePickUp}
          />
          <PostMatchSelector
            title="Clears Algae from Reef"
            updateStore={(value) => reportState.setKnocksAlgae(value)}
            items={[
              { label: "No", value: 0 },
              { label: "Yes", value: 1 },
            ]}
            direction={ButtonGroupDirection.Horizontal}
            selected={reportState.knocksAlgae}
          />
          <PostMatchSelector
            title="Traverses Under Shallow Cage"
            // Probably rename this
            updateStore={(value) => reportState.setTraversesUnderCage(value)}
            items={[
              { label: "No", value: 0 },
              { label: "Yes", value: 1 },
            ]}
            direction={ButtonGroupDirection.Horizontal}
            selected={reportState.traversesUnderCage}
          />
          <View style={{ gap: 7, marginBottom: 18 }}>
            <LabelSmall>Notes</LabelSmall>
            <TextField
              value={reportState!.notes}
              onChangeText={reportState.setNotes}
              multiline={true}
              returnKeyType="done"
            />
            <View
              style={{
                marginTop: -2,
              }}
            >
              <BodyMedium>
                Keep it helpful. Notes can be viewed by anyone.
              </BodyMedium>
            </View>
          </View>
          <View style={{ gap: 10 }}>
            <Button
              disabled={trainingModeEnabled}
              variant="primary"
              onPress={() => {
                router.replace("/game/submit");
              }}
            >
              Submit
            </Button>
            <Button
              variant="secondary"
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
  const { title, updateStore, items, selected, direction } = props;

  return (
    <View style={{ gap: 7 }}>
      <LabelSmall>{title}</LabelSmall>
      <ButtonGroup
        direction={direction ?? ButtonGroupDirection.Vertical}
        buttons={items}
        selected={selected}
        onChange={(value) => updateStore(value)}
      />
    </View>
  );
}
