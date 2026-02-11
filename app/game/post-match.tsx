import { Alert, View } from "react-native";
import { NavBar } from "../../lib/components/NavBar";
import { Stack, router, useNavigation } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import Button from "../../lib/components/Button";
import LabelSmall from "../../lib/components/text/LabelSmall";
import { Picker, PickerOption } from "../../lib/components/Picker";
import { useReportStateStore } from "../../lib/collection/reportStateStore";
import { driverAbilityDescriptions } from "../../lib/collection/DriverAbility";
import { robotRoleDescriptions } from "../../lib/collection/RobotRole";
import {
  FieldTraversal,
  fieldTraversalDescriptions,
} from "../../lib/collection/FieldTraversal";
import { accuracyDescriptions } from "../../lib/collection/Accuracy";
import { autoClimbDescriptions } from "../../lib/collection/AutoClimb";
import {
  IntakeType,
  intakeTypeDescriptions,
} from "../../lib/collection/IntakeType";
import { feederTypeDescriptions } from "../../lib/collection/FeederType";
import { Beached, beachedDescriptions } from "../../lib/collection/Beached";
import { defenseEffectivenessDescriptions } from "../../lib/collection/DefenseEffectiveness";
import { scoresWhileMovingDescriptions } from "../../lib/collection/ScoresWhileMoving";
import {
  EndgameClimb,
  endgameClimbDescriptions,
} from "../../lib/collection/EndgameClimb";
import TextField from "../../lib/components/TextField";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { CommonActions } from "@react-navigation/native";
import BodyMedium from "../../lib/components/text/BodyMedium";
import { useTrainingModeStore } from "../../lib/storage/userStores";
import React, { useEffect } from "react";
import { Checkbox } from "../../lib/components/Checkbox";
import { RobotRole } from "../../lib/collection/RobotRole";
import { MatchEventType } from "../../lib/collection/MatchEventType";

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

  const shouldShowDefenseEffectiveness =
    reportState.robotRole.includes(RobotRole.Defending) ||
    reportState.hasEventOfType(
      MatchEventType.StartDefending,
      MatchEventType.StartCamping,
    );

  const hasEndgameClimbEvent = reportState.hasEndgameClimbEvent();

  const endgameClimbIsMismatched =
    hasEndgameClimbEvent &&
    reportState.climbResult === EndgameClimb.NotAttempted;

  const hasOutpostIntakeEvent = reportState.hasOutpostIntakeEvent();
  const autoTraversalTypes = reportState.getAutoTraversalTypes();

  // Auto-set intake type based on events
  useEffect(() => {
    if (hasOutpostIntakeEvent) {
      if (reportState.intakeType === IntakeType.Ground) {
        reportState.setIntakeType(IntakeType.Both);
      } else if (reportState.intakeType === IntakeType.Neither) {
        reportState.setIntakeType(IntakeType.Outpost);
      }
    }
  }, [hasOutpostIntakeEvent]);

  // Auto-set traversal type based on auto events
  useEffect(() => {
    if (autoTraversalTypes.trench || autoTraversalTypes.bump) {
      let newSelection = reportState.fieldTraversal;

      if (autoTraversalTypes.trench && autoTraversalTypes.bump) {
        newSelection = FieldTraversal.Both;
      } else if (autoTraversalTypes.trench) {
        newSelection = FieldTraversal.Trench;
      } else if (autoTraversalTypes.bump) {
        newSelection = FieldTraversal.Bump;
      }

      if (newSelection !== reportState.fieldTraversal) {
        reportState.setFieldTraversal(newSelection);
      }
    }
  }, [autoTraversalTypes]);

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
        bottomOffset={48}
        keyboardDismissMode="interactive"
        disableScrollOnKeyboardHide={true}
      >
        <SafeAreaView
          edges={["bottom", "left", "right"]}
          style={{ flex: 1, gap: 14, paddingBottom: 200, maxWidth: 550 }}
        >
          <PostMatchSelector
            title="Robot roles"
            items={robotRoleDescriptions.map((roleDescription) => ({
              label: roleDescription.localizedDescription,
              description: roleDescription.localizedLongDescription,
              value: roleDescription.role,
            }))}
            selected={reportState.robotRole}
            onChange={reportState.setRobotRole}
            multiSelect
          />
          {reportState.hasEventOfType(MatchEventType.StartScoring) && (
            <PostMatchSelector
              title="Accuracy"
              items={accuracyDescriptions.map((desc) => ({
                label: desc.localizedDescription,
                description: desc.localizedLongDescription,
                value: desc.accuracy,
              }))}
              selected={reportState.accuracy}
              onChange={reportState.setAccuracy}
            />
          )}
          {reportState.robotRole.includes(RobotRole.Feeding) && (
            <PostMatchSelector
              title="Feeder Type"
              items={feederTypeDescriptions.map((desc) => ({
                label: desc.localizedDescription,
                description: desc.localizedLongDescription,
                value: desc.feederType,
              }))}
              selected={reportState.feederType}
              onChange={reportState.setFeederType}
              multiSelect
            />
          )}
          {shouldShowDefenseEffectiveness && (
            <PostMatchSelector
              title="Defense Effectiveness"
              items={defenseEffectivenessDescriptions.map((desc) => ({
                label: desc.localizedDescription,
                description: desc.localizedLongDescription,
                value: desc.effectiveness,
              }))}
              selected={reportState.defenseEffectiveness}
              onChange={reportState.setDefenseEffectiveness}
            />
          )}
          <PostMatchSelector<string, IntakeType>
            title="Intake Type"
            items={intakeTypeDescriptions
              .filter(
                (desc) =>
                  desc.intakeType === IntakeType.Ground ||
                  desc.intakeType === IntakeType.Outpost,
              )
              .map((desc) => ({
                label: desc.localizedDescription,
                description: desc.localizedLongDescription,
                value:
                  desc.intakeType === IntakeType.Ground ? "ground" : "outpost",
                disabled:
                  desc.intakeType === IntakeType.Outpost &&
                  hasOutpostIntakeEvent,
              }))}
            selected={
              reportState.intakeType === IntakeType.Both
                ? ["ground", "outpost"]
                : reportState.intakeType === IntakeType.Ground
                  ? ["ground"]
                  : reportState.intakeType === IntakeType.Outpost
                    ? ["outpost"]
                    : []
            }
            onChange={reportState.setIntakeType}
            multiSelect
            mapSelection={(selected) => {
              const hasGround = selected.includes("ground");
              const hasOutpost = selected.includes("outpost");
              if (hasGround && hasOutpost) return IntakeType.Both;
              if (hasGround) return IntakeType.Ground;
              if (hasOutpost) return IntakeType.Outpost;
              return IntakeType.Neither;
            }}
          />
          <PostMatchSelector<string, FieldTraversal>
            title="Field Traversal"
            items={fieldTraversalDescriptions
              .filter(
                (desc) =>
                  desc.traversal === FieldTraversal.Trench ||
                  desc.traversal === FieldTraversal.Bump,
              )
              .map((desc) => ({
                label: desc.localizedDescription,
                description: desc.localizedLongDescription,
                value:
                  desc.traversal === FieldTraversal.Trench ? "trench" : "bump",
                disabled:
                  (desc.traversal === FieldTraversal.Trench &&
                    autoTraversalTypes.trench) ||
                  (desc.traversal === FieldTraversal.Bump &&
                    autoTraversalTypes.bump),
              }))}
            selected={
              reportState.fieldTraversal === FieldTraversal.Both
                ? ["trench", "bump"]
                : reportState.fieldTraversal === FieldTraversal.Trench
                  ? ["trench"]
                  : reportState.fieldTraversal === FieldTraversal.Bump
                    ? ["bump"]
                    : []
            }
            onChange={reportState.setFieldTraversal}
            multiSelect
            mapSelection={(selected) => {
              const hasTrench = selected.includes("trench");
              const hasBump = selected.includes("bump");
              if (hasTrench && hasBump) return FieldTraversal.Both;
              if (hasTrench) return FieldTraversal.Trench;
              if (hasBump) return FieldTraversal.Bump;
              return FieldTraversal.None;
            }}
          />
          <PostMatchSelector
            title="Auto Climb"
            items={autoClimbDescriptions.map((desc) => ({
              label: desc.localizedDescription,
              description: desc.localizedLongDescription,
              value: desc.climb,
            }))}
            selected={reportState.autoClimb}
            onChange={reportState.setAutoClimb}
          />
          {hasEndgameClimbEvent && (
            <PostMatchSelector
              title="Endgame Climb"
              items={endgameClimbDescriptions
                .filter((desc) => desc.climb !== EndgameClimb.NotAttempted)
                .map((desc) => ({
                  label: desc.localizedDescription,
                  description: desc.localizedLongDescription,
                  value: desc.climb,
                }))}
              selected={reportState.climbResult}
              onChange={reportState.setClimbResult}
            />
          )}

          <PostMatchSelector<string, Beached>
            title="Beached"
            items={beachedDescriptions
              .filter(
                (desc) =>
                  desc.beached === Beached.OnFuel ||
                  desc.beached === Beached.OnBump,
              )
              .map((desc) => ({
                label: desc.localizedDescription,
                description: desc.localizedLongDescription,
                value: desc.beached === Beached.OnFuel ? "fuel" : "bump",
              }))}
            selected={
              reportState.beached === Beached.Both
                ? ["fuel", "bump"]
                : reportState.beached === Beached.OnFuel
                  ? ["fuel"]
                  : reportState.beached === Beached.OnBump
                    ? ["bump"]
                    : []
            }
            onChange={reportState.setBeached}
            multiSelect
            mapSelection={(selected) => {
              const hasFuel = selected.includes("fuel");
              const hasBump = selected.includes("bump");
              if (hasFuel && hasBump) return Beached.Both;
              if (hasFuel) return Beached.OnFuel;
              if (hasBump) return Beached.OnBump;
              return Beached.Neither;
            }}
          />
          <PostMatchSelector
            title="Driver ability"
            items={driverAbilityDescriptions.map((desc) => ({
              label: desc.localizedDescription,
              description: desc.localizedLongDescription,
              value: desc.ability,
            }))}
            selected={reportState.driverAbility}
            onChange={reportState.setDriverAbility}
          />

          <PostMatchSelector
            title="Scores While Moving"
            items={scoresWhileMovingDescriptions.map((desc) => ({
              label: desc.localizedDescription,
              description: desc.localizedLongDescription,
              value: desc.scoresWhileMoving,
            }))}
            selected={reportState.scoresWhileMoving}
            onChange={reportState.setScoresWhileMoving}
          />

          <View style={{ marginVertical: 18 }}>
            <Checkbox
              label="Robot broke"
              checked={reportState.robotBrokeDescription != null}
              onChange={(checked) => {
                reportState.setRobotBrokeDescription(checked ? "" : null);
              }}
            />
            {reportState.robotBrokeDescription != null && (
              <View style={{ gap: 7, marginTop: 7 }}>
                <TextField
                  value={reportState.robotBrokeDescription}
                  onChangeText={reportState.setRobotBrokeDescription}
                  multiline={true}
                  returnKeyType="done"
                  placeholder="How did it break?"
                />
              </View>
            )}
          </View>

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
              disabled={trainingModeEnabled || endgameClimbIsMismatched}
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

