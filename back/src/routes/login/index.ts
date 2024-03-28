import { z } from 'zod';
import { app, handleError } from '../..';
import { loginHandler } from './handlers/loginHandler';
import { LoginServices } from '../../api/authApi';

app.post('/login', async (req, res) => {
  try {
    const { code, provider } = z.object({
      code: z.string(),
      provider: z.nativeEnum(LoginServices)
    }).parse(req.body);

    const user = await loginHandler(code, provider);

    if (!user) {
      res.status(401).send();
    }

    res.status(200).send(user);
  } catch(err) {
    handleError(err, res);
  }
});