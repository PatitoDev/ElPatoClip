import { IncomingHttpHeaders } from 'http';
import { decodeJwt } from 'jose';
import { z } from 'zod';

export const getUserIdFromToken = (headers: IncomingHttpHeaders) => {
  try {
    const token = headers.authorization?.split(' ').at(1);
    if (!token) return;
    const tokenPayload = decodeJwt(token);
    const userId = z.number().parse(tokenPayload['id']);
    return userId;
  } catch {
    return;
  }
};

