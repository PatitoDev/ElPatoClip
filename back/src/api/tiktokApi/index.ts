import { CreatorPublishPermissionResponse, PostVideoRequest } from './types';


/**
 * video.publish
 */
const initiateVideo = async (postOptions: PostVideoRequest, token: string) => {
  const url = 'https://open.tiktokapis.com/v2/post/publish/video/init/';
  console.log(postOptions);

  const resp = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=UTF-8',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(postOptions)
  });

  const data = await resp.json() as {
    data: {
      publish_id?: string,
      upload_url?: string
    },
    error: {
      code: string,
      message: string,
      logId: string
    }
  };

  if (data.error.code !== 'ok') {
    console.error(data);
    return;
  }

  return data.data;
};

export interface StatusResponse {
  data: {
    status: 'FAILED' | 'PROCESSING_UPLOAD' | 'PROCESSING_DOWNLOAD' | 'SEND_TO_USER_INBOX' | 'PUBLISH_COMPLETE' | 'FAILED',
    fail_reason: string,
    publicaly_available_post_id: Array<number>,
    uploaded_bytes: number
  },
  error: {
    code: string,
    message: string,
    log_id: string
  }
}

const getUploadStatus = async (videoId: string, token: string) => {
  const url = 'https://open.tiktokapis.com/v2/post/publish/status/fetch/';
  const resp = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json; charset=UTF-8'
    },
    body: JSON.stringify({
      publish_id: videoId
    })
  });

  return await resp.json() as StatusResponse;
}; 

const getCreatorPermissions = async (token: string) => {
  const url = 'https://open.tiktokapis.com/v2/post/publish/creator_info/query/';
  const resp = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json; charset=UTF-8'
    }
  });


  return await resp.json() as CreatorPublishPermissionResponse;
};

export const TiktokApi = {
  initiateVideo,
  getUploadStatus,
  getCreatorPermissions
};