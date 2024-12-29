import { useTeamStore } from "../storage/userStores";

const urlPrefix = process.env.EXPO_PUBLIC_API_URL;

export const get = async (url: string) => {
  const teamCode = useTeamStore.getState().code;

  return await fetch(urlPrefix + url, {
    headers: {
      method: "GET",
      "X-Team-Code": teamCode ?? "",
    },
  });
};

export const post = async (url: string, body: unknown) => {
  const teamCode = useTeamStore.getState().code;

  return await fetch(urlPrefix + url, {
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

  return await fetch(urlPrefix + url, {
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

  return await fetch(urlPrefix + url, {
    method: "DELETE",
    headers: {
      "X-Team-Code": teamCode ?? "",
    },
  });
};
