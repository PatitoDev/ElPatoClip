import * as S from './styles';
import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../../../authContext/useAuth';
import { useNavigate } from 'react-router-dom';
import { ElPatoApi } from '../../../api/elPatoClipApi';
import { ConnectionButton } from './ConnectionButton';
import { serviceToDetailsMap } from './serviceToDetailsMap';
import { ElPatoConnection } from '../../../api/elPatoClipApi/types';
import { Loading } from '../../Atoms/Loading';
import { createTokenUrl } from '../../../Utils/TokenAuthorizationBuilder';


export const AccountPage = () => {
  const navigate = useNavigate();
  const [shouldListenForFocus, setShouldListenForFocus] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [connections, setConnections] = useState<Array<ElPatoConnection>>([]);
  const auth = useAuth();

  const getConnections = useCallback(async (cancelToken?: { cancel: boolean }) => {
    if (!auth.isAuthorized) return;
    setIsLoading(true);
    const connections = await ElPatoApi.getAllowedConnections(auth.token);
    if (!connections) return;
    if (cancelToken?.cancel) return;
    // TODO - error handling
    setConnections(connections);
    setIsLoading(false);
  }, [auth.isAuthorized, auth.token]);

  useEffect(() => {
    const cancelToken = { cancel: false };
    let timeoutRef:NodeJS.Timeout | null = null;

    const onFocus = () => {
      if (!shouldListenForFocus) return;

      if (timeoutRef) {
        clearTimeout(timeoutRef);
        timeoutRef = null;
      }

      timeoutRef = setTimeout(async () => {
        await getConnections(cancelToken);
      }, 800);
    };

    window.addEventListener('focus', onFocus);

    return () => {
      cancelToken.cancel = true;
      window.removeEventListener('focus', onFocus);
      if (timeoutRef) {
        clearTimeout(timeoutRef);
      }
    };

  }, [shouldListenForFocus, getConnections]);

  useEffect(() => {
    if (auth.isLoading) return;

    if (!auth.isAuthorized) {
      navigate('/login');
      return;
    }

    getConnections();
  }, [auth, navigate, getConnections]);

  if (!auth.isAuthorized) return null;

  const loggedInProvider = serviceToDetailsMap[auth.user.provider.type];

  const onDisconnectConnection = async (type: string) => {
    const isOk = await ElPatoApi.deleteConnection(auth.token, type);
    if (!isOk) return;
    await getConnections();
  };

  const onConnect = (type: 'tiktok' | 'twitch') => {
    const url = createTokenUrl(type, 'connect');
    window.open(url, 'popup', 'toolbar=0,status=0,width=626,height=436');
    setShouldListenForFocus(true);
  };

  return (
    <S.Card>
      <h1>Account</h1>

      <S.ProfileDetails>
        <S.ProfileImage height={80} alt="" src={auth.user.provider.profileImageUrl} />
        <div>
          <p>{auth.user.provider.displayName}</p>
          <div>
            <img height={18} src={loggedInProvider.imgUrl} alt="" />
            <span>Logged in with {loggedInProvider.display}</span>
          </div>
        </div>

        <button title='Log out' onClick={auth.logOut}>
          <img alt="" height={18} src='/icons/MingcuteCloseFill.svg' />
        </button>
      </S.ProfileDetails>

      <h2>Connections</h2>
      <p>Upload your clips to</p>

      <S.ConnectionButtonContainer>
        { isLoading ? <Loading /> : (
          <>
            <ConnectionButton 
              onConnect={() => onConnect('tiktok')}
              onDisconnect={() => onDisconnectConnection('tiktok')}
              type="tiktok"
              connection={(connections ?? []).find(connection => connection.type === 'tiktok')}
            />
          </>
        ) }
      </S.ConnectionButtonContainer>
    </S.Card>
  );
};