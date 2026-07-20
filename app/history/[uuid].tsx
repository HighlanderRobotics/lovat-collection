import { router, useLocalSearchParams } from "expo-router";
import { colors } from "../../lib/colors";
import { IconButton } from "../../lib/components/IconButton";
import { NavBar } from "../../lib/components/NavBar";
import { Suspense, useMemo } from "react";
import { ActivityIndicator, View } from "react-native";
import {
  MatchIdentityLocalizationFormat,
  localizeMatchIdentity,
} from "../../lib/models/match";
import { ScoutReportCode } from "../../lib/collection/ui/ScoutReportCode";
import { SafeAreaView } from "react-native-safe-area-context";
import Button from "../../lib/components/Button";
import { uploadReport } from "../../lib/lovatAPI/uploadReport";
import { useHistoryStore } from "../../lib/storage/historyStore";
import React from "react";
import { z } from "zod";

export default function HistoryDetails() {
  return (
    <Suspense
      fallback={
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <ActivityIndicator size="large" />
        </View>
      }
    >
      <Details />
    </Suspense>
  );
}

const Details = () => {
  const params = useLocalSearchParams();
  const history = useHistoryStore((state) => state.history);
  const setMatchUploaded = useHistoryStore((state) => state.setMatchUploaded);

  const match = useMemo(() => {
    return history.find((match) => match.scoutReport.uuid === params.uuid);
  }, [history, params.uuid]);

  return (
    <>
      <NavBar
        title={`${match!.meta.teamNumber} in ${localizeMatchIdentity(match!.meta.matchIdentity, MatchIdentityLocalizationFormat.Short)}`}
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
      />
      <SafeAreaView
        edges={["bottom", "left", "right"]}
        style={{
          flex: 1,
          gap: 7,
          flexDirection: "row",
          justifyContent: "center",
        }}
      >
        <View style={{ flex: 1, paddingVertical: 16, maxWidth: 450 }}>
          <ScoutReportCode scoutReport={match!.scoutReport} />
          <View
            style={{
              paddingHorizontal: 26,
              flex: 1,
              justifyContent: "flex-end",
            }}
          >
            {!match!.uploaded && (
              <Button
                onPress={async () => {
                  try {
                    await uploadReport(match!.scoutReport);
                    setMatchUploaded(match!.scoutReport.uuid);
                  } catch (error) {
                    try {
                      if (
                        z.object({ message: z.string() }).parse(error)
                          .message === "Scout report already uploaded"
                      ) {
                        setMatchUploaded(match!.scoutReport.uuid);
                      }
                    } catch {
                      throw Error("Upload failed");
                    }

                    throw error;
                  }
                }}
                loadingChildren="Uploading"
              >
                Upload
              </Button>
            )}
          </View>
        </View>
      </SafeAreaView>
    </>
  );
};
