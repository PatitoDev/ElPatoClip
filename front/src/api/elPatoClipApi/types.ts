export interface ClipsResponse {
  data: Array<Clip>,
  pagination: {
    cursor?: string,
  }
}

export interface Clip {
  id: string
  url: string
  embed_url: string
  broadcaster_id: string
  broadcaster_name: string
  creator_id: string
  creator_name: string
  video_id: string
  game_id: string
  language: string
  title: string
  view_count: number
  created_at: string
  thumbnail_url: string
  duration: number
  vod_offset: number
  is_featured: boolean
}

export interface ClipListRequestFilters {
  /**
   * on twitch api as first
   */
  amount: number,
  beforeCursor?: string,
  afterCursor?: string,
  isFeatured?: boolean,
  startedAt?: string,
  endedAt?: string,
}

export interface ChannelSearchResponse {
  id: string,
  displayName: string,
  profileImg: string
}

export interface UserDetails {
  id: string,
  login: string,
  display_name: string,
  type: 'admin' | 'global_mod' | 'staff' | '',
  broadcaster_type: 'affiliate' | 'partner' | '',
  description: string,
  profile_image_url: string,
  offline_image_url: string,
  created_at: string
}

export interface ElPatoConnection {
  type: 'twitch' | 'tiktok',
  displayName: string,
  profileImageUrl: string
}

//

export interface TikTokResponse<T> {
  data: T,
  error: {
    code: string,
    message: string,
    log_id: string
  }
}

export interface CreatorPublishPermissions {
  creator_avatar_url: string,
  creator_username: string,
  creator_nickname: string,
  privacy_level_options: Array<
    'PUBLIC_TO_EVERYONE' | 'MUTUAL_FOLLOW_FRIENDS' | 
    'SELF_ONLY' | 'FOLLOWER_OF_CREATOR' | 'MUTUAL_FOLLOW_FRIENDS' | 'SELF_ONLY'
  >,
  comment_disabled: boolean,
  duet_disabled: boolean,
  stitch_disabled: boolean,
  max_video_post_duration_sec: number,
}

export interface CreatorPublishPermissionResponse extends TikTokResponse<CreatorPublishPermissions> {}