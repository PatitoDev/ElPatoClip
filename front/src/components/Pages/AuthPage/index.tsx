import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Loading } from '../../Atoms/Loading';
import { useEffect, useState } from 'react';
import { ElPatoApi } from '../../../api/elPatoClipApi';
import { decodeJwt } from 'jose';
import { LOCAL_STORAGE_KEY, User } from '../../../authContext';
import { useAuth } from '../../../authContext/useAuth';
import styled from 'styled-components';
import { createRedirectUrl } from '../../../Utils/TokenAuthorizationBuilder';

const Container = styled.section`
  margin-top: 8em;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const AuthPage = () => {
  const auth = useAuth();
  const [hasError, setHasError] = useState<boolean>(false);
  const navigate = useNavigate();
  const { authService, action } = useParams<{ authService: string, action: string }>();
  const [searchParams, setSearchParams] = useSearchParams();

  if (authService !== 'tiktok' &&
      authService !== 'twitch') throw new Error('invalid authentication service');

  if (action !== 'auth' &&
      action !== 'connect') throw new Error('invalid action');

  useEffect(() => {
    if (!auth?.isAuthorized || auth.isLoading || action === 'connect') return;
    navigate('/');
  }, [auth, navigate, action]);

  useEffect(() => {
    if (auth.isLoading) return;
    if (action === 'auth' && auth.isAuthorized) return;
    const code = searchParams.get('code');
    if (!code) { return; }
    setSearchParams('');

    const redirectUrl = createRedirectUrl(authService, action);

    const connectUser = async () => {
      const token = auth.token;
      if (!token) {
        return;
      }
      const resp = await ElPatoApi.createConnection(token, authService, redirectUrl, code);
      if (resp.error) {
        setHasError(true);
        return;
      }
      window.close();
    };

    const getUserInfo = async () => {
      try {
        const resp = await ElPatoApi.authenticate(code, authService, redirectUrl);

        if (resp.error) {
          setHasError(true);
          setTimeout(() => {
            navigate('/login');
          }, 5000);
          return;
        }

        const user = decodeJwt<User>(resp.data.token);

        auth.setUserState({ user, token: resp.data.token });
        localStorage.setItem(LOCAL_STORAGE_KEY, resp.data.token);
      } catch (e) {
        setTimeout(() => {
          navigate('/login');
        }, 5000);
        setHasError(true);
      }
    };

    if (action === 'connect') {
      connectUser();
      return;
    }

    if (action === 'auth') {
      getUserInfo();
    }
  }, [auth, authService, navigate, searchParams, setSearchParams, action]);

  if (
    authService !== 'tiktok' &&
    authService !== 'twitch'
  ) return (
    <Container>
      <h1>404 Not found</h1>
    </Container>
  );

  if (hasError) return (
    <Container>
      <h1>Error authenticating, redirecting in 5 seconds</h1>
    </Container>
  );

  return (
    <Container>
      <Loading />
    </Container>
  );
};