import { PostVideoPayload } from '../tiktokApi';
import { readBlob } from './responseReaders';
import { ChannelSearchResponse, ClipListRequestFilters, ClipsResponse, CreatorPublishPermissionResponse, ElPatoConnection, UserDetails  } from './types';

const baseApi = import.meta.env.MODE === 'production' ?  'https://api.niv3kelpato.com/clipApi/' : 'http://localhost:3000/';

const getClips = async (channelName: string, filters: ClipListRequestFilters) => {
  const resp = await fetch(`${baseApi}channel/${channelName}/clips`, {
    method: 'POST',
    body: JSON.stringify(filters),
    headers: {
      'content-type': 'application/json',
    }
  });
  return (await resp.json()) as ClipsResponse;
};

const getChannelDetails = async (channelId: string) => {
  const resp = await fetch(`${baseApi}channel/${channelId}`);
  return await resp.json() as UserDetails;
};

const getClip = async (clipId: string, onProgress: (progress: number, total:number) => void) => {
  const resp = await fetch(`${baseApi}clip/${clipId}`);
  return await readBlob(resp, onProgress);
};

const searchUser = async (searchString: string) => {
  const resp = await fetch(`${baseApi}channels?search=${searchString}`);
  return await resp.json() as Array<ChannelSearchResponse>;
};

const authenticate = async (code: string, provider: string, redirectUrl: string) => {
  const resp = await fetch(`${baseApi}login`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      code,
      provider: provider,
      redirectUrl
    })
  });

  if (!resp.ok) return;

  return await resp.json() as {
    token: string
  };
};

const getUploadToken = async (elPatoAuthToken: string, connectionType: string) => {
  const resp = await fetch(`${baseApi}upload-token/${connectionType}`, {
    headers: {
      'Authorization': `Bearer ${elPatoAuthToken}`
    }
  });

  if (!resp.ok) return;

  const data = await resp.json() as { token: string };
  return data.token;
};

const initiateVideo = async (payload: PostVideoPayload, token: string) => {
  const resp = await fetch(`${baseApi}tiktok/initiate-upload`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });
  if (!resp.ok) return;
  return await resp.json() as { 
    publish_id: string,
    upload_url: string
  };
};

const getVideoStatus = async (videoId: string, token: string) => {
  const resp = await fetch(`${baseApi}tiktok/video/status`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({
      id: videoId
    })
  });
  return await resp.json();
};

const getConnectionDetails = async (token: string, connectionType: string) => {
  const resp = await fetch(`${baseApi}user/connection/${connectionType}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (resp.status === 404) return;

  if (!resp.ok) return;

  return await resp.json() as ElPatoConnection;
};

const createConnection = async (token: string, connectionType: string, redirectUrl: string, code: string) => {
  const resp = await fetch(`${baseApi}user/connection/${connectionType}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      code,
      redirectUrl
    })
  });

  return resp.ok;
};

const deleteConnection = async (token: string, connectionType: string) => {
  const resp = await fetch(`${baseApi}user/connection/${connectionType}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    },
  });

  return resp.ok;
};

const getTiktokCreatorPermissions = async (token: string) => {
  const resp = await fetch(`${baseApi}tiktok/permissions`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return await resp.json() as CreatorPublishPermissionResponse;
};

export const ElPatoApi = {
  getClips,
  getClip,
  searchUser,
  getChannelDetails,
  authenticate,
  getUploadToken,
  initiateVideo,
  getVideoStatus,
  getConnectionDetails,
  createConnection,
  deleteConnection,
  getTiktokCreatorPermissions
};