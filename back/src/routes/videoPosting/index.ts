import { app, handleError } from '../..';
import { PostVideoRequest } from '../../api/tiktokApi/types';
import { initiateVideoUploadHandler } from './handlers/initiateVideoUploadHandler';
import { getUploadStatusHandler } from './handlers/getUploadStatusHandler';
import { getUserIdFromToken } from '../../getUserFromToken';

app.post('/user/initiate-upload', async (req, res) => {
  try {
    const videoData = (req.body as PostVideoRequest);

    const userId = getUserIdFromToken(req.headers);
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
    const userId = getUserIdFromToken(req.headers);
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
