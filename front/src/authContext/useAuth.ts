import { useContext } from 'react';
import { userContext } from '.';

export const useAuth = () => {
  return useContext(userContext);
};