import * as S from './styles';
import { ElPatoConnection } from '../../../../api/elPatoClipApi/types';
import { serviceToDetailsMap } from '../serviceToDetailsMap';

export interface ConnectionButtonProps {
  type: 'twitch' | 'tiktok'
  connection?: ElPatoConnection | null,
  onDisconnect: () => void,
  onConnect: () => void
}

export const ConnectionButton = (
  {
    connection,
    type,
    onDisconnect,
    onConnect
  }: ConnectionButtonProps
) => {

  const connectionDetails = serviceToDetailsMap[type];

  if (!connection) return (
    <S.ConnectButton onClick={onConnect}>
      <img alt="" src={connectionDetails.imgUrl} height={20} width={20} ></img>
      Connect with {connectionDetails.display}
    </S.ConnectButton>
  );

  return (
    <S.ExistingConnectionContainer>
      <img alt="" src={connection.profileImageUrl} height={60} width={60} ></img>
      <div>
        {connection.displayName}
        <div>
          <img alt="" src={connectionDetails.imgUrl} height={20} width={20} ></img>
        Linked with {connectionDetails.display}
        </div>
      </div>
      <S.ConnectButton onClick={onDisconnect}>
        Disconnect
      </S.ConnectButton>
    </S.ExistingConnectionContainer>
  );
};