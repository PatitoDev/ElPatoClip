import { LoginServices, authenticate } from '../../../api/authApi';

export const loginHandler = async (code: string, service: LoginServices) => {
  return await authenticate(code, service);
};