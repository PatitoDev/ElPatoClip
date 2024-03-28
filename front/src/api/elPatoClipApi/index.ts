import { User } from '../../authContext';
import { PostVideoPayload } from '../tiktokApi';
import { readBlob } from './responseReaders';
import { ChannelSearchResponse, ClipListRequestFilters, ClipsResponse, UserDetails  } from './types';

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

const authenticate = async (code: string) => {
  const resp = await fetch(`${baseApi}login`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify({ 
      code,
      provider: 'tiktok'
    })
  });

  if (!resp.ok) return;

  return await resp.json() as {
    user: User,
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
  const resp = await fetch(`${baseApi}user/initiate-upload`, {
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
  const resp = await fetch(`${baseApi}video/status`, {
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

export const ElPatoApi = {
  getClips,
  getClip,
  searchUser,
  getChannelDetails,
  authenticate,
  getUploadToken,
  initiateVideo,
  getVideoStatus
};