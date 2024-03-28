import { IncomingHttpHeaders } from 'http';
import { decodeJwt } from 'jose';
import { z } from 'zod';
import { app, handleError } from '../..';
import { getConnections } from '../../api/authApi';
import { PostVideoRequest } from '../../api/tiktokApi/types';
import { initiateVideoUploadHandler } from './handlers/initiateVideoUploadHandler';
import { getUploadStatusHandler } from './handlers/getUploadStatusHandler';

const getUserFromToken = (headers: IncomingHttpHeaders) => {
  const token = headers.authorization?.split(' ').at(1);
  if (!token) return;
  const tokenPayload = decodeJwt(token);
  const userId = z.number().parse(tokenPayload['id']);
  return userId;
};

app.get('/user/allowed-connections', async (req, res) => {
  try {
    const userId = getUserFromToken(req.headers);
    if (!userId) return res.status(401).send('Missing auth token');
    const connections = await getConnections(userId) ?? [];
    res.status(200).send(connections.map(connection => ({
      type: connection.type
    })));
  } catch(err) {
    handleError(err, res);
  }
});

app.post('/user/initiate-upload', async (req, res) => {
  try {
    const videoData = (req.body as PostVideoRequest);

    const userId = getUserFromToken(req.headers);
    if (!userId) return res.status(401).send('Missing auth token');

    const result = await initiateVideoUploadHandler(videoData, userId);
    if (!result) return res.status(500).send('Unable to create video');

    return res.status(200).send(result);
  } catch (e) {
    handleError(e, res);
  }
});

app.post('/video/status', async (req, res) => {
  try {
    const userId = getUserFromToken(req.headers);
    if (!userId) return res.status(401).send('Missing auth token');
    const videoId = req.body.id;
    if (videoId.length === 0) return res.status(400).send('Invalid video id');

    const data = await getUploadStatusHandler(userId, videoId);
    if (!data) return res.status(500).send('Server error');
    return res.status(200).send(data);

  } catch (e) {
    console.log(e);
    handleError(e, res);
  }
});

//  get tiktok allowed metadata