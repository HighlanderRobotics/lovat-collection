import { ActivityIndicator, Alert, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { NavBar } from "../../lib/components/NavBar";
import { IconButton } from "../../lib/components/IconButton";
import { Link, router } from "expo-router";
import { colors } from "../../lib/colors";
import { HistoryEntry, useHistoryStore } from "../../lib/storage/historyStore";
import { Suspense, useMemo, useState } from "react";
import {
  MatchIdentityLocalizationFormat,
  localizeMatchIdentity,
} from "../../lib/models/match";
import Heading1Small from "../../lib/components/text/Heading1Small";
import { Icon } from "../../lib/components/Icon";
import BodyMedium from "../../lib/components/text/BodyMedium";
import TextField from "../../lib/components/TextField";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import * as ContextMenu from "zeego/context-menu";
import { uploadReport } from "../../lib/lovatAPI/uploadReport";
import { z } from "zod";
import React from "react";

export default function History() {
  const [filterText, setFilterText] = useState("");

  return (
    <>
      <NavBar
        title="History"
        left={
          <IconButton
            icon="arrow_back_ios"
            label="Back"
            onPress={() => {
              router.back();
            }}
            color={colors.onBackground.default}
          />
        }
        bottom={
          <View
            style={{
              paddingTop: 14,
              paddingHorizontal: 10,
              flexDirection: "row",
              justifyContent: "center",
            }}
          >
            <View
              style={{
                maxWidth: 800,
                flex: 1,
              }}
            >
              <TextField
                placeholder="Search"
                value={filterText}
                onChangeText={setFilterText}
                returnKeyType="search"
              />
            </View>
          </View>
        }
      />
      <Suspense
        fallback={<ActivityIndicator size="large" style={{ flex: 1 }} />}
      >
        <Matches filter={filterText} />
      </Suspense>
    </>
  );
}

const Matches = ({ filter }: { filter: string }) => {
  const history = useHistoryStore((state) => state.history);

  const filteredMatches = useMemo(() => {
    if (!filter) return history;
    return history.filter((match) => {
      const matchIdentity = localizeMatchIdentity(
        match.meta.matchIdentity,
        MatchIdentityLocalizationFormat.Long,
      );
      const team = match.meta.teamNumber.toString();
      return (
        matchIdentity.toLowerCase().includes(filter.toLowerCase()) ||
        team.includes(filter)
      );
    });
  }, [history, filter]);

  return (
    <KeyboardAwareScrollView
      style={{ flex: 1, gap: 28 }}
      contentContainerStyle={{ flexDirection: "row", justifyContent: "center" }}
    >
      <SafeAreaView
        edges={["bottom", "left", "right"]}
        style={{
          flex: 1,
          gap: 14,
          marginVertical: 16,
          marginHorizontal: 26,
          maxWidth: 800,
        }}
      >
        {filteredMatches.map((match) => (
          <Match match={match} key={match.scoutReport.uuid} />
        ))}
      </SafeAreaView>
    </KeyboardAwareScrollView>
  );
};

const Match = ({ match }: { match: HistoryEntry }) => {
  function localizeDate(date: Date) {
    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);

    const isToday = date.toDateString() === now.toDateString();
    const isYesterday = date.toDateString() === yesterday.toDateString();

    const timeOptions = {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    } as const;
    const timeString = date.toLocaleTimeString("en-US", timeOptions);

    if (isToday) {
      return `Today at ${timeString}`;
    } else if (isYesterday) {
      return `Yesterday at ${timeString}`;
    } else {
      const dateOptions = {
        month: "2-digit",
        day: "2-digit",
        year: "2-digit",
      } as const;
      const dateString = date.toLocaleDateString("en-US", dateOptions);
      return `${dateString} at ${timeString}`;
    }
  }

  const setMatchUploaded = useHistoryStore((state) => state.setMatchUploaded);
  const deleteMatchFromHistory = useHistoryStore((state) => state.deleteMatch);

  return (
    <ContextMenu.Root>
      <ContextMenu.Trigger>
        <Link
          asChild
          href={{
            pathname: "/history/[uuid]",
            params: {
              uuid: match.scoutReport.uuid,
            },
          }}
        >
          <TouchableOpacity
            style={{
              backgroundColor: colors.secondaryContainer.default,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              paddingVertical: 10,
              paddingHorizontal: 14,
              borderRadius: 7,
            }}
          >
            <View>
              <Heading1Small>
                {localizeMatchIdentity(
                  match.meta.matchIdentity,
                  MatchIdentityLocalizationFormat.Long,
                )}
              </Heading1Small>
              <BodyMedium>
                {match.meta.teamNumber} •{" "}
                {localizeDate(new Date(match.scoutReport.startTime))}
              </BodyMedium>
            </View>
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 7 }}
            >
              {!match.uploaded && (
                <Icon
                  name="error"
                  size={24}
                  color={colors.onBackground.default}
                />
              )}
              <Icon
                name="arrow_forward_ios"
                size={20}
                color={colors.onBackground.default}
              />
            </View>
          </TouchableOpacity>
        </Link>
      </ContextMenu.Trigger>
      <ContextMenu.Content
        loop={false}
        alignOffset={0}
        avoidCollisions={true}
        collisionPadding={0}
      >
        {!match.uploaded && (
          <ContextMenu.Item
            key="upload"
            onSelect={async () => {
              try {
                await uploadReport(match!.scoutReport);
                setMatchUploaded(match!.scoutReport.uuid);
              } catch (e) {
                let message;

                try {
                  message = z
                    .object({
                      message: z.string(),
                    })
                    .parse(e).message;
                } catch {
                  message = "An unknown error occurred";
                }

                Alert.alert("Failed to upload", message);
              }
            }}
          >
            <ContextMenu.ItemIcon
              ios={{
                name: "arrow.up.to.line",
              }}
              androidIconName="upload"
            />
            <ContextMenu.ItemTitle>Upload report</ContextMenu.ItemTitle>
          </ContextMenu.Item>
        )}
        <ContextMenu.Item
          key="delete"
          destructive
          onSelect={() => {
            Alert.alert(
              "Discard data",
              "Are you sure you want to discard this match data?",
              [
                {
                  text: "Cancel",
                  style: "cancel",
                },
                {
                  text: "Discard",
                  style: "destructive",
                  onPress: () => {
                    deleteMatchFromHistory(match.scoutReport.uuid);
                  },
                },
              ],
            );
          }}
        >
          <ContextMenu.ItemIcon
            ios={{
              name: "trash",
            }}
            androidIconName="delete"
          />
          <ContextMenu.ItemTitle>Discard data</ContextMenu.ItemTitle>
        </ContextMenu.Item>
      </ContextMenu.Content>
    </ContextMenu.Root>
  );
};
