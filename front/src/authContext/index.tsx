import { createContext, useCallback, useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ElPatoApi } from '../api/elPatoClipApi';

export interface UserContextState {
  user: User,
  token: string
}

export interface User {
  app: string,
  id: number,
  provider: {
    type: string,
    userId: string,
    userLogin: string
  }
}

export const userContext = createContext<{
  logOut: () => void,
    } & UserContextState | null>(null);

const LOCAL_STORAGE_KEY = 'EL_PATO_CLIP_USER';

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [state, setState] = useState<UserContextState | null>(null);

  const logOut = useCallback(() => {
    setState(null);
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    navigate('/');
  }, [navigate]);

  useEffect(() => {
    // load from local storage
    const item = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!item) return;

    const data = JSON.parse(item) as UserContextState;
    setState(data);
  }, []);

  useEffect(() => {
    const code = searchParams.get('code');
    if (!code) return;
    setSearchParams('');

    const getUserInfo = async () => {
      const resp = await ElPatoApi.authenticate(code);
      if (!resp) throw new Error('invalid auth');
      // todo - handle error handling
      const newState: UserContextState = { token: resp.token, user: resp.user };
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newState));
      setState(newState);
    };

    getUserInfo();
  }, [searchParams, setSearchParams]);

  return (
    <userContext.Provider value={state ? {
      ...state,
      logOut
    } : null}>
      {children}
    </userContext.Provider>
  );
};
