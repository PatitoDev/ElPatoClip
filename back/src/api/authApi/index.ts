const REDIRECT_URL = 'https://clip.elpato.dev';
const BASE_URL = 'http://localhost:8022';
const APP_ID = 'elpatoclip';

export enum LoginServices {
  tiktok = 'tiktok',
  twitch = 'twitch'
}

export const authenticate = async (code: string, service: LoginServices) => {
  const resp = await fetch(BASE_URL + `/${APP_ID}/authenticate/${service}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      code,
      redirectUrl: REDIRECT_URL
    })
  });

  if (resp.ok) {
    return await resp.json();
  }
};

export const verifyToken = async (token: string) => {
  const resp = await fetch(BASE_URL + '/token/verify', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ token })
  });
  return resp.ok;
};

export interface ElPatoConnection {
  token: string,
  refresh_token: string,
  user_id: string,
  type: 'tiktok' | 'twitch' | 'youtube'
}

export const getConnections = async (userId: number) => {
  const resp = await fetch(BASE_URL + `/${APP_ID}/user/${userId}/connections`);
  if (!resp.ok) return;

  return await resp.json() as Array<ElPatoConnection>;
};