// Base props shared by all variants
type BaseProps<T> = {
  title: string;
  items: PickerOption<T>[];
};

// Single-select: multiSelect is false or undefined
type SingleSelectProps<T> = BaseProps<T> & {
  selected: T;
  onChange: (value: T) => void;
  multiSelect?: false;
  mapSelection?: undefined;
};

// True multi-select: multiSelect is true, no mapSelection
type TrueMultiSelectProps<T> = BaseProps<T> & {
  selected: T[];
  onChange: (value: T[]) => void;
  multiSelect: true;
  mapSelection?: undefined;
};

// Pseudo multi-select: multiSelect is true with mapSelection
type MappedMultiSelectProps<TItem, TOutput> = BaseProps<TItem> & {
  selected: TItem[];
  onChange: (value: TOutput) => void;
  multiSelect: true;
  mapSelection: (selected: TItem[]) => TOutput;
};

// Overloaded function signatures for proper type inference
function PostMatchSelector<T>(props: SingleSelectProps<T>): React.ReactElement;
function PostMatchSelector<T>(
  props: TrueMultiSelectProps<T>,
): React.ReactElement;
function PostMatchSelector<TItem, TOutput>(
  props: MappedMultiSelectProps<TItem, TOutput>,
): React.ReactElement;
function PostMatchSelector<TItem, TOutput = TItem>(
  props:
    | SingleSelectProps<TItem>
    | TrueMultiSelectProps<TItem>
    | MappedMultiSelectProps<TItem, TOutput>,
) {
  const { title, items, multiSelect, selected } = props;

  const handleChange = (value: TItem) => {
    if (!multiSelect) {
      // Single select
      (props as SingleSelectProps<TItem>).onChange(value);
    } else {
      // Multi-select
      const selectedArray = selected as TItem[];
      let newSelected: TItem[];
      if (selectedArray.includes(value)) {
        newSelected = selectedArray.filter((v) => v !== value);
      } else {
        newSelected = [...selectedArray, value];
      }

      if ("mapSelection" in props && props.mapSelection) {
        // Pseudo multi-select: map to enum value
        (props as MappedMultiSelectProps<TItem, TOutput>).onChange(
          props.mapSelection(newSelected),
        );
      } else {
        // True multi-select: pass array
        (props as TrueMultiSelectProps<TItem>).onChange(newSelected);
      }
    }
  };

  return (
    <View style={{ gap: 7 }}>
      <LabelSmall>{title}</LabelSmall>
      <Picker
        style="inset-picker"
        options={items}
        selected={selected}
        onChange={handleChange}
        multiSelect={multiSelect}
      />
    </View>
  );
}
