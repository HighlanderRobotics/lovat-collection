import {
  ActivityIndicator,
  KeyboardAvoidingView,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import BodyMedium from "../../lib/components/text/BodyMedium";
import Button from "../../lib/components/Button";
import { SafeAreaView } from "react-native-safe-area-context";
import TitleMedium from "../../lib/components/text/TitleMedium";
import TextField from "../../lib/components/TextField";
import { useEffect, useState } from "react";
import { colors } from "../../lib/colors";
import { addScouter } from "../../lib/lovatAPI/addScouter";
import { router } from "expo-router";
import { z } from "zod";
import { Scouter } from "../../lib/models/scouter";
import { useTeamScoutersStore } from "../../lib/services";
import { useScouterStore, useTeamStore } from "../../lib/storage/userStores";

export default function Name() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const scouters = useTeamScoutersStore((state) => state.data);
  const fetchScouters = useTeamScoutersStore((state) => state.fetchData);
  const setScouter = useScouterStore((state) => state.setValue);
  const [fieldText, setFieldText] = useState("");

  useEffect(() => {
    fetchScouters();
  }, []);

  useEffect(() => {
    if (scouters) {
      setLoading(false);
    }
  }, [scouters]);

  const submitScouter = (scouter: Scouter) => {
    setLoading(true);
    setError(null);

    try {
      setScouter(scouter);
      router.push("/onboarding/tournaments");
    } catch (e) {
      let message;
      try {
        message = z.object({ message: z.string() }).parse(e).message;
      } catch {
        message = "An unknown error occurred";
      }

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const filteredScouters = scouters?.filter((scouter) =>
    scouter.name.toLowerCase().includes(fieldText.toLowerCase()),
  );

  return (
    <SafeAreaView
      style={{ flex: 1, flexDirection: "row", justifyContent: "center" }}
      edges={["top", "right", "left"]}
    >
      <View
        style={{
          flex: 1,
          paddingVertical: 16,
          paddingHorizontal: 26,
          maxWidth: 550,
        }}
      >
        <TitleMedium>Enter your name</TitleMedium>
        <TextField onChangeText={(text) => setFieldText(text)} />

        <LoadingView loading={loading} />
        <ErrorView error={error} />

        {!loading && (
          <KeyboardAvoidingView
            style={{ flex: 1, justifyContent: "center" }}
            behavior="padding"
          >
            <ScoutersView
              scouters={filteredScouters}
              onSubmit={submitScouter}
              filterText={fieldText}
            />
            <NewScouterPrompt
              visible={!!fieldText && !filteredScouters?.length}
              name={fieldText}
              onSubmit={submitScouter}
            />
          </KeyboardAvoidingView>
        )}
      </View>
    </SafeAreaView>
  );
}

const NewScouterPrompt = ({
  visible,
  name,
  onSubmit,
}: {
  visible: boolean;
  name: string;
  onSubmit: (scouter: Scouter) => void;
}) => {
  if (!visible) return null;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const teamNumber = useTeamStore((state) => state.number);

  const onPress = async () => {
    if (loading) return;

    setLoading(true);
    setError(null);

    try {
      const scouter = await addScouter(name, teamNumber!);

      onSubmit(scouter);
    } catch (e) {
      let message;
      try {
        message = z.object({ message: z.string() }).parse(e).message;
      } catch {
        message = "An unknown error occurred";
      }

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ alignItems: "center" }}>
      <View style={{ padding: 10 }}>
        <BodyMedium>Scouter &ldquo;{name}&rdquo; not found.</BodyMedium>
      </View>
      <Button variant="primary" onPress={onPress} disabled={loading}>
        Create new scouter
      </Button>

      <LoadingView loading={loading} />
      <ErrorView error={error} />
    </View>
  );
};

const ScoutersView = ({
  scouters,
  onSubmit,
}: {
  scouters?: Scouter[];
  onSubmit?: (scouter: Scouter) => void;
  filterText?: string;
}) => {
  if (!scouters || scouters.length === 0) return null;

  return (
    <ScrollView style={{ flex: 1, paddingVertical: 10 }}>
      <View style={{ paddingBottom: 80 }}>
        {scouters.map((scouter) => (
          <TouchableOpacity
            key={scouter.uuid}
            style={{
              paddingVertical: 10,
              paddingHorizontal: 10,
              borderRadius: 7,
              backgroundColor: colors.secondaryContainer.default,
              marginBottom: 10,
            }}
            onPress={() => onSubmit && onSubmit(scouter)}
          >
            <BodyMedium>{scouter.name}</BodyMedium>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

const LoadingView = ({ loading }: { loading?: boolean }) => {
  if (!loading) return null;

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
    >
      <ActivityIndicator size="large" />
    </KeyboardAvoidingView>
  );
};

const ErrorView = ({ error }: { error: string | null }) => {
  if (!error) return null;

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
    >
      <BodyMedium color={colors.danger.default}>{error}</BodyMedium>
    </KeyboardAvoidingView>
  );
};
