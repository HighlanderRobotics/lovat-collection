import { create } from "zustand";
import { Platform } from "react-native";
import Constants from "expo-constants";
import { v4 as uuidv4 } from "uuid";
import "react-native-get-random-values";
import { useScouterStore, useTeamStore } from "../storage/userStores";
import { persist } from "zustand/middleware";
import { storage } from "../storage/zustandStorage";

const defaultUrlPrefix = process.env.EXPO_PUBLIC_API_URL;

export const useUrlPrefix = create(
  persist<{
    urlPrefix: string | null;
    setUrlPrefix: (urlPrefix: string | null) => void;
    getUrlPrefix: () => string;
    getIsCustom: () => boolean;
  }>(
    (set, get) => ({
      urlPrefix: null,
      setUrlPrefix: (urlPrefix) => {
        set({ urlPrefix });
      },
      getUrlPrefix: () => get().urlPrefix ?? defaultUrlPrefix!,
      getIsCustom: () => get().urlPrefix !== null,
    }),
    { name: "urlPrefix", storage },
  ),
);

const DEVICE_ID_STORAGE_KEY = "deviceId";

const getDeviceId = async () => {
  const stored = await storage?.getItem(DEVICE_ID_STORAGE_KEY);

  if (stored?.state?.value) {
    return stored.state.value;
  }

  const generated = uuidv4();

  await storage?.setItem(DEVICE_ID_STORAGE_KEY, {
    state: { value: generated },
    version: 0,
  });

  return generated;
};

const getCommonHeaders = async () => {
  const teamCode = useTeamStore.getState().code;
  const scouter = useScouterStore.getState().value;
  const appVersion = Constants.expoConfig?.version;
  const deviceId = await getDeviceId();

  const headers: Record<string, string> = {
    "X-Team-Code": teamCode ?? "",
  };

  if (appVersion) {
    headers["X-App-Version"] = appVersion;
  }

  if (Platform.OS) {
    headers["X-OS-Name"] = Platform.OS;
  }

  if (scouter?.uuid) {
    headers["X-Scouter-UUID"] = scouter.uuid;
  }

  if (deviceId) {
    headers["X-Device-Id"] = deviceId;
  }

  return headers;
};

export const get = async (url: string) => {
  return await fetch(useUrlPrefix.getState().getUrlPrefix() + url, {
    headers: await getCommonHeaders(),
  });
};

export const post = async (url: string, body: unknown) => {
  const headers = await getCommonHeaders();
  headers["Content-Type"] = "application/json";

  return await fetch(useUrlPrefix.getState().getUrlPrefix() + url, {
    method: "POST",
    body: JSON.stringify(body),
    headers,
  });
};

export const put = async (url: string, body: unknown) => {
  const headers = await getCommonHeaders();
  headers["Content-Type"] = "application/json";

  return await fetch(useUrlPrefix.getState().getUrlPrefix() + url, {
    method: "PUT",
    body: JSON.stringify(body),
    headers,
  });
};

export const del = async (url: string) => {
  return await fetch(useUrlPrefix.getState().getUrlPrefix() + url, {
    method: "DELETE",
    headers: await getCommonHeaders(),
  });
};
