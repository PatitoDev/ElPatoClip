import { ApiResponse } from '../types';
import { readBlob } from './responseReaders';
import { ChannelDetails, ChannelSearchResponse, ClipListRequestFilters, ClipsResponse, CreatorPublishPermissionResponse, ElPatoConnection, PostVideoPayload } from './types';

const baseApi = import.meta.env.MODE === 'production' ?  'https://api.niv3kelpato.com/clipApi/' : 'http://localhost:3000/';

const searchUser = async (searchString: string) => (
  await request<Array<ChannelSearchResponse>>(`${baseApi}channels?search=${searchString}`)
);

const getChannelDetails = async (channelId: string): Promise<ApiResponse<ChannelDetails>> => (
  await request<ChannelDetails>(`${baseApi}channel/${channelId}`)
);

const getClips = async (channelName: string, filters: ClipListRequestFilters):Promise<ApiResponse<ClipsResponse>> => (
  await request<ClipsResponse>(`${baseApi}channel/${channelName}/clips`, {
    method: 'POST',
    body: JSON.stringify(filters),
    headers: {
      'content-type': 'application/json',
    }
  })
);

const getClip = async (clipId: string, onProgress: (progress: number, total:number) => void): Promise<ApiResponse<Blob>> => {
  try {
    const resp = await fetch(`${baseApi}clip/${clipId}`);
    if (!resp.ok)
      return { error: true, status: resp.status, data: null };

    const blob = await readBlob(resp, onProgress);
    return { data: blob, error: false, status: resp.status };
  } catch {
    return { data: null, error: true, status: 500 };
  }
};


const authenticate = async (code: string, provider: string, redirectUrl: string) => (
  await request<{ token: string }>(`${baseApi}login`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      code,
      provider: provider,
      redirectUrl
    })
  })
);

const request = async <T>(path: string, options: RequestInit = {}): Promise<ApiResponse<T>> => {
  try {

    const resp = await fetch(path, options);

    if (!resp.ok)
      return { error: true, status: resp.status, data: null };

    try {
      return {
        data: await resp.json(),
        error: false,
        status: resp.status
      };
    } catch {
      return {
        data: null as T,
        error: false,
        status: resp.status
      };
    }
  } catch {
    return {
      data: null,
      error: true,
      status: 500
    };
  }
};

const initiateVideo = async (payload: PostVideoPayload, token: string) => (
  await request<{ publish_id: string, upload_url: string }>(`${baseApi}tiktok/initiate-upload`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  })
);

// TODO - type this
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

const getConnectionDetails = async (token: string, connectionType: string) => (
  await request<ElPatoConnection>(`${baseApi}user/connection/${connectionType}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  })
);

const createConnection = async (token: string, connectionType: string, redirectUrl: string, code: string) => (
  await request(`${baseApi}user/connection/${connectionType}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      code,
      redirectUrl
    })
  })
);

const deleteConnection = async (token: string, connectionType: string) => (
  await request(`${baseApi}user/connection/${connectionType}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    },
  })
);

const getTiktokCreatorPermissions = async (token: string) => (
  await request<CreatorPublishPermissionResponse>(`${baseApi}tiktok/permissions`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
);

export const ElPatoApi = {
  getClips,
  getClip,
  searchUser,
  getChannelDetails,
  authenticate,
  initiateVideo,
  getVideoStatus,
  getConnectionDetails,
  createConnection,
  deleteConnection,
  getTiktokCreatorPermissions
};