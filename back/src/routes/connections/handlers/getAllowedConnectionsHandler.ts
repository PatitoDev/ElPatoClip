import { getConnections } from '../../../api/authApi';
import { BadRequestError } from '../../../errors';

export const getAllowedConnectionsHandler = async (userId: number) => {
  const connections = await getConnections(userId);
  if (!connections) throw new BadRequestError('Unable to get user connections');

  const connectionsDto = connections.map(connection => ({
    type: connection.type,
    displayName: connection.displayName,
    profileImageUrl: connection.profileImageUrl
  }));

  return connectionsDto;
};