
export interface PostVideoPayload {
  post_info: VideoPostInfo,
  source_info: VideoSourceInfo
}

export interface VideoPostInfo {
  title: string,
  privacy_level: 
    'PUBLIC_TO_EVERYONE' | 
    'MUTUAL_FOLLOW_FRIENDS' | 
    'FOLLOWER_OF_CREATOR' | 
    'SELF_ONLY',
  disable_duet: boolean,
  disable_comment: boolean,
  disable_stitch: boolean,
  video_cover_timestamp_ms: number,
  brand_content_toggle: boolean,
  brand_organic_toggle: boolean,
}

export interface VideoSourceInfo {
  source: 'PULL_FROM_URL' | 'FILE_UPLOAD',
  video_size: number,
  chunk_size: number,
  total_chunk_count: number
}

const createVideoContainer = async (
  token: string,
  videoPostInfo: VideoPostInfo,
  videoSourceInfo: VideoSourceInfo
) => {
  const url = 'https://open.tiktokapis.com/v2/post/publish/inbox/video/init/';

  const resp = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=UTF-8',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      post_info: videoPostInfo,
      source_info: videoSourceInfo
    })
  });

  if (!resp.ok) {
    console.log(resp.status);
    console.log(await resp.text());
    return;
  }

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
    console.log(data);
    return;
  }

  return data.data.upload_url;
};

const uploadVideoChunk = async (uploadUrl: string, chunkSize: number, firstByte: number, totalBytes: number, body: BodyInit) => {
  const resp = await fetch(uploadUrl, {
    method: 'PUT',
    headers: {
      // TODO - check last byte
      'Content-Range': `bytes ${firstByte}-${firstByte + chunkSize - 1}/${totalBytes}`,
      'Content-Length': chunkSize.toString(),
      'Content-Type': 'video/webm'
    },
    body
  });
  return resp.ok;
}; 

export const TiktokApi = {
  createVideoContainer,
  uploadVideoChunk
};