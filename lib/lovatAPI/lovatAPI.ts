
export const urlPrefix = "http://macbook-pro.local:3000";

export const get = async (url: string) => {
  return await fetch(urlPrefix + url);
};

export const post = async (url: string, body: any) => {
  return await fetch(urlPrefix + url, {
    method: "POST",
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json",
    }
  });
};

export const put = async (url: string, body: any) => {
  return await fetch(urlPrefix + url, {
    method: "PUT",
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json",
    }
  });
};

export const del = async (url: string) => {
  return await fetch(urlPrefix + url, {
    method: "DELETE",
  });
};
