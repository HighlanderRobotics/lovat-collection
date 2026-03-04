import { create } from "zustand";
import { Platform } from "react-native";
import Constants from "expo-constants";
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

const getCommonHeaders = () => {
  const teamCode = useTeamStore.getState().code;
  const scouter = useScouterStore.getState().value;
  const appVersion = Constants.expoConfig?.version;

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

  return headers;
};

export const get = async (url: string) => {
  return await fetch(useUrlPrefix.getState().getUrlPrefix() + url, {
    headers: getCommonHeaders(),
  });
};

export const post = async (url: string, body: unknown) => {
  const headers = getCommonHeaders();
  headers["Content-Type"] = "application/json";

  return await fetch(useUrlPrefix.getState().getUrlPrefix() + url, {
    method: "POST",
    body: JSON.stringify(body),
    headers,
  });
};

export const put = async (url: string, body: unknown) => {
  const headers = getCommonHeaders();
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
    headers: getCommonHeaders(),
  });
};
