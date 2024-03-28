import { app, handleError } from '../..';
import { TwitchApi } from '../../api/twitchApi';
import { TwitchGqlApi } from '../../api/twitchGqlApi';
import { BadRequestError } from '../../errors';
import { downloadClipHandler } from './handlers/downloadClipHandler';
import { getClipsFromChannelHandler } from './handlers/getClipsFromChannelHandler';
import { ClipListRequestFiltersValidator } from './types';

const twitchGqlApi = new TwitchGqlApi();
const twitchApi = new TwitchApi();

app.get('/clip/:id', async (req, res) => {
  try {
    const id = req.params.id;
    if (!id.length) throw new BadRequestError('Missing Id');
    await downloadClipHandler(id, twitchGqlApi, res);
  } catch (err) {
    handleError(err, res);
  }
});

app.post('/channel/:channelId/clips', async (req, res) => {
  try {
    const channelId = req.params.channelId;
    const filters = ClipListRequestFiltersValidator.parse({...req.body, broadcaster_id: channelId});

    const data = await getClipsFromChannelHandler(filters, twitchApi);
    res.send(data);
  } catch (err) {
    handleError(err, res);
  }
});