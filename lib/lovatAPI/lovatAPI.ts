import { create } from "zustand";
import { useTeamStore } from "../storage/userStores";
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

export const get = async (url: string) => {
  const teamCode = useTeamStore.getState().code;

  return await fetch(useUrlPrefix.getState().getUrlPrefix() + url, {
    headers: {
      method: "GET",
      "X-Team-Code": teamCode ?? "",
    },
  });
};

export const post = async (url: string, body: unknown) => {
  const teamCode = useTeamStore.getState().code;

  return await fetch(useUrlPrefix.getState().getUrlPrefix() + url, {
    method: "POST",
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json",
      "X-Team-Code": teamCode ?? "",
    },
  });
};

export const put = async (url: string, body: unknown) => {
  const teamCode = useTeamStore.getState().code;

  return await fetch(useUrlPrefix.getState().getUrlPrefix() + url, {
    method: "PUT",
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json",
      "X-Team-Code": teamCode ?? "",
    },
  });
};

export const del = async (url: string) => {
  const teamCode = useTeamStore.getState().code;

  return await fetch(useUrlPrefix.getState().getUrlPrefix() + url, {
    method: "DELETE",
    headers: {
      "X-Team-Code": teamCode ?? "",
    },
  });
};
