import * as S from './styles';
import { useEffect, useState } from 'react';
import { CreatorPublishPermissions, ElPatoConnection } from '../../../../../api/elPatoClipApi/types';
import { Button } from '../../../../Atoms/Button';
import { Input } from '../../../../Atoms/Input';
import { Select } from '../../../../Atoms/Select';
import { ConnectionButton } from '../../../../Molecules/ConnectionButton';
import { useAuth } from '../../../../../authContext/useAuth';
import { ElPatoApi } from '../../../../../api/elPatoClipApi';

const privacyEnumToDisplayName: Record<string, string> = {
  'PUBLIC_TO_EVERYONE': 'Public',
  'MUTUAL_FOLLOW_FRIENDS': 'Friends only',
  'SELF_ONLY': 'Private',
  'FOLLOWER_OF_CREATOR': 'Followers only',
};

export interface TikTokPublishFormData {
  allowComment: boolean,
  allowDuet: boolean,
  allowStitch: boolean,
  title: string,
  privacy: string
}

export interface TiktokPublishFormProps {
  onSubmit: (payload: TikTokPublishFormData) => void
}

export const TiktokPublishForm = ({
  onSubmit
}: TiktokPublishFormProps) => {
  const auth = useAuth();
  const [connection, setConnection] = useState<ElPatoConnection | undefined>();
  const [formData, setFormData] = useState<TikTokPublishFormData>({
    allowComment: true,
    allowDuet: true,
    allowStitch: true,
    privacy: '',
    title: ''
  });

  const [creatorPermissions, setCreatorPermissions] = useState<{
    error: string | null,
    isLoading: boolean,
    permissions: CreatorPublishPermissions | null
  }>({
    isLoading: true,
    permissions: null,
    error: null
  });

  useEffect(() => {
    if (!auth.isAuthorized || !connection) return;

    const load = async() => {

      setCreatorPermissions({
        isLoading: true,
        error: null,
        permissions: null
      });

      const resp = await ElPatoApi.getTiktokCreatorPermissions(auth.token);

      if (resp.error.code !== 'ok') {
        setCreatorPermissions({
          error: resp.error.message,
          isLoading: false,
          permissions: null
        });
      }

      setFormData(prev => ({
        ...prev,
        privacy: resp.data.privacy_level_options.at(0) ?? '',
        allowComment: (resp.data.comment_disabled === true) ? false : prev.allowComment,
        allowDuet: (resp.data.duet_disabled === true) ? false : prev.allowDuet,
        allowStitch: (resp.data.stitch_disabled === true) ? false : prev.allowStitch,
      }));

      setCreatorPermissions({
        error: null,
        isLoading: false,
        permissions: resp.data
      });
    };

    load();
  }, [auth, connection]);

  if (!auth) return null;

  return (
    <S.Container>
      <h3>Share to TikTok</h3>
      <ConnectionButton onChange={setConnection} type='tiktok' />

      <label htmlFor='title-input'>Title</label>
      <Input
        id="title-input"
        value={formData.title} 
        onChange={(e) => setFormData(prev => ({
          ...prev,
          title: e.target.value
        }))}
        size='sm'
      />
      <label>Privacy</label>
      <Select
        value={formData.privacy}
        onChange={(e) => setFormData(prev => ({...prev, privacy: e.target.value }))}
      >
        {
          creatorPermissions.permissions?.privacy_level_options.map((privacyLevel) => (
            <option key={privacyLevel} value={privacyLevel}>{
              privacyEnumToDisplayName[privacyLevel] ?? privacyLevel
            }</option>
          ))
        }
      </Select>
      <div>

        { !!creatorPermissions.permissions?.comment_disabled || !creatorPermissions.isLoading && (
          <>
            <S.Checkbox 
              checked={formData.allowComment}
              id="allow-comment-checkbox"
              onChange={(e) => {
                setFormData((prev) => ({
                  ...prev,
                  allowComment: e.target.checked
                }));
              }}
              disabled={
                creatorPermissions.isLoading
              }
              type='checkbox'
            />
            <label 
              htmlFor="allow-comment-checkbox"
            >Allow comment</label>
          </>
        )}

        { !!creatorPermissions.permissions?.duet_disabled || !creatorPermissions.isLoading && (
          <>
            <S.Checkbox 
              checked={formData.allowDuet}
              id='allow-duet-checkbox'
              onChange={(e) => {
                setFormData((prev) => ({
                  ...prev,
                  allowDuet: e.target.checked
                }));
              }}
              disabled={ creatorPermissions.isLoading }
              type='checkbox' 
            />
            <label
              htmlFor='allow-duet-checkbox'
            >Allow duet</label>
          </>
        )}


        { !!creatorPermissions.permissions?.comment_disabled || !creatorPermissions.isLoading && (
          <>
            <S.Checkbox
              checked={formData.allowStitch}
              type='checkbox'
              onChange={(e) => {
                setFormData((prev) => ({
                  ...prev,
                  allowStitch: e.target.checked
                }));
              }}
              disabled={
                creatorPermissions.isLoading || !!creatorPermissions?.permissions?.stitch_disabled
              }
              id='allow-stitch-checkbox'
            />
            <label
              htmlFor='allow-stitch-checkbox'
            >Allow stitch</label>
          </>
        )}
      </div>
      <Button
        onClick={() => onSubmit(formData)}
        disabled={creatorPermissions.isLoading} 
        $variant='primary'
      >Publish</Button>
      <Button 
        disabled={creatorPermissions.isLoading} 
        $variant='white'
      >Upload as draft</Button>
    </S.Container>
  );

};